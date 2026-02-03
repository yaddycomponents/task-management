/**
 * AUTHENTICATION CONTEXT
 *
 * Demonstrates:
 * - Auth state management with Context
 * - Login/Logout flow
 * - Persisting auth to localStorage
 * - Protected routes pattern (see ProtectedRoute.jsx)
 *
 * In a real app, you'd:
 * - Call an API for login
 * - Store JWT tokens
 * - Handle token refresh
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

// Dummy users for testing
const DUMMY_USERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex@company.com', password: 'password123', avatar: 'AJ' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@company.com', password: 'password123', avatar: 'SS' },
  { id: 3, name: 'Demo User', email: 'demo', password: 'demo', avatar: 'DU' },
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('taskflow_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user (case insensitive email)
    const foundUser = DUMMY_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    // Remove password from stored user
    const { password: _, ...safeUser } = foundUser;

    setUser(safeUser);
    localStorage.setItem('taskflow_user', JSON.stringify(safeUser));

    return safeUser;
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('taskflow_user');
    localStorage.removeItem('taskflow_achievements');
  }, []);

  // Check if authenticated
  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
