import axiosInstance from './axios';

// API endpoints
const endpoints = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  
  // Jobs
  jobs: '/jobs',
  job: (id) => `/jobs/${id}`,
  
  // Employers
  employers: '/employers',
  employer: (id) => `/employers/${id}`,
  
  // Candidates
  candidates: '/candidates',
  candidate: (id) => `/candidates/${id}`,
};

// API functions
const api = {
  // Auth
  login: (credentials) => axiosInstance.post(endpoints.login, credentials),
  register: (userData) => axiosInstance.post(endpoints.register, userData),
  logout: () => axiosInstance.post(endpoints.logout),
  
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
};

export default api; 