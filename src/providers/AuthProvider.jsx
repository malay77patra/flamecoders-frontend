import { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { Auth } from "@/utils/auth";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : {};
    });
    const auth = new Auth();

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, setUser, auth }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };