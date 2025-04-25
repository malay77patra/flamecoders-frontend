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
    const { authToken } = useAuth()

    const api = useApi()

    const fetchPost = async () => {
        try {
            const { data, error } = await api.get(`/api/post/get/${id}`);

            if (error) {
                setLoadingError(error.message)
            } else {
                setTitle(data.title)
                setMetadata(data.metadata)
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
                            <div className="flex justify-end">
                                <button disabled={!chnaged} className="btn btn-accent" onClick={savePost}>
                                    {saving ? <RadialLoader /> : "Save"}
                                </button>
                            </div>
                            <TextareaAutosize
                                className="outline-none text-3xl font-bold resize-none"
                                placeholder="Untitled"
                                maxLength={75}
                                value={title}
                                onChange={(event) => {
                                    setTitle(event.target.value)
                                    setChanged(true)
                                }}
                            />
                            <TTEditor
                                metadata={metadata}
                                setMetadata={setMetadata}
                                setChanged={setChanged}
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}