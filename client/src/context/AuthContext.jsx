/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { logError } from '../utils/logger';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds logged-in user data
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Load user from localStorage on initial render
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        logError("Failed to parse user from localStorage", e);
        localStorage.removeItem('user'); // Clear corrupted data
      }
    }
    setIsLoading(false); // Done loading
  }, []);

  // Function to handle login
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Value to be provided to consumers
  const authContextValue = {
    user,
    login,
    logout,
    // Helper to check if user has a specific role (e.g., isAdmin)
    isAdmin: user && user.user.roles.includes('admin')
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading Gitamind..." size="large" />;
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};