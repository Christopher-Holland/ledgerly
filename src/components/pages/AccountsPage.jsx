import React, { useState, useMemo, useEffect } from "react";
import { api } from "../../hooks/useAuth";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import AddAccountModal from "../modals/AddAccountModal";
import EditAccountModal from "../modals/EditAccountModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Trash2, Edit2, PlusCircle, TrendingUp, TrendingDown, Wallet } from "lucide-react";

const AccountsPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] = useState(null);
    const [accountToDelete, setAccountToDelete] = useState(null);

    // Fetch accounts from backend
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get("/api/accounts");
                setAccounts(res.data);
            } catch (err) {
                console.error("Failed to fetch accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    // Totals
    const totals = useMemo(() => {
        const income = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);
        const expenses = accounts.filter(a => a.balance < 0).reduce((sum, a) => sum + Math.abs(a.balance), 0);
        const net = income - expenses;
        return { income, expenses, net };
    }, [accounts]);

    // Handlers
    const handleAddAccount = async (newAccount) => {
        try {
            const res = await api.post("/api/accounts", newAccount);
            setAccounts([...accounts, res.data]);
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("Failed to add account:", err);
        }
    };

    const handleUpdateAccount = async (updatedAccount) => {
        try {
            const res = await api.put(`/api/accounts/${updatedAccount._id}`, updatedAccount);
            setAccounts(accounts.map(a => a._id === res.data._id ? res.data : a));
            setAccountToEdit(null);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Failed to update account:", err);
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/accounts/${accountToDelete._id}`);
            setAccounts(accounts.filter(a => a._id !== accountToDelete._id));
            setAccountToDelete(null);
            setIsConfirmModalOpen(false);
        } catch (err) {
            console.error("Failed to delete account:", err);
        }
    };

    // Edit/Delete button handlers
    const handleEditClick = (account) => { setAccountToEdit(account); setIsEditModalOpen(true); };
    const handleDeleteClick = (account) => { setAccountToDelete(account); setIsConfirmModalOpen(true); };

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Accounts" />
                <main className="flex-1 relative overflow-y-auto">
                    {/* Background */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8 space-y-10">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-3xl font-bold text-[var(--color-text)]">Accounts</h1>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                            >
                                <PlusCircle size={20} />
                                Add Account
                            </button>
                        </div>

                        {/* Summary Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md flex items-center gap-4">
                                <TrendingUp className="text-[var(--color-cyan)]" size={36} />
                                <div>
                                    <p className="text-[var(--color-muted)]">Total Assets</p>
                                    <p className="text-2xl font-bold text-[var(--color-accent-green)]">
                                        ${totals.income.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md flex items-center gap-4">
                                <TrendingDown className="text-red-400" size={36} />
                                <div>
                                    <p className="text-[var(--color-muted)]">Total Debt</p>
                                    <p className="text-2xl font-bold text-red-400">
                                        ${totals.expenses.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 shadow-md flex items-center gap-4">
                                <Wallet className={`${totals.net >= 0 ? "text-[var(--color-cyan)]" : "text-red-400"}`} size={36} />
                                <div>
                                    <p className="text-[var(--color-muted)]">Net Worth</p>
                                    <p className={`text-2xl font-bold ${totals.net >= 0 ? "text-[var(--color-cyan)]" : "text-red-400"}`}>
                                        ${totals.net.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Account Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {accounts.map((account) => (
                                <div
                                    key={account._id}
                                    className="relative bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 hover:shadow-xl transition border border-[var(--color-border)]"
                                >
                                    {/* Edit/Delete buttons */}
                                    <div className="absolute top-3 right-3 flex gap-3">
                                        <button className="text-[var(--color-cyan)] hover:opacity-80 transition" onClick={() => handleEditClick(account)}>
                                            <Edit2 size={24} />
                                        </button>
                                        <button className="text-[var(--color-red)] hover:opacity-80 transition" onClick={() => handleDeleteClick(account)}>
                                            <Trash2 size={24} />
                                        </button>
                                    </div>

                                    {/* Account Info */}
                                    <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">{account.name}</h2>
                                    <p className="text-[var(--color-muted)] mb-1">{account.type} {account.institution && `- ${account.institution}`}</p>
                                    <p className={`mt-1 text-2xl font-semibold ${account.balance < 0 ? "text-red-400" : "text-[var(--color-cyan)]"}`}>
                                        ${account.balance.toLocaleString()}
                                    </p>
                                    {account.transactions !== undefined && (
                                        <p className="text-sm text-[var(--color-muted)] mt-2">{account.transactions} transactions</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Modals */}
            <AddAccountModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddAccount} />
            <EditAccountModal
                isOpen={isEditModalOpen}
                onClose={() => { setIsEditModalOpen(false); setAccountToEdit(null); }}
                onSave={handleUpdateAccount}
                account={accountToEdit}
            />
            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onClose={() => { setIsConfirmModalOpen(false); setAccountToDelete(null); }}
                onConfirm={confirmDelete}
                title="Delete Account?"
                message={`Are you sure you want to delete the account "${accountToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
};

export default AccountsPage;