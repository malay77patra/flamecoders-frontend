import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import { useAuth } from '@/hooks/useAuth'
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import Loading from '@/pages/state/Loading';
import Error from './state/Error';
import { toast } from '@/lib/toast'
import TextareaAutosize from 'react-textarea-autosize'


export default function Post() {
    const { id } = useParams()
    const api = useApi()
    const navigate = useNavigate()
    const editorRef = useRef(null)
    const { user, authToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [published, setPublished] = useState(false)
    const [title, setTitle] = useState("")

    useEffect(() => {

        const loadPost = async () => {
            const { error, data } = await api.get(`/api/post/get${user.isAdmin ? "-admin" : ""}/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                setError(error.message)
            } else {
                console.log(data)
                setTitle(data.title)
                setPublished(data.published)
                const editor = new EditorJS({
                    holder: 'editorjs',
                    autofocus: true,
                    placeholder: "Start writing...",
                    readOnly: !editing,
                    inlineToolbar: ['link', 'bold', 'italic'],
                    data: data.metadata,
                    tools: {
                        header: {
                            class: Header,
                            config: {
                                placeholder: 'Enter a header',
                                levels: [2, 3, 4],
                                defaultLevel: 2,
                            }
                        }
                    },
                    onReady: () => {
                        editorRef.current = editor;
                        setLoading(false)
                    },
                    onChange: () => {
                        setIsChanged(true)
                    }

                })
            }
        }

        loadPost()

        return () => {
            if (editorRef.current && typeof editorRef.current.destroy === 'function') {
                editorRef.current.destroy()
                editorRef.current = null
            }
        }
    }, [])

    const togglePublish = async () => {
        if (!published && !title) {
            toast.error("Title is required to publish the post")
            return
        }
        const { error, data } = await api.post("/api/post/publish", {
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
            setPublished(data.published)
            toast.success(data.message)
        }
    }

    const confirmDelete = async () => {
        const { error, data } = await api.post("/api/post/delete", {
            id: id
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        if (error) {
            toast.error(error.message)
        } else {
            toast.success(data.message)
            navigate("/admin?tab=posts")
        }
    }

    const handleDelete = () => {
        toast.confirm(
            "Are you sure?",
            "once the post is deleted, it can not be undone.",
            () => {
                confirmDelete()
            },
            () => { },
            {
                position: "center",
                variant: "danger"
            }
        )
    }

    const handleSave = async () => {
        if (title.trim() === "") {
            toast.error("Title is required")
            return
        }
        const metadata = await editorRef.current.save();
        const { error, data } = await api.post("/api/post/update", {
            id: id,
            title: title.trim(),
            metadata: metadata
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        if (error) {
            toast.error(error.message)
        } else {
            setIsChanged(false)
            toast.success(data.message)
        }
    }

    if (error) {
        return <Error message={error} />
    }

    return (
        <div>
            {loading ? (
                <Loading />
            ) : (
                <>
                    {user.isAdmin && (
                        <div className='flex gap-2'>
                            <button className='btn btn-square btn-outline tooltip' data-tip={editing ? "Preview" : "Edit"} onClick={async () => {
                                const prevState = await editorRef.current.readOnly.toggle();
                                setEditing(!prevState);
                            }}>
                                {editing ? (
                                    <MdOutlineRemoveRedEye size="1.25rem" />
                                ) : (
                                    <MdModeEditOutline size="1.25rem" />
                                )}
                            </button>
                            {editing && (
                                <button className='btn btn-primary' disabled={!isChanged} onClick={handleSave}>Save</button>
                            )}
                            <button className={published ? 'btn btn-primary' : 'btn btn-accent'} onClick={togglePublish}>{published ? "Unpublish" : "Publish"}</button>
                            <button className='btn btn-error' onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </>
            )
            }
            <div className={`mt-4 edjs:py-4 edjs:px-10 ${loading ? "hidden" : ""}`}>
                <TextareaAutosize
                    placeholder="Title..."
                    maxLength={70}
                    className="resize-none disabled:bg-base-100 text-3xl font-bold outline-0 w-full break-all"
                    disabled={!editing}
                    value={title || ""}
                    onChange={(event) => {
                        setTitle(event.target.value)
                        setIsChanged(true)
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                        }
                    }}
                />
                <div id="editorjs" className='rounded-md'></div>
            </div>
        </div >
    )
}
