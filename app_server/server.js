import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import accountRoutes from './routes/accountRoute.js';


// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS (Postman-friendly for now)
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.url}`);
    console.log('Body:', req.body);
    next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/accounts', accountRoutes);


// Test route
app.get('/', (req, res) => {
    console.log('GET / hit');
    res.send('Ledgerly API is running...');
});

// Global error handler (for extra debug)
app.use((err, req, res, next) => {
    console.error('🔥 Global error:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});