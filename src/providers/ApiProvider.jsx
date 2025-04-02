import { ApiContext } from "@/contexts/ApiContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const ApiProvider = ({ children }) => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const serverURL = import.meta.env.VITE_SERVER_URL;

    const api = axios.create({
        baseURL: `${serverURL}/api`,
    });

    api.interceptors.response.use(
        (response) => {
            return response.data;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error?.response?.status === 401) {
                if (!originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshResponse = await axios.post(`${serverURL}/api/user/refresh`, {}, {
                            withCredentials: true
                        });

                        if (refreshResponse?.data?.data?.accessToken) {
                            auth.accessToken = refreshResponse.data.data.accessToken;
                            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.data.accessToken}`;
                            return api(originalRequest);
                        }
                    } catch (refreshError) {
                        if (refreshError?.response?.status === 401) {
                            if (location.pathname != "/auth") {
                                navigate("/auth");
                                return Promise.reject({});
                            }
                        }

                        console.log("[use-api]", refreshError);
                        return Promise.reject({ message: error?.response?.data?.error?.message || refreshError?.response?.data?.error?.message || "Something went wrong!" });
                    }
                } else {
                    if (location.pathname != "/auth") {
                        navigate("/auth");
                        return Promise.reject({});
                    }
                }
            }

            console.log("[use-api]", error);
            return Promise.reject({ message: error?.response?.data?.error?.message || "Something went wrong!" });
        }
    );

    const requestHandler = async (method, url, config = {}) => {
        try {
            const response = await api[method](url, config);
            return { data: response.data, error: null };
        } catch (error) {
            return { data: null, error };
        }
    };

    const apiWrapper = {
        get: (url, config) => requestHandler("get", url, config),
        post: (url, data, config) => requestHandler("post", url, { ...config, data }),
        put: (url, data, config) => requestHandler("put", url, { ...config, data }),
        delete: (url, config) => requestHandler("delete", url, config),
    };

    return <ApiContext.Provider value={apiWrapper}>{children}</ApiContext.Provider>;
};

export { ApiProvider };
