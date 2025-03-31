import { useCallback } from "react";
import axios from "axios";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

const useApi = () => {
    const { authToken, setAuthToken } = useAuth();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
        validateStatus: (status) => true
    });

    let isRefreshing = false;
    let refreshPromise = null;

    const refreshToken = async () => {
        if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = api.post("/user/refresh", {}, { withCredentials: true })
                .then((res) => {
                    const newToken = res.data?.accessToken;
                    if (newToken) {
                        setAuthToken(newToken);
                    }
                    isRefreshing = false;
                    return newToken;
                })
                .catch(() => {
                    isRefreshing = false;
                    navigate("/login");
                    throw new Error("Token refresh failed");
                });
        }
        return refreshPromise;
    };

    api.interceptors.request.use((config) => {
        if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    });

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshToken();
                    if (newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                } catch {
                    navigate("/login");
                    throw new Error("Redirecting to login");
                }
            }

            return Promise.reject(error);
        }
    );

    const request = useCallback(
        async (method, url, data = null, config = {}) => {
            const response = await api({ method, url, data, ...config });
            return response.data;
        },
        [authToken, navigate, setAuthToken]
    );

    return {
        get: (url, config = {}) => request("GET", url, null, config),
        post: (url, data, config = {}) => request("POST", url, data, config),
        put: (url, data, config = {}) => request("PUT", url, data, config),
        delete: (url, config = {}) => request("DELETE", url, null, config)
    };
};

export { useApi };
