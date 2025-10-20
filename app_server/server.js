import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoute.js';
import billsRoute from './routes/billsRoute.js';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// ===== API ROUTES =====
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/bills', billsRoute);

// ===== SERVE REACT BUILD =====
const buildPath = path.join(__dirname, '../app_client/dist'); // Adjust if your build folder is different
app.use(express.static(buildPath));

// Fallback route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('🔥 Global error:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

// ===== SERVER START =====
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});