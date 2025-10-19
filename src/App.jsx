// src/App.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import "./index.css";

// Hooks
import { AuthProvider, useAuth } from './hooks/useAuth';
import { UserAccountProvider } from './hooks/useUserAccounts.jsx';

// Pages
import LoadingScreen from './components/pages/LoadingScreen';
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

function AppContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // 🧠 If already logged in, skip WelcomePage
  if (isAuthenticated && !isLoaded) {
    setIsLoaded(true);
  }

  return (
    <>
      {!isLoaded && !isAuthenticated && (
        <WelcomePage onComplete={() => setIsLoaded(true)} />
      )}

      {isLoaded && (
        <div className="min-h-screen transition-opacity duration-700 opacity-100 bg-black text-gray-100">
          <Router>
            <Routes>
              {!isAuthenticated && (
                <>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="*" element={<Navigate to="/login" replace />} />
                </>
              )}

              {isAuthenticated && (
                <>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/accounts" element={<AccountsPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
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

export default function App() {
  return (
    <AuthProvider>
      <UserAccountProvider>
        <AppContent />
      </UserAccountProvider>
    </AuthProvider>
  );
}