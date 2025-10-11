import express from 'express';
import { registerUser, loginUser, getMe, updateMe, deleteMe, changePassword, forgotPassword, resetPassword, updateSettings } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private routes
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe); // <-- Update logged-in user
router.delete("/me", protect, deleteMe);
router.put('/change-password', protect, changePassword);

// Login Page Password Resets
router.post("/forgot-password", forgotPassword); // verifies username exists
router.put("/reset-password", resetPassword); // updates password by username

// Settings
router.put("/settings", protect, updateSettings);

export default router;