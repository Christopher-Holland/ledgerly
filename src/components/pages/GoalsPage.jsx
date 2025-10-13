//TODO: Add a progress bar to the goals page
//TODO: Add a completed button to the goals page
//TODO: Add a filter to see completed goals that will be removed from the list
//TODO: Add a goal type (short term, medium term, long term)
//TODO: 

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

    const startEdit = (goal) => setEditingGoal(goal);
    const cancelEdit = () => setEditingGoal(null);

    const saveEdit = (id, updatedGoal) => {
        editGoal(id, updatedGoal);
        cancelEdit();
    };

    const confirmDelete = (goal) => {
        setGoalToDelete(goal);
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
                            {goals.map((goal) => (
                                <div
                                    key={goal._id}
                                    className="relative bg-[var(--color-card-bg)] shadow-md rounded-2xl p-6 flex flex-col justify-between"
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

                                    <h3 className="font-bold text-2xl mb-2">{goal.title}</h3>
                                    <p className="text-lg mb-2" style={{ color: 'var(--color-text)', opacity: 0.8 }}>{goal.description}</p>
                                    <p className="text-lg mb-2" style={{ color: 'var(--color-text)', opacity: 0.6 }}>
                                        Target Completion Date: {goal.targetDate
                                            ? new Date(goal.targetDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: '2-digit',
                                                year: 'numeric'
                                            })
                                            : "N/A"}
                                    </p>
                                    {goal.linkedAccount && (
                                        <p className="text-sm text-[var(--color-cyan)]">
                                            Linked Account: {accounts.find(acc => acc.id === goal.linkedAccount)?.name || "Unknown"}
                                        </p>
                                    )}
                                </div>
                            ))}
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
                            value={editingGoal.linkedAccount || ""}
                            onChange={(e) => setEditingGoal({ ...editingGoal, linkedAccount: e.target.value })}
                            className="p-3 rounded text-lg border border-[var(--color-border)] text-[var(--color-text)] bg-[var(--color-card-bg)]"
                        >
                            <option value="">Optional: Link an account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
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