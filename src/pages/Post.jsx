import { useNavigate, useParams } from "react-router-dom"
import TTEditor from "@/components/Editor/TTEditor"
import { useEffect, useState } from "react"
import TextareaAutosize from 'react-textarea-autosize'
import PageError from "@/components/ui/PageError"
import PageLoading from "@/components/ui/PageLoading"
import { useApi } from "@/hooks/useApi"
import RadialLoader from "@/components/ui/RadialLoader"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"
import confirmation from "@/lib/react-hot-confirmation"

export default function Post() {
    const { id } = useParams()
    const [metadata, setMetadata] = useState(null)
    const [title, setTitle] = useState("")
    const [chnaged, setChanged] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [loadingError, setLoadingError] = useState("")
    const [isAuthor, setIsAuthor] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const { authToken, isAuthenticated } = useAuth()
    const [published, setPublished] = useState(true)
    const [publishing, setPublishing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()

    const api = useApi()

    const togglePublished = async () => {
        setPublishing(true)
        try {
            const { error, data } = await api.post("/api/post/update", {
                id: id,
                published: !published
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success(published ? "Unpublished" : "Published")
                setPublished(!published)
                setPublishing(false)
            }
        } catch (err) {
            toast.error("Something went wrong")
        } finally {
            setPublishing(false)
        }
    }

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
                setPublished(data.published)
            }
        } catch (err) {
            setLoadingError("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const deletePost = async () => {
        setDeleting(true)
        try {
            const { data, error } = await api.delete(`/api/post/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (error) {
                toast.error(error.message)
            } else {
                toast.success("Post deleted.")
                navigate(-1)
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setDeleting(false)
        }
    }

    const confirmDelete = () => {
        confirmation({
            title: "Delete Post",
            message: "Are you sure you want to delete this post?",
            confirmText: "Delete",
            cancelText: "Cancel",
            variant: "error",
            onConfirm: () => {
                deletePost()
            }
        })
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
                setChanged(false)
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
    }, [isAuthenticated])

    return (
        <>
            {loading ? <PageLoading /> : (
                <>
                    {loadingError ? <PageError message={loadingError} /> : (
                        <div className="flex flex-col gap-2">
                            {isAuthor && (
                                <div className="flex justify-end gap-2">
                                    <button className="btn btn-sm btn-primary" onClick={toggleIsEditing}>
                                        {isEditing ? "Preview" : "Edit"}
                                    </button>
                                    <button disabled={!chnaged} className="btn btn-accent btn-sm" onClick={savePost}>
                                        {saving ? <RadialLoader /> : "Save"}
                                    </button>
                                    <button className={`btn btn-sm ${published ? 'btn-error' : 'btn-success'}`} onClick={togglePublished} >
                                        {publishing ? <RadialLoader /> : (published ? "Unpublish" : "Publish")}
                                    </button>
                                    <button className="btn btn-sm btn-error" onClick={confirmDelete} >
                                        {deleting ? <RadialLoader /> : "Delete"}
                                    </button>
                                </div>
                            )}
                            <TextareaAutosize
                                className="outline-none text-3xl font-bold resize-none"
                                placeholder="Untitled"
                                maxLength={75}
                                value={title}
                                readOnly={!(isEditing && isAuthor)}
                                onChange={(event) => {
                                    setTitle(event.target.value)
                                    setChanged(true)
                                }}
                            />
                            <TTEditor
                                metadata={metadata}
                                setMetadata={setMetadata}
                                setChanged={setChanged}
                                readOnly={!(isEditing && isAuthor)}
                                placeholder="Start writing your post..."
                            />
                        </div>
                    )}
                </>
            )}
        </>
    )
}