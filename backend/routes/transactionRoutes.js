import express from "express";
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionStats
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// Transaction routes
router.route("/")
  .get(getTransactions)
  .post(createTransaction);

router.route("/stats")
  .get(getTransactionStats);

router.route("/:id")
  .get(getTransaction)
  .put(updateTransaction)
  .delete(deleteTransaction);

export default router;
