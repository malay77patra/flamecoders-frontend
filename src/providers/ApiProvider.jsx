import { ApiContext } from "@/contexts/ApiContext";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

const ApiProvider = ({ children }) => {
    const { auth } = useAuth();
    const serverURL = import.meta.env.VITE_SERVER_URL;

    const api = axios.create({
        url: "/api",
        baseURL: serverURL,
    });

    api.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error?.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshResponse = await axios.post(`${serverURL}/api/user/refresh`, {}, {
                        withCredentials: true
                    });

                    if (refreshResponse?.data?.data?.accessToken) {
                        auth.accessToken = refreshResponse.data.data.accessToken;
                        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.success.accessToken}`;

                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );


    return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export { ApiProvider };
