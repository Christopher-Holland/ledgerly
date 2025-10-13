import Transaction from "../models/transactionModel.js";

// GET /api/transactions
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Error fetching transactions", error: err.message });
    }
};

// POST /api/transactions
export const createTransaction = async (req, res) => {
    try {
        const { date, amount, type, vendor, category, notes, accountId } = req.body;

        if (!date || !amount || !type || !vendor || !category || !accountId) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newTx = await Transaction.create({
            userId: req.user._id,
            accountId,
            date,
            amount,
            type,
            vendor,
            category,
            notes,
        });

        res.status(201).json(newTx);
    } catch (err) {
        res.status(500).json({ message: "Error creating transaction", error: err.message });
    }
};

// PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
    try {
        const updated = await Transaction.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Transaction not found" });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: "Error updating transaction", error: err.message });
    }
};

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
    try {
        const deleted = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });

        if (!deleted) return res.status(404).json({ message: "Transaction not found" });
        res.json({ message: "Transaction deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting transaction", error: err.message });
    }
};