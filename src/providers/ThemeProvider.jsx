import { useState, useEffect } from "react"
import { ThemeContext } from "@/contexts/ThemeContext";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
            return localStorage.getItem("theme") || (mediaQuery.matches ? "night" : "modern")
        }

        // fallback
        return "modern";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme)
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])


    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export { ThemeProvider }