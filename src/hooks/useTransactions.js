import { useState, useEffect, useCallback } from "react";
import { useAuth, api } from "./useAuth"; // assumes you already have this set up

export const useTransactions = () => {
    const { user } = useAuth(); // access logged-in user
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch accounts
    const fetchAccounts = useCallback(async () => {
        if (!user) return;

        try {
            const res = await api.get("/api/accounts");
            setAccounts(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        }
    }, [user]);

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const res = await api.get("/api/transactions");
            setTransactions(res.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching transactions:", err);
            setError("Failed to load transactions");
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Add transaction
    const addTransaction = async (transactionData) => {
        try {
            const res = await api.post("/api/transactions", transactionData);
            setTransactions((prev) => [res.data, ...prev]); // add new transaction to top
            return res.data;
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw new Error(err.response?.data?.message || "Failed to add transaction");
        }
    };

    // Update transaction
    const updateTransaction = async (id, updates) => {
        try {
            const res = await api.put(`/api/transactions/${id}`, updates);
            setTransactions((prev) =>
                prev.map((t) => (t._id === id ? res.data : t))
            );
            return res.data;
        } catch (err) {
            console.error("Error updating transaction:", err);
            throw new Error(err.response?.data?.message || "Failed to update transaction");
        }
    };

    // Delete transaction
    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/api/transactions/${id}`);
            setTransactions((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error("Error deleting transaction:", err);
            throw new Error(err.response?.data?.message || "Failed to delete transaction");
        }
    };

    useEffect(() => {
        fetchAccounts();
        fetchTransactions();
    }, [fetchAccounts, fetchTransactions]);

    return {
        transactions,
        accounts,
        loading,
        error,
        fetchTransactions,
        addTransaction,
        updateTransaction,
        editTransaction: updateTransaction, // Alias for consistency
        deleteTransaction,
    };
};