import { api } from '@/utils/api';

export const jobService = {
  // Job CRUD operations
  async createJob(jobData) {
    try {
      const response = await api.createJob(jobData);
      return response;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  async updateJob(id, jobData) {
    try {
      const response = await api.updateJob(id, jobData);
      return response;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  async deleteJob(id) {
    try {
      const response = await api.deleteJob(id);
      return response;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  async getJob(id) {
    try {
      const response = await api.getJob(id);
      return response;
    } catch (error) {
      console.error('Error getting job:', error);
      throw error;
    }
  },

  async getJobs(params = {}) {
    try {
      const response = await api.getJobs(params);
      return response;
    } catch (error) {
      console.error('Error getting jobs:', error);
      throw error;
    }
  },

  async searchJobs(searchParams = {}) {
    try {
      // Map frontend params to backend API format
      const apiParams = {
        keyword: searchParams.keyword || undefined,
        location: searchParams.location || undefined,
        employmentType: searchParams.employmentType || undefined,
        experienceLevel: searchParams.experienceLevel || undefined,
        isRemote: searchParams.isRemote || undefined,
        city: searchParams.city || undefined,
        category: searchParams.category || undefined,
        skill: searchParams.skill || undefined,
        minSalary: searchParams.minSalary || undefined,
        maxSalary: searchParams.maxSalary || undefined,
        page: searchParams.page || 0,
        size: searchParams.size || 10
      };

      // Remove undefined values to avoid sending empty params
      Object.keys(apiParams).forEach(key => 
        apiParams[key] === undefined && delete apiParams[key]
      );

      console.log('Searching jobs with mapped params:', apiParams);
      const response = await api.searchJobs(apiParams);
      return response;
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // Job Requirements are now handled as JSON strings in job creation/update
  // No separate API endpoints needed

  // Form data endpoints
  async getFormData() {
    try {
      const [skillsResponse, categoriesResponse, languagesResponse] = await Promise.all([
        api.axiosInstance.get('/jobs/form-data/skills'),
        api.axiosInstance.get('/jobs/form-data/categories'),
        api.axiosInstance.get('/jobs/form-data/languages')
      ]);

      return {
        skills: skillsResponse.data?.data || [],
        categories: categoriesResponse.data?.data || [],
        languages: languagesResponse.data?.data || []
      };
    } catch (error) {
      console.error('Error getting form data:', error);
      throw error;
    }
  }
};

export default jobService; 