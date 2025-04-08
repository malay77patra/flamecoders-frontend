import React, { useEffect, useState } from 'react'
import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RLoader from '@/components/RLoader';
import toast from 'react-hot-toast';

export default function Admin() {
    const [loggingIn, setLoggingIn] = useState(true);
    const api = useApi();
    const { isAuthenticated, authToken, user, setUser } = useAuth();
    const navigate = useNavigate();

    const loginAsAdmin = async () => {
        try {
            const { data, error } = await api.post("/api/admin/login", {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });

            if (error) {
                navigate("/");
            } else {
                setUser({ isAdmin: true, ...user });
            }
        } catch (err) {
            toast.error("Something went wrong!");
        } finally {
            setLoggingIn(false);
        }
    }


    useEffect(() => {
        if (!user.isAdmin) {
            if (!isAuthenticated) {
                navigate("/", { replace: true });
            } else {
                loginAsAdmin();
            }
        } else {
            setLoggingIn(false);
        }
    }, [isAuthenticated]);

    return loggingIn ? (
        <div className='flex justify-center pt-20'>
            <RLoader size='3rem' />
        </div>
    ) : (
        <>
            <h1>Hello admin {user.name}!</h1>
        </>
    );
}
