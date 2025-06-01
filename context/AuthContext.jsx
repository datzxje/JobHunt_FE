'use client'

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state by checking session with the backend
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");
        // Call API endpoint to check if user is logged in
        const response = await api.getMe();
        
        // Extract user data from response.data
        const userData = response.data || response;
        
        // If we get a successful response, the user is logged in (cookies are valid)
        console.log("User is authenticated:", userData);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("User is not authenticated");
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (userData) => {
    console.log("Login function called");
    setUser(userData);
    setIsLoggedIn(true);
    // No need to store anything in localStorage
    // Cookies are automatically handled by the browser
  };

  // Logout function
  const logout = async () => {
    console.log("Logout function called");
    try {
      // Call the logout API to clear cookies on the server
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API success
      setUser(null);
      setIsLoggedIn(false);
      
      // Redirect to homepage after logout
      console.log("Redirecting to homepage after logout");
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, initialized, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext); 