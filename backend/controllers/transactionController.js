import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;
    
    // Build filter object
    const filter = { user: req.user.id };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter)
      .populate('category', 'name type color icon')
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
export const getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('category', 'name type color icon');

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, tags, notes } = req.body;

    // Validate required fields
    if (!type || !amount || !description || !category) {
      return res.status(400).json({ 
        message: "Type, amount, description, and category are required" 
      });
    }

    // Check if category exists and belongs to user
    const categoryExists = await Category.findOne({
      _id: category,
      user: req.user.id
    });

    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      description,
      category,
      date: date || new Date(),
      tags: tags || [],
      notes: notes || ""
    });

    await transaction.populate('category', 'name type color icon');

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Create transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, tags, notes } = req.body;

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // If category is being updated, verify it exists
    if (category && category !== transaction.category.toString()) {
      const categoryExists = await Category.findOne({
        _id: category,
        user: req.user.id
      });

      if (!categoryExists) {
        return res.status(400).json({ message: "Category not found" });
      }
    }

    // Update fields
    if (type) transaction.type = type;
    if (amount !== undefined) transaction.amount = amount;
    if (description) transaction.description = description;
    if (category) transaction.category = category;
    if (date) transaction.date = new Date(date);
    if (tags) transaction.tags = tags;
    if (notes !== undefined) transaction.notes = notes;

    await transaction.save();
    await transaction.populate('category', 'name type color icon');

    res.json(transaction);
  } catch (error) {
    console.error("Update transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete transaction error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get transaction statistics
// @route   GET /api/transactions/stats
// @access  Private
export const getTransactionStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = { user: req.user._id };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const stats = await Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    const incomeStats = stats.find(stat => stat._id === 'income') || { total: 0, count: 0 };
    const expenseStats = stats.find(stat => stat._id === 'expense') || { total: 0, count: 0 };

    res.json({
      income: {
        total: incomeStats.total,
        count: incomeStats.count
      },
      expense: {
        total: expenseStats.total,
        count: expenseStats.count
      },
      balance: incomeStats.total - expenseStats.total
    });
  } catch (error) {
    console.error("Get transaction stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
