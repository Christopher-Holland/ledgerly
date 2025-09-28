import Category from "../models/Category.js";

// @desc    Get all categories
// @route   GET /api/categories
// @access  Private
export const getCategories = async (req, res) => {
  try {
    const { type } = req.query;
    
    const filter = { user: req.user.id };
    if (type) filter.type = type;

    const categories = await Category.find(filter).sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Private
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Get category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private
export const createCategory = async (req, res) => {
  try {
    const { name, type, color, icon, budget } = req.body;

    // Validate required fields
    if (!name || !type) {
      return res.status(400).json({ 
        message: "Name and type are required" 
      });
    }

    // Check if category name already exists for this user
    const existingCategory = await Category.findOne({
      name: name.trim(),
      user: req.user.id
    });

    if (existingCategory) {
      return res.status(400).json({ 
        message: "Category with this name already exists" 
      });
    }

    const category = await Category.create({
      user: req.user.id,
      name: name.trim(),
      type,
      color: color || '#3B82F6',
      icon: icon || '💰',
      budget: budget || 0
    });

    res.status(201).json(category);
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
export const updateCategory = async (req, res) => {
  try {
    const { name, type, color, icon, budget } = req.body;

    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // If name is being updated, check for duplicates
    if (name && name.trim() !== category.name) {
      const existingCategory = await Category.findOne({
        name: name.trim(),
        user: req.user.id,
        _id: { $ne: req.params.id }
      });

      if (existingCategory) {
        return res.status(400).json({ 
          message: "Category with this name already exists" 
        });
      }
    }

    // Update fields
    if (name) category.name = name.trim();
    if (type) category.type = type;
    if (color) category.color = color;
    if (icon) category.icon = icon;
    if (budget !== undefined) category.budget = budget;

    await category.save();

    res.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category is being used in transactions
    const Transaction = (await import("../models/Transaction.js")).default;
    const transactionCount = await Transaction.countDocuments({
      category: req.params.id,
      user: req.user.id
    });

    if (transactionCount > 0) {
      return res.status(400).json({ 
        message: "Cannot delete category that has transactions. Please move or delete transactions first." 
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create default categories for new user
// @route   POST /api/categories/default
// @access  Private
export const createDefaultCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user already has categories
    const existingCategories = await Category.countDocuments({ user: userId });
    if (existingCategories > 0) {
      return res.status(400).json({ 
        message: "User already has categories" 
      });
    }

    const defaultCategories = [
      // Income categories
      { name: "Salary", type: "income", color: "#10B981", icon: "💼" },
      { name: "Freelance", type: "income", color: "#3B82F6", icon: "💻" },
      { name: "Investment", type: "income", color: "#8B5CF6", icon: "📈" },
      { name: "Other Income", type: "income", color: "#F59E0B", icon: "💰" },
      
      // Expense categories
      { name: "Food & Dining", type: "expense", color: "#EF4444", icon: "🍽️" },
      { name: "Transportation", type: "expense", color: "#3B82F6", icon: "🚗" },
      { name: "Housing", type: "expense", color: "#8B5CF6", icon: "🏠" },
      { name: "Entertainment", type: "expense", color: "#F59E0B", icon: "🎬" },
      { name: "Healthcare", type: "expense", color: "#10B981", icon: "🏥" },
      { name: "Shopping", type: "expense", color: "#EF4444", icon: "🛍️" },
      { name: "Utilities", type: "expense", color: "#6B7280", icon: "⚡" },
      { name: "Other Expenses", type: "expense", color: "#9CA3AF", icon: "📝" }
    ];

    const categories = await Category.insertMany(
      defaultCategories.map(cat => ({ ...cat, user: userId }))
    );

    res.status(201).json({
      message: "Default categories created successfully",
      categories
    });
  } catch (error) {
    console.error("Create default categories error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
