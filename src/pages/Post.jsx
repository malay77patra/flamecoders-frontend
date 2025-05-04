import { useLocation, useNavigate, useParams } from "react-router-dom"
import TTEditor from "@/components/Editor/TTEditor"
import { useEffect, useState } from "react"
import TextareaAutosize from 'react-textarea-autosize'
import PageError from "@/components/ui/PageError"
import PageLoading from "@/components/ui/PageLoading"
import { useApi } from "@/hooks/useApi"
import toast from "react-hot-toast"
import { useAuth } from "@/hooks/useAuth"
import confirmation from "@/lib/react-hot-confirmation"
import { FaFire } from "react-icons/fa6"
import CopyLinkButton from "@/components/ui/CopyLinkButton"
import { formatDistanceToNow, isToday, isThisWeek } from "date-fns"

export default function Post() {
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const isEditMode = queryParams.get('mode') === "edit"

    const { id } = useParams()
    const { authToken, isAuthenticated, user } = useAuth()
    const [post, setPost] = useState({
        title: "",
        metadata: {
            "type": "doc",
            "content": [
                {
                    "type": "paragraph"
                }
            ]
        },
        published: false,
        liked: false,
        likeCount: 0,
        author: null,
        publishedAt: null,

    })

    const [chnaged, setChanged] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [loadingError, setLoadingError] = useState("")
    const [isEditing, setIsEditing] = useState(isEditMode)
    const [publishing, setPublishing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const navigate = useNavigate()

    const api = useApi()

    const setMetadata = (v) => {
        setPost(prev => ({
            ...prev,
            metadata: v
        }))
    }

    const [displayPublishedAt, SetdisplayPublishedAt] = useState(null)
    useEffect(() => {
        if (post.publishedAt) {
            const date = new Date(post.publishedAt)

            if (isToday(date) || isThisWeek(date)) {
                SetdisplayPublishedAt(formatDistanceToNow(date, { addSuffix: true }))
            } else {
                SetdisplayPublishedAt(date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }))
            }
        } else {
            SetdisplayPublishedAt("")
        }
    }, [post.publishedAt])

    const toggleLike = async () => {
        if(!isAuthenticated) {
            navigate("/login")
            return
        }
        const { error, data } = await api.post("/api/post/like", {
            id: id
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        if (error) {
            toast.error(error.message)
        } else {
            setPost(prev => ({
                ...prev,
                ...data
            }))
        }
    }

    const togglePublished = async () => {
        setPublishing(true)
        try {
            const { error, data } = await api.post("/api/post/update", {
                id: id,
                published: !post.published
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
            if (error) {
                toast.error(error.message)
            } else {
                toast.success(post.published ? "Unpublished" : "Published")
                setPost(prev => ({
                    ...prev,
                    ...data
                }))
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
                setPost(data)
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
                title: post.title.trim(),
                metadata: post.metadata
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                toast.error(error.message)
            } else {
                setPost(prev => ({
                    ...prev,
                    ...data
                }))
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
                <div className="container mx-auto">
                    {loadingError ? <PageError message={loadingError} /> : (
                        <div className="flex flex-col md:flex-row gap-2 relative">
                            <div className="hidden md:flex w-16 lg:w-24 flex-shrink-0 flex-col items-center gap-4 sticky top-20 self-start">
                                {!isEditing && (
                                    <>
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm text-accent mt-1">{post.likeCount}</span>
                                            <button
                                                className={`btn btn-square ${post.liked ? 'text-accent' : ''}`}
                                                onClick={toggleLike}
                                                aria-label="Like post"
                                            >
                                                <FaFire size="1rem" />
                                            </button>
                                        </div>
                                        <CopyLinkButton link={window.location.href} />
                                    </>
                                )}
                            </div>

                            <div className="flex-1 max-w-3xl mx-auto w-full">
                                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                                    {(post.author?._id == user.id) ? (
                                        <>
                                            <button className="btn btn-sm btn-primary" onClick={toggleIsEditing}>
                                                {isEditing ? "Preview" : "Edit"}
                                            </button>
                                            <button
                                                disabled={!chnaged}
                                                className="btn btn-accent btn-sm"
                                                onClick={savePost}
                                            >
                                                {saving ? <span className="loading loading-spinner"></span> : "Save"}
                                            </button>
                                            <button
                                                className={`btn btn-sm ${post.published ? 'btn-error' : 'btn-success'}`}
                                                onClick={togglePublished}
                                            >
                                                {publishing ? <span className="loading loading-spinner"></span> : (post.published ? "Unpublish" : "Publish")}
                                            </button>
                                            <button className="btn btn-sm btn-error" onClick={confirmDelete}>
                                                {deleting ? <span className="loading loading-spinner"></span> : "Delete"}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-4 flex items-center gap-2">
                                                <div className="avatar ring-2 ring-accent rounded-full">
                                                    <div className="size-8 rounded-full">
                                                        <img src={post.author?.avatar || "/avatar404.svg"} />
                                                    </div>
                                                </div>
                                                <div>
                                                    {post.author ? (
                                                        <h2 className="font-semibold">{post.author.name}</h2>
                                                    ) : (
                                                        <h2 className="font-semibold text-base-content/60">Deleted Account</h2>
                                                    )}
                                                    <p className="text-xs text-base-content/60">{post.published ? displayPublishedAt : "Unpublished"}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <TextareaAutosize
                                    className="outline-none text-3xl lg:text-4xl font-bold resize-none w-full mb-4"
                                    placeholder="Untitled"
                                    maxLength={75}
                                    value={post.title}
                                    readOnly={!(isEditing && (post.author?._id === user.id))}
                                    onChange={(event) => {
                                        setPost(prev => ({
                                            ...prev,
                                            title: event.target.value
                                        }))
                                        setChanged(true)
                                    }}
                                />

                                <div className="mt-4 pb-16">
                                    <TTEditor
                                        metadata={post.metadata}
                                        setMetadata={setMetadata}
                                        setChanged={setChanged}
                                        readOnly={!(isEditing && (post.author?._id == user.id))}
                                        placeholder="Start writing your post..."
                                    />
                                </div>

                                {!isEditing && (
                                    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-base-100 shadow-up-md px-4 py-2 flex items-center justify-between z-10">
                                        <button
                                            className={`btn ${post.liked ? 'text-accent' : ''}`}
                                            onClick={toggleLike}
                                        >
                                            <FaFire size="1rem" /> <span className="ml-1">{post.likeCount}</span>
                                        </button>
                                        <CopyLinkButton link={window.location.href} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}