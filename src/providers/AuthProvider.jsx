import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });

    const isAuthenticated = user && Object.keys(user).length > 0;

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };