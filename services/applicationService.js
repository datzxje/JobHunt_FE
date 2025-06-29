import { api } from '@/utils/api';

export const applicationService = {
  // Apply for a job with CV upload
  async applyForJob(applicationData, cvFile) {
    try {
      const formData = new FormData();
      
      // Add application data
      const applicationRequest = {
        jobId: applicationData.jobId,
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary,
        candidateProfile: JSON.stringify(applicationData.candidateProfile)
      };
      
      formData.append('application', new Blob([JSON.stringify(applicationRequest)], {
        type: 'application/json'
      }));
      
      // Add CV file
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await api.axiosInstance.post('/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Apply for a job (simple version without CV upload)
  async simpleApplyForJob(jobId) {
    try {
      const response = await api.axiosInstance.post(`/jobs/${jobId}/apply`);
      return response.data;
    } catch (error) {
      console.error('Error applying for job:', error);
      throw error;
    }
  },

  // Get user's applications
  async getMyApplications(page = 0, size = 10) {
    try {
      const response = await api.axiosInstance.get('/applications/my-applications', {
        params: { page, size, sort: 'createdAt,desc' }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting my applications:', error);
      throw error;
    }
  },

  // Get applied jobs
  async getAppliedJobs(page = 0, size = 10) {
    try {
      const response = await api.axiosInstance.get('/jobs/applied', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting applied jobs:', error);
      throw error;
    }
  },

  // Get single application
  async getApplication(applicationId) {
    try {
      const response = await api.axiosInstance.get(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting application:', error);
      throw error;
    }
  },

  // Update application
  async updateApplication(applicationId, applicationData, cvFile = null) {
    try {
      const formData = new FormData();
      
      // Add application update data
      const applicationRequest = {
        coverLetter: applicationData.coverLetter,
        expectedSalary: applicationData.expectedSalary,
        candidateProfile: JSON.stringify(applicationData.candidateProfile)
      };
      
      formData.append('application', new Blob([JSON.stringify(applicationRequest)], {
        type: 'application/json'
      }));
      
      // Add CV file if provided
      if (cvFile) {
        formData.append('cv', cvFile);
      }

      const response = await api.axiosInstance.put(`/applications/${applicationId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Withdraw application
  async withdrawApplication(applicationId) {
    try {
      const response = await api.axiosInstance.delete(`/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  },

  // Get job applications (for employers)
  async getJobApplications(jobId, page = 0, size = 10) {
    try {
      const response = await api.axiosInstance.get(`/applications/job/${jobId}`, {
        params: { page, size, sort: 'createdAt,desc' }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting job applications:', error);
      throw error;
    }
  },

  // Update application status (for employers)
  async updateApplicationStatus(applicationId, status, rejectionReason = null) {
    try {
      const params = { status };
      if (rejectionReason) {
        params.rejectionReason = rejectionReason;
      }
      
      const response = await api.axiosInstance.put(
        `/applications/${applicationId}/status`,
        null,
        { params }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Schedule interview (for employers)
  async scheduleInterview(applicationId, interviewData) {
    try {
      const response = await api.axiosInstance.post(
        `/applications/${applicationId}/interview`,
        null,
        {
          params: {
            interviewDate: interviewData.interviewDate,
            interviewLocation: interviewData.interviewLocation
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error scheduling interview:', error);
      throw error;
    }
  },

  // Add interview notes (for employers)
  async addInterviewNotes(applicationId, notes) {
    try {
      const response = await api.axiosInstance.post(
        `/applications/${applicationId}/interview-notes`,
        null,
        { params: { notes } }
      );
      return response.data;
    } catch (error) {
      console.error('Error adding interview notes:', error);
      throw error;
    }
  },

  // Get ranked applications for a job (for employers)
  async getRankedApplications(jobId) {
    try {
      const response = await api.axiosInstance.get(`/jobs/${jobId}/applications/ranked`);
      return response.data;
    } catch (error) {
      console.error('Error getting ranked applications:', error);
      throw error;
    }
  },

  // Save job
  async saveJob(jobId) {
    try {
      const response = await api.axiosInstance.post(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Unsave job
  async unsaveJob(jobId) {
    try {
      const response = await api.axiosInstance.delete(`/jobs/${jobId}/save`);
      return response.data;
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },

  // Get saved jobs
  async getSavedJobs(page = 0, size = 10) {
    try {
      const response = await api.axiosInstance.get('/jobs/saved', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Error getting saved jobs:', error);
      throw error;
    }
  }
};

export default applicationService; 