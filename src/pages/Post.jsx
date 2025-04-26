import { useParams } from "react-router-dom"
import TTEditor from "@/components/Editor/TTEditor"
import { useEffect, useState } from "react"
import TextareaAutosize from 'react-textarea-autosize'
import PageError from "@/components/ui/PageError"
import PageLoading from "@/components/ui/PageLoading"
import { useApi } from "@/hooks/useApi"
import RadialLoader from "@/components/ui/RadialLoader"
import { toast } from "@/lib/toast"
import { useAuth } from "@/hooks/useAuth"

export default function Post() {
    const { id } = useParams()
    const [metadata, setMetadata] = useState({})
    const [title, setTitle] = useState("")
    const [chnaged, setChanged] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [loadingError, setLoadingError] = useState("")
    const [isAuthor, setIsAuthor] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { authToken } = useAuth()

    const api = useApi()

    const fetchPost = async () => {
        try {
            const { data, error } = await api.get(`/api/post/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (error) {
                setLoadingError(error.message)
            } else {
                setTitle(data.title)
                setMetadata(data.metadata)
                setIsAuthor(data.me)
            }
        } catch (err) {
            setLoadingError("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const savePost = async () => {
        setSaving(true)

        try {
            const { error, data } = await api.post("/api/post/update", {
                id: id,
                title: title,
                metadata: metadata
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                toast.error(error.message)
            } else {
                setTitle(data.title)
                setMetadata(data.metadata)
                toast.success("Saved")
            }

        } catch (err) {
            console.log("Unexpected error:", err)
            toast.error("Something went wrong!")
        } finally {
            setSaving(false)
        }
    }

    const toggleIsEditing = () => {
        setIsEditing(!isEditing)
    }

    useEffect(() => {
        if (!id) {
            setLoadingError("404 | POST NOT FOUND")
            return;
        }

        fetchPost()
    }, [])

    return (
        <>
            {loading ? <PageLoading /> : (
                <>
                    {loadingError ? <PageError message={loadingError} /> : (
                        <div className="flex flex-col gap-2">
                            {isAuthor && (
                                <div className="flex justify-end gap-2">
                                    <button disabled={!chnaged} className="btn btn-accent" onClick={savePost}>
                                        {saving ? <RadialLoader /> : "Save"}
                                    </button>
                                    <button className="btn" onClick={toggleIsEditing}>
                                        {isEditing ? "Preview" : "Edit"}
                                    </button>
                                </div>
                            )}
                            <TextareaAutosize
                                className="outline-none text-3xl font-bold resize-none"
                                placeholder="Untitled"
                                maxLength={75}
                                value={title}
                                readOnly={!isEditing}
                                onChange={(event) => {
                                    setTitle(event.target.value)
                                    setChanged(true)
                                }}
                            />
                            <TTEditor
                                metadata={metadata}
                                setMetadata={setMetadata}
                                setChanged={setChanged}
                                readOnly={!isEditing}
                                placeholder="Start writing your post..."
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}