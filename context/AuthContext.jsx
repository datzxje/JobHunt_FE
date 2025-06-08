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
        console.log("=== AUTH INITIALIZATION ===");
        console.log("Checking auth status by calling /auth/me...");
        
        // Call API endpoint to check if user is logged in
        // If access token is invalid, this will trigger 401 -> refresh token flow in axios interceptor
        const response = await api.getMe();
        
        // Extract user data from response.data
        const userData = response.data || response;
        
        // If we get a successful response, the user is authenticated (cookies are valid or were refreshed)
        console.log("User is authenticated:", userData);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.log("=== AUTH CHECK FAILED ===");
        console.log("Error checking auth status:", error.message);
        
        // Check if this is a "No refresh token found" scenario
        const errorMessage = error.response?.data?.message || error.message || '';
        const isNoRefreshTokenError = errorMessage.includes('No refresh token found') || 
                                    error.response?.status === 400;
        
        if (isNoRefreshTokenError) {
          console.log("No refresh token found - user needs to login");
        } else {
          console.log("Other auth error:", errorMessage);
        }
        
        // In all error cases, set user as not authenticated
        setUser(null);
        setIsLoggedIn(false);
        
        // Note: Redirect to login is handled by axios interceptor for "No refresh token found" cases
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log("Auth initialization completed");
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