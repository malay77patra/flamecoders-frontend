import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function AuthorizedLayout() {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true })
        }
    }, [isAuthenticated])

    return (
        <>
            <Outlet />
        </>
    );
}
