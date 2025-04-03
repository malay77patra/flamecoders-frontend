import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const [authToken, setAuthToken] = useState(localStorage.getItem("_authtk"));
    const isAuthenticated = !!authToken;

    const logoutUser = async () => {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/user/logout`, {}, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        });
        setUser({});
        setAuthToken("");
    }


    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user ? user : {}));
    }, [user]);

    useEffect(() => {
        localStorage.setItem("_authtk", authToken || "");
    }, [authToken]);


    return (
        <AuthContext.Provider value={{ user, setUser, authToken, setAuthToken, isAuthenticated, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };