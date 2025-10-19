/**
 * @fileoverview Main App component with routing and authentication
 * @description React application entry point with protected routes and context providers
 * @author Ledgerly Development Team
 * @version 1.0.0
 */

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./index.css";

// Context providers and hooks
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserAccountProvider } from './hooks/useUserAccounts.jsx';

// Page components
import WelcomePage from './components/pages/WelcomePage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardPage from './components/pages/DashboardPage';
import AccountsPage from './components/pages/AccountsPage';
import GoalsPage from './components/pages/GoalsPage';
import TransactionsPage from './components/pages/TransactionsPage';
import ReportsPage from './components/pages/ReportsPage';
import SettingsPage from './components/pages/SettingsPage';
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./components/pages/ResetPasswordPage.jsx";

/**
 * Main application content component with routing logic
 * @description Handles route protection and navigation based on authentication status
 * @component AppContent
 * @returns {JSX.Element} Application content with conditional routing
 */
function AppContent() {
  // State to track if the app has finished initial loading
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Authentication state from context
  const { isAuthenticated, loading } = useAuth();

  // Handle loading state smoothly without flashing
  if (loading) {
    // Return null to prevent any visual flashing during authentication check
    return null;
  }

  // Auto-complete loading if user is already authenticated
  if (isAuthenticated && !isLoaded) {
    setIsLoaded(true);
  }

  return (
    <>
      {/* Show welcome page for new/unauthenticated users */}
      {!isLoaded && !isAuthenticated && (
        <WelcomePage onComplete={() => setIsLoaded(true)} />
      )}

      {/* Main application content for loaded/authenticated users */}
      {isLoaded && (
        <div className="min-h-screen transition-opacity duration-700 opacity-100 bg-black text-gray-100">
          <Router>
            <Routes>
              {/* Public routes for unauthenticated users */}
              {!isAuthenticated && (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  {/* Redirect all other routes to login */}
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              )}

              {/* Protected routes for authenticated users */}
              {isAuthenticated && (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  {/* Redirect all other routes to dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              )}
            </Routes>
          </Router>
        </div>
      )}
    </>
  );
}

/**
 * Root App component with context providers
 * @description Wraps the application with necessary context providers for state management
 * @component App
 * @returns {JSX.Element} Application wrapped with context providers
 */
export default function App() {
  return (
    <AuthProvider>
      <UserAccountProvider>
        <AppContent />
      </UserAccountProvider>
    </AuthProvider>
  );
}