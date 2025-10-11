import { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // unique IDs for now

export const useGoals = () => {
    const [goals, setGoals] = useState([
        {
            id: uuidv4(),
            title: "Pay off credit card",
            description: "Make extra payments to reduce debt faster",
            targetDate: "2025-12-31",
        },
        {
            id: uuidv4(),
            title: "Build emergency fund",
            description: "Save up 3 months of expenses",
            targetDate: "2025-06-01",
        },
    ]);

    // ➕ Add new goal
    const addGoal = (goal) => {
        const newGoal = {
            id: uuidv4(),
            title: goal.title,
            description: goal.description,
            targetDate: goal.targetDate,
        };
        setGoals((prev) => [...prev, newGoal]);
    };

    // 🗑️ Remove a goal by ID
    const removeGoal = (id) => {
        setGoals((prev) => prev.filter((goal) => goal.id !== id));
    };

    // ✏️ Edit a goal (update title, description, or date)
    const editGoal = (id, updatedData) => {
        setGoals((prev) =>
            prev.map((goal) =>
                goal.id === id ? { ...goal, ...updatedData } : goal
            )
        );
    };

    return {
        goals,
        addGoal,
        removeGoal,
        editGoal,
    };
};