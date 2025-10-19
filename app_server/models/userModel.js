/**
 * @fileoverview User model definition with authentication and settings schemas
 * @description Mongoose schema for user accounts with password hashing and nested settings
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

/**
 * Notification preferences schema for user settings
 * @description Defines notification preferences for different types of alerts
 * @schema notificationSchema
 */
const notificationSchema = new mongoose.Schema({
    // Account activity notifications (login, transactions, etc.)
    accountActivity: {
        email: { type: Boolean, default: true },    // Email notifications enabled by default
        inApp: { type: Boolean, default: true },    // In-app notifications enabled by default
    },
    // Budget-related alerts and warnings
    budgetAlerts: {
        email: { type: Boolean, default: true },    // Email alerts for budget overspend
        inApp: { type: Boolean, default: false },   // In-app budget alerts disabled by default
    },
    // Goal progress and milestone notifications
    goalUpdates: {
        email: { type: Boolean, default: true },    // Email notifications for goal progress
        inApp: { type: Boolean, default: true },    // In-app goal notifications enabled
    },
    // Bill due date and payment reminders
    billReminders: {
        email: { type: Boolean, default: true },    // Email reminders for bill due dates
        inApp: { type: Boolean, default: true },    // In-app bill reminders enabled
    },
    // Marketing and promotional communications
    promotions: {
        email: { type: Boolean, default: false },   // Promotional emails disabled by default
        inApp: { type: Boolean, default: false },   // Promotional in-app messages disabled
    },
}, { _id: false }); // Disable automatic _id generation for nested schema

/**
 * Privacy and security settings schema
 * @description Defines user privacy preferences and security options
 * @schema privacySchema
 */
const privacySchema = new mongoose.Schema({
    twoFA: { type: Boolean, default: false },           // Two-factor authentication disabled by default
    activityLog: { type: Boolean, default: true },      // Activity logging enabled by default
    privateAccount: { type: Boolean, default: false },  // Account privacy setting
    autoLogout: { type: Boolean, default: false },      // Automatic logout after inactivity
    shareData: { type: Boolean, default: false },       // Data sharing preferences
}, { _id: false });

/**
 * User settings schema containing all user preferences
 * @description Aggregates notification and privacy settings with other user preferences
 * @schema settingsSchema
 */
const settingsSchema = new mongoose.Schema({
    notifications: { type: notificationSchema, default: () => ({}) }, // Notification preferences
    privacy: { type: privacySchema, default: () => ({}) },           // Privacy and security settings
    integration: { type: Object, default: {} },                      // Third-party integrations
    support: { type: Object, default: {} },                          // Support and help preferences
}, { _id: false });

/**
 * Main user schema definition
 * @description Core user account schema with authentication fields and settings
 * @schema userSchema
 */
const userSchema = new mongoose.Schema({
    // User's full name
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    // Unique username for login
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    // User's email address (unique and lowercase)
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    // Hashed password (minimum 6 characters)
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    // User preferences and settings
    settings: { 
        type: settingsSchema, 
        default: () => ({}) 
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

/**
 * Pre-save middleware for password hashing
 * @description Automatically hashes password before saving to database
 * @function password hashing middleware
 * @param {Function} next - Express next function
 */
userSchema.pre('save', async function (next) {
    // Only hash password if it has been modified
    if (!this.isModified('password')) return next();
    
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Instance method for password verification
 * @description Compares provided password with stored hashed password
 * @function matchPassword
 * @param {string} enteredPassword - Plain text password to verify
 * @returns {Promise<boolean>} Promise resolving to true if password matches
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export User model
const User = mongoose.model('User', userSchema);
export default User;