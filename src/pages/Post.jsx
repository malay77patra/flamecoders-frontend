import React, { useEffect, useRef, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import { useAuth } from '@/hooks/useAuth'
import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import Loading from '@/pages/state/Loading';
import Error from './state/Error';
import toast from 'react-hot-toast';


export default function Post() {
    const { id } = useParams()
    const api = useApi()
    const editorRef = useRef(null)
    const { user, authToken } = useAuth()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [editing, setEditing] = useState(false)
    const [isChanged, setIsChanged] = useState(false)
    const [published, setPublished] = useState(false)

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

    const handleSave = async () => {
        const metadata = await editorRef.current.save();
        const { error, data } = await api.post("/api/post/update", {
            id: id,
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
                            <button className={published ? 'btn btn-error' : 'btn btn-accent'} onClick={togglePublish}>{published ? "Unpublish" : "Publish"}</button>
                        </div>
                    )}
                </>
            )
            }
            <div id="editorjs" className='rounded-md edjs:py-4 edjs:px-10'></div>
        </div >
    )
}
