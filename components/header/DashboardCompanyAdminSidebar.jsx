'use client'

import Link from "next/link";
import companyAdminMenuData from "../../data/companyAdminMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useCompanyAdminAuth } from "../../context/CompanyAdminAuthContext";

import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { usePathname } from "next/navigation";
import "../../styles/company-admin.css";

const DashboardCompanyAdminSidebar = () => {
    const { menu } = useSelector((state) => state.toggle);
    const { user, company, logout, isAdmin, pendingRequestsCount } = useCompanyAdminAuth();

    const dispatch = useDispatch();
    // menu toggle handler
    const menuToggleHandler = () => {
        dispatch(menuToggle());
    };

    const handleLogout = async () => {
        if (confirm("Bạn có chắc chắn muốn đăng xuất? / Are you sure you want to logout?")) {
            await logout();
        }
    };

    return (
        <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
            {/* Start sidebar close icon */}
            <div className="pro-header text-end pb-0 mb-0 show-1023">
                <div className="fix-icon" onClick={menuToggleHandler}>
                    <span className="flaticon-close"></span>
                </div>
            </div>
            {/* End sidebar close icon */}

            <div className="sidebar-inner">
                {/* Company Admin Badge */}
                <div className="company-admin-badge">
                    <div className="badge-content">
                        <div className="user-avatar">
                            <img 
                                src={user?.avatar || "/images/resource/candidate-1.png"} 
                                alt={user?.name || "Admin"}
                                className="avatar-img"
                            />
                        </div>
                        <span className="icon la la-shield"></span>
                        <div className="text">
                            <h6>
                                {user?.name || "Company Admin"}
                                {isAdmin() && <span className="admin-badge">Admin</span>}
                            </h6>
                            <p>{company?.name || "Company Portal"}</p>
                            <small className="user-email">{user?.email}</small>
                        </div>
                    </div>
                </div>

                <ul className="navigation">
                    {companyAdminMenuData.map((item) => (
                        <li
                            className={`${
                                isActiveLink(item.routePath, usePathname())
                                    ? "active"
                                    : ""
                            } mb-1`}
                            key={item.id}
                            onClick={menuToggleHandler}
                        >
                            <Link href={item.routePath}>
                                <i className={`la ${item.icon}`}></i>{" "}
                                {item.name}
                                {item.id === 2 && pendingRequestsCount > 0 && (
                                    <span className="nav-badge">{pendingRequestsCount}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                    
                    {/* Logout Button */}
                    <li className="logout-item">
                        <button 
                            onClick={handleLogout}
                            className="logout-btn"
                            type="button"
                        >
                            <i className="la la-sign-out"></i>
                            Đăng xuất / Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardCompanyAdminSidebar;