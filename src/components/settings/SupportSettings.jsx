import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { useAuth } from "../../hooks/useAuth";

const SupportSettings = ({ onClose }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState("");

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);
        setSuccess("");

        try {
            await emailjs.send(
                "service_kqew34r",
                "template_g2lu3ci",
                {
                    from_name: user?.name || "Anonymous",
                    username: user?.username || "N/A",
                    email: user?.email || "No email provided",
                    message,
                },
                "gd4gg_qbngF-ajLgy"
            );
            setSuccess("Your message has been sent successfully!");
            setMessage("");

            // ✅ Close modal after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error("EmailJS error:", err);
            setSuccess("Failed to send message. Please try again later.");
        } finally {
            setSending(false);
        }
    };

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
                    Support
                </h2>

                <div className="space-y-6">
                    <div>
                        <p className="text-[var(--color-text)] mb-4 text-center">
                            Have a question or need help? Send us a message and we'll get back to you as soon as possible.
                        </p>
                    </div>

                    {success && (
                        <div
                            className={`p-4 rounded-xl text-center font-semibold animate-fadeIn ${success.includes("successfully")
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}
                        >
                            {success}
                        </div>
                    )}

                    <div>
                        <label className="block text-[var(--color-cyan)] font-semibold mb-2">
                            Your Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-3 bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-cyan)] transition text-[var(--color-text)] placeholder:text-[var(--color-text)] placeholder:opacity-50"
                            rows={6}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-10 flex flex-col md:flex-row justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 md:w-auto px-6 py-2.5 rounded-xl border border-[var(--color-cyan)] text-[var(--color-cyan)] hover:bg-[var(--color-cyan)] hover:text-[var(--color-bg)] transition font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={sending || !message.trim()}
                        className="flex-1 md:w-auto px-6 py-2.5 rounded-xl bg-[var(--color-cyan)] text-white font-semibold hover:brightness-110 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? "Sending..." : "Send Message"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SupportSettings;