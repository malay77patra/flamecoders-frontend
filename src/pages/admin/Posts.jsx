import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6"
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import RLoader from '@/components/RLoader'

export default function Posts() {
  const api = useApi()
  const { authToken } = useAuth()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)

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
      <button className='btn' onClick={handleNewPost} disabled={creating}>
        {creating ? <RLoader size={18} /> : (
          <>
            <FaPlus />
            New Post
          </>
        )}
      </button>
    </div>
  )
}
