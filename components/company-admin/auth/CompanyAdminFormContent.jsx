'use client'

import { useState, useEffect } from "react";
import { useCompanyAdminAuth } from "../../../context/CompanyAdminAuthContext";
import { useRouter } from "next/navigation";
import api from "../../../utils/api/api";

const CompanyAdminFormContent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useCompanyAdminAuth();
  const router = useRouter();

  // Load remembered credentials when component mounts
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('companyAdminRememberedEmail');
    const rememberedPassword = localStorage.getItem('companyAdminRememberedPassword');
    const rememberMe = localStorage.getItem('companyAdminRememberMe') === 'true';
    
    if (rememberedEmail && rememberedPassword && rememberMe) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        password: rememberedPassword,
        rememberMe: true
      }));
      console.log("Loaded remembered company admin credentials");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin / Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Company admin login attempt with:", {
        email: formData.email,
        password: "***hidden***",
        rememberMe: formData.rememberMe
      });
      
      // Call the login API from utils/api/api.js
      const response = await api.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      console.log("Company admin login successful:", response);
      setLoginSuccess(true);
      
      // Handle "Remember me" functionality for company admin
      if (formData.rememberMe) {
        localStorage.setItem('companyAdminRememberedEmail', formData.email);
        localStorage.setItem('companyAdminRememberedPassword', formData.password);
        localStorage.setItem('companyAdminRememberMe', 'true');
        console.log("Company admin credentials saved for next login");
      } else {
        localStorage.removeItem('companyAdminRememberedEmail');
        localStorage.removeItem('companyAdminRememberedPassword');
        localStorage.removeItem('companyAdminRememberMe');
      }
      
      // Extract user and company data from response
      const userData = response.user || response.data?.user || {
        name: formData.email,
        email: formData.email,
        role: 'admin'
      };
      
      const companyData = response.company || response.data?.company || null;
      
      // Update auth context state
      await login(userData, companyData);
      
      // Redirect to company profile after successful login
      setTimeout(() => {
        router.push('/company-admin/company-profile');
      }, 1000);
      
    } catch (error) {
      console.error("Company admin login error:", error);
      
      // Handle different error types
      let errorMessage = "Đăng nhập thất bại / Login failed";
      
      if (error.response?.status === 401) {
        errorMessage = "Email hoặc mật khẩu không đúng / Invalid email or password";
      } else if (error.response?.status === 403) {
        errorMessage = "Bạn không có quyền truy cập quản trị / You don't have admin access";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <div className="text-center mb-4">
        <h3>Company Admin Login</h3>
        <p className="text-muted">Đăng nhập quản trị công ty / Company Administration Login</p>
      </div>

      {loginSuccess && (
        <div className="alert alert-success">
          <i className="icon-check"></i> Đăng nhập thành công! Đang chuyển hướng... / Login successful! Redirecting...
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <i className="icon-close"></i> {error}
        </div>
      )}

      {/* <!--Login Form--> */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Nhập email của bạn / Enter your email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* email */}

        <div className="form-group">
          <label>Mật khẩu / Password</label>
          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu / Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* password */}

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input 
                type="checkbox" 
                name="rememberMe" 
                id="companyAdminRemember" 
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="companyAdminRemember" className="remember">
                <span className="custom-checkbox"></span> Ghi nhớ đăng nhập / Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Quên mật khẩu? / Forgot password?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one w-100"
            type="submit"
            name="log-in"
            disabled={isLoading || loginSuccess}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang đăng nhập... / Logging in...
              </>
            ) : loginSuccess ? (
              <>
                <i className="icon-check me-2"></i>
                Đăng nhập thành công! / Logged in!
              </>
            ) : (
              "Đăng nhập / Log In"
            )}
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text text-center">
          <small className="text-muted">
            Chỉ dành cho quản trị viên công ty / For company administrators only
          </small>
        </div>
        <div className="divider">
          <span>Secure Login</span>
        </div>
        <div className="text-center">
          <small className="text-muted">
            🔒 Kết nối được bảo mật / Secure Connection
          </small>
        </div>
      </div>
      {/* End bottom-box */}
    </div>
  );
};

export default CompanyAdminFormContent; 