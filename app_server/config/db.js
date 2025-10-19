/**
 * @fileoverview Database connection configuration for MongoDB
 * @description Handles connection to MongoDB database using Mongoose ODM
 * @author Christopher Holland
 * @version 1.0.0
 */

import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB database
 * @description Connects to MongoDB using the connection string from environment variables
 * @async
 * @function connectDB
 * @returns {Promise<void>} Promise that resolves when connection is established
 * @throws {Error} Throws error if connection fails and exits process
 */
const connectDB = async () => {
    try {
        // Connect to MongoDB with modern connection options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,    // Use new URL parser for MongoDB connection string
            useUnifiedTopology: true, // Use new Server Discovery and Monitoring engine
        });

        // Log successful connection with host information
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log connection error and exit process
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

export default connectDB;