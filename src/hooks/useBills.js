import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://ledgerly-p5ss.onrender.com";
const api = axios.create({ baseURL: API_BASE_URL });

export const useBills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get token from storage
    const getToken = () => {
        return localStorage.getItem("token") || sessionStorage.getItem("token");
    };

    // Fetch bills from API
    const fetchBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await api.get("/api/bills", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBills(response.data);
        } catch (err) {
            console.error("Error fetching bills:", err);
            setError(err.response?.data?.message || "Failed to fetch bills");
        } finally {
            setLoading(false);
        }
    };

    // Create new bill
    const createBill = async (billData) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const dataToSend = {
                ...billData,
                amount: parseFloat(billData.amount),
                date: billData.date || billData.due
            };

            const response = await api.post("/api/bills", dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBills(prev => [...prev, response.data]);
            return { success: true, bill: response.data };
        } catch (err) {
            console.error("Error creating bill:", err);
            return { success: false, error: err.response?.data?.message || "Failed to create bill" };
        }
    };

    // Update existing bill
    const updateBill = async (billId, billData) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            const dataToSend = {
                ...billData,
                amount: parseFloat(billData.amount),
                date: billData.date || billData.due
            };

            const response = await api.put(`/api/bills/${billId}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBills(prev => prev.map(bill => 
                bill._id === billId ? response.data : bill
            ));
            return { success: true, bill: response.data };
        } catch (err) {
            console.error("Error updating bill:", err);
            return { success: false, error: err.response?.data?.message || "Failed to update bill" };
        }
    };

    // Delete bill
    const deleteBill = async (billId) => {
        try {
            const token = getToken();
            if (!token) {
                throw new Error("No authentication token found");
            }

            await api.delete(`/api/bills/${billId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBills(prev => prev.filter(bill => bill._id !== billId));
            return { success: true };
        } catch (err) {
            console.error("Error deleting bill:", err);
            return { success: false, error: err.response?.data?.message || "Failed to delete bill" };
        }
    };

    // Bulk update bills (for the modal's save functionality)
    const updateBills = async (updatedBills) => {
        try {
            const results = [];
            
            // Get current bills to compare with updated bills
            const currentBillIds = bills.map(bill => bill._id);
            const updatedBillIds = updatedBills.map(bill => bill._id).filter(id => id);
            
            // Delete bills that are no longer in the updated list
            const billsToDelete = currentBillIds.filter(id => !updatedBillIds.includes(id));
            for (const billId of billsToDelete) {
                const result = await deleteBill(billId);
                results.push(result);
            }
            
            // Process each bill - create new ones or update existing ones
            for (const bill of updatedBills) {
                if (bill._id) {
                    // Update existing bill
                    const result = await updateBill(bill._id, {
                        name: bill.name,
                        date: bill.date || bill.due,
                        amount: parseFloat(bill.amount)
                    });
                    results.push(result);
                } else {
                    // Create new bill
                    const result = await createBill({
                        name: bill.name,
                        date: bill.date || bill.due,
                        amount: parseFloat(bill.amount)
                    });
                    results.push(result);
                }
            }

            // Check if all operations were successful
            const hasErrors = results.some(result => !result.success);
            if (hasErrors) {
                return { success: false, error: "Some bills failed to save" };
            }

            return { success: true };
        } catch (err) {
            console.error("Error updating bills:", err);
            return { success: false, error: "Failed to update bills" };
        }
    };

    // Load bills on mount
    useEffect(() => {
        fetchBills();
    }, []);

    return { 
        bills, 
        loading, 
        error, 
        fetchBills, 
        createBill, 
        updateBill, 
        deleteBill, 
        updateBills 
    };
};