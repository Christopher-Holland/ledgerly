/**
 * @fileoverview Authentication middleware for JWT token verification and authorization
 * @description Provides middleware functions for protecting routes and role-based access control
 * @author Christopher Holland
 * @version 1.0.0
 */

import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware function to protect routes by verifying JWT tokens
 * @description Validates JWT tokens from Authorization header and attaches user to request object
 * @async
 * @function protect
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>} Calls next() if authentication succeeds, sends error response otherwise
 * 
 * @example
 * // Usage in routes
 * router.get('/protected-route', protect, controllerFunction);
 */
export const protect = async (req, res, next) => {
    let token;

    // Extract JWT token from Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            // Extract token from "Bearer <token>" format
            token = req.headers.authorization.split(" ")[1];

            // Verify and decode JWT token using secret from environment
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user from database and attach to request (excluding password field)
            req.user = await User.findById(decoded.id).select("-password");

            // Verify user exists in database
            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Authentication successful, proceed to next middleware/controller
            next();
        } catch (error) {
            // JWT verification failed (invalid token, expired, etc.)
            console.error("JWT verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        // No authorization header or invalid format
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

/**
 * Role-based access control middleware for admin-only routes
 * @description Restricts access to routes that require admin privileges
 * @function adminOnly
 * @param {Object} req - Express request object (must have req.user from protect middleware)
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} Calls next() if user is admin, sends 403 error otherwise
 * 
 * @example
 * // Usage in routes (must be used after protect middleware)
 * router.post('/admin-only', protect, adminOnly, adminController);
 */
export const adminOnly = (req, res, next) => {
    // Check if user exists and has admin role
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        // User is not admin or doesn't exist
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};