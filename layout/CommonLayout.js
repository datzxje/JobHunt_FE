"use client";

import Header from '@/components/home-7/Header';
import DashboardHeader from '@/components/header/DashboardHeader';
import MobileMenu from '@/components/header/MobileMenu';
import LoginPopup from '@/components/common/form/login/LoginPopup';
import FooterDefault from '@/components/footer/common-footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

const CommonLayout = ({ children }) => {
  const { isLoggedIn, initialized, loading } = useAuth();
  
  // Show a simple loading indicator if auth state is still loading
  if (loading) {
    return (
      <div className="page-wrapper">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <span className="header-span"></span>
      <LoginPopup />
      {initialized && isLoggedIn ? (
        <DashboardHeader />
      ) : (
        <Header />
      )}
      <MobileMenu />
      
      {children}
      
      <FooterDefault footerStyle="alternate3" />
    </>
  );
};

export default CommonLayout; 