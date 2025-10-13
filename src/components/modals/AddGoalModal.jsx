import React, { useState } from "react";
import Modal from "./Modal";

const AddGoalModal = ({ isOpen, onClose, onSave, accounts = [] }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [linkedAccount, setLinkedAccount] = useState("");

    const handleSave = () => {
        if (!title.trim()) return;

        onSave({
            title,
            description,
            targetDate,
            linkedAccount,
        });

        // Reset form and close modal
        setTitle("");
        setDescription("");
        setTargetDate("");
        setLinkedAccount("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Goal">
            <div className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Goal Title"
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                    required
                />
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                />
                <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                />
                <select
                    value={linkedAccount}
                    onChange={(e) => setLinkedAccount(e.target.value)}
                    className="w-full px-4 py-2 border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                >
                    <option value="">Optional: Link an account</option>
                    {accounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                            {acc.name} ({acc.type})
                        </option>
                    ))}
                </select>

                <div className="flex justify-end gap-4 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-xl bg-[var(--color-cyan)] text-white hover:brightness-110 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AddGoalModal;