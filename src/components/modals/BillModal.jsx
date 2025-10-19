import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

const EditBillsModal = ({ isOpen, onClose, bills = [], onSave, updateBills }) => {
    const [localBills, setLocalBills] = useState([]);
    const [newBill, setNewBill] = useState({ name: "", date: "", amount: "" });
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);

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

    // Handle inline field editing
    const handleBillChange = (id, field, value) => {
        setLocalBills(localBills.map((b) =>
            (b._id || b.id) === id ? { ...b, [field]: value } : b
        ));
    };

    // Handle deleting a bill
    const handleDeleteBill = (id) => {
        setLocalBills(localBills.filter((b) => (b._id || b.id) !== id));
    };

    // Handle adding a new bill from form
    const handleAddBill = (e) => {
        e.preventDefault();
        if (!newBill.name || !newBill.date || !newBill.amount) return;

        const billToAdd = {
            name: newBill.name,
            date: newBill.date,
            amount: parseFloat(newBill.amount),
        };

        setLocalBills([...localBills, billToAdd]);
        setNewBill({ name: "", date: "", amount: "" }); // reset form
    };

    // Handle save (calls API through updateBills function)
    const handleSave = async () => {
        if (!updateBills) {
            // Fallback to parent onSave if updateBills not provided
            onSave(localBills);
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 1800);
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const result = await updateBills(localBills);
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1800);
            } else {
                setError(result.error || "Failed to save bills");
            }
        } catch (err) {
            console.error("Error saving bills:", err);
            setError("Failed to save bills");
        } finally {
            setIsSaving(false);
        }
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

                {/* Error message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                {/* ➕ Add Bill Form */}
                <form onSubmit={handleAddBill} className="mb-6 flex flex-wrap gap-3 items-end">
                    <div className="flex-1">
                        <label className="block text-sm text-[var(--color-muted)] mb-1">Name</label>
                        <input
                            type="text"
                            value={newBill.name}
                            onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
                            placeholder="Bill name"
                            className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--color-muted)] mb-1">Date</label>
                        <input
                            type="date"
                            value={newBill.date}
                            onChange={(e) => setNewBill({ ...newBill, date: e.target.value })}
                            className="bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-[var(--color-muted)] mb-1">Amount</label>
                        <input
                            type="number"
                            step="0.01"
                            value={newBill.amount}
                            onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                            placeholder="0.00"
                            className="bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] w-24"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-medium"
                    >
                        <Plus size={18} /> Add
                    </button>
                </form>

                {/* Bills Table */}
                <div className="overflow-x-auto max-h-80">
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
                            {localBills.map((bill) => {
                                const billId = bill._id || bill.id;
                                return (
                                    <tr key={billId} className="border-b border-[var(--color-border)] last:border-0">
                                        <td className="py-2">
                                            <input
                                                type="text"
                                                value={bill.name}
                                                onChange={(e) => handleBillChange(billId, "name", e.target.value)}
                                                className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            />
                                        </td>
                                        <td className="py-2">
                                            <input
                                                type="date"
                                                value={bill.date ? (bill.date.match(/^\d{4}-\d{2}-\d{2}$/) ? bill.date : new Date(bill.date).toISOString().split('T')[0]) : ''}
                                                onChange={(e) => handleBillChange(billId, "date", e.target.value)}
                                                className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            />
                                        </td>
                                        <td className="py-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={bill.amount}
                                                onChange={(e) => handleBillChange(billId, "amount", e.target.value)}
                                                className="w-full bg-transparent border border-[var(--color-border)] rounded-lg px-2 py-1 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            />
                                        </td>
                                        <td className="py-2 text-right">
                                            <button
                                                onClick={() => handleDeleteBill(billId)}
                                                className="text-[var(--color-red)] hover:opacity-80 transition"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBillsModal;