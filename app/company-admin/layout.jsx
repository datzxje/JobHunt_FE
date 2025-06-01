'use client'

import { CompanyAdminAuthProvider } from '../../context/CompanyAdminAuthContext';
import CompanyAdminProtectedRoute from '../../components/company-admin/auth/CompanyAdminProtectedRoute';
import { usePathname } from 'next/navigation';

export default function CompanyAdminLayout({ children }) {
  const pathname = usePathname();
  
  // Don't protect the login page
  const isLoginPage = pathname === '/company-admin/login';

  return (
    <CompanyAdminAuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <CompanyAdminProtectedRoute>
          {children}
        </CompanyAdminProtectedRoute>
      )}
    </CompanyAdminAuthProvider>
  );
} 