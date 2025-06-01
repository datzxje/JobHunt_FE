import axios from 'axios';

// Tạo instance riêng cho company admin API
const companyAdminAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/profile/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Helper function để lấy access token từ cookie
const getAccessTokenFromCookie = () => {
  if (typeof window === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const accessTokenCookie = cookies.find(cookie => 
    cookie.trim().startsWith('access_token=')
  );
  
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  
  return null;
};

// Request interceptor để thêm bearer token
companyAdminAxios.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromCookie();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url} with token:`, token ? 'Yes' : 'No');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor để xử lý lỗi
companyAdminAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      
      // Xử lý lỗi 401 cho company admin
      if (status === 401) {
        console.log('Company admin unauthorized access');
        // Chỉ redirect nếu không đang ở trang login
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/company-admin/login')) {
            window.location.href = '/company-admin/login?session=expired';
          }
        }
      }
      
      // Format error message
      const errorMessage = error.response.data?.message || 'An error occurred';
      error.message = errorMessage;
    }
    
    return Promise.reject(error);
  }
);

// Company Admin API endpoints
const companyAdminEndpoints = {
  // Auth
  login: '/company-admin/auth/login',
  logout: '/company-admin/auth/logout',
  me: '/auth/me',
  
  // Join Requests
  joinRequests: '/company-admin/join-requests',
  approveJoinRequest: (id) => `/company-admin/join-requests/${id}/approve`,
  rejectJoinRequest: (id) => `/company-admin/join-requests/${id}/reject`,
  
  // Team Members
  teamMembers: '/company-admin/team-members',
  teamMember: (id) => `/company-admin/team-members/${id}`,
  updateMemberRole: (id) => `/company-admin/team-members/${id}/role`,
  activateMember: (id) => `/company-admin/team-members/${id}/activate`,
  deactivateMember: (id) => `/company-admin/team-members/${id}/deactivate`,
  removeMember: (id) => `/company-admin/team-members/${id}`,
  transferAdmin: (id) => `/company-admin/team-members/${id}/transfer-admin`,
  
  // Company Profile
  companyProfile: '/company-admin/company-profile',
  updateCompanyProfile: '/company-admin/company-profile',
  
  // Dashboard Stats
  dashboardStats: '/company-admin/dashboard/stats',
};

// Company Admin API functions
const companyAdminApi = {
  // Auth
  login: async (credentials) => {
    try {
      console.log('Company Admin login attempt');
      const response = await companyAdminAxios.post(companyAdminEndpoints.login, credentials);
      console.log('Company Admin login successful:', response);
      return response;
    } catch (error) {
      console.error('Company Admin login error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.logout);
      return response;
    } catch (error) {
      console.error('Company Admin logout error:', error);
      throw error;
    }
  },
  
  getMe: async () => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.me);
      return response;
    } catch (error) {
      console.error('Company Admin getMe error:', error);
      throw error;
    }
  },
  
  // Join Requests
  getJoinRequests: async (params = {}) => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.joinRequests, { params });
      return response;
    } catch (error) {
      console.error('Get join requests error:', error);
      throw error;
    }
  },
  
  approveJoinRequest: async (requestId) => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.approveJoinRequest(requestId));
      return response;
    } catch (error) {
      console.error('Approve join request error:', error);
      throw error;
    }
  },
  
  rejectJoinRequest: async (requestId, reason = '') => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.rejectJoinRequest(requestId), { reason });
      return response;
    } catch (error) {
      console.error('Reject join request error:', error);
      throw error;
    }
  },
  
  // Team Members
  getTeamMembers: async (params = {}) => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.teamMembers, { params });
      return response;
    } catch (error) {
      console.error('Get team members error:', error);
      throw error;
    }
  },
  
  getTeamMember: async (memberId) => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.teamMember(memberId));
      return response;
    } catch (error) {
      console.error('Get team member error:', error);
      throw error;
    }
  },
  
  updateMemberRole: async (memberId, roleData) => {
    try {
      const response = await companyAdminAxios.put(companyAdminEndpoints.updateMemberRole(memberId), roleData);
      return response;
    } catch (error) {
      console.error('Update member role error:', error);
      throw error;
    }
  },
  
  activateMember: async (memberId) => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.activateMember(memberId));
      return response;
    } catch (error) {
      console.error('Activate member error:', error);
      throw error;
    }
  },
  
  deactivateMember: async (memberId) => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.deactivateMember(memberId));
      return response;
    } catch (error) {
      console.error('Deactivate member error:', error);
      throw error;
    }
  },
  
  removeMember: async (memberId) => {
    try {
      const response = await companyAdminAxios.delete(companyAdminEndpoints.removeMember(memberId));
      return response;
    } catch (error) {
      console.error('Remove member error:', error);
      throw error;
    }
  },
  
  transferAdmin: async (memberId) => {
    try {
      const response = await companyAdminAxios.post(companyAdminEndpoints.transferAdmin(memberId));
      return response;
    } catch (error) {
      console.error('Transfer admin error:', error);
      throw error;
    }
  },
  
  // Company Profile
  getCompanyProfile: async () => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.companyProfile);
      return response;
    } catch (error) {
      console.error('Get company profile error:', error);
      throw error;
    }
  },
  
  updateCompanyProfile: async (profileData) => {
    try {
      const response = await companyAdminAxios.put(companyAdminEndpoints.updateCompanyProfile, profileData);
      return response;
    } catch (error) {
      console.error('Update company profile error:', error);
      throw error;
    }
  },
  
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await companyAdminAxios.get(companyAdminEndpoints.dashboardStats);
      return response;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  },
};

export default companyAdminApi; 