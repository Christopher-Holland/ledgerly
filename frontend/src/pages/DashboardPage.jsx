import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
      <h1 className="text-3xl font-bold mb-6">Welcome to Ledgerly</h1>
      <p className="mb-6">You are successfully logged in!</p>
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;