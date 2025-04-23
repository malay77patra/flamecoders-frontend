import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useApi } from '@/hooks/useApi'
import Loading from '@/pages/state/Loading'
import Error from './state/Error'
import TextareaAutosize from 'react-textarea-autosize';
import TTEditor from '@/components/Editor/TTEditor'
import RLoader from '@/components/RLoader'
import { toast } from '@/lib/toast'

export default function Post() {
    const { id } = useParams()
    const { authToken, user } = useAuth()
    const api = useApi()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)
    const [chnaged, setChanged] = useState(false)

    const [title, setTitle] = useState("")
    const [metadata, setMetadata] = useState({
        "type": "doc",
        "content": []
    })

    const handleSave = async () => {
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
                setChanged(false)
            }
        } catch (err) {
            toast.err("Something went wrong")
        } finally {
            setSaving(false)
        }
    }

    useEffect(() => {
        if (!id) return

        const fetchPost = async () => {
            const { error, data } = await api.get(`/api/post/get${user.isAdmin ? "-admin" : ""}/${id}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                setError(error.message)
            } else {
                setTitle(data.title)
                setMetadata(data.metadata)
            }

            setLoading(false)
        }

        fetchPost()
    }, [id])

    if (loading) return <Loading />
    if (error) return <Error message={error} />

    return (
        <div>
            <TextareaAutosize
                className='resize-none w-full text-3xl font-bold mb-6 outline-0 break-all'
                placeholder='Your post title here...'
                maxLength={75}
                autoFocus={!title}
                value={title}
                onChange={ev => {
                    const noNewlines = ev.target.value.replace(/[\r\n]+/g, ' ')
                    setTitle(noNewlines)
                    setChanged(true)
                }}
                onKeyDown={ev => {
                    if (ev.key === 'Enter') {
                        ev.preventDefault()
                    }
                }}
            />
            <TTEditor metadata={metadata} setMetadata={setMetadata} setChanged={setChanged} autoFocus={title ? 'end' : false} />
            <div className='fixed bottom-0 left-0 pb-2 pl-2'>
                <button className='btn btn-accent' disabled={!chnaged || saving} onClick={handleSave}>
                    {saving ? <RLoader /> : "Save"}
                </button>
            </div>
        </div>
    )
}
