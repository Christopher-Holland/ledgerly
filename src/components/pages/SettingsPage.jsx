// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../modals/Modal";

// Settings components
import AccountSettings from "../settings/AccountSettings";
import NotificationsSettings from "../settings/NotificationsSettings";
import PrivacySettings from "../settings/PrivacySettings";
import IntegrationsSettings from "../settings/IntegrationSettings";
import SupportSettings from "../settings/SupportSettings";

const SettingsPage = () => {
    const { theme, toggleTheme } = useTheme();
    const [openModal, setOpenModal] = useState(null);

    const renderModalContent = () => {
        switch (openModal) {
            case "account":
                return <AccountSettings onClose={() => setOpenModal(null)} />;
            case "notifications":
                return <NotificationsSettings onClose={() => setOpenModal(null)} />;
            case "privacy":
                return <PrivacySettings onClose={() => setOpenModal(null)} />;
            case "integrations":
                return <IntegrationsSettings onClose={() => setOpenModal(null)} />;
            case "support":
                return <SupportSettings onClose={() => setOpenModal(null)} />;
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        switch (openModal) {
            case "account":
                return "Account Settings";
            case "notifications":
                return "Notification Settings";
            case "privacy":
                return "Privacy & Security";
            case "integrations":
                return "Integrations";
            case "support":
                return "Support";
            default:
                return "";
        }
    };

    return (
        <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Settings" />

                <main className="flex-1 relative overflow-y-auto">
                    {/* Background gradients */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8 space-y-8">
                        <h2 className="text-3xl font-semibold mb-6">Settings</h2>

                        {/* Settings grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Appearance */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Appearance</h3>
                                <div className="flex items-center justify-center gap-4 text-lg">
                                    <span>Dark Mode</span>
                                    <label className="inline-flex relative items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={theme === "light"}
                                            onChange={toggleTheme}
                                        />
                                        <div className="w-14 h-7 bg-[var(--color-card-bg)] rounded-full peer-checked:bg-[var(--color-cyan)] transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full peer-checked:translate-x-7 transition-transform"></div>
                                    </label>
                                    <span>Light Mode</span>
                                </div>
                            </div>

                            {/* Notifications */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Notifications</h3>
                                <p className="text-lg mb-4">
                                    Customize alerts for bills, goals, and spending.
                                </p>
                                <button
                                    onClick={() => setOpenModal("notifications")}
                                    className="bg-[var(--color-cyan)] hover:brightness-90 text-white px-6 py-3 rounded-lg text-lg"
                                >
                                    Manage Alerts
                                </button>
                            </div>

                            {/* Account Settings */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Account Settings</h3>
                                <p className="text-lg mb-4">
                                    Manage linked accounts, password, and login preferences.
                                </p>
                                <button
                                    onClick={() => setOpenModal("account")}
                                    className="bg-[var(--color-accent-green)] hover:brightness-90 text-white px-6 py-3 rounded-lg text-lg"
                                >
                                    Manage Accounts
                                </button>
                            </div>

                            {/* Privacy & Security */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Privacy & Security</h3>
                                <p className="text-lg mb-4">
                                    Adjust privacy settings and enable two-factor authentication.
                                </p>
                                <button
                                    onClick={() => setOpenModal("privacy")}
                                    className="bg-[var(--color-red)] hover:brightness-90 text-white px-6 py-3 rounded-lg text-lg"
                                >
                                    Configure
                                </button>
                            </div>

                            {/* Integrations */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Integrations</h3>
                                <p className="text-lg mb-4">
                                    Connect external apps or bank accounts.
                                </p>
                                <button
                                    onClick={() => setOpenModal("integrations")}
                                    className="bg-blue-500 hover:brightness-90 text-white px-6 py-3 rounded-lg text-lg"
                                >
                                    Connect
                                </button>
                            </div>

                            {/* Support */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-4">Support</h3>
                                <p className="text-lg mb-4">
                                    Get help or contact customer support.
                                </p>
                                <button
                                    onClick={() => setOpenModal("support")}
                                    className="bg-purple-500 hover:brightness-90 text-white px-6 py-3 rounded-lg text-lg"
                                >
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* --- Single Modal --- */}
                    <Modal
                        isOpen={!!openModal}
                        onClose={() => setOpenModal(null)}
                        title={getModalTitle()}
                    >
                        {renderModalContent()}
                    </Modal>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;