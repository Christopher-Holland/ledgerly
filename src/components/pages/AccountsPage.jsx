// src/components/pages/AccountsPage.jsx
import React, { useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useAccounts } from "../../hooks/useAccounts";
import { Edit2, Trash2, PlusCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const AccountsPage = () => {
    const { accounts, addAccount, editAccount, deleteAccount } = useAccounts();
    const [showForm, setShowForm] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [chartMode, setChartMode] = useState("overview");
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        balance: "",
        institution: "",
        balanceType: "asset",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAccount) {
            editAccount(editingAccount.id, formData);
        } else {
            addAccount(formData);
        }
        setFormData({
            name: "",
            type: "",
            balance: "",
            institution: "",
            balanceType: "asset",
        });
        setShowForm(false);
        setEditingAccount(null);
    };

    const handleEditClick = (account) => {
        setFormData({
            name: account.name,
            type: account.type,
            balance: account.balance,
            institution: account.institution || "",
            balanceType: account.balanceType,
        });
        setEditingAccount(account);
        setShowForm(true);
    };

    const totalAssets = accounts
        .filter((acc) => acc.balanceType === "asset")
        .reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const totalDebt = accounts
        .filter((acc) => acc.balanceType === "debt")
        .reduce((sum, acc) => sum + parseFloat(acc.balance || 0), 0);
    const netWorth = totalAssets - totalDebt;

    const COLORS = ["#22d3ee", "#f87171", "#a78bfa", "#34d399", "#fbbf24"];
    const overviewData = [
        { name: "Assets", value: totalAssets },
        { name: "Debt", value: totalDebt },
    ];
    const distributionData = accounts.map((acc) => ({
        name: acc.name,
        value: parseFloat(acc.balance || 0),
    }));
    const chartData =
        chartMode === "overview" ? overviewData : distributionData.filter((d) => d.value > 0);

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Accounts" />

                <main className="flex-1 relative overflow-y-auto">
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8 space-y-12">
                        {/* Summary */}
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl font-bold">Accounts Overview</h1>
                            <div className="flex flex-col md:flex-row justify-center gap-10">
                                <div>
                                    <p className="text-lg opacity-70">Total Assets</p>
                                    <p className="text-3xl font-semibold text-[var(--color-accent-green)]">
                                        ${totalAssets.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg opacity-70">Total Debt</p>
                                    <p className="text-3xl font-semibold text-[var(--color-red)]">
                                        ${totalDebt.toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg opacity-70">Net Worth</p>
                                    <p
                                        className={`text-3xl font-semibold ${netWorth >= 0
                                            ? "text-[var(--color-cyan)]"
                                            : "text-[var(--color-red)]"
                                            }`}
                                    >
                                        ${netWorth.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="text-base mt-2 opacity-70">
                                {accounts.length} {accounts.length === 1 ? "Account" : "Accounts"} Connected
                            </p>
                        </div>

                        {/* Chart */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setChartMode("overview")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${chartMode === "overview"
                                        ? "bg-[var(--color-cyan)] text-white shadow-lg"
                                        : "bg-[var(--color-card-bg)] text-[var(--color-text)] hover:bg-[var(--color-cyan)]/40"
                                        }`}
                                >
                                    Assets vs Debt
                                </button>
                                <button
                                    onClick={() => setChartMode("distribution")}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${chartMode === "distribution"
                                        ? "bg-[var(--color-cyan)] text-white shadow-lg"
                                        : "bg-[var(--color-card-bg)] text-[var(--color-text)] hover:bg-[var(--color-cyan)]/40"
                                        }`}
                                >
                                    Account Distribution
                                </button>
                            </div>

                            <div className="w-full max-w-md h-80 bg-[var(--color-card-bg)] rounded-2xl backdrop-blur-md p-4 shadow-lg">
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={100}
                                            label
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "var(--color-card-bg)",
                                                border: "none",
                                                borderRadius: "10px",
                                            }}
                                            itemStyle={{ color: "var(--color-text)" }}
                                        />
                                        <Legend wrapperStyle={{ color: "var(--color-text)", marginTop: "10px" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Accounts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Add Account */}
                            <div
                                onClick={() => {
                                    setShowForm(!showForm);
                                    setEditingAccount(null);
                                    setFormData({
                                        name: "",
                                        type: "",
                                        balance: "",
                                        institution: "",
                                        balanceType: "asset",
                                    });
                                }}
                                className="flex flex-col items-center justify-center bg-[var(--color-card-bg)] rounded-2xl shadow-lg p-6 cursor-pointer hover:bg-[var(--color-cyan)] hover:text-white transition transform hover:scale-105"
                            >
                                <PlusCircle size={40} className="mb-2 opacity-60" />
                                <span className="text-xl font-semibold">Add Account</span>
                            </div>

                            {/* Add/Edit Account Form */}
                            {showForm && (
                                <form
                                    onSubmit={handleSubmit}
                                    className="bg-[var(--color-card-bg)] rounded-2xl shadow-lg p-6 flex flex-col gap-4 col-span-1 md:col-span-2"
                                >
                                    <h3 className="text-2xl font-bold mb-2">
                                        {editingAccount ? "Edit Account" : "New Account"}
                                    </h3>

                                    {/* Text Inputs with visible borders */}
                                    <input
                                        type="text"
                                        placeholder="Account Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-cyan)] outline-none"
                                    />

                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-cyan)] outline-none"
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Checking">Checking</option>
                                        <option value="Savings">Savings</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Investment">Investment</option>
                                        <option value="Auto">Auto Loan</option>
                                    </select>

                                    <input
                                        type="number"
                                        placeholder="Balance or Amount Owed"
                                        value={formData.balance}
                                        onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                                        className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-cyan)] outline-none"
                                    />

                                    <input
                                        type="text"
                                        placeholder="Institution (Optional)"
                                        value={formData.institution}
                                        onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                                        className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-cyan)] outline-none"
                                    />

                                    <select
                                        value={formData.balanceType}
                                        onChange={(e) => setFormData({ ...formData, balanceType: e.target.value })}
                                        className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-cyan)] outline-none"
                                    >
                                        <option value="asset">Asset (Money You Own)</option>
                                        <option value="debt">Debt (Money You Owe)</option>
                                    </select>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowForm(false);
                                                setEditingAccount(null);
                                            }}
                                            className="px-4 py-2 rounded-lg transition opacity-80"
                                            style={{ backgroundColor: 'var(--color-text)', color: 'var(--color-bg)' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[var(--color-cyan)] text-white px-4 py-2 rounded-lg hover:opacity-80 transition"
                                        >
                                            {editingAccount ? "Save Changes" : "Save Account"}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {/* Account Cards */}
                            {accounts.map((account) => (
                                <div
                                    key={account.id}
                                    className={`backdrop-blur-md rounded-2xl shadow-lg p-6 hover:scale-105 transform transition ${account.balanceType === "debt"
                                        ? "bg-[rgba(248,113,113,0.3)] border border-[rgba(248,113,113,0.5)]"
                                        : "bg-[var(--color-card-bg)]"
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-2xl font-bold text-[var(--color-cyan)]">{account.name}</h3>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleEditClick(account)}
                                                className="hover:text-[var(--color-cyan)]"
                                            >
                                                <Edit2 size={20} />
                                            </button>
                                            <button
                                                onClick={() => deleteAccount(account.id)}
                                                className="hover:text-[var(--color-red)]"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-lg mb-1 opacity-70">
                                        <span className="font-semibold">Type:</span> {account.type}
                                    </p>
                                    <p
                                        className={`text-lg mb-1 ${account.balanceType === "debt"
                                            ? "text-[var(--color-red)]"
                                            : "text-[var(--color-accent-green)]"
                                            }`}
                                    >
                                        <span className="font-semibold">
                                            {account.balanceType === "debt" ? "Amount Owed:" : "Balance:"}
                                        </span>{" "}
                                        ${account.balance.toLocaleString()}
                                    </p>
                                    {account.institution && (
                                        <p className="text-base opacity-70">{account.institution}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AccountsPage;