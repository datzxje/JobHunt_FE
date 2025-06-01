'use client'

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { employerMenuData, candidatesMenuData } from "../../data/menuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const DashboardHeader = () => {
    const [navbar, setNavbar] = useState(false);
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const changeBackground = () => {
        if (window.scrollY >= 0) {
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

    const handleLogout = () => {
        console.log("🔘 DashboardHeader handleLogout clicked");
        console.log("🔘 About to call logout() function");
        logout();
        console.log("🔘 logout() function called");
    };

    return (
        // <!-- Main Header-->
        <header
            className={`main-header header-shaddow  ${
                navbar ? "fixed-header " : ""
            }`}
        >
            <div className="container-fluid">
                {/* <!-- Main box --> */}
                <div className="main-box">
                    {/* <!--Nav Outer --> */}
                    <div className="nav-outer">
                        <div className="logo-box">
                            <div className="logo">
                                <Link href="/">
                                    <Image
                                        alt="brand"
                                        src="/images/logo.svg"
                                        width={154}
                                        height={50}
                                        priority
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
                                            isActiveLink(
                                                item.routePath,
                                                pathname
                                            )
                                                ? "active"
                                                : ""
                                        } mb-1`}
                                        key={item.id}
                                    >
                                        <Link href={item.routePath}>
                                            <i
                                                className={`la ${item.icon}`}
                                            ></i>{" "}
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="mb-1">
                                    <button onClick={handleLogout} className="dropdown-item">
                                        <i className="la la-sign-out"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                        {/* End dropdown */}
                    </div>
                    {/* End outer-box */}
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;