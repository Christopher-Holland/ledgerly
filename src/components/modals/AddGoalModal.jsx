import React, { useState } from "react";

const AddGoalModal = ({ isOpen, onClose, onSave, accounts = [] }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [currentAmount, setCurrentAmount] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [linkedAccount, setLinkedAccount] = useState("");
    const [type, setType] = useState("");

    const handleSave = () => {
        if (!title.trim()) return;

        onSave({
            title,
            description,
            targetAmount: parseFloat(targetAmount) || 0,
            currentAmount: parseFloat(currentAmount) || 0,
            targetDate,
            linkedAccount,
            goalType: type, // Map type to goalType to match backend
            completed: false,
        });

        // Reset form and close modal
        setTitle("");
        setDescription("");
        setTargetAmount("");
        setCurrentAmount("");
        setTargetDate("");
        setLinkedAccount("");
        setType("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-lg shadow-2xl z-10 animate-fadeInUp border border-[var(--color-border)]">
                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-6 text-center">
                    Add New Goal
                </h3>
                
                <div className="flex flex-col space-y-4">
                    {/* Goal Title */}
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Goal Title"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                        required
                    />

                    {/* Description */}
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Description"
                        rows={3}
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                    />

                    {/* Target Amount */}
                    <input
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="Target Amount (e.g., 5000)"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                        min="0"
                    />

                    {/* Current Amount */}
                    <input
                        type="number"
                        value={currentAmount}
                        onChange={(e) => setCurrentAmount(e.target.value)}
                        placeholder="Current Amount (e.g., 1000)"
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                        min="0"
                    />

                    {/* Target Date */}
                    <input
                        type="date"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                    />

                    {/* Goal Type */}
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                    >
                        <option value="">Select goal type</option>
                        <option value="short-term">Short Term</option>
                        <option value="medium-term">Medium Term</option>
                        <option value="long-term">Long Term</option>
                    </select>

                    {/* Optional Linked Account */}
                    <select
                        value={linkedAccount}
                        onChange={(e) => setLinkedAccount(e.target.value)}
                        className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl 
                        focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] 
                        text-[var(--color-text)] bg-transparent"
                    >
                        <option value="">Optional: Link an account</option>
                        {accounts.map(acc => (
                            <option key={acc._id || acc.id} value={acc._id || acc.id}>
                                {acc.name} ({acc.type})
                            </option>
                        ))}
                    </select>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-5 py-2 rounded-xl bg-[var(--color-cyan)] text-white hover:brightness-110 transition font-semibold shadow-md"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddGoalModal;