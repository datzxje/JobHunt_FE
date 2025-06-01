'use client'

import { useEffect } from "react";
import CompanyAdminFormContent from "../../../components/company-admin/auth/CompanyAdminFormContent";

const CompanyAdminLoginPage = () => {
  // Set document title since we can't use metadata in client components
  useEffect(() => {
    document.title = "Company Admin Login || JobHunt - Job Board React NextJS Template";
  }, []);

  return (
    <div className="company-admin-login-page">
      {/* <!-- Login Section --> */}
      <section className="login-section">
        <div className="login-form-container">
          <div className="auto-container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="login-modal-content">
                  <div className="modal-body">
                    <div id="login-modal">
                      <div className="login-form default-form">
                        <CompanyAdminFormContent />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-6 col-md-4 d-none d-lg-block">
                <div className="info-section">
                  <div className="content">
                    <div className="logo">
                      <img src="/images/logo.svg" alt="JobHunt" />
                    </div>
                    <h2>Company Administration Portal</h2>
                    <div className="text">
                      Chào mừng đến với cổng quản trị công ty JobHunt. 
                      Đăng nhập để quản lý nhóm, yêu cầu tham gia và 
                      thông tin công ty của bạn.
                    </div>
                    <div className="text mt-3">
                      Welcome to JobHunt Company Administration Portal. 
                      Login to manage your team, join requests, and 
                      company information.
                    </div>
                    
                    <div className="features mt-4">
                      <div className="feature-item">
                        <i className="la la-users"></i>
                        <span>Quản lý thành viên nhóm / Team Management</span>
                      </div>
                      <div className="feature-item">
                        <i className="la la-user-check"></i>
                        <span>Duyệt yêu cầu tham gia / Approve Join Requests</span>
                      </div>
                      <div className="feature-item">
                        <i className="la la-building"></i>
                        <span>Quản lý thông tin công ty / Company Profile</span>
                      </div>
                      <div className="feature-item">
                        <i className="la la-chart-bar"></i>
                        <span>Thống kê và báo cáo / Analytics & Reports</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--End Login Section --> */}
    </div>
  );
};

export default CompanyAdminLoginPage; 