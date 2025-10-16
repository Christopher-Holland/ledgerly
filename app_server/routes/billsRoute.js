// routes/bills.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    getBills,
    createBill,
    updateBill,
    deleteBill,
} from "../controllers/billsController.js";

const router = express.Router();

router.get("/", protect, getBills);
router.post("/", protect, createBill);
router.put("/:id", protect, updateBill);
router.delete("/:id", protect, deleteBill);

export default router;