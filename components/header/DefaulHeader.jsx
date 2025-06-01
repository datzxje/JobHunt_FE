'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "./HeaderNavContent";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { employerMenuData, candidatesMenuData } from "../../data/menuData";
import { usePathname } from "next/navigation";
import { isActiveLink } from "../../utils/linkActiveChecker";

const DefaulHeader = () => {
  const [navbar, setNavbar] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const pathname = usePathname();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  // Determine which menu to show based on user role
  const getMenuData = () => {
    if (!user) return [];
    
    const userRole = user.role || user.userType || 'CANDIDATE';
    
    if (userRole.toUpperCase() === 'EMPLOYER') {
      return employerMenuData;
    } else {
      return candidatesMenuData;
    }
  };

  const currentMenuData = getMenuData();

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.firstname && user?.lastname) return `${user.firstname} ${user.lastname}`;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    return "My Account";
  };

  return (
    // <!-- Main Header-->
    <header
      className={`main-header  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      {/* <!-- Main box --> */}
      <div className="main-box">
        {/* <!--Nav Outer --> */}
        <div className="nav-outer">
          <div className="logo-box">
            <div className="logo">
              <Link href="/">
                <Image
                  width={154}
                  height={50}
                  src="/images/logo.svg"
                  alt="brand"
                />
              </Link>
            </div>
          </div>
          {/* End .logo-box */}

          <HeaderNavContent />
          {/* <!-- Main Menu End--> */}
        </div>
        {/* End .nav-outer */}

        <div className="outer-box">
          {isLoggedIn ? (
            // Show Dashboard Header elements when logged in
            <>
              <button className="menu-btn">
                <span className="count">1</span>
                <span className="icon la la-heart-o"></span>
              </button>
              {/* wishlisted menu */}

              <button className="menu-btn">
                <span className="icon la la-bell"></span>
              </button>
              {/* End notification-icon */}

              {/* <!-- Dashboard Option --> */}
              <div className="dropdown dashboard-option">
                <a
                  className="dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <Image
                    alt="avatar"
                    className="thumb"
                    src={user?.avatar || "/images/resource/company-6.png"}
                    width={50}
                    height={50}
                  />
                  <span className="name">
                    {getUserDisplayName()}
                    {user?.role && (
                      <small className="d-block text-muted" style={{fontSize: '10px'}}>
                        {user.role.toLowerCase()}
                      </small>
                    )}
                  </span>
                </a>

                <ul className="dropdown-menu">
                  {currentMenuData?.filter(item => item.name !== 'Logout' && item.name !== 'Delete Profile').map((item) => (
                    <li
                      className={`${
                        isActiveLink(item.routePath, pathname) ? "active" : ""
                      } mb-1`}
                      key={item.id}
                    >
                      <Link href={item.routePath}>
                        <i className={`la ${item.icon}`}></i> {item.name}
                      </Link>
                    </li>
                  ))}
                  <li className="mb-1">
                    <button onClick={logout} className="dropdown-item">
                      <i className="la la-sign-out"></i> Logout
                    </button>
                  </li>
                </ul>
              </div>
              {/* End dropdown */}
            </>
          ) : (
            // Show Login/Register buttons when not logged in
            <div className="btn-box">
              <a
                href="#"
                className="theme-btn btn-style-three call-modal"
                data-bs-toggle="modal"
                data-bs-target="#loginPopupModal"
              >
                Login / Register
              </a>
              <Link
                href="/employers-dashboard/post-jobs"
                className="theme-btn btn-style-one"
              >
                Job Post
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DefaulHeader;
