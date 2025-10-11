import React, { useState, useEffect } from "react";
import { useAuth, api } from "../../hooks/useAuth";
import { ChevronDown, ChevronUp } from "lucide-react";

const NotificationsSettings = ({ onClose }) => {
    const { user, setUser } = useAuth();

    const defaultNotifications = {
        accountActivity: { email: true, inApp: true },
        budgetAlerts: { email: true, inApp: true },
        goalUpdates: { email: true, inApp: true },
        billReminders: { email: true, inApp: true },
        promotions: { email: true, inApp: true },
    };

    const [notifications, setNotifications] = useState(defaultNotifications);
    const [expanded, setExpanded] = useState({
        accountActivity: true,
        budgetAlerts: false,
        goalUpdates: false,
        billReminders: false,
        promotions: false,
    });
    const [showSaved, setShowSaved] = useState(false); // ✅ NEW: confirmation popup

    // Fetch notifications once on mount
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/api/users/me");
                if (res.data?.settings?.notifications) {
                    setNotifications({
                        ...defaultNotifications,
                        ...res.data.settings.notifications,
                    });
                }
            } catch (err) {
                console.error("Error fetching notification settings:", err);
            }
        };
        fetchSettings();
    }, []);

    const toggleExpand = (category) => {
        setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
    };

    const handleToggle = (category, type) => {
        setNotifications((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [type]: !prev[category][type],
            },
        }));
    };

    const handleSave = async () => {
        try {
            await api.put("/api/users/settings", {
                notifications: notifications,
            });

            setUser((prev) => ({
                ...prev,
                settings: {
                    ...prev.settings,
                    notifications: notifications,
                },
            }));

            // ✅ Show success popup briefly before closing
            setShowSaved(true);
            setTimeout(() => {
                setShowSaved(false);
                onClose();
            }, 1500);
        } catch (err) {
            console.error("Error saving notification settings:", err);
            alert("Failed to save settings");
        }
    };

    const renderCategory = (label, category) => (
        <div key={category} className="border-t border-[var(--color-border)] pt-4">
            <button
                className="w-full flex justify-between items-center text-[var(--color-cyan)] font-semibold text-lg hover:opacity-80 transition"
                onClick={() => toggleExpand(category)}
            >
                {label}
                {expanded[category] ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
            </button>
            {expanded[category] && (
                <div className="mt-3 space-y-3 animate-fadeIn">
                    {["email", "inApp"].map((type) => (
                        <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-[var(--color-text)]">
                                <span className="capitalize">
                                    {type === "email" ? "Email" : "In-App"}
                                </span>
                            </div>
                            <label className="inline-flex relative items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={notifications[category][type]}
                                    onChange={() => handleToggle(category, type)}
                                />
                                <div className="w-12 h-6 bg-gray-400 border-2 border-gray-500 rounded-full peer-checked:bg-[var(--color-cyan)] peer-checked:border-[var(--color-cyan)] transition-colors"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-transform shadow-sm"></div>
                            </label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

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
                    Notification Settings
                </h2>

                <div className="space-y-6">
                    {renderCategory("Account Activity", "accountActivity")}
                    {renderCategory("Budget Alerts", "budgetAlerts")}
                    {renderCategory("Goal Updates", "goalUpdates")}
                    {renderCategory("Bill Updates", "billReminders")}
                    {renderCategory("Promotional Updates", "promotions")}
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

export default NotificationsSettings;