// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const result = await login(username, password, rememberMe);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setError(result.error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 flex text-[var(--color-text)]">
            {/* Background Gradients */}
            <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
            <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

            <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen">
                <h1 className="fixed top-10 logo">ledgerly</h1>

                <div className="w-full max-w-lg p-8 bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg space-y-6">
                    <h2 className="text-4xl font-bold mb-6 text-center text-[var(--color-cyan)]">Login</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-lg opacity-80">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                placeholder="yourusername"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-lg opacity-80">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                placeholder="********"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="mr-2 w-5 h-5"
                            />
                            <label htmlFor="rememberMe" className="text-lg opacity-80">Remember Me</label>
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => navigate("/forgot-password")}
                                className="text-sm text-[var(--color-cyan)] hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[var(--color-cyan)] hover:opacity-80 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Logging In..." : "Log In"}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate("/register")}
                        className="w-full py-3 mt-4 border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] rounded-lg font-bold text-lg transition"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;