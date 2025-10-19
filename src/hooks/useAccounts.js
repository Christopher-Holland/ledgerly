import { useState, useEffect, useCallback } from "react";
import { useAuth, api } from "./useAuth";

export const useAccounts = () => {
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch accounts from backend
    const fetchAccounts = useCallback(async () => {
        if (!user) return;

        try {
            setLoading(true);
            const res = await api.get("/api/accounts");
            setAccounts(res.data || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching accounts:", err);
            setError("Failed to load accounts");
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Add account
    const addAccount = async (accountData) => {
        try {
            const res = await api.post("/api/accounts", accountData);
            setAccounts((prev) => [...prev, res.data]);
            return res.data;
        } catch (err) {
            console.error("Error adding account:", err);
            throw new Error(err.response?.data?.message || "Failed to add account");
        }
    };

    // Edit account
    const editAccount = async (id, updatedAccount) => {
        try {
            const res = await api.put(`/api/accounts/${id}`, updatedAccount);
            setAccounts((prev) =>
                prev.map((account) =>
                    account._id === id ? res.data : account
                )
            );
            return res.data;
        } catch (err) {
            console.error("Error updating account:", err);
            throw new Error(err.response?.data?.message || "Failed to update account");
        }
    };

    // Delete account
    const deleteAccount = async (id) => {
        try {
            await api.delete(`/api/accounts/${id}`);
            setAccounts((prev) => prev.filter((account) => account._id !== id));
        } catch (err) {
            console.error("Error deleting account:", err);
            throw new Error(err.response?.data?.message || "Failed to delete account");
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    return { 
        accounts, 
        addAccount, 
        editAccount, 
        deleteAccount, 
        loading, 
        error, 
        fetchAccounts 
    };
};