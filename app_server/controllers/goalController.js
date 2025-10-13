// backend/controllers/goalController.js
import Goal from '../models/goalModel.js';

// Get all goals for the authenticated user
export const getGoals = async (req, res) => {
    try {
        const goals = await Goal.find({ userId: req.user._id }).populate('linkedAccount', 'name type');
        res.json(goals);
    } catch (err) {
        console.error('💥 getGoals error:', err);
        res.status(500).json({ error: "Failed to fetch goals." });
    }
};

// Create a new goal
export const createGoal = async (req, res) => {
    try {
        const { title, description, targetDate, linkedAccount } = req.body;

        const goalData = {
            title,
            description,
            targetDate,
            userId: req.user._id
        };

        // Only set linkedAccount if provided and not empty
        if (linkedAccount) goalData.linkedAccount = linkedAccount;

        const goal = new Goal(goalData);
        await goal.save();
        res.status(201).json(goal);
    } catch (err) {
        console.error('💥 createGoal error:', err);
        res.status(400).json({ error: "Failed to create goal." });
    }
};

// Update an existing goal
export const updateGoal = async (req, res) => {
    try {
        const { title, description, targetDate, linkedAccount, isCompleted, targetAmount, currentAmount } = req.body;

        const updateData = {
            title,
            description,
            targetDate,
            isCompleted,
            targetAmount,
            currentAmount
        };

        // Only update linkedAccount if it's a non-empty string
        if (linkedAccount) {
            updateData.linkedAccount = linkedAccount;
        } else {
            updateData.linkedAccount = null; // Allow unlinking
        }

        const goal = await Goal.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            updateData,
            { new: true }
        );

        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }

        res.json(goal);
    } catch (err) {
        console.error('💥 updateGoal error:', err);
        res.status(400).json({ error: "Failed to update goal." });
    }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

        if (!goal) {
            return res.status(404).json({ error: "Goal not found" });
        }

        res.json({ message: "Goal deleted" });
    } catch (err) {
        console.error('💥 deleteGoal error:', err);
        res.status(400).json({ error: "Failed to delete goal." });
    }
};