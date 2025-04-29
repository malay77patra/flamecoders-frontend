import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"
import toast from "react-hot-toast"
import { FaPlus } from "react-icons/fa"
import { useNavigate, Link } from "react-router-dom"
import { useQuery } from '@tanstack/react-query'  // Import from @tanstack/react-query

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
    const navigate = useNavigate()

    // Use TanStack Query to manage data fetching and caching
    const { data: posts = [], isLoading, refetch } = useQuery({
        queryKey: ['myPosts'],
        queryFn: async () => {
            const cacheBuster = `?_=${Date.now()}`
            const { error, data } = await api.get(`/api/post/posts/my${cacheBuster}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            })

            if (error) {
                toast.error(error.message)
                return []
            }
            return data
        },
        // Options to ensure fresh data when navigating back
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        staleTime: 0, // Data is immediately considered stale
    })

    const filteredPosts = [];

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

    return (
        <>
            <div className="flex gap-1">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All</FilterButton>
                <FilterButton active={filter === "posts"} onClick={() => setFilter("posts")}>Published</FilterButton>
                <FilterButton active={filter === "drafts"} onClick={() => setFilter("drafts")}>Drafts</FilterButton>
                <div className="flex-1"></div>
                <button
                    className="btn btn-ghost mr-2"
                    onClick={() => refetch()}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
                <button className="btn btn-accent" onClick={createNewPost}><FaPlus /> New</button>
            </div>
            <div className="max-w-3xl m-auto">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="loading loading-spinner"></div>
                    </div>
                ) : (
                    <AllPosts posts={filteredPosts} />
                )}
            </div>
        </>
    )
}