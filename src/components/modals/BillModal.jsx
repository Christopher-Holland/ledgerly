import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

const EditBillsModal = ({ isOpen, onClose, bills = [], onSave }) => {
    const [localBills, setLocalBills] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setLocalBills(bills);
    }, [bills]);

    if (!isOpen && !showSuccess) return null;

    // ✅ Success toast
    if (showSuccess) {
        return (
            <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
                <div className="mt-10 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl px-6 py-4 shadow-xl text-center animate-slideDownFade z-50">
                    <CheckCircle className="text-green-500 mx-auto mb-2" size={36} />
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                        Bills updated successfully
                    </h3>

                    <style>{`
                        @keyframes slideDownFade {
                            0% { opacity: 0; transform: translateY(-20px); }
                            50% { opacity: 1; transform: translateY(0); }
                            100% { opacity: 0; transform: translateY(-10px); }
                        }
                        .animate-slideDownFade {
                            animation: slideDownFade 1.8s ease-in-out forwards;
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    const handleAddBill = () => {
        setLocalBills([
            ...localBills,
            { id: Date.now(), name: "", date: "", amount: "" },
        ]);
    };

    const handleDeleteBill = (id) => {
        setLocalBills(localBills.filter((b) => b.id !== id));
    };

    const handleBillChange = (id, field, value) => {
        setLocalBills(localBills.map((b) =>
            b.id === id ? { ...b, [field]: value } : b
        ));
    };

    const handleSave = () => {
        onSave(localBills);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1800);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl shadow-2xl z-10 border border-[var(--color-border)] animate-fadeInUp">
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 text-center">
                    Manage Bills
                </h2>

                {/* Bills Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[var(--color-muted)] border-b border-[var(--color-border)]">
                                <th className="py-2">Name</th>
                                <th className="py-2">Date</th>
                                <th className="py-2">Amount</th>
                                <th className="py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localBills.map((bill) => (
                                <tr key={bill.id} className="border-b border-[var(--color-border)] last:border-0">
                                    <td className="py-2">
                                        <input
                                            type="text"
                                            value={bill.name}
                                            onChange={(e) => handleBillChange(bill.id, "name", e.target.value)}
                                            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            placeholder="Bill name"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input
                                            type="date"
                                            value={bill.date}
                                            onChange={(e) => handleBillChange(bill.id, "date", e.target.value)}
                                            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                        />
                                    </td>
                                    <td className="py-2">
                                        <input
                                            type="number"
                                            value={bill.amount}
                                            onChange={(e) => handleBillChange(bill.id, "amount", e.target.value)}
                                            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="py-2 text-right">
                                        <button
                                            onClick={() => handleDeleteBill(bill.id)}
                                            className="text-[var(--color-red)] hover:opacity-80 transition"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={handleAddBill}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-medium"
                    >
                        <Plus size={18} /> Add Bill
                    </button>

                    <div className="flex gap-3">
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
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditBillsModal;