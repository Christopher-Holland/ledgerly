import React, { useState } from "react";
import { useAuth, api } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

const AccountSettings = ({ onClose }) => {
    const { user, setUser, logout } = useAuth();
    const [name, setName] = useState(user?.name || "");
    const [username, setUsername] = useState(user?.username || "");
    const [email, setEmail] = useState(user?.email || "");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswordSection, setShowPasswordSection] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }
        try {
            setChangingPassword(true);
            await api.put("/api/users/change-password", { currentPassword, newPassword });
            setSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordSection(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update password");
        } finally {
            setChangingPassword(false);
        }
    };

    const handleSave = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await api.put("/api/users/me", { name, username, email });
            setUser(res.data);
            setSuccess("Account updated successfully!");
            if (onClose) onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update account");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            setIsDeleting(true);
            await api.delete("/api/users/me");
            logout();
            navigate("/login");
        } catch (err) {
            console.error("Error deleting account:", err);
            setError("Something went wrong while deleting your account.");
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Main Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-3xl z-10 animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-cyan)]">
                    Account Settings
                </h2>

                {error && <p className="text-red-400 mb-4 text-center">{error}</p>}
                {success && <p className="text-green-400 mb-4 text-center">{success}</p>}

                <div className="space-y-8">
                    {/* User Info */}
                    <div className="space-y-5">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                            />
                        </div>
                    </div>

                    {/* Toggle Password Section */}
                    <div className="border-t border-[var(--color-border)] pt-6">
                        <button
                            onClick={() => setShowPasswordSection((prev) => !prev)}
                            className="w-full flex items-center justify-between text-[var(--color-cyan)] font-semibold text-lg hover:opacity-80 transition"
                        >
                            Change Password
                            {showPasswordSection ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                        </button>

                        {showPasswordSection && (
                            <div className="mt-5 space-y-3 animate-fadeIn">
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                />
                                <button
                                    onClick={handleChangePassword}
                                    disabled={changingPassword}
                                    className="w-full mt-3 py-2.5 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition disabled:opacity-50 shadow-md"
                                >
                                    {changingPassword ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition shadow-md"
                    >
                        Delete Account
                    </button>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 px-6 py-2.5 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition disabled:opacity-50 shadow-md"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-60 animate-fadeIn">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowDeleteModal(false)}
                    />
                    <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl text-center z-10 animate-fadeInUp">
                        <AlertTriangle className="text-red-500 mx-auto mb-3" size={40} />
                        <h3 className="text-2xl font-bold text-red-400 mb-2">
                            Delete Account?
                        </h3>
                        <p className="text-gray-300 mb-6">
                            This action is permanent and cannot be undone. Are you sure you want to delete your account?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-5 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 shadow-md"
                            >
                                {isDeleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountSettings;