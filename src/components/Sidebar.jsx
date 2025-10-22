import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const linkClasses = (path) =>
    `link-sidebar ${location.pathname === path ? "link-sidebar-active" : ""}`;

  return (
    <aside className="w-64 min-h-screen bg-sidebar backdrop-blur border-r border-sidebar flex flex-col p-6">
      {/* Logo / App name */}
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat text-[var(--color-cyan)] font-bold">My Ledger</h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 text-lg items-start">
        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/accounts" className={linkClasses("/accounts")}>
          Accounts
        </Link>
        <Link to="/transactions" className={linkClasses("/transactions")}>
          Transactions
        </Link>
        <Link to="/goals" className={linkClasses("/goals")}>
          Goals
        </Link>
        <Link to="/reports" className={linkClasses("/reports")}>
          Reports
        </Link>
        <Link to="/settings" className={linkClasses("/settings")}>
          Settings
        </Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto text-sidebar text-sm">
        &copy; 2025 Ledgerly
      </div>
    </aside>
  );
};

export default Sidebar;