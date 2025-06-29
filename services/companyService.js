import api from '../utils/api/api';

const companyService = {
  // Get all companies with pagination and filters
  getAllCompanies: async (params = {}) => {
    try {
      console.log('CompanyService: Fetching companies with params:', params);
      const response = await api.getCompanies(params);
      console.log('CompanyService: Get companies response:', response);
      return response;
    } catch (error) {
      console.error('CompanyService: Error fetching companies:', error);
      throw error;
    }
  },

  // Get single company by ID
  getCompany: async (id) => {
    try {
      console.log('CompanyService: Fetching company with ID:', id);
      const response = await api.getCompany(id);
      console.log('CompanyService: Get company response:', response);
      return response;
    } catch (error) {
      console.error('CompanyService: Error fetching company:', error);
      throw error;
    }
  },

  // Map API company data to UI format
  mapCompanyData: (apiCompany) => {
    return {
      id: parseInt(apiCompany.id),
      img: apiCompany.logoUrl || '/images/resource/company-logo/default.png',
      logoUrl: apiCompany.logoUrl,
      name: apiCompany.name,
      location: `${apiCompany.city}${apiCompany.country ? ', ' + apiCompany.country : ''}`,
      city: apiCompany.city,
      country: apiCompany.country,
      address: apiCompany.address,
      jobNumber: apiCompany.activeJobsCount || 0,
      jobType: apiCompany.industryType,
      industryType: apiCompany.industryType,
      phone: apiCompany.phoneNumber,
      email: apiCompany.email,
      website: apiCompany.websiteUrl,
      teamSize: apiCompany.teamSize,
      establishmentYear: apiCompany.establishmentYear,
      about: apiCompany.about,
      averageRating: apiCompany.averageRating || 0,
      totalReviews: apiCompany.totalReviews || 0,
      bgColor: `bg-clr-${(parseInt(apiCompany.id) % 4) + 1}`, // Generate color based on ID
      // For filters
      category: apiCompany.industryType,
      destination: {
        min: 0,
        max: 100
      },
      foundationDate: {
        min: apiCompany.establishmentYear || 1900,
        max: apiCompany.establishmentYear || 2024
      }
    };
  }
};

export default companyService; 