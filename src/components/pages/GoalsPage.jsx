import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { Edit2, Trash2, PlusCircle, CheckCircle } from "lucide-react";

const GoalsPage = () => {
    const { goals, addGoal, removeGoal, editGoal } = useGoals();
    const [showForm, setShowForm] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        addGoal({ title, description, targetDate });
        setTitle("");
        setDescription("");
        setTargetDate("");
        setShowForm(false);
    };

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editTargetDate, setEditTargetDate] = useState("");

    const startEdit = (goal) => {
        setEditingId(goal.id);
        setEditTitle(goal.title);
        setEditDescription(goal.description);
        setEditTargetDate(goal.targetDate);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditTargetDate("");
    };

    const saveEdit = (id) => {
        editGoal(id, {
            title: editTitle,
            description: editDescription,
            targetDate: editTargetDate,
        });
        cancelEdit();
    };

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <Navbar title="Goals" />

                <main className="flex-1 relative overflow-y-auto">
                    {/* Background */}
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />

                    <div className="relative z-10 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Add Goal Card */}
                            <div
                                onClick={() => !showForm && setShowForm(true)}
                                className={`group flex flex-col items-center justify-center text-center 
               bg-[var(--color-card-bg)] shadow-md rounded-2xl cursor-pointer 
               transition transform hover:scale-105 p-6 w-full
               ${showForm ? '' : 'hover:bg-[var(--color-cyan)] hover:text-white'}`}
                            >
                                {!showForm ? (
                                    <>
                                        <PlusCircle size={40} className="mb-2" style={{ color: 'var(--color-text)', opacity: 0.6 }} />
                                        <span className="text-2xl font-semibold">Add New Goal</span>
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full mt-2">
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Goal Title"
                                            className="p-3 rounded text-lg"
                                            style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                            required
                                        />
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Description"
                                            className="p-3 rounded text-lg"
                                            style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                            rows={3}
                                        />
                                        <input
                                            type="date"
                                            value={targetDate}
                                            onChange={(e) => setTargetDate(e.target.value)}
                                            className="p-3 rounded text-lg"
                                            style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                        />
                                        <div className="flex space-x-2">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-[var(--color-cyan)] text-white px-6 py-3 rounded hover:opacity-80 text-lg font-semibold transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowForm(false)}
                                                className="flex-1 px-6 py-3 rounded text-lg font-semibold transition"
                                                style={{ backgroundColor: 'var(--color-text)', opacity: 0.6, color: 'var(--color-bg)' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* Render Goals */}
                            {goals.map((goal) => (
                                <div
                                    key={goal.id}
                                    className="bg-[var(--color-card-bg)] shadow-md rounded-2xl p-6 flex flex-col justify-between"
                                >
                                    {editingId === goal.id ? (
                                        <div className="flex flex-col space-y-3">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="p-3 rounded text-lg"
                                                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                                required
                                            />
                                            <textarea
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="p-3 rounded text-lg"
                                                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                                rows={2}
                                            />
                                            <input
                                                type="date"
                                                value={editTargetDate}
                                                onChange={(e) => setEditTargetDate(e.target.value)}
                                                className="p-3 rounded text-lg"
                                                style={{ backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)', border: '1px solid var(--color-text)', opacity: 0.3 }}
                                            />
                                            <div className="flex space-x-2 mt-2">
                                                <button
                                                    onClick={() => saveEdit(goal.id)}
                                                    className="flex-1 bg-[var(--color-cyan)] text-white px-4 py-2 rounded flex items-center justify-center gap-1 hover:opacity-80"
                                                >
                                                    <CheckCircle className="inline mb-1" /> Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="flex-1 px-4 py-2 rounded hover:opacity-80"
                                                    style={{ backgroundColor: 'var(--color-text)', opacity: 0.6, color: 'var(--color-bg)' }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h3 className="font-bold text-2xl mb-2">{goal.title}</h3>
                                            <p className="text-lg mb-2" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{goal.description}</p>
                                            <p className="text-lg" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Target: {goal.targetDate || "N/A"}</p>
                                            <div className="flex justify-end space-x-3 mt-4">
                                                <button
                                                    onClick={() => startEdit(goal)}
                                                    className="text-[var(--color-cyan)] hover:opacity-70 transition"
                                                >
                                                    <Edit2 size={20} />
                                                </button>
                                                <button
                                                    onClick={() => removeGoal(goal.id)}
                                                    className="text-[var(--color-red)] hover:opacity-70 transition"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default GoalsPage;