/**
 * @fileoverview Transaction model definition for financial transactions
 * @description Mongoose schema for user financial transactions with categorization and tracking
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from "mongoose";

/**
 * Financial transaction schema definition
 * @description Represents a single financial transaction with all relevant details
 * @schema transactionSchema
 */
const transactionSchema = new mongoose.Schema({
    // Reference to the user who owns this transaction
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    // Reference to the account associated with this transaction
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    // Date when the transaction occurred
    date: {
        type: Date,
        required: true,
    },
    // Transaction amount (always positive, type determines if it's income or expense)
    amount: {
        type: Number,
        required: true,
        min: 0, // Amount must be positive
    },
    // Transaction type: either income (money in) or expense (money out)
    type: {
        type: String,
        enum: ["income", "expense"], // Only allow these two values
        required: true,
    },
    // Vendor or merchant name (e.g., "Amazon", "Starbucks", "Employer")
    vendor: {
        type: String,
        required: true,
        trim: true, // Remove leading/trailing whitespace
    },
    // Transaction category for budgeting and reporting (e.g., "Food", "Transportation", "Salary")
    category: {
        type: String,
        required: true,
    },
    // Optional notes or description for the transaction
    notes: {
        type: String,
        trim: true, // Remove leading/trailing whitespace
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export Transaction model
export default mongoose.model("Transaction", transactionSchema);