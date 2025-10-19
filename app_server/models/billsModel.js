/**
 * @fileoverview Bill model definition for recurring bills and payments
 * @description Mongoose schema for user bills with due dates and amounts
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from "mongoose";

/**
 * Bill schema definition
 * @description Represents a recurring bill or payment with due date and amount
 * @schema billSchema
 */
const billSchema = new mongoose.Schema({
    // Bill name (e.g., "Rent", "Electric Bill", "Car Payment")
    name: { 
        type: String, 
        required: true 
    },
    // Due date for this bill (monthly recurring)
    date: { 
        type: Date, 
        required: true 
    },
    // Amount due for this bill
    amount: { 
        type: Number, 
        required: true 
    },
    // Reference to the user who owns this bill
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export Bill model
export default mongoose.model("Bill", billSchema);