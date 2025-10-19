/**
 * @fileoverview Main server file for Ledgerly API
 * @description Express.js server configuration with middleware, routes, and error handling
 * @author Christopher Holland
 * @version 1.0.0
 */

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoute.js';
import billsRoute from './routes/billsRoute.js';

// Load environment variables from .env file
dotenv.config();

// Initialize database connection to MongoDB
connectDB();

// Create Express application instance
const app = express();

// ===== MIDDLEWARE CONFIGURATION =====

/**
 * Parse incoming JSON requests with a size limit
 * @description Enables parsing of JSON payloads in request bodies
 */
app.use(express.json());

/**
 * Configure Cross-Origin Resource Sharing (CORS)
 * @description Allows cross-origin requests from frontend applications
 * @note Currently set to allow all origins for development
 */
app.use(cors());

/**
 * Request logging middleware for development debugging
 * @description Logs all incoming requests with method, URL, and body
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// ===== ROUTE CONFIGURATION =====

/**
 * API route handlers for different resources
 * @description Mounts route handlers for various application endpoints
 */
app.use('/api/users', userRoutes);        // User authentication and management
app.use('/api/goals', goalRoutes);        // Financial goals management
app.use('/api/transactions', transactionRoutes); // Transaction CRUD operations
app.use('/api/accounts', accountRoutes);  // Account management
app.use('/api/bills', billsRoute);        // Bills and recurring payments

// ===== UTILITY ROUTES =====

/**
 * Health check endpoint
 * @description Simple endpoint to verify server is running
 * @route GET /
 * @access Public
 */
app.get('/', (req, res) => {
    console.log('GET / hit');
    res.send('Ledgerly API is running...');
});

// ===== ERROR HANDLING =====

/**
 * Global error handling middleware
 * @description Catches and handles any unhandled errors in the application
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use((err, req, res, next) => {
    console.error('🔥 Global error:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// ===== SERVER INITIALIZATION =====

/**
 * Server port configuration
 * @description Uses environment variable PORT or defaults to 5001
 */
const PORT = process.env.PORT || 5001;

/**
 * Start the Express server
 * @description Binds the server to the specified port and logs startup information
 */
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});