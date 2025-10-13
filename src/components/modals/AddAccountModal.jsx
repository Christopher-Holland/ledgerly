import React, { useState } from "react";
import Modal from "./Modal";

const AddAccountModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [balance, setBalance] = useState("");
    const [institution, setInstitution] = useState("");
    const [balanceType, setBalanceType] = useState("positive");

    const handleSave = () => {
        if (!name.trim() || !type.trim()) return;

        onSave({
            name,
            type,
            balance: parseFloat(balance) || 0,
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
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Account">
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Account Nickname"
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                    required
                />
                <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Account Type (e.g. Checking, Savings)"
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                    required
                />
                <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="Initial Balance"
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
                />
                <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Institution (optional)"
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)] placeholder-gray-400 dark:placeholder-gray-500"
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
                        Save Account
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddAccountModal;