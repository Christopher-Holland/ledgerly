// src/hooks/useGoals.js
import { useState, useEffect } from "react";
import { api } from "./useAuth";

export const useGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all goals from backend
    const fetchGoals = async () => {
        setLoading(true);
        try {
            const res = await api.get("/api/goals");
            setGoals(res.data);
        } catch (err) {
            console.error("Failed to fetch goals:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to fetch goals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    // Add a goal
    const addGoal = async (goal) => {
        setLoading(true);
        try {
            // Convert empty linkedAccount to undefined to avoid Mongoose error
            const payload = { ...goal, linkedAccount: goal.linkedAccount || undefined };
            const res = await api.post("/api/goals", payload);
            setGoals((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to add goal:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to add goal");
        } finally {
            setLoading(false);
        }
    };

    // Edit a goal
    const editGoal = async (id, updatedGoal) => {
        setLoading(true);
        try {
            const payload = { ...updatedGoal, linkedAccount: updatedGoal.linkedAccount || undefined };
            const res = await api.put(`/api/goals/${id}`, payload);
            setGoals((prev) => prev.map((g) => (g._id === id ? res.data : g)));
        } catch (err) {
            console.error("Failed to edit goal:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to edit goal");
        } finally {
            setLoading(false);
        }
    };

    // Remove a goal
    const removeGoal = async (id) => {
        setLoading(true);
        try {
            await api.delete(`/api/goals/${id}`);
            setGoals((prev) => prev.filter((g) => g._id !== id));
        } catch (err) {
            console.error("Failed to remove goal:", err.response?.data || err);
            setError(err.response?.data?.message || "Failed to remove goal");
        } finally {
            setLoading(false);
        }
    };

    return { goals, addGoal, editGoal, removeGoal, loading, error, fetchGoals };
};