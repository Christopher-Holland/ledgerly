/**
 * @fileoverview Goal model definition for financial goals and savings targets
 * @description Mongoose schema for user financial goals with progress tracking and categorization
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from 'mongoose';

/**
 * Financial goal schema definition
 * @description Represents a user's financial goal with target amounts, progress tracking, and completion status
 * @schema GoalSchema
 */
const GoalSchema = new mongoose.Schema({
    // Goal title (e.g., "Emergency Fund", "Vacation Savings", "New Car")
    title: { 
        type: String, 
        required: true 
    },
    // Optional detailed description of the goal
    description: { 
        type: String, 
        default: "" 
    },
    // Target amount to reach for this goal
    targetAmount: { 
        type: Number, 
        default: 0 
    },
    // Current amount saved towards this goal
    currentAmount: { 
        type: Number, 
        default: 0 
    },
    // Target date to achieve this goal (optional)
    targetDate: { 
        type: Date 
    },
    // Reference to account linked to this goal (optional)
    linkedAccount: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Account', 
        default: null 
    },
    // Whether the goal has been completed
    completed: { 
        type: Boolean, 
        default: false 
    },
    // Goal type categorization for better organization
    goalType: { 
        type: String, 
        enum: ['short-term', 'medium-term', 'long-term'], 
        default: '' 
    },
    // Reference to the user who owns this goal
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create and export Goal model
export default mongoose.model('Goal', GoalSchema);