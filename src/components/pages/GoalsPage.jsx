// src/pages/GoalsPage.jsx

import Sidebar from '../Sidebar';
import Navbar from '../Navbar';
import React, { useState } from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useAccounts } from '../../hooks/useAccounts';
import { Edit2, Trash2, PlusCircle, CheckCircle } from "lucide-react";
import AddGoalModal from '../modals/AddGoalModal';
import Modal from '../modals/Modal';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const GoalsPage = () => {
    const { goals, addGoal, removeGoal, editGoal } = useGoals();
    const { accounts } = useAccounts();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goalToDelete, setGoalToDelete] = useState(null);
    const [showCompleted, setShowCompleted] = useState(false);

    const startEdit = (goal) => setEditingGoal(goal);
    const cancelEdit = () => setEditingGoal(null);

    const saveEdit = (id, updatedGoal) => {
        editGoal(id, updatedGoal);
        cancelEdit();
    };

    const confirmDelete = (goal) => {
        setGoalToDelete(goal);
    };

    const toggleComplete = (goal) => {
        editGoal(goal._id, { ...goal, completed: !goal.completed });
    };

    const calculateProgress = (goal) => {
        if (goal.targetAmount && goal.currentAmount !== undefined) {
            return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        }
        return goal.progress || 0;
    };

    return (
        <div className="fixed inset-0 flex bg-[var(--color-bg)] text-[var(--color-text)]">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar title="Goals" />
                <main className="flex-1 relative overflow-y-auto">
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-gradient)" }} />
                    <div className="absolute inset-0" style={{ background: "var(--color-bg-radial)" }} />
                    <div className="relative z-10 p-8">

                        {/* Filter Toggle */}
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={() => setShowCompleted(!showCompleted)}
                                className="px-4 py-2 border border-[var(--color-border)] rounded-xl 
                                           hover:bg-[var(--color-cyan)] hover:text-white transition"
                            >
                                {showCompleted ? "Show Active Goals" : "Show Completed Goals"}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Add Goal Card */}
                            <div
                                onClick={() => setShowAddModal(true)}
                                className="group flex flex-col items-center justify-center text-center 
                                bg-[var(--color-card-bg)] shadow-md rounded-2xl cursor-pointer 
                                transition transform hover:scale-105 p-6 w-full hover:bg-[var(--color-cyan)] hover:text-white"
                            >
                                <PlusCircle size={40} className="mb-2" style={{ color: 'var(--color-text)', opacity: 0.6 }} />
                                <span className="text-2xl font-semibold">Add New Goal</span>
                            </div>

                            {/* Render Goals */}
                            {goals
                                .filter(goal => showCompleted ? goal.completed : !goal.completed)
                                .map((goal) => {
                                    const progress = calculateProgress(goal);
                                    const linkedAccount = accounts.find(acc => (acc._id || acc.id) === goal.linkedAccount);

                                    return (
                                        <div
                                            key={goal._id}
                                            className={`relative bg-[var(--color-card-bg)] shadow-md rounded-2xl p-6 flex flex-col justify-between 
                                                transition-all ${goal.completed ? "opacity-70" : "opacity-100"}`}
                                        >
                                            {/* Edit/Delete Buttons Top Corner */}
                                            <div className="absolute top-3 right-3 flex space-x-2">
                                                <button
                                                    onClick={() => startEdit(goal)}
                                                    className="text-[var(--color-cyan)] hover:opacity-80 transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={24} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(goal)}
                                                    className="text-[var(--color-red)] hover:opacity-80 transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={24} />
                                                </button>
                                            </div>

                                            {/* Goal Info */}
                                            <h3 className="font-bold text-2xl mb-2">{goal.title}</h3>
                                            <p className="text-lg mb-2" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{goal.description}</p>
                                            <p className="text-lg mb-2" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                                Target Completion: {goal.targetDate
                                                    ? new Date(goal.targetDate).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: '2-digit',
                                                        year: 'numeric'
                                                    })
                                                    : "N/A"}
                                            </p>

                                            {goal.goalType && (
                                                <p className="text-sm text-[var(--color-cyan)] mb-2">
                                                    Type: {goal.goalType.charAt(0).toUpperCase() + goal.goalType.slice(1)} Term
                                                </p>
                                            )}

                                            {linkedAccount && (
                                                <p className="text-sm text-[var(--color-cyan)]">
                                                    Linked Account: {linkedAccount.name}
                                                </p>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
                                                <div
                                                    className="bg-[var(--color-cyan)] h-3 rounded-full transition-all"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm mt-1 text-[var(--color-text)] opacity-80">
                                                {progress.toFixed(0)}% complete
                                            </p>

                                            {/* Complete Button */}
                                            {/* Complete Button */}
                                            <div className="mt-4 flex justify-end">
                                                {!goal.completed ? (
                                                    <button
                                                        onClick={() => toggleComplete(goal)}
                                                        className="flex items-center text-green-500 border border-green-500 px-3 py-2 rounded-lg hover:bg-green-500 hover:text-white transition-all duration-200 hover:scale-105"
                                                    >
                                                        <CheckCircle size={20} className="mr-1" /> Mark Complete
                                                    </button>
                                                ) : (
                                                    <span className="text-[var(--color-green)] font-semibold flex items-center">
                                                        <CheckCircle size={20} className="mr-1" /> Completed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Goal Modal */}
            <AddGoalModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSave={addGoal}
                accounts={accounts}
            />

            {/* Edit Goal Modal */}
            {editingGoal && (
                <Modal isOpen={true} onClose={cancelEdit} title="Edit Goal" size="lg">
                    <form className="flex flex-col space-y-4">
                        <input
                            type="text"
                            value={editingGoal.title}
                            onChange={(e) => setEditingGoal({ ...editingGoal, title: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                            required
                        />
                        <textarea
                            value={editingGoal.description}
                            onChange={(e) => setEditingGoal({ ...editingGoal, description: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                            rows={2}
                        />
                        <input
                            type="date"
                            value={editingGoal.targetDate || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, targetDate: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        />
                        <select
                            value={editingGoal.goalType || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, goalType: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        >
                            <option value="">Select Goal Type</option>
                            <option value="short">Short Term</option>
                            <option value="medium">Medium Term</option>
                            <option value="long">Long Term</option>
                        </select>
                        <input
                            type="number"
                            placeholder="Target Amount (optional)"
                            value={editingGoal.targetAmount || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        />
                        <input
                            type="number"
                            placeholder="Current Amount (optional)"
                            value={editingGoal.currentAmount || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, currentAmount: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        />
                        <select
                            value={editingGoal.linkedAccount || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, linkedAccount: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        >
                            <option value="">Optional: Link an account</option>
                            {accounts.map(acc => (
                                <option key={acc._id || acc.id} value={acc._id || acc.id}>
                                    {acc.name} ({acc.type})
                                </option>
                            ))}
                        </select>

                        <div className="flex space-x-2 mt-2 justify-end">
                            <button
                                onClick={cancelEdit}
                                className="px-6 py-3 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => saveEdit(editingGoal._id, editingGoal)}
                                className="px-6 py-3 rounded-xl bg-[var(--color-cyan)] text-white hover:brightness-110 transition"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={!!goalToDelete}
                onClose={() => setGoalToDelete(null)}
                onConfirm={() => removeGoal(goalToDelete._id)}
                title="Delete Goal"
                message={`Are you sure you want to delete the goal "${goalToDelete?.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                cancelLabel="Cancel"
                confirmColor="bg-red-600 hover:bg-red-700"
            />
        </div>
    );
};

export default GoalsPage;