// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long!");
            return;
        }

        setIsSubmitting(true);

        const result = await register(name, username, email, password, confirmPassword);

        if (result.success) {
            navigate("/login");
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
                    <h2 className="text-4xl font-bold mb-6 text-center text-[var(--color-cyan)]">Create Account</h2>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-2 text-lg opacity-80">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                placeholder="Your Name"
                                required
                            />
                        </div>
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
                            <label className="block mb-2 text-lg opacity-80">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                placeholder="youremail@example.com"
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
                        <div>
                            <label className="block mb-2 text-lg opacity-80">Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                placeholder="********"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-[var(--color-cyan)] hover:opacity-80 rounded-lg font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Creating Account..." : "Register"}
                        </button>
                    </form>

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 mt-4 border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] rounded-lg font-bold text-lg transition"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;