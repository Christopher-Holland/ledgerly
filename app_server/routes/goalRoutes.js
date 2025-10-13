// backend/routes/goals.js
import express from 'express';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// GET all goals for the authenticated user
router.get('/', getGoals);

// POST a new goal
router.post('/', createGoal);

// PUT (update) an existing goal by ID
router.put('/:id', updateGoal);

// DELETE a goal by ID
router.delete('/:id', deleteGoal);

export default router;