import { useState, useEffect } from "react"
import { ThemeContext } from "@/contexts/ThemeContext";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "light"
        }
        return "light";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme || "light")
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])


    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider }