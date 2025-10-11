import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../hooks/useAuth";

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await api.put(`/api/users/reset-password/${token}`, { password });
            setSuccess("Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000); // auto redirect to login
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] p-4">
            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-2xl p-10 w-full max-w-md">
                <h2 className="text-3xl font-semibold mb-6 text-center">Reset Password</h2>
                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-400 mb-4 text-center">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>
        </div>
    );
};

export default ResetPasswordPage;