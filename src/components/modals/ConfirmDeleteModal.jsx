import React, { useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmDeleteModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Yes, Delete",
    cancelLabel = "Cancel",
    confirmColor = "bg-red-600 hover:bg-red-700"
}) => {
    const [showSuccess, setShowSuccess] = useState(false);

    if (!isOpen && !showSuccess) return null;

    const handleConfirm = async () => {
        await onConfirm(); // trigger parent delete action
        setShowSuccess(true); // show success toast
        setTimeout(() => {
            setShowSuccess(false);
            onClose(); // close everything after toast disappears
        }, 1800);
    };

    // Detect type of entity being deleted
    const getEntityType = () => {
        if (title?.toLowerCase().includes("goal")) return "Goal";
        if (title?.toLowerCase().includes("account")) return "Account";
        if (title?.toLowerCase().includes("transaction")) return "Transaction";
        return "Item";
    };

    // ✅ Success Toast (top center)
    if (showSuccess) {
        return (
            <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
                <div className="mt-10 bg-[var(--color-card-bg)]/95 border border-[var(--color-border)] rounded-xl px-6 py-4 shadow-xl text-center animate-slideDownFade z-50">
                    <CheckCircle className="text-green-500 mx-auto mb-2" size={36} />
                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                        {getEntityType()} deleted successfully
                    </h3>
                </div>
            </div>
        );
    }

    // 🟥 Confirmation Modal
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl text-center z-10 animate-fadeInUp border border-[var(--color-border)]">
                <AlertTriangle className="text-red-500 mx-auto mb-3" size={40} />
                <h3 className="text-2xl font-bold text-red-500 mb-2">
                    {title}
                </h3>
                <p className="mb-6 text-[var(--color-text)]">
                    {message}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-5 py-2 rounded-xl text-white font-semibold transition shadow-md ${confirmColor}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;