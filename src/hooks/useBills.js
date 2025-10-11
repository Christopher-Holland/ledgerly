import { useState } from "react";

export const useBills = () => {
    const [bills] = useState([
        { id: 1, name: "Rent", amount: 1200, due: "2025-10-05" },
        { id: 2, name: "Internet", amount: 60, due: "2025-10-10" },
    ]);
    return { bills };
};