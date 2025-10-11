import React, { useState } from "react";
import { api } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // Step 1: enter username, Step 2: set new password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleUsernameSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            // Verify username exists
            await api.post("/api/users/forgot-password", { username });
            setSuccess("Username verified. You can now set a new password.");
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || "Username not found");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await api.put(`/api/users/reset-password`, { username, password });
            setSuccess("Password reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4">
            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-400 mb-4 text-center">{success}</p>}

                {step === 1 && (
                    <form onSubmit={handleUsernameSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-2 rounded-lg bg-[var(--color-cyan)] text-white hover:brightness-90 transition disabled:opacity-50"
                        >
                            {loading ? "Verifying..." : "Verify Username"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <input
                            type="password"
                            placeholder="New Password"
                            className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-2 rounded-lg bg-[var(--color-cyan)] text-white hover:brightness-90 transition disabled:opacity-50"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <button
                    onClick={() => navigate("/login")}
                    className="mt-4 w-full px-6 py-2 rounded-lg border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition"
                >
                    Back to Login
                </button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;