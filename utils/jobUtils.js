import api from '@/utils/api';

// Job utility functions
export const jobUtils = {
  // Transform job data for display
  transformJobForDisplay: (job) => {
    if (!job) return null;
    
    return {
      ...job,
      salaryRange: job.salaryMin && job.salaryMax 
        ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`
        : job.salaryMin 
          ? `$${job.salaryMin.toLocaleString()}+`
          : 'Salary not specified',
      
      formattedLocation: [job.city, job.country].filter(Boolean).join(', ') || job.location,
      
      skillNames: job.requiredSkills?.map(skill => skill.name) || [],
      categoryNames: job.categories?.map(cat => cat.name) || [],
      languageNames: job.requiredLanguages?.map(lang => lang.name) || [],
      
      isDeadlinePassed: job.applicationDeadline 
        ? new Date(job.applicationDeadline) < new Date()
        : false,
      
      daysUntilDeadline: job.applicationDeadline
        ? Math.ceil((new Date(job.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24))
        : null
    };
  },

  // Get all form data for job posting
  async getJobFormData() {
    try {
      const [skillsData, categoriesData, languagesData] = await Promise.all([
        api.getJobFormDataSkills(),
        api.getJobFormDataCategories(),
        api.getJobFormDataLanguages()
      ]);

      return {
        skills: skillsData.data?.map(skill => ({ value: skill.id, label: skill.name })) || [],
        categories: categoriesData.data?.map(cat => ({ value: cat.id, label: cat.name })) || [],
        languages: languagesData.data?.map(lang => ({ value: lang.id, label: lang.name })) || []
      };
    } catch (error) {
      console.error('Error fetching job form data:', error);
      throw error;
    }
  },

  // Format employment type for display
  formatEmploymentType: (type) => {
    const typeMap = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time',
      'CONTRACT': 'Contract',
      'INTERNSHIP': 'Internship',
      'TEMPORARY': 'Temporary',
      'FREELANCER': 'Freelancer'
    };
    return typeMap[type] || type;
  },

  // Format gender preference for display
  formatGenderPreference: (preference) => {
    const preferenceMap = {
      'NO_PREFERENCE': 'No Preference',
      'MALE': 'Male',
      'FEMALE': 'Female',
      'OTHER': 'Other'
    };
    return preferenceMap[preference] || preference;
  },

  // Validate job form data
  validateJobData: (jobData) => {
    const errors = {};

    if (!jobData.title?.trim()) {
      errors.title = 'Job title is required';
    }

    if (!jobData.description?.trim()) {
      errors.description = 'Job description is required';
    }

    if (!jobData.requirements?.trim()) {
      errors.requirements = 'Job requirements are required';
    }

    if (!jobData.employmentType) {
      errors.employmentType = 'Employment type is required';
    }

    if (!jobData.experienceLevel) {
      errors.experienceLevel = 'Experience level is required';
    }

    if (!jobData.location?.trim()) {
      errors.location = 'Location is required';
    }

    if (jobData.salaryMin && jobData.salaryMax && jobData.salaryMin > jobData.salaryMax) {
      errors.salaryRange = 'Minimum salary cannot be greater than maximum salary';
    }

    if (jobData.minimumAge && jobData.maximumAge && jobData.minimumAge > jobData.maximumAge) {
      errors.ageRange = 'Minimum age cannot be greater than maximum age';
    }

    if (jobData.minimumExperienceYears && jobData.maximumExperienceYears && 
        jobData.minimumExperienceYears > jobData.maximumExperienceYears) {
      errors.experienceRange = 'Minimum experience cannot be greater than maximum experience';
    }

    if (jobData.applicationDeadline && new Date(jobData.applicationDeadline) <= new Date()) {
      errors.applicationDeadline = 'Application deadline must be in the future';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Search jobs with filters
  async searchJobs(filters = {}, page = 0, size = 10) {
    try {
      const params = {
        page,
        size,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      return await api.getJobs(params);
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  },

  // Get job with transformed data
  async getJobWithDetails(id) {
    try {
      const jobData = await api.getJob(id);
      return this.transformJobForDisplay(jobData.data);
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  // Apply for job with error handling
  async applyForJob(jobId) {
    try {
      const result = await api.applyForJob(jobId);
      return {
        success: true,
        message: 'Successfully applied for the job!',
        data: result.data
      };
    } catch (error) {
      console.error('Error applying for job:', error);
      return {
        success: false,
        message: error.message || 'Failed to apply for job',
        error
      };
    }
  },

  // Save job with error handling
  async saveJob(jobId) {
    try {
      const result = await api.saveJob(jobId);
      return {
        success: true,
        message: 'Job saved to your favorites!',
        data: result.data
      };
    } catch (error) {
      console.error('Error saving job:', error);
      return {
        success: false,
        message: error.message || 'Failed to save job',
        error
      };
    }
  },

  // Unsave job with error handling
  async unsaveJob(jobId) {
    try {
      const result = await api.unsaveJob(jobId);
      return {
        success: true,
        message: 'Job removed from favorites!',
        data: result.data
      };
    } catch (error) {
      console.error('Error unsaving job:', error);
      return {
        success: false,
        message: error.message || 'Failed to remove job from favorites',
        error
      };
    }
  },

  // Get saved jobs with pagination
  async getSavedJobs(page = 0, size = 10) {
    try {
      return await api.getSavedJobs({ page, size });
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // Format job posting date
  formatJobDate: (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Posted today';
    } else if (diffDays <= 7) {
      return `Posted ${diffDays} days ago`;
    } else if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Posted ${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  // Get job status color for UI
  getJobStatusColor: (job) => {
    if (!job.active) return 'gray';
    if (job.isDeadlinePassed) return 'red';
    if (job.daysUntilDeadline && job.daysUntilDeadline <= 3) return 'orange';
    return 'green';
  },

  // Generate job filters for search
  generateJobFilters: (searchParams) => {
    const filters = {};
    
    if (searchParams.keyword) filters.keyword = searchParams.keyword;
    if (searchParams.location) filters.location = searchParams.location;
    if (searchParams.jobType) filters.employmentType = searchParams.jobType;
    if (searchParams.experienceLevel) filters.experienceLevel = searchParams.experienceLevel;
    if (searchParams.salaryRange) filters.salaryRange = searchParams.salaryRange;
    if (searchParams.isRemote !== undefined) filters.isRemote = searchParams.isRemote;
    
    return filters;
  }
};

export default jobUtils; 