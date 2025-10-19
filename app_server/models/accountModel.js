/**
 * @fileoverview Account model definition for financial accounts
 * @description Mongoose schema for user financial accounts (bank, credit, cash, etc.)
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from "mongoose";

/**
 * Financial account schema definition
 * @description Represents a user's financial account with basic information and balance
 * @schema accountSchema
 */
const accountSchema = new mongoose.Schema({
    // Account name (e.g., "Chase Checking", "Credit Card", "Cash Wallet")
    name: {
        type: String,
        required: true,
    },
    // Account type (e.g., "Bank", "Credit", "Cash", "Investment", "Savings")
    type: {
        type: String,
        required: true,
    },
    // Current account balance (can be positive or negative for credit accounts)
    balance: {
        type: Number,
        required: true,
        default: 0,
    },
    // Financial institution name (e.g., "Chase Bank", "American Express")
    institution: {
        type: String,
    },
    // Number of transactions associated with this account (for quick reference)
    transactions: {
        type: Number,
        default: 0,
    },
    // Reference to the user who owns this account
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export Account model
export default mongoose.model("Account", accountSchema);