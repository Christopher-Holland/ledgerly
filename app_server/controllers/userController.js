import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Generate JWT
const generateToken = (id) => {
    console.log(`🔑 Generating JWT for user ID: ${id}`);
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

// @desc    Get current logged-in user (with settings)
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { _id, name, username, email, settings } = req.user;

        res.json({
            _id,
            name,
            username,
            email,
            settings: {
                notifications: settings?.notifications || {
                    accountActivity: { email: true, inApp: true },
                    budgetAlerts: { email: true, inApp: false },
                    goalUpdates: { email: true, inApp: true },
                    billReminders: { email: true, inApp: true },
                    promotions: { email: false, inApp: false },
                },
                privacy: settings?.privacy || {
                    twoFA: false,
                    activityLog: true,
                    privateAccount: false,
                    autoLogout: false,
                    shareData: false,
                },
                integration: settings?.integration || {},
                support: settings?.support || {},
            },
        });
    } catch (error) {
        console.error("💥 getMe error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        console.log('📝 registerUser called');
        console.log('Received body:', req.body);

        const { name, username, email, password, confirmPassword } = req.body;

        if (!name || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check for existing username or email
        const usernameExists = await User.findOne({ username });
        const emailExists = await User.findOne({ email });

        if (usernameExists) return res.status(400).json({ message: 'Username already exists' });
        if (emailExists) return res.status(400).json({ message: 'Email already exists' });

        const user = await User.create({ name, username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error('🔥 registerUser error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        console.log("🔐 Login attempt:", req.body);
        const { username, password } = req.body;

        if (!username || !password) {
            console.log("❌ Missing username or password");
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = await User.findOne({ username });
        console.log("👤 User found:", user ? "Yes" : "No");

        if (!user) {
            console.log("❌ User not found for username:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const isMatch = await user.matchPassword(password);
        console.log("🔑 Password match:", isMatch);

        if (!isMatch) {
            console.log("❌ Password mismatch for username:", username);
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = generateToken(user._id);
        console.log("✅ Login successful for user:", user.username);
        
        res.json({
            _id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token,
        });
    } catch (error) {
        console.error("💥 loginUser error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// --- NEW: Update current user ---
// @desc    Update logged-in user's profile
// @route   PUT /api/users/me
// @access  Private
export const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { name, username, email, password } = req.body;

        if (name) user.name = name;
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password; // hashed automatically by pre-save hook

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
        });
    } catch (error) {
        console.error("💥 updateMe error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// DELETE /api/users/me
export const deleteMe = async (req, res) => {
    try {
        const userId = req.user.id;

        await User.findByIdAndDelete(userId);

        res.json({ message: "Account deleted successfully." });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ message: "Server error while deleting account." });
    }
};

// Change Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: "Please provide both current and new passwords." });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Verify username exists for forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { username } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        res.status(200).json({ message: "Username verified" });
    } catch (error) {
        console.error("💥 forgotPassword error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Reset password using username
// @route   PUT /api/users/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        user.password = password; // hashed automatically via pre-save hook
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("💥 resetPassword error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user settings
export const updateSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const { notifications, integration, support, privacy } = req.body;

        // --- Update notifications ---
        if (notifications) {
            user.settings.notifications = {
                accountActivity: {
                    ...user.settings.notifications.accountActivity,
                    ...notifications.accountActivity,
                },
                budgetAlerts: {
                    ...user.settings.notifications.budgetAlerts,
                    ...notifications.budgetAlerts,
                },
                goalUpdates: {
                    ...user.settings.notifications.goalUpdates,
                    ...notifications.goalUpdates,
                },
                billReminders: {
                    ...user.settings.notifications.billReminders,
                    ...notifications.billReminders,
                },
                promotions: {
                    ...user.settings.notifications.promotions,
                    ...notifications.promotions,
                },
            };
        }

        // --- Update privacy settings ---
        if (privacy) {
            user.settings.privacy = {
                ...user.settings.privacy,
                ...privacy,
            };
        }

        // --- Optional: update integration settings ---
        if (integration) {
            user.settings.integration = {
                ...user.settings.integration,
                ...integration,
            };
        }

        // --- Optional: update support settings ---
        if (support) {
            user.settings.support = {
                ...user.settings.support,
                ...support,
            };
        }

        await user.save();

        res.status(200).json({ message: "Settings updated successfully", settings: user.settings });
    } catch (error) {
        console.error("💥 updateSettings error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
