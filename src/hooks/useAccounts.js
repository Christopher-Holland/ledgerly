import { useState } from "react";

export const useAccounts = () => {
    const [accounts, setAccounts] = useState([
        { id: 1, name: "Checking Account", type: "Checking", balance: 2450.32, institution: "Bank of America", balanceType: "asset" },
        { id: 2, name: "Savings Account", type: "Savings", balance: 8300.5, institution: "Chase Bank", balanceType: "asset" },
        { id: 3, name: "Credit Card", type: "Debt", balance: 1200.0, institution: "Capital One", balanceType: "debt" },
        { id: 4, name: "Car Loan", type: "Auto", balance: 9800.0, institution: "Toyota Finance", balanceType: "debt" },
    ]);

    const addAccount = (newAccount) => {
        setAccounts((prev) => [...prev, { id: Date.now(), ...newAccount }]);
    };

    const editAccount = (id, updatedAccount) => {
        setAccounts((prev) =>
            prev.map((account) =>
                account.id === id ? { ...account, ...updatedAccount } : account
            )
        );
    };

    const deleteAccount = (id) => {
        setAccounts((prev) => prev.filter((account) => account.id !== id));
    };

    return { accounts, addAccount, editAccount, deleteAccount };
};