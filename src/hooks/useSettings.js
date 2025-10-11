// src/hooks/useSettings.js
import { useState, useEffect } from "react";

export const useSettings = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "dark"; // default to dark
    });

    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem("currency") || "$";
    });

    const [dateFormat, setDateFormat] = useState(() => {
        return localStorage.getItem("dateFormat") || "MM/DD/YYYY";
    });

    const [defaultAccountId, setDefaultAccountId] = useState(null);

    useEffect(() => {
        document.documentElement.classList.remove("theme-dark", "theme-light");
        document.documentElement.classList.add(`theme-${theme}`);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return {
        theme,
        toggleTheme,
        currency,
        setCurrency,
        dateFormat,
        setDateFormat,
        defaultAccountId,
        setDefaultAccountId
    };
};