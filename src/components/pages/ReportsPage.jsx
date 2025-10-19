import React, { useState, useMemo } from 'react';
import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import {
    BarChart2,
    PieChart,
    Calendar,
    TrendingUp,
    FileText,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useAccounts } from '../../hooks/useAccounts';
import { useBills } from '../../hooks/useBills';
import { useGoals } from '../../hooks/useGoals';
import { useSettings } from '../../hooks/useSettings';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';

const COLORS = ['#06b6d4', '#10b981', '#f43f5e', '#f59e0b', '#3b82f6', '#8b5cf6', '#f97316'];

const ReportsPage = () => {
    const [period, setPeriod] = useState('monthly');
    const { theme } = useTheme(); // 'light' or 'dark'
    
    // Data hooks
    const { transactions } = useTransactions();
    const { accounts } = useAccounts();
    const { bills } = useBills();
    const { goals } = useGoals();
    const { currency } = useSettings();

    // Filter data based on period
    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return transactions.filter((t) => {
            const txDate = new Date(t.date);
            if (period === 'monthly') {
                return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
            } else {
                return txDate.getFullYear() === currentYear;
            }
        });
    }, [transactions, period]);

    const filteredBills = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        return bills.filter((b) => {
            const billDate = new Date(b.date || b.due);
            if (period === 'monthly') {
                return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
            } else {
                return billDate.getFullYear() === currentYear;
            }
        });
    }, [bills, period]);

    // Calculate data for charts
    const spendingData = useMemo(() => {
        const expenses = filteredTransactions.filter(t => t.type === 'expense');
        const categoryTotals = expenses.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
        
        return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
    }, [filteredTransactions]);

    const incomeVsExpenseData = useMemo(() => {
        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        
        return [
            { name: 'Income', amount: income },
            { name: 'Expenses', amount: expenses },
            { name: 'Net', amount: income - expenses }
        ];
    }, [filteredTransactions]);

    const cashFlowData = useMemo(() => {
        // Generate monthly data for the year or daily data for the month
        const data = [];
        const now = new Date();
        
        if (period === 'monthly') {
            // Daily data for current month
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayTransactions = filteredTransactions.filter(t => {
                    const txDate = new Date(t.date);
                    return txDate.getDate() === day;
                });
                const income = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                const expenses = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                data.push({
                    date: `${now.getMonth() + 1}/${day}`,
                    income,
                    expenses,
                    net: income - expenses
                });
            }
        } else {
            // Monthly data for current year
            for (let month = 0; month < 12; month++) {
                const monthTransactions = filteredTransactions.filter(t => {
                    const txDate = new Date(t.date);
                    return txDate.getMonth() === month;
                });
                const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
                const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
                data.push({
                    date: new Date(now.getFullYear(), month, 1).toLocaleDateString('en-US', { month: 'short' }),
                    income,
                    expenses,
                    net: income - expenses
                });
            }
        }
        
        return data;
    }, [filteredTransactions, period]);

    const summaryStats = useMemo(() => {
        const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const netCashFlow = totalIncome - totalExpenses;
        const totalBills = filteredBills.reduce((sum, b) => sum + b.amount, 0);
        const activeGoals = goals.filter(g => !g.completed).length;
        
        return {
            totalIncome,
            totalExpenses,
            netCashFlow,
            totalBills,
            activeGoals,
            transactionCount: filteredTransactions.length
        };
    }, [filteredTransactions, filteredBills, goals]);

    return (
        <div className="min-h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Reports" />

                <main className="flex-1 relative overflow-y-auto">
                    {/* Background */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8">
                        {/* Header Controls */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold">Financial Reports</h2>
                            <div className="p-1 rounded-lg flex space-x-2" style={{ backgroundColor: 'var(--color-card-bg)' }}>
                                <button
                                    className={`px-3 py-1 rounded-md transition-colors ${period === 'monthly' ? 'bg-[var(--color-cyan)] text-white' : 'text-[var(--color-text)] hover:text-[var(--color-cyan)]'}`}
                                    onClick={() => setPeriod('monthly')}
                                >
                                    Monthly
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md transition-colors ${period === 'yearly' ? 'bg-[var(--color-cyan)] text-white' : 'text-[var(--color-text)] hover:text-[var(--color-cyan)]'}`}
                                    onClick={() => setPeriod('yearly')}
                                >
                                    Yearly
                                </button>
                            </div>
                        </div>

                        {/* Reports Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Spending by Category */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <PieChart className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Spending by Category</h3>
                                </div>
                                {spendingData.length > 0 ? (
                                    <div className="h-48">
                                        <ResponsiveContainer>
                                            <RechartsPieChart>
                                                <Pie
                                                    data={spendingData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    outerRadius={70}
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                                >
                                                    {spendingData.map((_, index) => (
                                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${currency} ${value.toLocaleString()}`, 'Amount']} />
                                            </RechartsPieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                        No spending data for this period
                                    </div>
                                )}
                            </div>

                            {/* Income vs Expenses */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <BarChart2 className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Income vs Expenses</h3>
                                </div>
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <BarChart data={incomeVsExpenseData}>
                                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip formatter={(value) => [`${currency} ${value.toLocaleString()}`, 'Amount']} />
                                            <Bar dataKey="amount" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Cash Flow Overview */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Cash Flow Overview</h3>
                                </div>
                                <div className="h-48">
                                    <ResponsiveContainer>
                                        <LineChart data={cashFlowData}>
                                            <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                            <YAxis stroke="#9ca3af" fontSize={12} />
                                            <Tooltip formatter={(value) => [`${currency} ${value.toLocaleString()}`, 'Amount']} />
                                            <Legend />
                                            <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                                            <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2} />
                                            <Line type="monotone" dataKey="net" stroke="#06b6d4" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recurring Transactions */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <Calendar className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Recurring Transactions</h3>
                                </div>
                                <div className="h-48 overflow-y-auto">
                                    {filteredBills.length > 0 ? (
                                        <div className="space-y-2">
                                            {filteredBills.slice(0, 6).map((bill) => (
                                                <div key={bill._id || bill.id} className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-[var(--color-text)]">{bill.name}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(bill.date || bill.due).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className="text-sm font-semibold text-[var(--color-red)]">
                                                        {currency} {bill.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                            {filteredBills.length > 6 && (
                                                <p className="text-xs text-gray-400 text-center">
                                                    +{filteredBills.length - 6} more bills
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                            No recurring bills for this period
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Summary Report */}
                            <div className="col-span-full bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <FileText className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                        <h3 className="font-semibold text-lg">Summary Report</h3>
                                    </div>
                                    <button className="px-4 py-2 bg-[var(--color-cyan)] text-white rounded-lg hover:brightness-110 transition text-sm">
                                        Export PDF
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Total Income</p>
                                        <p className="text-lg font-semibold text-green-500">
                                            {currency} {summaryStats.totalIncome.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Total Expenses</p>
                                        <p className="text-lg font-semibold text-red-500">
                                            {currency} {summaryStats.totalExpenses.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Net Cash Flow</p>
                                        <p className={`text-lg font-semibold ${summaryStats.netCashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {currency} {summaryStats.netCashFlow.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Total Bills</p>
                                        <p className="text-lg font-semibold text-orange-500">
                                            {currency} {summaryStats.totalBills.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Active Goals</p>
                                        <p className="text-lg font-semibold text-blue-500">
                                            {summaryStats.activeGoals}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-400 mb-1">Transactions</p>
                                        <p className="text-lg font-semibold text-purple-500">
                                            {summaryStats.transactionCount}
                                        </p>
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

export default ReportsPage;