import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { FaPlus } from "react-icons/fa"
import { useLocation, useNavigate, Link } from "react-router-dom"

const FilterButton = ({ children, active = false, className, ...props }) => {
    return (
        <button className={`btn rounded-full ${active ? 'btn-primary' : 'btn-outline'}`} {...props}>{children}</button>
    )
}

function AllPosts({ posts }) {
    return (
        <ul className="py-4 flex flex-col gap-2">
            {posts.map((post) => {
                return (
                    <li key={post.id} className="w-full flex items-center justify-center gap-2">
                        <Link to={`/post/${post.id}`} className="flex-1">
                            {post.title ? (
                                <h1 className="text-lg font-bold break-all">{post.title}</h1>
                            ) : (
                                <h1 className="text-lg font-bold break-all text-base-content/50">Untitled</h1>
                            )}
                        </Link>
                        {!post.published && (
                            <div className="bg-warning px-2 py-1 text-sm rounded-full">Draft</div>
                        )}
                    </li>
                )
            })}
        </ul>
    )
}

export default function Posts() {
    const { authToken } = useAuth()
    const api = useApi()
    const [filter, setFilter] = useState("all")
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const location = useLocation()
    const [fetching, setFetching] = useState(false)

    const filteredPosts = []

    if (filter === "posts") {
        posts.forEach((post) => {
            if (post.published) {
                filteredPosts.push(post)
            }
        })
    } else if (filter == "drafts") {
        posts.forEach((post) => {
            if (!post.published) {
                filteredPosts.push(post)
            }
        })
    } else {
        filteredPosts.push(...posts)
    }

    const fetchMyPosts = async () => {
        setFetching(true)
        try {
            const { error, data } = await api.get(`/api/post/posts/my`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                toast.error(error.message)
            } else {
                setPosts(data)
            }
        } catch (err) {
            toast.error("Somethimg went wrong!")
        } finally {
            setFetching(false)
        }
    }

    const createNewPost = async () => {
        const { error, data } = await api.post(`/api/post/new`, {}, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        if (error) {
            toast.error(error.message)
        } else {
            navigate(`/post/${data.id}`)
        }
    }

    useEffect(() => {
        fetchMyPosts()
        console.log("re fetching...")
    }, [location])

    return (
        <>
            <div className="flex gap-1">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
                <FilterButton active={filter === "posts"} onClick={() => setFilter("posts")}>Published</FilterButton>
                <FilterButton active={filter === "drafts"} onClick={() => setFilter("drafts")}>Drafats</FilterButton>
                <div className="flex-1"></div>
                <button className="btn btn-accent" onClick={createNewPost}><FaPlus /> New</button>
            </div>
            <div className="max-w-3xl m-auto mt-4">
                {fetching ? (
                    <div className="flex items-center justify-center p-2">
                        <span className="loading loading-spinner"></span>
                    </div>
                ) : (
                    <AllPosts posts={filteredPosts} />
                )}
            </div>
        </>
    )
}