// src/pages/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { useAccounts } from '../../hooks/useAccounts';
import { useTransactions } from '../../hooks/useTransactions';
import { useBills } from '../../hooks/useBills';
import { useGoals } from '../../hooks/useGoals';
import { useSettings } from '../../hooks/useSettings';

const COLORS = ['#06b6d4', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6'];

const DashboardPage = () => {
    const { accounts } = useAccounts();
    const { transactions } = useTransactions();
    const { bills } = useBills();
    const { goals } = useGoals();
    const { defaultAccountId, currency, dateFormat } = useSettings();

    const [timeRange, setTimeRange] = useState('month');
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const [isAddBillOpen, setIsAddBillOpen] = useState(false);

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        if (dateFormat === "MM/DD/YYYY") return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        if (dateFormat === "DD/MM/YYYY") return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
        if (dateFormat === "YYYY-MM-DD") return d.toISOString().split("T")[0];
        return d.toLocaleDateString();
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            const txDate = new Date(t.date);
            if (timeRange === 'month') return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            if (timeRange === 'year') return txDate.getFullYear() === currentYear;
            return true;
        });
    }, [transactions, timeRange, currentMonth, currentYear]);

    const filteredBills = useMemo(() => {
        return bills.filter((b) => {
            const billDate = new Date(b.due);
            if (timeRange === 'month') return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
            if (timeRange === 'year') return billDate.getFullYear() === currentYear;
            return true;
        });
    }, [bills, timeRange, currentMonth, currentYear]);

    const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const spendingData = Object.entries(
        filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {})
    ).map(([name, value]) => ({ name, value }));

    const incomeVsExpenseData = [
        { name: 'Income', amount: income },
        { name: 'Expenses', amount: expenses },
    ];

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Dashboard" />
                <main className="flex-1 relative overflow-y-auto">

                    {/* Background Gradients */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8 space-y-8">

                        {/* Header & Time Filter */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                            <h2 className="text-3xl font-semibold">Financial Overview</h2>
                            <div className="flex items-center gap-3">
                                <label className="text-gray-400 text-lg">View by:</label>
                                <select
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    className="bg-[var(--color-card-bg)] text-[var(--color-text)] px-3 py-2 rounded-lg"
                                >
                                    <option value="month">This Month</option>
                                    <option value="year">This Year</option>
                                </select>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 text-center">
                                <p className="text-xl text-[var(--color-text)]">Income</p>
                                <p className="text-2xl font-semibold text-[var(--color-accent-green)]">{currency} {income.toLocaleString()}</p>
                            </div>
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 text-center">
                                <p className="text-xl text-[var(--color-text)]">Expenses</p>
                                <p className="text-2xl font-semibold text-[var(--color-red)]">{currency} {expenses.toLocaleString()}</p>
                            </div>
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 text-center">
                                <p className="text-xl text-[var(--color-text)]">Net Cash Flow</p>
                                <p className={`text-2xl font-semibold ${income - expenses >= 0 ? "text-[var(--color-cyan)]" : "text-[var(--color-red)]"}`}>
                                    {currency} {(income - expenses).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Account Balances */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-3">Account Balances</h3>
                                <ul className="space-y-2">
                                    {accounts.map((acc) => (
                                        <li key={acc.id} className={`flex justify-between ${acc.id === defaultAccountId ? "bg-gray-700/30 p-2 rounded" : ""} text-[var(--color-text)]`}>
                                            <span>{acc.name}</span>
                                            <span className="font-semibold text-[var(--color-cyan)]">{currency} {acc.balance.toLocaleString()}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Spending Pie Chart */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-3">Spending ({timeRange === 'month' ? 'This Month' : 'This Year'})</h3>
                                {spendingData.length > 0 ? (
                                    <div className="h-48">
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <Pie
                                                    data={spendingData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    outerRadius={70}
                                                    label
                                                >
                                                    {spendingData.map((_, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center">No expense data</p>
                                )}
                            </div>

                            {/* Upcoming Bills */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <div className="flex justify-center items-center mb-4">
                                    <h3 className="text-2xl font-semibold text-[var(--color-text)]">
                                        Upcoming Bills ({timeRange === "month" ? "This Month" : "This Year"})
                                    </h3>
                                </div>

                                {filteredBills.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="text-[var(--color-muted)] border-b border-[var(--color-border)]">
                                                    <th className="py-2">Name</th>
                                                    <th className="py-2 text-center">Date</th>
                                                    <th className="py-2 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredBills.map((bill) => (
                                                    <tr
                                                        key={bill.id}
                                                        className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-hover-bg)] transition"
                                                    >
                                                        <td className="py-2 text-[var(--color-text)]">{bill.name}</td>
                                                        <td className="py-2 text-[var(--color-text)] text-center">
                                                            {new Date(bill.date).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-2 text-right text-[var(--color-red)]">
                                                            {currency} {bill.amount.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-center">No upcoming bills</p>
                                )}

                                {/* Edit button */}
                                <div className="flex justify-end mt-4">
                                    <button
                                        onClick={() => setIsEditBillsModalOpen(true)} // We'll define this modal next
                                        className="text-sm px-4 py-2 rounded-lg border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-medium"
                                    >
                                        Edit List
                                    </button>
                                </div>
                            </div>

                            {/* Goals */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-3">Goals Progress</h3>
                                {goals.length > 0 ? (
                                    goals.map((goal) => {
                                        const progress = Math.min((goal.saved / goal.target) * 100, 100).toFixed(0);
                                        return (
                                            <div key={goal.id} className="mb-3">
                                                <div className="flex justify-between text-lg mb-1">
                                                    <span>{goal.name}</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="h-3 bg-gray-700 rounded-full">
                                                    <div
                                                        className="h-full bg-[var(--color-cyan)] rounded-full"
                                                        style={{ width: `${progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-400 text-center">No goals set</p>
                                )}
                            </div>

                            {/* Alerts */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6">
                                <h3 className="text-2xl font-semibold mb-3">Alerts</h3>
                                <ul className="list-disc list-inside text-[var(--color-text)] space-y-1">
                                    {expenses > income && (
                                        <li className="text-[var(--color-red)]">Spending exceeds income!</li>
                                    )}
                                    {accounts.some(a => a.id === defaultAccountId && a.balance < 50) && (
                                        <li className="text-yellow-400">Low default account balance</li>
                                    )}
                                </ul>
                            </div>

                            {/* Income vs Expenses */}
                            <div className="col-span-full flex justify-center">
                                <div className="bg-[var(--color-card-bg)] backdrop-blur-md shadow-lg rounded-2xl p-6 w-full max-w-xl">
                                    <h3 className="text-2xl font-semibold mb-3">Income vs Expenses ({timeRange === 'month' ? 'Monthly' : 'Yearly'})</h3>
                                    <div className="h-48">
                                        <ResponsiveContainer>
                                            <BarChart data={incomeVsExpenseData}>
                                                <XAxis dataKey="name" stroke="#9ca3af" />
                                                <YAxis stroke="#9ca3af" />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="amount" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;