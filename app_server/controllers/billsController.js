// controllers/billsController.js
import Bill from "../models/billsModel.js";

// GET /api/bills
export const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({ userId: req.user._id });
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bills", error });
    }
};

// POST /api/bills
export const createBill = async (req, res) => {
    try {
        const { name, date, amount } = req.body;
        const bill = new Bill({ name, date, amount, userId: req.user._id });
        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ message: "Error creating bill", error });
    }
};

// PUT /api/bills/:id
export const updateBill = async (req, res) => {
    try {
        const { name, date, amount } = req.body;
        const bill = await Bill.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { name, date, amount },
            { new: true }
        );
        if (!bill) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: "Error updating bill", error });
    }
};

// DELETE /api/bills/:id
export const deleteBill = async (req, res) => {
    try {
        const deleted = await Bill.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (!deleted) {
            return res.status(404).json({ message: "Bill not found" });
        }
        res.json({ message: "Bill deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting bill", error });
    }
};