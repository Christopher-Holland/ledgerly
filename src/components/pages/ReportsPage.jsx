import React, { useState } from 'react';
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

const ReportsPage = () => {
    const [period, setPeriod] = useState('monthly');
    const { theme } = useTheme(); // 'light' or 'dark'

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
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
                                <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    [ Pie Chart Placeholder ]
                                </div>
                            </div>

                            {/* Income vs Expenses */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <BarChart2 className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Income vs Expenses</h3>
                                </div>
                                <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    [ Bar Chart Placeholder ]
                                </div>
                            </div>

                            {/* Cash Flow Overview */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <TrendingUp className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Cash Flow Overview</h3>
                                </div>
                                <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    [ Line Chart Placeholder ]
                                </div>
                            </div>

                            {/* Recurring Transactions */}
                            <div className="bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <Calendar className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Recurring Transactions</h3>
                                </div>
                                <div className="h-48 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    [ Recurring List Placeholder ]
                                </div>
                            </div>

                            {/* Summary Report */}
                            <div className="col-span-full bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-4">
                                <div className="flex items-center mb-2">
                                    <FileText className="w-5 h-5 mr-2 text-[var(--color-cyan)]" />
                                    <h3 className="font-semibold text-lg">Summary Report</h3>
                                </div>
                                <div className="h-32 flex items-center justify-center" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                    [ Totals / Download PDF Placeholder ]
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