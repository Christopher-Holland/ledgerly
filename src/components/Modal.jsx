import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div className="relative z-50 bg-[var(--color-card-bg)] rounded-2xl shadow-lg w-full max-w-lg p-6">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-[var(--color-text)] font-bold text-xl"
                >
                    &times;
                </button>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-4 text-[var(--color-cyan)]">{title}</h2>

                {/* Modal children (your settings forms) */}
                {children}
            </div>
        </div>
    );
};

export default Modal;