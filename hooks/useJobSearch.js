import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import jobService from '../services/jobService';

export const useJobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0
  });
  const [initialized, setInitialized] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const { jobList } = useSelector((state) => state.filter);
  
  console.log('useJobSearch hook render, jobList:', jobList);

  // Search function
  const searchJobs = useCallback(async (page = 0, size = 10) => {
    try {
      console.log(`🔍 searchJobs called with page: ${page}, size: ${size}`);
      setLoading(true);
      setError(null);

      // Check if salary range is different from default (0-10000)
      const isDefaultSalaryRange = jobList.salary?.min === 0 && jobList.salary?.max === 10000;
      
      // Build search parameters from Redux state
      const searchParams = {
        keyword: jobList.keyword || undefined,
        location: jobList.location || undefined,
        city: jobList.city || undefined,
        category: jobList.category || undefined,
        skill: jobList.skill || undefined,
        // Map old filter names to new API format
        employmentType: jobList.employmentType || jobList.jobTypeSelect || undefined,
        experienceLevel: jobList.experienceLevel || jobList.experienceSelect || undefined,
        isRemote: jobList.isRemote || undefined,
        // Only include salary range if it's different from default
        minSalary: !isDefaultSalaryRange ? jobList.salary?.min : undefined,
        maxSalary: !isDefaultSalaryRange ? jobList.salary?.max : undefined,
        page,
        size
      };

      // Check if any search criteria is provided (exclude page and size)
      const { page: _page, size: _size, ...searchCriteria } = searchParams;
      const hasSearchCriteria = Object.values(searchCriteria).some(value => 
        value !== undefined && value !== false && value !== '' && value !== null
      );

      console.log('Has search criteria:', hasSearchCriteria);
      console.log('Search params:', searchParams);

      // Safety check - ensure we have valid pagination params
      const safePage = isNaN(page) ? 0 : Math.max(0, page);
      const safeSize = isNaN(size) ? 10 : Math.max(1, Math.min(100, size));

      let response;
      if (hasSearchCriteria) {
        console.log('Using search API...');
        response = await jobService.searchJobs({
          ...searchParams,
          page: safePage,
          size: safeSize
        });
      } else {
        console.log('Using getAllJobs API...');
        response = await jobService.getJobs({ 
          page: safePage, 
          size: safeSize 
        });
      }
      
      console.log('API response:', response);
      
      if (response?.data) {
        let jobs = [];
        let paginationData = {};

        // Handle different response formats
        if (response.data.data && response.data.meta) {
          // Search API format: { data: [...], meta: {...} }
          jobs = response.data.data;
          paginationData = {
            current: response.data.meta.page || 0,
            size: response.data.meta.size || size,
            totalPages: response.data.meta.pages || 0,
            totalElements: response.data.meta.total || 0
          };
        } else if (response.data.content) {
          // getAllJobs API format: { content: [...], pageable: {...}, totalPages, totalElements }
          jobs = response.data.content;
          paginationData = {
            current: response.data.pageable?.pageNumber || 0,
            size: response.data.pageable?.pageSize || size,
            totalPages: response.data.totalPages || 0,
            totalElements: response.data.totalElements || 0
          };
        } else if (Array.isArray(response.data)) {
          // Simple array format
          jobs = response.data;
          paginationData = {
            current: 0,
            size: jobs.length,
            totalPages: 1,
            totalElements: jobs.length
          };
        }
        
        console.log('Parsed jobs:', jobs);
        console.log('Parsed pagination:', paginationData);
        
        setJobs(jobs || []);
        setPagination(paginationData);
      } else {
        console.log('No data in response');
        setJobs([]);
        setPagination({
          current: 0,
          size: size,
          totalPages: 0,
          totalElements: 0
        });
      }
    } catch (err) {
      console.error('Search jobs error:', err);
      setError(err.message || 'Failed to search jobs');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [jobList]);

  // Initial search on mount
  useEffect(() => {
    if (!initialized) {
      console.log('Initial search on mount...');
      searchJobs(0, pagination.size);
      setInitialized(true);
    }
  }, [initialized, searchJobs, pagination.size]);

  // Helper to get meaningful salary value for dependency tracking
  const meaningfulSalaryValue = useMemo(() => {
    const isDefaultRange = !jobList.salary || (jobList.salary.min === 0 && jobList.salary.max === 10000);
    
    console.log('Salary range evaluation:', {
      salary: jobList.salary,
      isDefaultRange,
      meaningful: !isDefaultRange
    });
    
    if (isDefaultRange) {
      return null; // Default range, not meaningful
    }
    return JSON.stringify(jobList.salary);
  }, [jobList.salary]);

  // Auto search when ONLY bottom filters change (after initialization)
  // Bottom filters: jobTypeSelect, experienceSelect, datePosted, salary (when meaningful)
  useEffect(() => {
    if (initialized && !isResetting) {
      console.log('Bottom filter changed, triggering auto search...', {
        jobTypeSelect: jobList.jobTypeSelect,
        experienceSelect: jobList.experienceSelect,
        datePosted: jobList.datePosted,
        meaningfulSalary: meaningfulSalaryValue
      });
      
      // Add error handling for auto search
      try {
        searchJobs(0, pagination.size);
      } catch (error) {
        console.error('Error in auto search:', error);
        setError('Auto search failed: ' + error.message);
      }
    }
  }, [
    initialized,
    isResetting,
    jobList.jobTypeSelect, 
    jobList.experienceSelect, 
    jobList.datePosted, 
    meaningfulSalaryValue, // Only trigger when salary is meaningful
    searchJobs, 
    pagination.size
  ]);
  
  // Separate effect to log when individual filters change
  useEffect(() => {
    console.log('JobList updated:', jobList);
  }, [jobList]);

  // Page change handler
  const handlePageChange = useCallback((page) => {
    console.log(`Page change to: ${page}`);
    searchJobs(page, pagination.size);
  }, [searchJobs, pagination.size]);

  // Reset search
  const resetSearch = () => {
    setJobs([]);
    setError(null);
    setPagination({
      current: 0,
      size: 10,
      totalPages: 0,
      totalElements: 0
    });
  };

  // Manual search - để trigger từ top form
  const manualSearch = useCallback(() => {
    console.log('Manual search triggered from top form');
    searchJobs(0, pagination.size);
  }, [searchJobs, pagination.size]);

  // Full reset - clears everything and loads initial data
  const fullReset = useCallback(async () => {
    try {
      console.log('Full reset triggered...');
      setIsResetting(true);
      setError(null);
      setJobs([]);
      setPagination({
        current: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
      });
      
      // Load initial data (all jobs)
      const response = await jobService.getJobs({ page: 0, size: 10 });
      
      if (response?.data) {
        let jobs = [];
        let paginationData = {};

        if (response.data.data && response.data.meta) {
          jobs = response.data.data;
          paginationData = {
            current: response.data.meta.page || 0,
            size: response.data.meta.size || 10,
            totalPages: response.data.meta.pages || 0,
            totalElements: response.data.meta.total || 0
          };
        } else if (response.data.content) {
          jobs = response.data.content;
          paginationData = {
            current: response.data.pageable?.pageNumber || 0,
            size: response.data.pageable?.pageSize || 10,
            totalPages: response.data.totalPages || 0,
            totalElements: response.data.totalElements || 0
          };
        }
        
        setJobs(jobs || []);
        setPagination(paginationData);
        console.log('Full reset completed successfully');
      }
    } catch (error) {
      console.error('Error in full reset:', error);
      setError('Failed to reset: ' + error.message);
    } finally {
      setIsResetting(false);
    }
  }, []);

  return {
    jobs,
    loading,
    error,
    pagination,
    searchJobs,
    manualSearch,
    fullReset,
    handlePageChange,
    resetSearch
  };
}; 