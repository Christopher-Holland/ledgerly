// src/hooks/useTransactions.js
import { useState, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { useAccounts } from "./useAccounts"; // For account names

export const useTransactions = () => {
    const { accounts } = useAccounts();

    const [transactions, setTransactions] = useState([]);

    const addTransaction = (tx) => {
        setTransactions((prev) => [
            ...prev,
            { ...tx, id: uuidv4() }
        ]);
    };

    const editTransaction = (id, updatedTx) => {
        setTransactions((prev) =>
            prev.map((tx) => (tx.id === id ? { ...tx, ...updatedTx } : tx))
        );
    };

    const deleteTransaction = (id) => {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    };

    // Calculated totals
    const totalIncome = useMemo(
        () =>
            transactions
                .filter((tx) => tx.type === "income")
                .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0),
        [transactions]
    );

    const totalExpenses = useMemo(
        () =>
            transactions
                .filter((tx) => tx.type === "expense")
                .reduce((sum, tx) => sum + (parseFloat(tx.amount) || 0), 0),
        [transactions]
    );

    const netCashFlow = totalIncome - totalExpenses;

    return {
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
        netCashFlow,
        accounts
    };
};