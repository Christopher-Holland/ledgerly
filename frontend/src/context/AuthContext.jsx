import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("ledgerlyToken");
    if (token) {
      setUser({ token }); // optionally decode JWT for name/username
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("ledgerlyToken", token);
    setUser({ token });
  };

  const logout = () => {
    localStorage.removeItem("ledgerlyToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};