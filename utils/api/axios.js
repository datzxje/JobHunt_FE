import axios from 'axios';

// Tạo instance Axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Interceptor xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (nếu có)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Đính kèm token vào header nếu có
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý response
axiosInstance.interceptors.response.use(
  (response) => {
    // Trả về dữ liệu từ response
    return response.data;
  },
  (error) => {
    // Xử lý lỗi
    if (error.response) {
      // Lỗi từ server (có response)
      const { status } = error.response;
      
      // Xử lý lỗi 401 (Unauthorized)
      if (status === 401) {
        // Xóa token và redirect về trang login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          // Thêm redirect nếu cần
          // window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 