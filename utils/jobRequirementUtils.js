import api from './api';

// Map frontend requirement types to backend enum values
const REQUIREMENT_TYPE_MAPPING = {
  'experience': 'EXPERIENCE',
  'age': 'AGE', 
  'education': 'EDUCATION',
  'skills': 'SKILLS',
  'languages': 'LANGUAGES',
  'salary': 'SALARY'
};

const jobRequirementUtils = {
  // Transform frontend requirements data to backend format
  transformRequirementsToAPI: (requirements) => {
    return requirements.map(requirement => {
      const { type, data } = requirement;
      const backendType = REQUIREMENT_TYPE_MAPPING[type];
      
      if (!backendType) {
        console.warn(`Unknown requirement type: ${type}`);
        return null;
      }

      // Transform criteria data based on type
      let criteriaData = {};
      let description = '';

      switch (type) {
        case 'experience':
          criteriaData = {
            minExperience: data.minExperience || null,
            maxExperience: data.maxExperience || null
          };
          description = `Experience: ${data.minExperience || 'No min'} - ${data.maxExperience || 'No max'}`;
          break;

        case 'age':
          criteriaData = {
            minAge: data.minAge ? parseInt(data.minAge) : null,
            maxAge: data.maxAge ? parseInt(data.maxAge) : null
          };
          description = `Age: ${data.minAge || 'No min'} - ${data.maxAge || 'No max'}`;
          break;

        case 'education':
          criteriaData = {
            minEducation: data.minEducation || null
          };
          description = `Education: ${data.minEducation || 'No requirement'}`;
          break;

        case 'skills':
          const skillIds = data.skills ? data.skills.map(skill => skill.value) : [];
          const skillNames = data.skills ? data.skills.map(skill => skill.label) : [];
          criteriaData = {
            requiredSkillIds: skillIds,
            requiredSkillNames: skillNames
          };
          description = `Skills: ${skillNames.join(', ') || 'No skills specified'}`;
          break;

        case 'languages':
          const languageIds = data.languages ? data.languages.map(lang => lang.value) : [];
          const languageNames = data.languages ? data.languages.map(lang => lang.label) : [];
          criteriaData = {
            requiredLanguageIds: languageIds,
            requiredLanguageNames: languageNames
          };
          description = `Languages: ${languageNames.join(', ') || 'No languages specified'}`;
          break;

        case 'salary':
          criteriaData = {
            minSalary: data.minSalary || null,
            maxSalary: data.maxSalary || null
          };
          description = `Salary: ${data.minSalary || 'No min'} - ${data.maxSalary || 'No max'}`;
          break;

        default:
          criteriaData = data;
          description = `${type} requirement`;
      }

      return {
        type: backendType,
        weight: parseInt(data.weight) || 5,
        isMandatory: data.isMandatory || false,
        criteriaData: JSON.stringify(criteriaData),
        description: description
      };
    }).filter(req => req !== null);
  },

  // Save job requirements to backend
  saveJobRequirements: async (jobId, requirements) => {
    try {
      if (!requirements || requirements.length === 0) {
        console.log('No requirements to save');
        return { success: true, data: [] };
      }

      // Transform requirements to API format
      const apiRequirements = jobRequirementUtils.transformRequirementsToAPI(requirements);
      
      if (apiRequirements.length === 0) {
        console.log('No valid requirements to save after transformation');
        return { success: true, data: [] };
      }

      console.log('Saving job requirements:', {
        jobId,
        requirements: apiRequirements
      });

      // Use bulk create API
      const response = await api.createJobRequirementsBulk(jobId, apiRequirements);
      
      console.log('Job requirements saved successfully:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error saving job requirements:', error);
      throw new Error(`Failed to save job requirements: ${error.message}`);
    }
  },

  // Load job requirements from backend
  loadJobRequirements: async (jobId) => {
    try {
      const response = await api.getJobRequirements(jobId);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error loading job requirements:', error);
      throw new Error(`Failed to load job requirements: ${error.message}`);
    }
  },

  // Delete all job requirements
  deleteAllJobRequirements: async (jobId) => {
    try {
      // Note: This would need to be implemented on backend as DELETE /jobs/{jobId}/requirements/all
      // For now, we'll get all requirements and delete them individually
      const requirementsResponse = await api.getJobRequirements(jobId);
      const requirements = requirementsResponse.data;

      const deletePromises = requirements.map(req => 
        api.deleteJobRequirement(jobId, req.id)
      );

      await Promise.all(deletePromises);
      return { success: true };
    } catch (error) {
      console.error('Error deleting job requirements:', error);
      throw new Error(`Failed to delete job requirements: ${error.message}`);
    }
  },

  // Transform backend requirements to frontend format (for editing)
  transformRequirementsFromAPI: (apiRequirements, skills = [], languages = []) => {
    return apiRequirements.map(req => {
      const frontendType = Object.keys(REQUIREMENT_TYPE_MAPPING).find(
        key => REQUIREMENT_TYPE_MAPPING[key] === req.type
      );

      if (!frontendType) {
        console.warn(`Unknown backend requirement type: ${req.type}`);
        return null;
      }

      let data = { weight: req.weight.toString() };
      
      try {
        const criteriaData = JSON.parse(req.criteriaData || '{}');
        
        switch (frontendType) {
          case 'experience':
            data.minExperience = criteriaData.minExperience || '';
            data.maxExperience = criteriaData.maxExperience || '';
            break;

          case 'age':
            data.minAge = criteriaData.minAge ? criteriaData.minAge.toString() : '';
            data.maxAge = criteriaData.maxAge ? criteriaData.maxAge.toString() : '';
            break;

          case 'education':
            data.minEducation = criteriaData.minEducation || '';
            break;

          case 'skills':
            // Map skill IDs back to skill objects
            if (criteriaData.requiredSkillIds) {
              data.skills = skills.filter(skill => 
                criteriaData.requiredSkillIds.includes(skill.value)
              );
            } else {
              data.skills = [];
            }
            break;

          case 'languages':
            // Map language IDs back to language objects
            if (criteriaData.requiredLanguageIds) {
              data.languages = languages.filter(lang => 
                criteriaData.requiredLanguageIds.includes(lang.value)
              );
            } else {
              data.languages = [];
            }
            break;

          case 'salary':
            data.minSalary = criteriaData.minSalary || '';
            data.maxSalary = criteriaData.maxSalary || '';
            break;
        }
      } catch (error) {
        console.error('Error parsing criteria data:', error);
      }

      return {
        id: req.id,
        type: frontendType,
        data: data
      };
    }).filter(req => req !== null);
  },

  // Validate requirements data
  validateRequirements: (requirements) => {
    const errors = [];

    requirements.forEach((req, index) => {
      const { type, data } = req;

      // Check if weight is valid
      const weight = parseInt(data.weight);
      if (!weight || weight < 1 || weight > 10) {
        errors.push(`Requirement ${index + 1}: Weight must be between 1 and 10`);
      }

      // Type-specific validation
      switch (type) {
        case 'experience':
          if (data.minExperience && data.maxExperience) {
            // Could add logic to validate min < max
          }
          break;

        case 'age':
          if (data.minAge && data.maxAge) {
            const minAge = parseInt(data.minAge);
            const maxAge = parseInt(data.maxAge);
            if (minAge >= maxAge) {
              errors.push(`Requirement ${index + 1}: Minimum age must be less than maximum age`);
            }
          }
          break;

        case 'skills':
          if (!data.skills || data.skills.length === 0) {
            errors.push(`Requirement ${index + 1}: At least one skill must be selected`);
          }
          break;

        case 'languages':
          if (!data.languages || data.languages.length === 0) {
            errors.push(`Requirement ${index + 1}: At least one language must be selected`);
          }
          break;
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
};

export default jobRequirementUtils; 