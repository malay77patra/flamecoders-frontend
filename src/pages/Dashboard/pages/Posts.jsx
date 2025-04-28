import { useApi } from "@/hooks/useApi"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"

export default function Posts() {
    const { authToken } = useAuth()
    const api = useApi()

    const fetchMyPosts = async () => {
        const { error, data } = await api.get(`/api/post/getmy/1/100`, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })

        console.log(error, data)
    }

    useEffect(() => {
        // fetchMyPosts()
    }, [])
    return (
        <>posts</>
    )
}