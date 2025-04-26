import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Authorized({ children }) {

    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login", { replace: true })
        }
    }, [isAuthenticated])

    return children;
}