import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Middleware: Protect routes by verifying JWT tokens.
 * Attaches the authenticated user object to req.user.
 */
export const protect = async (req, res, next) => {
    let token;

    // Check for "Bearer <token>"
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify and decode JWT
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request (excluding password)
            req.user = await User.findById(decoded.id).select("-password");

            if (!req.user) {
                return res.status(404).json({ message: "User not found" });
            }

            next(); // Proceed to controller
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }
    } else {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

/**
 * Optional: Restrict access to specific roles
 * Example usage: router.post('/admin', protect, adminOnly, controller)
 */
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied: Admins only" });
    }
};