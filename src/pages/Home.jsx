import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { formatDistanceToNow, isToday, isThisWeek } from "date-fns"
import CopyLinkButton from "@/components/ui/CopyLinkButton"
import { FaFire } from "react-icons/fa6"

export default function Home() {
    const api = useApi()
    const [fetching, setFetching] = useState(false)
    const [posts, setPosts] = useState([])

    const fetchAllPosts = async () => {
        setFetching(true)
        try {
            const { error, data } = await api.get("/api/post/all")
            if (error) {
                toast.error(error.message)
            } else {
                setPosts(data)
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setFetching(false)
        }
    }

    useEffect(() => {
        fetchAllPosts()
    }, [])

    return (
        <div className="p-1 sm:p-2">
            {fetching ? (
                <div className="flex items-center justify-center p-2">
                    <span className="loading loading-spinner"></span>
                </div>
            ) : (
                <div className="max-w-3xl m-auto flex flex-col gap-2">
                    {posts.map((post) => {
                        const date = new Date(post.timestamp);
                        let displayDate;

                        if (isToday(date) || isThisWeek(date)) {
                            displayDate = formatDistanceToNow(date, { addSuffix: true });
                        } else {
                            displayDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });
                        }

                        return (
                            <Link to={`/post/${post.id}`} key={post.id} className="bg-base-200 p-4 rounded-box">
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
                                        <p className="text-xs text-base-content/60">{displayDate}</p>
                                    </div>
                                </div>
                                <h1 className="text-xl md:text-2xl font-bold break-all">{post.title}</h1>
                                <div className="mt-2 flex items-center justify-center">
                                    <span className="text-sm text-base-content/60 flex items-center justify-center gap-1">
                                        <FaFire />
                                        {post.likeCount}
                                    </span>
                                    <div className="flex-1"></div>
                                    <div onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                    }}>
                                        <CopyLinkButton link={window.location.origin + `/post/${post.id}`} />
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
