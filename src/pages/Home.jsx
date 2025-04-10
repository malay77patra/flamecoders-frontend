import React, { useEffect, useState } from 'react'
import { toast } from '@/lib/toast'
import { useApi } from '@/hooks/useApi'
import Loading from './state/Loading'

const PostsList = () => {
    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])
    const api = useApi()

    useEffect(() => {
        const fetchPosts = async () => {
            const { error, data } = await api.get("/api/post/all/1/10")

            if (error) {
                toast.error(error.message)
                setLoading(false)
            } else {
                setPosts(data.posts)
                setLoading(false)
            }

        }

        fetchPosts()
    }, [])

    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="border-b py-4">
                            <a href={`/post/${post.id}`} className="flex flex-col gap-2">
                                <h2 className="text-lg font-bold">{post.title}</h2>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default function Home() {

    return (
        <>
            <PostsList />
        </>
    )
}
