// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("dark"); // Start with dark as default

    // On mount, load theme from localStorage if available
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("light", savedTheme === "light");
        } else {
            // default to system preference
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const initialTheme = prefersDark ? "dark" : "light";
            setTheme(initialTheme);
            document.documentElement.classList.toggle("light", initialTheme === "light");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("light", newTheme === "light");
        console.log("Theme toggled to:", newTheme); // Debug log
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for easy access
export const useTheme = () => useContext(ThemeContext);