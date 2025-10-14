import React, { useState } from "react";

const AddAccountModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [balance, setBalance] = useState("");
    const [institution, setInstitution] = useState("");
    const [balanceType, setBalanceType] = useState("positive");
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = () => {
        if (!name.trim() || !type.trim()) return;

        onSave({
            name,
            type,
            balance: parseFloat(balance) || 0,
            institution,
            balanceType,
        });

        // Reset fields
        setName("");
        setType("");
        setBalance("");
        setInstitution("");
        setBalanceType("positive");

        // Show success toast
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1800);
    };

    if (!isOpen && !showSuccess) return null;

    // ✅ Success Toast
    if (showSuccess) {
        return (
            <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
                <div className="mt-10 bg-[var(--color-card-bg)]/95 border border-[var(--color-border)] rounded-xl px-6 py-4 shadow-xl text-center animate-slideDownFade z-50">
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                        Account added successfully
                    </h3>
                </div>
            </div>
        );
    }

    // 🩵 Modal
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl z-10 animate-fadeInUp border border-[var(--color-border)]">
                <h3 className="text-2xl font-bold text-[var(--color-cyan)] mb-4 text-center">
                    Add New Account
                </h3>

                <div className="flex flex-col space-y-4 text-[var(--color-text)]">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Account Nickname"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Account Type (e.g. Checking, Savings)"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                        required
                    />
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Initial Balance"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="Institution (optional)"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                    />
                    <select
                        value={balanceType}
                        onChange={(e) => setBalanceType(e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] bg-[var(--color-card-bg)]"
                    >
                        <option value="positive">Positive Balance</option>
                        <option value="negative">Negative Balance</option>
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition shadow-md"
                        >
                            Save Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAccountModal;