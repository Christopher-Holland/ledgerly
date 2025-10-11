import React, { useState, useEffect } from "react";
import { useAuth, api } from "../../hooks/useAuth";

const PrivacySettings = ({ onClose }) => {
    const { user, setUser } = useAuth();

    const [privacy, setPrivacy] = useState({
        twoFA: false,
        activityLog: true,
        privateAccount: false,
        autoLogout: false,
        shareData: false,
    });

    const [showSaved, setShowSaved] = useState(false);

    useEffect(() => {
        if (user?.settings?.privacy) {
            setPrivacy(user.settings.privacy);
        }
    }, [user]);

    const handleToggle = (field) => {
        setPrivacy(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        try {
            const res = await api.put("/api/users/settings", {
                privacy, // ✅ send directly
            });

            setUser(prev => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    privacy,
                },
            }));

            // ✅ Show success popup briefly before closing
            setShowSaved(true);
            setTimeout(() => {
                setShowSaved(false);
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error saving privacy settings:", err);
            alert("Failed to save settings");
        }
    };

    const privacyOptions = [
        { key: "twoFA", label: "Two-Factor Authentication", description: "Add an extra layer of security to your account" },
        { key: "activityLog", label: "Activity Log", description: "Track all account activity and login history" },
        { key: "privateAccount", label: "Private Account", description: "Make your account and data private" },
        { key: "autoLogout", label: "Auto Logout", description: "Automatically log out after a certain time" },
        { key: "shareData", label: "Share Data", description: "Share your data with other users" },
    ];

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
                    Privacy & Security
                </h2>
                <p className="text-xl mb-6 text-center text-[var(--color-red)]">
                    ⚠️ Some features may not be available at this time. ⚠️
                </p>
                <p className="text-xl mb-6 text-center text-[var(--color-red)]">
                    ⚠️ For demonstration purposes, all settings are shown as enabled. ⚠️
                </p>

                <div className="space-y-6">
                    {privacyOptions.map(({ key, label, description }) => (
                        <div key={key} className="border-t border-[var(--color-border)] pt-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[var(--color-cyan)] mb-1">
                                        {label}
                                    </h3>
                                    <p className="text-sm text-[var(--color-text)] opacity-70">
                                        {description}
                                    </p>
                                </div>
                                <label className="inline-flex relative items-center cursor-pointer ml-4">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={privacy[key]}
                                        onChange={() => handleToggle(key)}
                                    />
                                    <div className="w-12 h-6 bg-gray-400 border-2 border-gray-500 rounded-full peer-checked:bg-[var(--color-cyan)] peer-checked:border-[var(--color-cyan)] transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform shadow-sm"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 md:w-auto px-6 py-2.5 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 md:w-auto px-6 py-2.5 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition shadow-md"
                    >
                        Save
                    </button>
                </div>
            </div>
            {/* ✅ Success Popup */}
            {showSaved && (
                <div className="absolute bottom-12 bg-[var(--color-card-bg)] text-[var(--color-text)] border border-[var(--color-cyan)] px-6 py-3 rounded-xl shadow-lg animate-fadeIn">
                    Settings saved successfully!
                </div>
            )}
        </div>
    );
};

export default PrivacySettings;