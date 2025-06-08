import axios from 'axios';
import api from './api';

// Tạo instance Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/profile/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = config.baseURL + config.url;
    console.log(`Making ${config.method.toUpperCase()} request to ${fullUrl}`);
    
    // Log query parameters if any
    if (config.params) {
      console.log('Request params:', config.params);
    }
        
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Log for login responses to see if cookies are being set
    const originalUrl = response.config?.url;
    if (originalUrl && originalUrl.includes('/auth/login')) {
      console.log('=== LOGIN RESPONSE DEBUG ===');
      console.log('Login successful, checking cookies...');
      
      // Small delay to ensure cookies are set before checking
      setTimeout(() => {
        console.log('Cookies after login (with delay):');
        console.log('document.cookie:', document.cookie);
        
        // Check if cookies exist in DevTools
        if (typeof window !== 'undefined') {
          console.log('Please check DevTools -> Application -> Cookies for:');
          console.log('- access_token (HttpOnly)');
          console.log('- refresh_token (HttpOnly)');
        }
      }, 100);
    }
    
    // Trả về dữ liệu từ response
    return response.data;
  },
  async (error) => {
    // Xử lý lỗi
    if (error.response) {
      // Lỗi từ server (có response)
      const { status, data } = error.response;
      
      // Xử lý lỗi 401 (Unauthorized)
      if (status === 401) {
        console.log('=== 401 UNAUTHORIZED DEBUG ===');
        console.log('Request URL:', error.config?.url);
        console.log('Current cookies:', document.cookie);
        console.log('Unauthorized access, trying to refresh token...');
        
        // Store the original request to retry after token refresh
        const originalRequest = error.config;
        
        // Check if this is a logout request - don't redirect if it is
        const isLogoutRequest = originalRequest.url && originalRequest.url.includes('/auth/logout');
        
        // Avoid infinite loops - only try to refresh once
        if (!originalRequest._retry && !isLogoutRequest) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            console.log('Attempting to refresh token...');
            await api.refreshToken();
            console.log('Token refresh successful, retrying original request');
            
            // If refresh successful, retry the original request
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            
            // Get the original error message from the refresh token response
            const refreshErrorMessage = refreshError.response?.data?.message || refreshError.message || '';
            const isNoRefreshTokenError = refreshErrorMessage.includes('No refresh token found') || 
                                        refreshError.response?.status === 400;
            
            if (isNoRefreshTokenError) {
              console.log('No refresh token found - user will stay on current page');
              
              // Preserve the original refresh error message for the calling context
              const preservedError = new Error(refreshErrorMessage || 'No refresh token found');
              preservedError.response = refreshError.response;
              throw preservedError;
            } else {
              console.log('Refresh token failed for other reason:', refreshErrorMessage);
              // For other refresh token errors, don't redirect yet - let the app handle it
              throw refreshError;
            }
          }
        } else if (isLogoutRequest) {
          // For logout requests, don't redirect - let the logout function handle it
          console.log('Logout request - not redirecting to login page');
        }
      }
      
      // Format error message
      const errorMessage = data?.message || 'An error occurred';
      error.message = errorMessage;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 