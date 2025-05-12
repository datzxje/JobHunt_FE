"use client";

import Header from '@/components/home-7/Header';
import MobileMenu from '@/components/header/MobileMenu';
import LoginPopup from '@/components/common/form/login/LoginPopup';
import FooterDefault from '@/components/footer/common-footer';

const CommonLayout = ({ children }) => {
  return (
    <>
      <span className="header-span"></span>
      <LoginPopup />
      <Header />
      <MobileMenu />
      
      {children}
      
      <FooterDefault footerStyle="alternate3" />
    </>
  );
};

export default CommonLayout; 