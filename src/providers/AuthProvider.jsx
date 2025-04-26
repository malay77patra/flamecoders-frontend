import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const [authToken, setAuthToken] = useState(localStorage.getItem("_authtk") || "");
    const isAuthenticated = !!authToken;


    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user ? user : {}));
    }, [user]);

    useEffect(() => {
        localStorage.setItem("_authtk", authToken || "");
    }, [authToken]);


    return (
        <AuthContext.Provider value={{ user, setUser, authToken, setAuthToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };