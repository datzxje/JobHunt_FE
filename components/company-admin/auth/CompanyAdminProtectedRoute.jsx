'use client'

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCompanyAdminAuth } from '../../../context/CompanyAdminAuthContext';

const CompanyAdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading, initialized } = useCompanyAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we've finished loading and initializing
    if (initialized && !loading) {
      // If not logged in and not already on login page
      if (!isLoggedIn && pathname !== '/company-admin/login') {
        console.log('Company admin not authenticated, redirecting to login');
        const returnUrl = encodeURIComponent(pathname);
        router.push(`/company-admin/login?returnUrl=${returnUrl}`);
      }
    }
  }, [isLoggedIn, loading, initialized, pathname, router]);

  // Show loading spinner while checking authentication
  if (loading || !initialized) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang kiểm tra quyền truy cập... / Checking access permissions...</p>
        </div>
        
        <style jsx>{`
          .loading-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f8f9fa;
          }
          
          .loading-spinner {
            text-align: center;
            padding: 40px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }
          
          .loading-spinner p {
            color: #6c757d;
            margin: 0;
            font-size: 14px;
          }
          
          .spinner-border {
            width: 3rem;
            height: 3rem;
          }
        `}</style>
      </div>
    );
  }

  // If not logged in, don't render children (will redirect in useEffect)
  if (!isLoggedIn) {
    return null;
  }

  // If logged in, render the protected content
  return children;
};

export default CompanyAdminProtectedRoute; 