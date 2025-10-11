import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useTransactions } from "../../hooks/useTransactions";
import { Edit2, Trash2, PlusCircle, X } from "lucide-react";

const presetCategories = {
    income: ["Salary", "Gift", "Investment", "Other"],
    expense: ["Groceries", "Rent", "Utilities", "Entertainment", "Transport", "Other"],
};

const TransactionForm = ({ data, setData, onSubmit, onCancel }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "type") {
            setData({ ...data, type: value, category: "" });
        } else {
            setData({ ...data, [name]: value });
        }
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6"
        >
            <input
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                required
            />
            <input
                type="number"
                name="amount"
                value={data.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                required
            />
            <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
            >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>
            <input
                type="text"
                name="vendor"
                value={data.vendor}
                onChange={handleChange}
                placeholder="Vendor / Source"
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                required
            />
            <select
                name="category"
                value={data.category}
                onChange={handleChange}
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                required
            >
                <option value="">Select Category</option>
                {presetCategories[data.type].map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
            <textarea
                name="notes"
                value={data.notes}
                onChange={handleChange}
                placeholder="Notes (Optional)"
                className="p-3 rounded text-lg"
                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                rows={2}
            />
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="flex-1 bg-[var(--color-cyan)] text-white px-6 py-3 rounded-lg hover:opacity-80 text-lg font-semibold transition"
                >
                    Save
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 rounded-lg text-lg font-semibold transition"
                    style={{ backgroundColor: 'var(--color-text)', opacity: 0.6, color: 'var(--color-bg)' }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

const TransactionsPage = () => {
    const {
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
        netCashFlow,
        accounts,
    } = useTransactions();

    const [selectedAccountId, setSelectedAccountId] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        amount: "",
        type: "expense",
        vendor: "",
        category: "",
        notes: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const filteredTransactions = selectedAccountId
        ? transactions.filter((tx) => tx.accountId.toString() === selectedAccountId)
        : [];

    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!selectedAccountId) return alert("Please select an account first.");
        addTransaction({
            ...formData,
            accountId: selectedAccountId,
            amount: parseFloat(formData.amount),
        });
        setFormData({
            date: "",
            amount: "",
            type: "expense",
            vendor: "",
            category: "",
            notes: "",
        });
        setShowForm(false);
    };

    const startEdit = (tx) => {
        setEditingId(tx.id);
        setEditData({ ...tx });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const saveEdit = (id) => {
        editTransaction(id, { ...editData, amount: parseFloat(editData.amount) });
        cancelEdit();
    };

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Transactions" />
                <main className="flex-1 relative overflow-y-auto">
                    {/* Background */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10">
                        {/* Toolbar */}
                        <div className="sticky top-0 z-20 bg-[var(--color-card-bg)]/90 backdrop-blur-md shadow-md border-b" style={{ borderColor: 'var(--color-cyan)' }}>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-8 py-4">
                                <select
                                    value={selectedAccountId}
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    className="p-3 rounded text-lg min-w-[240px] text-center"
                                    style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}
                                >
                                    <option value="">Select an Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id.toString()}>
                                            {acc.name}
                                        </option>
                                    ))}
                                </select>

                                {!showForm && selectedAccountId && (
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex items-center gap-2 bg-[var(--color-cyan)] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:opacity-80 transition transform hover:scale-105"
                                    >
                                        <PlusCircle size={22} className="text-white" />
                                        Add Transaction
                                    </button>
                                )}

                                {showForm && (
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl transition"
                                        style={{ backgroundColor: 'var(--color-text)', opacity: 0.6, color: 'var(--color-bg)' }}
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            {selectedAccountId && (
                                <div className="flex flex-col md:flex-row justify-center gap-10 text-center">
                                    <div>
                                        <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Total Income</p>
                                        <p className="text-2xl font-semibold text-[var(--color-accent-green)]">
                                            ${totalIncome.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Total Expenses</p>
                                        <p className="text-2xl font-semibold text-[var(--color-red)]">
                                            ${totalExpenses.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.7 }}>Net Cash Flow</p>
                                        <p className={`text-2xl font-semibold ${netCashFlow >= 0 ? "text-[var(--color-cyan)]" : "text-[var(--color-red)]"}`}>
                                            ${netCashFlow.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {showForm && (
                                <TransactionForm
                                    data={formData}
                                    setData={setFormData}
                                    onSubmit={handleAddSubmit}
                                    onCancel={() => setShowForm(false)}
                                />
                            )}

                            {selectedAccountId && (
                                <div className="flex flex-col gap-4">
                                    {filteredTransactions.length === 0 ? (
                                        <p className="text-center" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
                                            No transactions for this account yet.
                                        </p>
                                    ) : (
                                        filteredTransactions.map((tx) => (
                                            <div
                                                key={tx.id}
                                                className="grid grid-cols-1 md:grid-cols-7 items-center gap-6 bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-5"
                                            >
                                                {editingId === tx.id ? (
                                                    <div className="col-span-7">
                                                        <TransactionForm
                                                            data={editData}
                                                            setData={setEditData}
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                saveEdit(tx.id);
                                                            }}
                                                            onCancel={cancelEdit}
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="text-lg font-semibold" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{tx.date}</p>
                                                        <p className="text-lg truncate" style={{ color: 'var(--color-text)' }}>{tx.vendor}</p>
                                                        <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{tx.category}</p>
                                                        <p className={`text-lg font-semibold text-right ${tx.type === "income" ? "text-[var(--color-accent-green)]" : "text-[var(--color-red)]"}`}>
                                                            ${tx.amount.toLocaleString()}
                                                        </p>
                                                        <p className="truncate col-span-2" style={{ color: 'var(--color-text)', opacity: 0.7 }}>{tx.notes || ""}</p>
                                                        <div className="flex justify-end gap-3 col-span-1">
                                                            <button
                                                                onClick={() => startEdit(tx)}
                                                                className="text-[var(--color-cyan)] hover:opacity-70"
                                                            >
                                                                <Edit2 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => deleteTransaction(tx.id)}
                                                                className="text-[var(--color-red)] hover:opacity-70"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TransactionsPage;