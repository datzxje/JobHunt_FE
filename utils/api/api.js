import axiosInstance from './axios';

// API endpoints
const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/signup',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh-token',
  me: '/auth/me', 
  
  // Jobs
  jobs: '/jobs',
  job: (id) => `/jobs/${id}`,
  
  // Employers
  employers: '/employers',
  employer: (id) => `/employers/${id}`,
  
  // Candidates
  candidates: '/candidates',
  candidate: (id) => `/candidates/${id}`,
  
  // Company Admin - Join Requests
  companyAdminJoinRequests: '/company-admin/join-requests',
  companyAdminJoinRequest: (id) => `/company-admin/join-requests/${id}`,
  approveJoinRequest: (id) => `/company-admin/join-requests/${id}/approve`,
  rejectJoinRequest: (id) => `/company-admin/join-requests/${id}/reject`,
  
  // Company Admin - Team Members  
  companyAdminTeamMembers: '/company-admin/team-members',
  companyAdminTeamMember: (id) => `/company-admin/team-members/${id}`,
  transferAdminRights: (id) => `/company-admin/team-members/${id}/transfer-admin`,
  toggleMemberStatus: (id) => `/company-admin/team-members/${id}/toggle-status`,
  
  // Company Admin - Stats
  companyAdminStats: '/company-admin/stats',
  companyAdminTeamStats: '/company-admin/team-stats',
  myManagedCompanies: '/company-admin/my-companies',
  checkMembership: '/company-admin/check-membership',

  // Company
  company: (id) => `/companies/${id}`,
  companies: '/companies'
};

// API functions
const api = {
  // Auth
  login: async (credentials) => {
    try {
      console.log('Calling login API with endpoint:', endpoints.login);
      console.log('Full URL will be:', axiosInstance.defaults.baseURL + endpoints.login);
      const response = await axiosInstance.post(endpoints.login, credentials);
      console.log('Login API response:', response);
      return response;
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  register: async (userData) => {
    try {
      console.log('Calling register API with endpoint:', endpoints.register);
      console.log('Full URL will be:', axiosInstance.defaults.baseURL + endpoints.register);
      console.log('Register data:', {
        ...userData,
        password: "***hidden***",
        confirmPassword: "***hidden***"
      });
      const response = await axiosInstance.post(endpoints.register, userData);
      console.log('Register API response:', response);
      return response;
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },
  logout: () => axiosInstance.post(endpoints.logout),
  refreshToken: () => axiosInstance.post(endpoints.refreshToken),
  getMe: () => axiosInstance.get(endpoints.me),
  
  // Jobs
  getJobs: (params) => axiosInstance.get(endpoints.jobs, { params }),
  getJob: (id) => axiosInstance.get(endpoints.job(id)),
  createJob: (jobData) => axiosInstance.post(endpoints.jobs, jobData),
  updateJob: (id, jobData) => axiosInstance.put(endpoints.job(id), jobData),
  deleteJob: (id) => axiosInstance.delete(endpoints.job(id)),
  
  // Employers
  getEmployers: (params) => axiosInstance.get(endpoints.employers, { params }),
  getEmployer: (id) => axiosInstance.get(endpoints.employer(id)),
  
  // Candidates
  getCandidates: (params) => axiosInstance.get(endpoints.candidates, { params }),
  getCandidate: (id) => axiosInstance.get(endpoints.candidate(id)),
  
  // Company Admin - Join Requests
  getJoinRequests: async (companyId, params = {}) => {
    try {
      const response = await axiosInstance.get(endpoints.companyAdminJoinRequests, { 
        params: { companyId, ...params } 
      });
      return response;
    } catch (error) {
      console.error('Get join requests error:', error);
      throw error;
    }
  },
  
  getJoinRequest: async (id) => {
    try {
      const response = await axiosInstance.get(endpoints.companyAdminJoinRequest(id));
      return response;
    } catch (error) {
      console.error('Get join request error:', error);
      throw error;
    }
  },
  
  approveJoinRequest: async (id, reviewerId) => {
    try {
      const response = await axiosInstance.put(endpoints.approveJoinRequest(id), null, {
        params: { reviewerId }
      });
      return response;
    } catch (error) {
      console.error('Approve join request error:', error);
      throw error;
    }
  },
  
  rejectJoinRequest: async (id, reviewerId) => {
    try {
      const response = await axiosInstance.put(endpoints.rejectJoinRequest(id), null, {
        params: { reviewerId }
      });
      return response;
    } catch (error) {
      console.error('Reject join request error:', error);
      throw error;
    }
  },
  
  // Company Admin - Team Members
  getTeamMembers: async (companyId, params = {}) => {
    try {
      console.log('Calling getTeamMembers with:', { companyId, params });
      const response = await axiosInstance.get(endpoints.companyAdminTeamMembers, { 
        params: { 
          companyId,
          ...params 
        } 
      });
      console.log('Team members API response:', response);
      
      // Extract data from response - the members array is in response.data
      const responseData = response?.data || [];
      console.log('Extracted team members data:', responseData);
      return responseData;
    } catch (error) {
      console.error('Get team members error:', error);
      throw error;
    }
  },
  
  getTeamMember: async (id) => {
    try {
      const response = await axiosInstance.get(endpoints.companyAdminTeamMember(id));
      return response;
    } catch (error) {
      console.error('Get team member error:', error);
      throw error;
    }
  },
  
  updateTeamMember: async (id, updateData) => {
    try {
      const response = await axiosInstance.put(endpoints.companyAdminTeamMember(id), updateData);
      return response;
    } catch (error) {
      console.error('Update team member error:', error);
      throw error;
    }
  },
  
  transferAdminRights: async (memberId, currentAdminId, companyId) => {
    try {
      const response = await axiosInstance.put(endpoints.transferAdminRights(memberId), null, {
        params: { currentAdminId, companyId }
      });
      return response;
    } catch (error) {
      console.error('Transfer admin rights error:', error);
      throw error;
    }
  },
  
  toggleMemberStatus: async (id) => {
    try {
      const response = await axiosInstance.put(endpoints.toggleMemberStatus(id));
      return response;
    } catch (error) {
      console.error('Toggle member status error:', error);
      throw error;
    }
  },
  
  removeTeamMember: async (id) => {
    try {
      const response = await axiosInstance.delete(endpoints.companyAdminTeamMember(id));
      return response;
    } catch (error) {
      console.error('Remove team member error:', error);
      throw error;
    }
  },
  
  // Company Admin - Stats
  getCompanyAdminStats: async (companyId) => {
    try {
      const response = await axiosInstance.get(endpoints.companyAdminStats, {
        params: { companyId }
      });
      return response;
    } catch (error) {
      console.error('Get company admin stats error:', error);
      throw error;
    }
  },
  
  getTeamStats: async (companyId) => {
    try {
      const response = await axiosInstance.get(endpoints.companyAdminTeamStats, {
        params: { companyId }
      });
      return response;
    } catch (error) {
      console.error('Get team stats error:', error);
      throw error;
    }
  },
  
  getMyManagedCompanies: async () => {
    try {
      const response = await axiosInstance.get(endpoints.myManagedCompanies);
      return response;
    } catch (error) {
      console.error('Get managed companies error:', error);
      throw error;
    }
  },
  
  checkMembership: async (userId, companyId) => {
    try {
      const response = await axiosInstance.get(endpoints.checkMembership, {
        params: { userId, companyId }
      });
      return response;
    } catch (error) {
      console.error('Check membership error:', error);
      throw error;
    }
  },
};

export default api; 