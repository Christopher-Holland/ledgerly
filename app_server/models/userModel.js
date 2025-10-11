import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// --- Notification Schema ---
const notificationSchema = new mongoose.Schema({
    accountActivity: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
    },
    budgetAlerts: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: false },
    },
    goalUpdates: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
    },
    billReminders: {
        email: { type: Boolean, default: true },
        inApp: { type: Boolean, default: true },
    },
    promotions: {
        email: { type: Boolean, default: false },
        inApp: { type: Boolean, default: false },
    },
}, { _id: false });

// --- Privacy Schema ---
const privacySchema = new mongoose.Schema({
    twoFA: { type: Boolean, default: false },
    activityLog: { type: Boolean, default: true },
    privateAccount: { type: Boolean, default: false },
    autoLogout: { type: Boolean, default: false },
    shareData: { type: Boolean, default: false },
}, { _id: false });

// --- Settings Schema ---
const settingsSchema = new mongoose.Schema({
    notifications: { type: notificationSchema, default: () => ({}) },
    privacy: { type: privacySchema, default: () => ({}) },
    integration: { type: Object, default: {} },
    support: { type: Object, default: {} },
}, { _id: false });

// --- User Schema ---
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true, 
        minlength: 6 
    },
    settings: { 
        type: settingsSchema, 
        default: () => ({}) },
}, { timestamps: true });

// --- Password Hashing ---
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// --- Password Validation ---
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;