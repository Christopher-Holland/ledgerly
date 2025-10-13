import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String, // e.g., Bank, Credit, Cash, etc.
        required: true,
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    institution: {
        type: String,
    },
    transactions: {
        type: Number,
        default: 0,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);