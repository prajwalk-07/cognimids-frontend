"use client";
import { createContext, useState, useEffect, use } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  token: null,
  login: (userId, token,role) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  // Initialize from localStorage once
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
const storedRole=localStorage.getItem("role")
    if (storedToken && storedUserId &&storedRole) {
      setToken(storedToken);
      setUserId(storedUserId);
      setRole(storedRole)
    }
    setInitialized(true);
  }, []);

  const login = (userId, token,role) => {
    // Set state first
    setToken(token);
    setUserId(userId);
setRole(role)
    // Then persist to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("role",role)
  };

  const logout = () => {
    // Clear state first
    setToken(null);
    setUserId(null);
    setRole(null)

    // Then clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role")
  };

  if (!initialized) {
    return null; // Don't render until initialized
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        userId,
        token,
        login,
        logout,
        role
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
