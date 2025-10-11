import { createContext, useContext } from "react";

const UserAccountContext = createContext();

export const UserAccountProvider = ({ children }) => {
    // This is a placeholder provider for user accounts
    // You can expand this with actual account management logic later
    const value = {
        accounts: [],
        loading: false,
        error: null
    };

    return (
        <UserAccountContext.Provider value={value}>
            {children}
        </UserAccountContext.Provider>
    );
};

export const useUserAccounts = () => {
    const context = useContext(UserAccountContext);
    if (!context) throw new Error("useUserAccounts must be used within UserAccountProvider");
    return context;
};
