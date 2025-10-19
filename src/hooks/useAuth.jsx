/**
 * @fileoverview Authentication context and hook for user management
 * @description Provides authentication state, login/logout functionality, and API configuration
 * @author Christopher Holland
 * @version 1.0.0
 */

import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// API configuration
const API_BASE_URL = "https://ledgerly-p5ss.onrender.com";
const api = axios.create({ baseURL: API_BASE_URL });

// Create authentication context
const AuthContext = createContext();

/**
 * Authentication provider component
 * @description Provides authentication state and methods to child components
 * @component AuthProvider
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider with authentication functionality
 */
export const AuthProvider = ({ children }) => {
    // Load existing authentication token from browser storage
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token") || null;

    // Authentication state management
    const [user, setUser] = useState(null);        // Current authenticated user
    const [token, setToken] = useState(storedToken); // JWT authentication token
    const [loading, setLoading] = useState(true);   // Loading state for auth verification

    /**
     * Configure axios headers with authentication token
     * @description Automatically attaches or removes Bearer token from API requests
     */
    useEffect(() => {
        if (token) {
            // Set Authorization header for authenticated requests
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            console.log("Token set in headers:", token);
        } else {
            // Remove Authorization header for unauthenticated requests
            delete api.defaults.headers.common["Authorization"];
            console.log("Token removed from headers");
        }
    }, [token]);

    // Validate user session
    useEffect(() => {
        const checkAuth = async () => {
            if (token) {
                try {
                    console.log("Checking auth with token:", token);
                    const res = await api.get("/api/users/me");
                    console.log("Authenticated user:", res.data);
                    setUser(res.data);
                } catch (err) {
                    console.error("Token invalid or expired:", err.response?.data || err);
                    logout();
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, [token]);

    // --- LOGIN ---
    const login = async (username, password, rememberMe = false) => {
        setLoading(true);
        try {
            const res = await api.post("/api/users/login", { username, password });
            const { _id, name, username: uname, email, token: userToken } = res.data;

            setUser({ _id, name, username: uname, email });
            setToken(userToken);

            if (rememberMe) {
                localStorage.setItem("token", userToken);
                sessionStorage.removeItem("token");
            } else {
                sessionStorage.setItem("token", userToken);
                localStorage.removeItem("token");
            }

            return { success: true, user: { _id, name, username: uname, email } };
        } catch (err) {
            console.error("Login failed:", err.response?.data || err);
            return { success: false, error: err.response?.data?.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    // --- REGISTER ---
    const register = async (name, username, email, password, confirmPassword) => {
        setLoading(true);
        try {
            const res = await api.post("/api/users/register", {
                name,
                username,
                email,
                password,
                confirmPassword
            });

            const { _id, name: n, username: uname, email: em, token: userToken } = res.data;

            setUser({ _id, name: n, username: uname, email: em });
            setToken(userToken);
            localStorage.setItem("token", userToken); // Persist token after registration

            return { success: true, user: { _id, name: n, username: uname, email: em } };
        } catch (err) {
            console.error("Registration failed:", err.response?.data || err);
            return { success: false, error: err.response?.data?.message || "Registration failed" };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log("Logging out user");
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export { api };