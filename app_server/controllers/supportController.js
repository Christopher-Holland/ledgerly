import { sendSupportEmail } from "../utils/mailer.js";

export const submitSupportRequest = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        await sendSupportEmail({ fromName: name, fromEmail: email, message });
        res.status(200).json({ message: "Support message sent successfully!" });
    } catch (err) {
        console.error("Support request error:", err);
        res.status(500).json({ message: "Failed to send support message." });
    }
};