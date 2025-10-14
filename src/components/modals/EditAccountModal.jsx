import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const EditAccountModal = ({ isOpen, onClose, onSave, account }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [balance, setBalance] = useState("");
    const [institution, setInstitution] = useState("");
    const [balanceType, setBalanceType] = useState("positive");

    // Populate fields when account changes
    useEffect(() => {
        if (account) {
            setName(account.name || "");
            setType(account.type || "");
            // Show absolute value in input, balanceType handles the sign
            setBalance(Math.abs(account.balance || 0).toString());
            setInstitution(account.institution || "");
            // Determine balanceType from the current balance
            setBalanceType(account.balance < 0 ? "negative" : "positive");
        }
    }, [account]);

    const handleSave = () => {
        if (!name.trim() || !type.trim()) return;

        // Calculate balance based on balanceType
        const numericBalance = parseFloat(balance) || 0;
        const finalBalance = balanceType === "negative" ? -Math.abs(numericBalance) : Math.abs(numericBalance);

        onSave({
            ...account,
            name,
            type,
            balance: finalBalance,
            institution,
            balanceType,
        });

        // Reset and close
        setName("");
        setType("");
        setBalance("");
        setInstitution("");
        setBalanceType("positive");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl text-center z-10 animate-fadeInUp border border-[var(--color-border)]">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text)]">
                        {account ? `Editing "${account.name}"` : "Edit Account"}
                    </h2>
                </div>

                {/* Form */}
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Account Nickname"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400"
                        required
                    />
                    <input
                        type="text"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        placeholder="Account Type (e.g. Checking, Savings)"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400"
                        required
                    />
                    <input
                        type="number"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        placeholder="Balance"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400"
                    />
                    <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="Institution (optional)"
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400"
                    />
                    <select
                        value={balanceType}
                        onChange={(e) => setBalanceType(e.target.value)}
                        className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                    >
                        <option value="positive">Positive Balance</option>
                        <option value="negative">Negative Balance</option>
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-2">
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
                            Update Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAccountModal;