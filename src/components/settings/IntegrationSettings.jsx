import React from "react";

const IntegrationsSettings = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Main Modal */}
            <div className="relative bg-[var(--color-card-bg)]/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 w-full max-w-3xl z-10 animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-6 text-center text-[var(--color-cyan)]">
                    Integrations
                </h2>

                <div className="text-center py-8">
                    <p className="text-lg text-[var(--color-text)] mb-4">
                        This feature is currently unavailable. Please check back later.
                    </p>
                    <p className="text-base text-[var(--color-text)] opacity-70">
                        We're working on bringing you integrations with your favorite financial tools.
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-10 flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition shadow-md"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationsSettings;