import { ApiContext } from "@/contexts/ApiContext";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ApiProvider = ({ children }) => {
    const navigate = useNavigate();
    const serverURL = import.meta.env.VITE_SERVER_URL;
    const refreshEndPoint = `${serverURL}/api/user/refresh`;
    const { setAuthToken } = useAuth();

    const api = axios.create({
        baseURL: serverURL,
        headers: { "Content-Type": "application/json" }
    });

    const refreshAuthLogic = async (failedRequest) => {
        try {
            const response = await axios.post(refreshEndPoint);
            const newToken = response.data.accessToken;
            setAuthToken(newToken);
            failedRequest.response.config.headers["Authorization"] = `Bearer ${newToken}`;
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
            return Promise.resolve();
        } catch (refreshError) {
            console.log("Failed to refresh:", refreshError);
            return Promise.reject(failedRequest);

        }
    }

    createAuthRefreshInterceptor(api, refreshAuthLogic);

    const requestHandler = async (method, url, data = null, config = {}) => {
        try {
            const response = data
                ? await api[method](url, data, config)
                : await api[method](url, config);

            return { data: response.data, error: null };
        } catch (error) {
            // console.log("erorrrrrrrrr", error)
            // if (axios.isAxiosError(error) && error.status === 401) {
            //     navigate("/auth");
            //     return { data: null, error: { message: error?.response?.data?.message || "Please login again." } }
            // }

            // if (axios.isAxiosError(error) && error.response?.data) {
            //     return { data: null, error: error.response.data };
            // }

            // console.log("Unexpected error:", error);
            // return { data: null, error: { message: "An unexpected error occurred." } };

            if (axios.isAxiosError(error)) {
                if (error.status === 401) navigate("/auth");

                return {
                    data: null,
                    error: error.response?.data || { ...error, message: error.message || "Something went wrong." }
                };
            }

            return {
                data: null,
                error: error.message ? error : { ...error, message: "Something went wrong." }
            };
        }
    };

    const apiWrapper = {
        get: (url, config) => requestHandler("get", url, null, config),
        post: (url, data, config) => requestHandler("post", url, data, config),
        put: (url, data, config) => requestHandler("put", url, data, config),
        delete: (url, config) => requestHandler("delete", url, null, config),
    };


    return <ApiContext.Provider value={apiWrapper}>{children}</ApiContext.Provider>;
};

export { ApiProvider };
