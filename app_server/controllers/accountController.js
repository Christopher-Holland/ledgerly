import Account from "../models/accountModel.js";

// @desc    Get all accounts for authenticated user
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id });
        res.status(200).json(accounts);
    } catch (error) {
        console.error('💥 getAccounts error:', error);
        res.status(500).json({ message: "Failed to fetch accounts", error });
    }
};

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (req, res) => {
    try {
        const { name, type, balance, institution, transactions } = req.body;

        const newAccount = new Account({
            name,
            type,
            balance: balance || 0,
            institution,
            transactions: transactions || 0,
            userId: req.user._id,
        });

        const savedAccount = await newAccount.save();
        res.status(201).json(savedAccount);
    } catch (error) {
        console.error('💥 createAccount error:', error);
        res.status(400).json({ message: "Failed to create account", error });
    }
};

// @desc    Update existing account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (req, res) => {
    try {
        const updatedAccount = await Account.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updatedAccount)
            return res.status(404).json({ message: "Account not found" });
        res.status(200).json(updatedAccount);
    } catch (error) {
        console.error('💥 updateAccount error:', error);
        res.status(400).json({ message: "Failed to update account", error });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (req, res) => {
    try {
        const deleted = await Account.findOneAndDelete({ 
            _id: req.params.id, 
            userId: req.user._id 
        });
        if (!deleted)
            return res.status(404).json({ message: "Account not found" });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error('💥 deleteAccount error:', error);
        res.status(500).json({ message: "Failed to delete account", error });
    }
};