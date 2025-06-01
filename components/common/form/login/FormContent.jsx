'use client'

import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useRouter } from "next/navigation";
import api from "../../../../utils/api";

const FormContent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  // Load remembered credentials when component mounts
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberedEmail && rememberedPassword && rememberMe) {
      setFormData(prev => ({
        ...prev,
        email: rememberedEmail,
        password: rememberedPassword,
        rememberMe: true
      }));
      console.log("Loaded remembered credentials");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError("");
    setIsLoading(true);
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    try {
      console.log("Attempting API login with data:", {
        email: formData.email,
        password: "***hidden***",
        rememberMe: formData.rememberMe
      });
      
      // Call the login API - this will call http://localhost:8080/profile/api/v1/auth/login
      const response = await api.login({
        email: formData.email,
        password: formData.password,
        rememberMe: formData.rememberMe
      });
      
      console.log("Login successful:", response);
      setLoginSuccess(true);
      
      // Handle "Remember me" functionality
      if (formData.rememberMe) {
        // Store email and password in localStorage when remember me is checked
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
        localStorage.setItem('rememberMe', 'true');
        console.log("Credentials saved for next login");
      } else {
        // Clear remembered data if user unchecked "Remember me"
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
        localStorage.removeItem('rememberMe');
      }
      
      // Login with user data from API response
      // Extract user data from response.data if it exists
      const userData = response.user || response.data || {
        name: formData.email,
        email: formData.email,
        avatar: "/images/resource/candidate-1.png"
      };
      
      // This will update the auth context state
      login(userData);
      
      // Close modal if it's in a modal
      setTimeout(() => {
        try {
          if (window.bootstrap && window.bootstrap.Modal) {
            const modal = document.getElementById('loginPopupModal');
            if (modal) {
              const bsModal = window.bootstrap.Modal.getInstance(modal);
              if (bsModal) bsModal.hide();
            }
          }
          
          console.log("Reloading page...");
          // Use a forced hard reload to ensure everything is reset
          window.location.href = window.location.pathname + "?t=" + new Date().getTime();
        } catch (error) {
          console.error("Error during post-login process:", error);
          window.location.reload();
        }
      }, 1000);
      
    } catch (error) {
      console.error("Login error:", error);
      // Handle error
      const errorMessage = error.response?.data?.message || error.message || "Failed to login. Please check your credentials and try again.";
      setError(errorMessage);
      setLoginSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-inner">
      <h3>Login</h3>

      {loginSuccess && (
        <div className="alert alert-success">
          <i className="icon-check"></i> Login successful! Redirecting...
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
            placeholder="Enter your email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        {/* email */}

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
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
                id="remember" 
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Remember me
              </label>
            </div>
            <a href="#" className="pwd">
              Forgot password?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="submit"
            name="log-in"
            disabled={isLoading || loginSuccess}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : loginSuccess ? (
              <>
                <i className="icon-check me-2"></i>
                Logged in!
              </>
            ) : (
              "Log In"
            )}
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Don&apos;t have an account?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-toggle="modal"
            data-bs-target="#registerModal"
          >
            Signup
          </Link>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
