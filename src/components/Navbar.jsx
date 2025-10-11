import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = ({ title }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    // Function to generate a time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <header className="h-22 bg-navbar shadow-lg border-b border-navbar flex items-center px-6 justify-between">
            <h2 className="text-2xl font-semibold text-navbar">{title}</h2>

            <div className="flex items-center space-x-4">
                {user && (
                    <span className="text-lg text-navbar">
                        {getGreeting()}, <span className="font-bold">{user.name}</span>!
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="w-24 py-2 rounded-lg font-bold text-lg btn-navbar"
                >
                    Log Out
                </button>
            </div>
        </header>
    );
};

export default Navbar;