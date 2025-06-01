'use client'

import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../utils/api/api';

// Create the company admin auth context
export const CompanyAdminAuthContext = createContext();

export const CompanyAdminAuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      // Skip check if on login page
      if (pathname.includes('/company-admin/login')) {
        console.log("Skipping auth check on login page");
        setLoading(false);
        setInitialized(true);
        return;
      }

      console.log("=== COMPANY ADMIN AUTH CHECK ===");
      console.log("Current path:", pathname);
      console.log("Checking company admin auth status...");
      
      // Small delay to ensure cookies are properly set if we just logged in
      await new Promise(resolve => setTimeout(resolve, 200));
      
      try {
        console.log("Calling /auth/me to check authentication...");
        const response = await api.getMe();
        
        // Extract user data from response.data
        const userData = response.data || response;
        console.log("Company admin user authenticated successfully");
        setUser(userData);
        
        // Try to get managed companies to find companyId
        try {
          console.log("User data from /auth/me:", userData);
          console.log("User role:", userData.role);
          
          // Check if user has ADMIN role before calling getMyManagedCompanies
          if (userData.role === 'ADMIN') {
            console.log("User has ADMIN role, fetching managed companies...");
            const companiesResponse = await api.getMyManagedCompanies();
            
            console.log("Managed companies response:", companiesResponse);
            
            const managedCompanies = companiesResponse.data || companiesResponse || [];
            
            console.log("Managed companies data:", managedCompanies);
            
            if (Array.isArray(managedCompanies) && managedCompanies.length > 0) {
              // Use the first managed company
              const firstCompany = managedCompanies[0];
              console.log("First managed company:", firstCompany);
              
              const company = {
                id: firstCompany.companyId,
                name: firstCompany.companyName
              };
              
              setCompany(company);
              setCompanyId(firstCompany.companyId);
              console.log("Company admin manages company:", firstCompany.companyId, company);
            } else {
              console.warn("No managed companies found for ADMIN user");
              // Use fallback for development
              console.log("Using fallback companyId = 1 for ADMIN user with no companies");
              setCompanyId(1);
              setCompany({ id: 1, name: "Default Company" });
            }
          } else {
            console.log(`User role is ${userData.role}, not ADMIN. Cannot access company admin features.`);
            console.log("Using fallback companyId = 1 for non-ADMIN user (development only)");
            
            // For development purposes, allow access even for non-admin users
            // In production, you might want to redirect to an error page or regular dashboard
            setCompanyId(1);
            setCompany({ id: 1, name: "Default Company (Development)" });
          }
        } catch (companyError) {
          console.error("Error fetching managed companies:", companyError);
          
          // Check if error is due to insufficient permissions
          if (companyError.response?.status === 403) {
            console.warn("User does not have ADMIN role, cannot fetch managed companies");
            console.log("Using fallback companyId = 1 for 403 error");
            setCompanyId(1);
            setCompany({ id: 1, name: "Default Company (403)" });
          } else {
            console.warn("Could not fetch managed companies:", companyError.message);
            setCompanyId(1);
            setCompany({ id: 1, name: "Default Company (Error)" });
          }
        }
        
        setIsLoggedIn(true);
      } catch (error) {
        console.log("Company admin is not authenticated:", error.message);
        setUser(null);
        setCompany(null);
        setCompanyId(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    checkAuthStatus();
  }, [pathname]);

  // Login function
  const login = async (userData, companyData = null) => {
    console.log("Company admin login function called");
    setUser(userData);
    setIsLoggedIn(true);
    
    // If company data is provided, use it
    if (companyData) {
      setCompany(companyData);
      setCompanyId(companyData.id);
      console.log("Using provided company data:", companyData);
    } else {
      // Try to fetch managed companies after login
      try {
        console.log("User data after login:", userData);
        console.log("User role after login:", userData.role);
        
        // Check if user has ADMIN role before calling getMyManagedCompanies
        if (userData.role === 'ADMIN') {
          console.log("User has ADMIN role, fetching managed companies after login...");
          const companiesResponse = await api.getMyManagedCompanies();
          
          console.log("Managed companies response after login:", companiesResponse);
          
          const managedCompanies = companiesResponse.data || companiesResponse || [];
          
          console.log("Managed companies data after login:", managedCompanies);
          
          if (Array.isArray(managedCompanies) && managedCompanies.length > 0) {
            const firstCompany = managedCompanies[0];
            console.log("First managed company after login:", firstCompany);
            
            const company = {
              id: firstCompany.companyId,
              name: firstCompany.companyName
            };
            
            setCompany(company);
            setCompanyId(firstCompany.companyId);
            console.log("Set company after login:", company);
          } else {
            console.warn("No managed companies found for ADMIN user after login");
            console.log("Using fallback companyId = 1 for ADMIN user with no companies after login");
            setCompanyId(1);
            setCompany({ id: 1, name: "Default Company" });
          }
        } else {
          console.log(`User role is ${userData.role} after login, not ADMIN. Cannot access company admin features.`);
          console.log("Using fallback companyId = 1 for non-ADMIN user after login (development only)");
          
          // For development purposes, allow access even for non-admin users
          setCompanyId(1);
          setCompany({ id: 1, name: "Default Company (Development)" });
        }
      } catch (error) {
        console.error("Error fetching managed companies after login:", error);
        
        if (error.response?.status === 403) {
          console.warn("User does not have ADMIN role after login");
          setCompanyId(1);
          setCompany({ id: 1, name: "Default Company (403)" });
        } else {
          console.warn("Could not fetch managed companies after login:", error.message);
          setCompanyId(1);
          setCompany({ id: 1, name: "Default Company (Error)" });
        }
      }
    }
    
    // Access token should be set in cookies by the server
  };

  // Logout function
  const logout = async () => {
    console.log("Company admin logout function called");
    try {
      // Call the logout API to clear tokens on the server
      await api.logout();
    } catch (error) {
      console.error("Company admin logout error:", error);
    } finally {
      // Clear local state regardless of API success
      setUser(null);
      setCompany(null);
      setCompanyId(null);
      setIsLoggedIn(false);
      
      // Redirect to company admin login page after logout
      console.log("Redirecting to company admin login after logout");
      router.push('/company-admin/login');
    }
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin' || user?.isAdmin === true;
  };

  return (
    <CompanyAdminAuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      company,
      companyId,
      login, 
      logout, 
      initialized, 
      loading,
      hasPermission,
      isAdmin
    }}>
      {children}
    </CompanyAdminAuthContext.Provider>
  );
};

// Custom hook to use the company admin auth context
export const useCompanyAdminAuth = () => useContext(CompanyAdminAuthContext); 