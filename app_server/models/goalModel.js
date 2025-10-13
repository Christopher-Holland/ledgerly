// backend/models/Goal.js
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    targetAmount: { type: Number, default: 0 },
    currentAmount: { type: Number, default: 0 },
    targetDate: { type: Date },
    linkedAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
    isCompleted: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model('Goal', GoalSchema);