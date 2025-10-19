/**
 * @fileoverview Account controller for CRUD operations on user accounts
 * @description Handles account management with cascading deletes for related data
 * @author Christopher Holland
 * @version 1.0.0
 */

import Account from "../models/accountModel.js";

/**
 * Get all accounts for the authenticated user
 * @description Retrieves all financial accounts belonging to the authenticated user
 * @route GET /api/accounts
 * @access Private
 * @param {Object} req - Express request object (requires req.user from auth middleware)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns array of user accounts or error response
 */
export const getAccounts = async (req, res) => {
    try {
        // Find all accounts belonging to the authenticated user
        const accounts = await Account.find({ userId: req.user._id });
        res.status(200).json(accounts);
    } catch (error) {
        console.error('💥 getAccounts error:', error);
        res.status(500).json({ message: "Failed to fetch accounts", error });
    }
};

/**
 * Create a new account for the authenticated user
 * @description Creates a new financial account with the provided details
 * @route POST /api/accounts
 * @access Private
 * @param {Object} req - Express request object (requires req.user from auth middleware)
 * @param {Object} req.body - Account data (name, type, balance, institution, transactions)
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns created account or error response
 */
export const createAccount = async (req, res) => {
    try {
        // Extract account data from request body
        const { name, type, balance, institution, transactions } = req.body;

        // Create new account instance with user ID
        const newAccount = new Account({
            name,
            type,
            balance: balance || 0,           // Default to 0 if not provided
            institution,
            transactions: transactions || 0, // Default to 0 if not provided
            userId: req.user._id,            // Associate with authenticated user
        });

        // Save account to database
        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (error) {
        console.error('💥 createAccount error:', error);
        res.status(400).json({ message: "Failed to create account", error });
    }
};

/**
 * Update an existing account for the authenticated user
 * @description Updates account details for the specified account ID
 * @route PUT /api/accounts/:id
 * @access Private
 * @param {Object} req - Express request object (requires req.user from auth middleware)
 * @param {string} req.params.id - Account ID to update
 * @param {Object} req.body - Updated account data
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns updated account or error response
 */
export const updateAccount = async (req, res) => {
    try {
        // Find and update account, ensuring it belongs to the authenticated user
        const updatedAccount = await Account.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, // Security: ensure user owns the account
            req.body,                                     // Update with request body data
            { new: true }                                 // Return updated document
        );
        
        // Check if account was found and updated
        if (!updatedAccount) {
            return res.status(404).json({ message: "Account not found" });
        }
        
        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error('💥 updateAccount error:', error);
        res.status(400).json({ message: "Failed to update account", error });
    }
};

/**
 * Delete an account for the authenticated user
 * @description Removes the specified account and performs cascading deletes for related data
 * @route DELETE /api/accounts/:id
 * @access Private
 * @param {Object} req - Express request object (requires req.user from auth middleware)
 * @param {string} req.params.id - Account ID to delete
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Returns success message or error response
 */
export const deleteAccount = async (req, res) => {
    try {
        // Find and delete account, ensuring it belongs to the authenticated user
        const deleted = await Account.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        
        // Check if account was found and deleted
        if (!deleted) {
            return res.status(404).json({ message: "Account not found" });
        }
        
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('💥 deleteAccount error:', error);
        res.status(500).json({ message: "Failed to delete account", error });
    }
};