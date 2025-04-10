import React, { useState, useEffect } from 'react'
import { FaPlus } from "react-icons/fa6"
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/lib/toast'
import { useNavigate } from 'react-router-dom'
import RLoader from '@/components/RLoader'
import Loading from '../state/Loading'
import { IoIosArrowDown } from "react-icons/io";


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


const DraftsList = () => {
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState([])
  const api = useApi()
  const { authToken } = useAuth()

  useEffect(() => {
    const fetchDrafts = async () => {
      const { error, data } = await api.get("/api/post/drafts/1/10", {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
      } else {
        setDrafts(data.drafts)
        setLoading(false)
      }

    }

    fetchDrafts()
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <ul>
          {drafts.map((draft) => (
            <li key={draft.id} className="border-b py-4">
              <a href={`/post/${draft.id}`} className="flex flex-col gap-2">
                {draft.title ? (

                  <h2 className="text-lg font-bold">{draft.title}</h2>
                ) : (
                  <h2 className="text-lg font-bold opacity-60">Untitled</h2>
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default function Posts() {
  const api = useApi()
  const { authToken } = useAuth()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [isPublishedSelected, setIsPublishedSelected] = useState(true)

  const handleNewPost = async () => {
    setCreating(true)
    const { error, data } = await api.post("/api/post/new", {}, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    })
    setCreating(false)

    if (error) {
      toast.error(error.message)
    } else {
      navigate(`/post/${data.id}`)
    }
  }

  return (
    <div>
      <div>
        <div className='flex gap-2 items-center'>
          <div className="tabs tabs-box inline-flex font-semibold">
            <div className={`tab ${isPublishedSelected ? 'tab-active' : ''}`} onClick={() => setIsPublishedSelected(true)}>Published</div>
            <div className={`tab ${!isPublishedSelected ? 'tab-active' : ''}`} onClick={() => setIsPublishedSelected(false)}>Drafts</div>
          </div>
          <button className='btn btn-primary' onClick={handleNewPost} disabled={creating}>
            {creating ? <RLoader size={18} /> : (
              <>
                <FaPlus />
                New Post
              </>
            )}
          </button>
        </div>
        <div>
          {isPublishedSelected ? (
            <PostsList />
          ) : (
            <DraftsList />
          )}
        </div>
      </div>
    </div>
  )
}
