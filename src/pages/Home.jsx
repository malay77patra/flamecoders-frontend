import { useApi } from "@/hooks/useApi"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { formatDistanceToNow, isToday, isThisWeek } from "date-fns"
import { FiLink } from "react-icons/fi"
import { FaCheck } from "react-icons/fa6"

const CopyLinkButton = ({ link = "" }) => {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!link) return
        try {
            await navigator.clipboard.writeText(link)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <button onClick={handleCopy} className="btn btn-square btn-ghost btn-sm">
            {copied ? <FaCheck size="1rem" /> : <FiLink size="1rem" />}
        </button>
    )
}

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
                // console.log(data)
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
                <ul className="max-w-3xl m-auto mt-4">
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
                            <li key={post.id} className="bg-base-200 p-4 rounded-box">
                                <Link to={`/post/${post.id}`}>
                                    <h1 className="text-xl md:text-3xl font-bold break-all">{post.title}</h1>
                                </Link>
                                <div className="mt-2 flex items-center justify-center">
                                    <span className="text-xs text-base-content/60">{displayDate}</span>
                                    <div className="flex-1"></div>
                                    <CopyLinkButton link={window.location.origin + `/post/${post.id}`} />
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}
