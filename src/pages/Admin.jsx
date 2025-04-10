import React, { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { toast } from '@/lib/toast'
import Overview from '@/pages/admin/Overview'
import Posts from '@/pages/admin/Posts'
import Admins from '@/pages/admin/Admins'
import Loading from '@/pages/state/Loading'



export default function Admin() {
    const [loggingIn, setLoggingIn] = useState(true)
    const api = useApi()
    const { isAuthenticated, authToken, user, setUser } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    const loginAsAdmin = async () => {
        try {
            const { data, error } = await api.post("/api/admin/login", {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })

            if (error) {
                navigate("/")
            } else {
                setUser({ isAdmin: data.isAdmin, ...user })
            }
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setLoggingIn(false)
        }
    }

    useEffect(() => {
        if (!user.isAdmin) {
            if (!isAuthenticated) {
                navigate("/", { replace: true })
            } else {
                loginAsAdmin()
            }
        } else {
            setLoggingIn(false)
        }
    }, [isAuthenticated])

    const getTabFromQuery = () => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')
        return ['admins', 'posts', 'overview'].includes(tab) ? tab : 'overview'
    }

    const activeTab = getTabFromQuery()


    return loggingIn ? (
        <Loading />
    ) : (
        <>
            <div className="tabs tabs-box inline-flex font-semibold">
                <Link to="?tab=overview" className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}>Overview</Link>
                <Link to="?tab=posts" className={`tab ${activeTab === 'posts' ? 'tab-active' : ''}`}>Posts</Link>
                <Link to="?tab=admins" className={`tab ${activeTab === 'admins' ? 'tab-active' : ''}`}>Admins</Link>
            </div>
            <div className="mt-2">
                {(activeTab === "overview") && <Overview />}
                {(activeTab === "posts") && <Posts />}
                {(activeTab === "admins") && <Admins />}
            </div>
        </>
    )
}
