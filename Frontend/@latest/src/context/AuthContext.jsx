import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. On startup, check if we already have a token in the browser
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);

  // 2. Login function: Saves the JWT and User data
  const login = (userData, userToken) => {
    setToken(userToken);
    setUser(userData); // This is your { _id, email, firstName } object
    setIsLoggedIn(true);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // 3. Logout function: Clears everything
  // Inside AuthContext.js
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/"; // Force a fresh start
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
