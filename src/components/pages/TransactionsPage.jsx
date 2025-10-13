import React, { useState, useMemo, useEffect, useRef } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { useTransactions } from "../../hooks/useTransactions";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { Edit2, Trash2, PlusCircle, X, Filter, ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const presetCategories = {
    income: ["Salary", "Gift", "Investment", "Other"],
    expense: ["Groceries", "Rent", "Utilities", "Entertainment", "Transport", "Other"],
};

const TransactionForm = ({ data, setData, onSubmit, onCancel, continuousMode }) => {
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
            onSubmit={(e) => onSubmit(e, continuousMode)}
            className="flex flex-col gap-3 bg-[var(--color-card-bg)] backdrop-blur-md rounded-2xl shadow-lg p-6 text-[var(--color-text)] border border-[var(--color-border)]"
        >
            <h2 className="text-xl font-semibold mb-2">Add New Transaction</h2>

            <input
                type="date"
                name="date"
                value={data.date}
                onChange={handleChange}
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
                required
            />

            <input
                type="number"
                name="amount"
                value={data.amount}
                onChange={handleChange}
                placeholder="Amount"
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
                required
            />

            <select
                name="type"
                value={data.type}
                onChange={handleChange}
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
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
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
                required
            />

            <select
                name="category"
                value={data.category}
                onChange={handleChange}
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
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
                className="p-3 rounded-xl text-lg border border-[var(--color-border)] focus:ring-2 focus:ring-[var(--color-cyan)] focus:outline-none bg-[var(--color-bg)] text-[var(--color-text)]"
                rows={2}
            />

            <div className="flex gap-2 mt-2">
                {continuousMode ? (
                    <>
                        <button
                            type="submit"
                            className="flex-1 bg-[var(--color-cyan)] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:brightness-110 transition"
                        >
                            Save & Add Another
                        </button>
                        <button
                            type="button"
                            onClick={(e) => onSubmit(e, false)}
                            className="flex-1 bg-[var(--color-cyan)] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:brightness-110 transition"
                        >
                            Save & Close
                        </button>
                    </>
                ) : (
                    <button
                        type="submit"
                        className="flex-1 bg-[var(--color-cyan)] text-white px-6 py-3 rounded-lg text-lg font-semibold hover:brightness-110 transition"
                    >
                        Save
                    </button>
                )}
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 border border-[var(--color-cyan)] text-[var(--color-cyan)] px-6 py-3 rounded-lg text-lg font-semibold hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition"
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

    const [selectedAccountId, setSelectedAccountId] = useState("all");
    const [showForm, setShowForm] = useState(false);
    const [continuousMode, setContinuousMode] = useState(true);
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
    const [deleteTarget, setDeleteTarget] = useState(null);
    
    // Get current month in YYYY-MM format
    const getCurrentMonth = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    };
    
    // Filtering states
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [showCalendarPicker, setShowCalendarPicker] = useState(false);
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterIncomeType, setFilterIncomeType] = useState("all");
    const [filterExpenseType, setFilterExpenseType] = useState("all");

    // Ref for calendar picker
    const calendarRef = useRef(null);

    // Close calendar picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendarPicker(false);
            }
        };

        if (showCalendarPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showCalendarPicker]);

    // Helper function to reset form data
    const resetFormData = () => {
        setFormData({
            date: "",
            amount: "",
            type: "expense",
            vendor: "",
            category: "",
            notes: "",
        });
    };

    // Filter and process transactions
    const filteredAndSortedTransactions = useMemo(() => {
        // Step 1: Filter by account
        let filtered = selectedAccountId === "all"
            ? transactions
            : selectedAccountId
            ? transactions.filter((tx) => tx.accountId?.toString() === selectedAccountId)
            : [];

        // Step 2: Filter by month (always applied)
        filtered = filtered.filter((tx) => {
            const txDate = new Date(tx.date);
            const [year, month] = selectedMonth.split("-");
            return txDate.getFullYear() === parseInt(year) && 
                   txDate.getMonth() === parseInt(month) - 1;
        });

        // Step 3: Filter by category
        if (filterCategory !== "all") {
            filtered = filtered.filter((tx) => tx.category === filterCategory);
        }

        // Step 4: Filter by income type
        if (filterIncomeType !== "all") {
            filtered = filtered.filter((tx) => tx.type === "income" && tx.category === filterIncomeType);
        }

        // Step 5: Filter by expense type
        if (filterExpenseType !== "all") {
            filtered = filtered.filter((tx) => tx.type === "expense" && tx.category === filterExpenseType);
        }

        // Sort by date (newest first)
        const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

        return sorted;
    }, [transactions, selectedAccountId, selectedMonth, filterCategory, filterIncomeType, filterExpenseType]);

    // Calculate totals for filtered transactions (before sorting)
    const accountTotalIncome = filteredAndSortedTransactions
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    const accountTotalExpenses = filteredAndSortedTransactions
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0);

    const accountNetCashFlow = accountTotalIncome - accountTotalExpenses;

    // Generate all 12 months for the current year and previous year
    const allMonths = useMemo(() => {
        const months = [];
        const now = new Date();
        const currentYear = now.getFullYear();
        
        // Add current year and previous year
        for (let year = currentYear; year >= currentYear - 1; year--) {
            for (let month = 12; month >= 1; month--) {
                months.push(`${year}-${String(month).padStart(2, "0")}`);
            }
        }
        
        return months;
    }, []);

    // Navigate months (cycle through all 12 months)
    const navigateMonth = (direction) => {
        const [year, month] = selectedMonth.split("-");
        let newYear = parseInt(year);
        let newMonth = parseInt(month);

        if (direction === "prev") {
            newMonth -= 1;
            if (newMonth < 1) {
                newMonth = 12;
                newYear -= 1;
            }
        } else if (direction === "next") {
            newMonth += 1;
            if (newMonth > 12) {
                newMonth = 1;
                newYear += 1;
            }
        }

        setSelectedMonth(`${newYear}-${String(newMonth).padStart(2, "0")}`);
    };

    // Clear all filters
    const clearAllFilters = () => {
        setFilterCategory("all");
        setFilterIncomeType("all");
        setFilterExpenseType("all");
    };

    // Get all unique categories from both income and expense
    const allCategories = useMemo(() => {
        const categories = new Set();
        [...presetCategories.income, ...presetCategories.expense].forEach(cat => categories.add(cat));
        return Array.from(categories).sort();
    }, []);

    const handleAddSubmit = (e, keepOpen = true) => {
        e.preventDefault();
        if (!selectedAccountId || selectedAccountId === "all") {
            return alert("Please select a specific account first.");
        }
        addTransaction({
            ...formData,
            accountId: selectedAccountId,
            amount: parseFloat(formData.amount),
        });
        if (keepOpen) {
            resetFormData();
        } else {
            resetFormData();
            setShowForm(false);
        }
    };

    const startEdit = (tx) => {
        const id = tx._id || tx.id;
        setEditingId(String(id)); // Convert to string for consistent comparison
        
        // Format date to YYYY-MM-DD for HTML date input
        const formattedDate = tx.date ? new Date(tx.date).toISOString().split('T')[0] : '';
        
        setEditData({ ...tx, date: formattedDate });
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
                        {/* Account Navbar */}
                        <div className="sticky top-0 z-20 bg-[var(--color-card-bg)]/90 backdrop-blur-md shadow-md border-b border-[var(--color-cyan)]">
                            <div className="flex items-center justify-between px-6 py-3 overflow-x-auto">
                                <div className="flex gap-3">
                                    {/* All Accounts Button */}
                                    <button
                                        onClick={() => setSelectedAccountId("all")}
                                        className={`px-4 py-2 rounded-full font-semibold border transition ${selectedAccountId === "all"
                                                ? "bg-[var(--color-cyan)] text-white border-[var(--color-cyan)]"
                                                : "bg-[var(--color-card-bg)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-cyan)]/10"
                                            }`}
                                    >
                                        All Accounts
                                    </button>
                                    
                                    {/* Individual Account Buttons */}
                                    {accounts?.map((acc) => (
                                        <button
                                            key={acc._id}
                                            onClick={() => setSelectedAccountId(acc._id.toString())}
                                            className={`px-4 py-2 rounded-full font-semibold border transition ${selectedAccountId === acc._id.toString()
                                                    ? "bg-[var(--color-cyan)] text-white border-[var(--color-cyan)]"
                                                    : "bg-[var(--color-card-bg)] text-[var(--color-text)] border-[var(--color-border)] hover:bg-[var(--color-cyan)]/10"
                                                }`}
                                        >
                                            {acc.name}
                                        </button>
                                    ))}
                                </div>

                                {!showForm && selectedAccountId && selectedAccountId !== "all" && (
                                    <button
                                        onClick={() => {
                                            resetFormData();
                                            setShowForm(true);
                                        }}
                                        className="flex items-center gap-2 bg-[var(--color-cyan)] text-white font-semibold px-5 py-2 rounded-xl shadow-md hover:brightness-110 transition transform hover:scale-105"
                                    >
                                        <PlusCircle size={20} />
                                        Add Transaction
                                    </button>
                                )}

                                {showForm && (
                                    <button
                                        onClick={() => {
                                            resetFormData();
                                            setShowForm(false);
                                        }}
                                        className="flex items-center gap-2 border border-[var(--color-cyan)] text-[var(--color-cyan)] font-semibold px-5 py-2 rounded-xl hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition"
                                    >
                                        <X size={18} /> Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Filter and Sort Controls */}
                        {selectedAccountId && (
                            <div className="px-6 py-4 bg-[var(--color-card-bg)]/50 border-b border-[var(--color-border)]">
                                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                                    {/* Left Side - Month Navigator */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <Filter size={20} className="text-[var(--color-cyan)]" />
                                            <span className="font-semibold text-[var(--color-text)]">Month:</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => navigateMonth("prev")}
                                                className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            
                                            <div className="relative" ref={calendarRef}>
                                                <button
                                                    onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] hover:bg-[var(--color-cyan)]/10 transition min-w-[180px] justify-between focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                                >
                                                    <span>
                                                        {new Date(selectedMonth.split("-")[0], parseInt(selectedMonth.split("-")[1]) - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <Calendar size={18} />
                                                </button>
                                                
                                                {/* Calendar Dropdown */}
                                                {showCalendarPicker && (
                                                    <div className="absolute top-full mt-2 left-0 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-2xl p-3 z-30 max-h-64 overflow-y-auto backdrop-blur-md">
                                                        {allMonths.map((month) => {
                                                            const [year, monthNum] = month.split("-");
                                                            const date = new Date(year, parseInt(monthNum) - 1);
                                                            const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
                                                            return (
                                                                <button
                                                                    key={month}
                                                                    onClick={() => {
                                                                        setSelectedMonth(month);
                                                                        setShowCalendarPicker(false);
                                                                    }}
                                                                    className={`w-full text-left px-4 py-2 rounded-lg hover:bg-[var(--color-cyan)]/10 transition ${selectedMonth === month ? "bg-[var(--color-cyan)] text-white" : "text-[var(--color-text)]"}`}
                                                                >
                                                                    {monthName}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <button
                                                onClick={() => navigateMonth("next")}
                                                className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                            >
                                                <ChevronRight size={20} />
                                            </button>

                                            <button
                                                onClick={() => setSelectedMonth(getCurrentMonth())}
                                                className="px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)]/10 transition focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] text-sm font-semibold"
                                            >
                                                Today
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Side - Category Filters */}
                                    <div className="flex flex-wrap gap-3 items-center">
                                        {/* All Categories */}
                                        <select
                                            value={filterCategory}
                                            onChange={(e) => {
                                                setFilterCategory(e.target.value);
                                                if (e.target.value !== "all") {
                                                    setFilterIncomeType("all");
                                                    setFilterExpenseType("all");
                                                }
                                            }}
                                            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                        >
                                            <option value="all">All Categories</option>
                                            {allCategories.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Income Categories */}
                                        <select
                                            value={filterIncomeType}
                                            onChange={(e) => {
                                                setFilterIncomeType(e.target.value);
                                                if (e.target.value !== "all") {
                                                    setFilterCategory("all");
                                                    setFilterExpenseType("all");
                                                }
                                            }}
                                            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                        >
                                            <option value="all">All Income Types</option>
                                            {presetCategories.income.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Expense Categories */}
                                        <select
                                            value={filterExpenseType}
                                            onChange={(e) => {
                                                setFilterExpenseType(e.target.value);
                                                if (e.target.value !== "all") {
                                                    setFilterCategory("all");
                                                    setFilterIncomeType("all");
                                                }
                                            }}
                                            className="px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition"
                                        >
                                            <option value="all">All Expense Types</option>
                                            {presetCategories.expense.map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat}
                                                </option>
                                            ))}
                                        </select>

                                        {/* Clear Filters Button */}
                                        <button
                                            onClick={clearAllFilters}
                                            className="px-4 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)]"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Totals */}
                        {selectedAccountId && (
                            <div className="flex flex-col md:flex-row justify-center gap-10 text-center py-6">
                                <div>
                                    <p className="opacity-70">Total Income</p>
                                    <p className="text-2xl font-semibold text-[var(--color-accent-green)]">
                                        ${accountTotalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="opacity-70">Total Expenses</p>
                                    <p className="text-2xl font-semibold text-[var(--color-red)]">
                                        ${accountTotalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div>
                                    <p className="opacity-70">Net Cash Flow</p>
                                    <p
                                        className={`text-2xl font-semibold ${accountNetCashFlow >= 0 ? "text-[var(--color-cyan)]" : "text-[var(--color-red)]"
                                            }`}
                                    >
                                        ${accountNetCashFlow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        {showForm && (
                            <div className="p-6">
                                <TransactionForm
                                    data={formData}
                                    setData={setFormData}
                                    onSubmit={handleAddSubmit}
                                    onCancel={() => {
                                        resetFormData();
                                        setShowForm(false);
                                    }}
                                    continuousMode={continuousMode}
                                />
                            </div>
                        )}

                        {/* Transactions List */}
                        <div className="p-8 space-y-6">
                            {selectedAccountId && (
                                <div className="flex flex-col gap-4">
                                    {filteredAndSortedTransactions.length === 0 ? (
                                        <p className="text-center opacity-70">
                                            No transactions found for the selected filters.
                                        </p>
                                    ) : (
                                        filteredAndSortedTransactions.map((tx) => {
                                            const id = tx._id || tx.id;
                                            const idString = String(id); // Convert to string for consistent comparison
                                            return (
                                                <div
                                                    key={id}
                                                    className="relative bg-[var(--color-card-bg)] rounded-2xl shadow-lg p-5 hover:shadow-xl transition border border-[var(--color-border)]"
                                                >
                                                    {editingId === idString ? (
                                                        <TransactionForm
                                                            data={editData}
                                                            setData={setEditData}
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                saveEdit(id);
                                                            }}
                                                            onCancel={cancelEdit}
                                                            continuousMode={false}
                                                        />
                                                    ) : (
                                                        <>
                                                            <div className="absolute top-3 right-3 flex gap-2 z-10">
                                                                <button
                                                                    onClick={() => startEdit(tx)}
                                                                    className="p-2 rounded-lg hover:bg-[var(--color-bg)]/20 text-[var(--color-cyan)]"
                                                                >
                                                                    <Edit2 size={24} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteTarget(idString)}
                                                                    className="p-2 rounded-lg hover:bg-[var(--color-bg)]/20 text-[var(--color-red)]"
                                                                >
                                                                    <Trash2 size={24} />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                                                                <p className="font-semibold opacity-80">
                                                                    {new Date(tx.date).toLocaleDateString('en-US', {
                                                                        month: 'long',
                                                                        day: '2-digit',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                                <p>{tx.vendor}</p>
                                                                <p>{tx.category}</p>
                                                                <p
                                                                    className={`font-semibold text-right ${tx.type === "income"
                                                                            ? "text-[var(--color-accent-green)]"
                                                                            : "text-[var(--color-red)]"
                                                                        }`}
                                                                >
                                                                    ${tx.amount.toLocaleString(undefined, {
                                                                        minimumFractionDigits: 2,
                                                                    })}
                                                                </p>
                                                                <p className="col-span-3 opacity-70 truncate">
                                                                    {tx.notes || ""}
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Delete Modal */}
            <ConfirmDeleteModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => {
                    deleteTransaction(deleteTarget);
                    setDeleteTarget(null);
                }}
                title="Delete Transaction?"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
};

export default TransactionsPage;