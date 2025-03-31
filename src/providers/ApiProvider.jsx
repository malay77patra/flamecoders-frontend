import { ApiContext } from "@/contexts/ApiContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const ApiProvider = ({ children }) => {
    const { user, setUser, logout } = useAuth();
    const navigate = useNavigate();

    const api = useMemo(() => {
        const instance = axios.create({
            baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
        });

        instance.interceptors.request.use(
            (config) => {
                if (user?.accessToken) {
                    config.headers.Authorization = `Bearer ${user.accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    try {
                        const refreshResponse = await axios.post(
                            `${import.meta.env.VITE_SERVER_URL}/api/user/refresh`,
                            {},
                            { withCredentials: true }
                        );

                        const newAccessToken = refreshResponse.data?.success?.accessToken;
                        if (!newAccessToken) {
                            logout();
                            navigate("/login");
                            return Promise.reject(new Error("Unauthorized - No access token received"));
                        }

                        setUser((prevUser) => ({ ...prevUser, accessToken: newAccessToken }));

                        // Retry the failed request with the new token
                        return instance({
                            ...error.config,
                            headers: {
                                ...error.config.headers,
                                Authorization: `Bearer ${newAccessToken}`,
                            },
                        });
                    } catch (refreshError) {
                        if (refreshError.response?.status === 401) {
                            logout();
                            navigate("/login");
                        }
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }, [user, setUser, logout, navigate]);

    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export { ApiProvider };
