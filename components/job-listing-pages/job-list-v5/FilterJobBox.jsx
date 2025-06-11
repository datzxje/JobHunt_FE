'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Pagination from "../components/Pagination";
import JobSelect from "../components/JobSelect";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  addDatePosted,
  addExperienceSelect,
  addJobTypeSelect,
  addKeyword,
  addLocation,
  addPerPage,
  addSalary,
  addSort,
} from "../../../features/filter/filterSlice";
import Image from "next/image";
import api from "../../../utils/api";

// Add custom styles for enhanced job type badges
const customStyles = `
  .job-other-info {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 15px;
  }
  
  .job-other-info li {
    position: relative;
    font-size: 12px;
    font-weight: 500;
    line-height: 14px;
    padding: 6px 12px;
    border-radius: 20px;
    margin: 0;
    display: inline-block;
    border: 1px solid transparent;
    transition: all 0.3s ease;
  }
  
  .job-other-info li:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

// Inject styles into head
if (typeof window !== 'undefined' && !document.querySelector('#job-type-styles')) {
  const styleElement = document.createElement('style');
  styleElement.id = 'job-type-styles';
  styleElement.textContent = customStyles;
  document.head.appendChild(styleElement);
}

const FilterJobBox = () => {
  const { jobList, jobSort } = useSelector((state) => state.filter);
  const {
    keyword,
    location,
    destination,
    category,
    datePosted,
    jobTypeSelect,
    experienceSelect,
    salary,
  } = jobList || {};

  const { sort, perPage } = jobSort;
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // API state management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalJobs, setTotalJobs] = useState(0);

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API params from filters
        const params = {
          page: 0, // Start with page 0
          size: perPage.end || 50, // Default to 50 if no limit
          ...(keyword && { keyword }),
          ...(location && { location }),
          ...(jobTypeSelect && { jobType: jobTypeSelect.toUpperCase().replace('-', '_') }),
          ...(experienceSelect && { experienceLevel: experienceSelect }),
        };

        console.log('Fetching jobs with params:', params);
        const response = await api.getJobs(params);
        
        // Handle response based on backend structure
        if (response.data && response.data.data) {
          // If response has nested data structure
          const jobsData = response.data.data.content || response.data.data;
          setJobs(Array.isArray(jobsData) ? jobsData : []);
          setTotalJobs(response.data.data.totalElements || jobsData.length);
        } else if (response.data) {
          // If response data is direct
          const jobsData = Array.isArray(response.data) ? response.data : [];
          setJobs(jobsData);
          setTotalJobs(jobsData.length);
        }
        
        console.log('Jobs fetched successfully:', response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [keyword, location, jobTypeSelect, experienceSelect, perPage.end]);

  // Handle URL parameters for automatic filtering
  useEffect(() => {
    const jobTypeParam = searchParams.get('jobType');
    if (jobTypeParam === 'temporary') {
      dispatch(addJobTypeSelect('temporary'));
    }
  }, [searchParams, dispatch]);

  // Helper function to format salary display
  const formatSalary = (job) => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      return `$${job.salaryMin.toLocaleString()}+`;
    } else if (job.salaryMax) {
      return `Up to $${job.salaryMax.toLocaleString()}`;
    }
    return 'Negotiable';
  };

  // Helper function to format job type display
  const formatJobType = (employmentType) => {
    const typeMapping = {
      'FULL_TIME': { type: 'Full Time', styleClass: 'full-time' },
      'PART_TIME': { type: 'Part Time', styleClass: 'part-time' },
      'FREELANCER': { type: 'Freelancer', styleClass: 'freelance' },
      'TEMPORARY': { type: 'Temporary', styleClass: 'temporary' },
      'INTERNSHIP': { type: 'Internship', styleClass: 'internship' },
    };
    return typeMapping[employmentType] || { type: employmentType, styleClass: 'other' };
  };

  // Helper function to get job type colors
  const getJobTypeColor = (styleClass) => {
    const colorMapping = {
      'full-time': {
        bg: 'rgba(34, 197, 94, 0.15)', // Green
        text: '#16a34a'
      },
      'part-time': {
        bg: 'rgba(59, 130, 246, 0.15)', // Blue
        text: '#2563eb'
      },
      'freelance': {
        bg: 'rgba(168, 85, 247, 0.15)', // Purple
        text: '#7c3aed'
      },
      'temporary': {
        bg: 'rgba(245, 158, 11, 0.15)', // Orange
        text: '#d97706'
      },
      'internship': {
        bg: 'rgba(236, 72, 153, 0.15)', // Pink
        text: '#db2777'
      },
      'other': {
        bg: 'rgba(107, 114, 128, 0.15)', // Gray
        text: '#6b7280'
      }
    };
    return colorMapping[styleClass] || colorMapping['other'];
  };

  // Helper function to calculate time ago
  const formatTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Client-side filtering for additional filters not handled by API
  const clientSideFilter = (item) => {
    // Salary filter
    if (salary?.min > 0 || salary?.max < 20000) {
      const itemMin = item.salaryMin || 0;
      const itemMax = item.salaryMax || 0;
      if (itemMin < salary.min || (salary.max < 20000 && itemMax > salary.max)) {
        return false;
      }
    }

    // Category filter (if not handled by API)
    if (category !== "" && item.categories) {
      const hasCategory = item.categories.some(cat => 
        cat.name?.toLowerCase() === category.toLowerCase()
      );
      if (!hasCategory) return false;
    }

    // Date posted filter
    if (datePosted !== "all" && datePosted !== "") {
      const createdDate = new Date(item.createdAt);
      const now = new Date();
      const diffDays = Math.ceil((now - createdDate) / (1000 * 60 * 60 * 24));
      
      if (datePosted === "1" && diffDays > 1) return false;
      if (datePosted === "7" && diffDays > 7) return false;
      if (datePosted === "30" && diffDays > 30) return false;
    }

    return true;
  };

  // Sort function
  const sortJobs = (jobs) => {
    if (sort === "asc") {
      return [...jobs].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "des") {
      return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return jobs;
  };

  // Process jobs for display
  const processedJobs = sortJobs(jobs.filter(clientSideFilter))
    .slice(perPage.start, perPage.end !== 0 ? perPage.end : jobs.length);

  // Render content
  let content;
  
  if (loading) {
    content = (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading jobs...</p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="col-12 text-center py-5">
        <div className="alert alert-danger" role="alert">
          <h5>Error Loading Jobs</h5>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  } else if (processedJobs.length === 0) {
    content = (
      <div className="col-12 text-center py-5">
        <div className="alert alert-info" role="alert">
          <h5>No Jobs Found</h5>
          <p>Try adjusting your search criteria or filters.</p>
        </div>
      </div>
    );
  } else {
    content = processedJobs.map((item) => {
      const jobType = formatJobType(item.employmentType);
      
      return (
        <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                {item.company?.logo ? (
                  <Image 
                    width={50} 
                    height={49} 
                    src={item.company.logo} 
                    alt={`${item.company.name || 'Company'} logo`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <div 
                    style={{
                      width: '50px',
                      height: '49px',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#6c757d'
                    }}
                  >
                    {(item.company?.name || 'C').charAt(0).toUpperCase()}
                  </div>
                )}
              </span>
              <h4>
                <Link href={`/job-single-v3/${item.id}`}>{item.title}</Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.company?.name || 'Company Name'}
                </li>
                {/* company info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location || `${item.city || ''} ${item.country || ''}`.trim() || 'Location not specified'}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span> 
                  {formatTimeAgo(item.createdAt)}
                </li>
                {/* time info */}
                <li>
                  <span className="icon flaticon-money"></span> 
                  {formatSalary(item)}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                <li className={`${jobType.styleClass}`} style={{
                  backgroundColor: getJobTypeColor(jobType.styleClass).bg,
                  color: getJobTypeColor(jobType.styleClass).text
                }}>
                  {jobType.type}
                </li>
                {item.isRemote && (
                  <li className="remote" style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.15)',
                    color: '#22c55e'
                  }}>
                    Remote
                  </li>
                )}
                {item.experienceLevel && (
                  <li className="experience" style={{
                    backgroundColor: 'rgba(139, 69, 19, 0.15)',
                    color: '#8b4513'
                  }}>
                    {item.experienceLevel.replace('_', ' ')}
                  </li>
                )}
              </ul>
              {/* End .job-other-info */}

              <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button>
            </div>
          </div>
        </div>
      );
    });
  }

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // clear all filters
  const clearAll = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addCategory(""));
    dispatch(addJobTypeSelect(""));
    dispatch(addDatePosted(""));
    dispatch(addExperienceSelect(""));
    dispatch(addSalary({ min: 0, max: 20000 }));
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  return (
    <>
      <style jsx>{`
        .remote {
          background-color: #28a745 !important;
          color: white !important;
        }
        .experience {
          background-color: #007bff !important;
          color: white !important;
        }
        .full-time {
          background-color: #17a2b8 !important;
          color: white !important;
        }
        .part-time {
          background-color: #ffc107 !important;
          color: #212529 !important;
        }
        .freelance {
          background-color: #6f42c1 !important;
          color: white !important;
        }
        .temporary {
          background-color: #fd7e14 !important;
          color: white !important;
        }
        .internship {
          background-color: #20c997 !important;
          color: white !important;
        }
        .other {
          background-color: #6c757d !important;
          color: white !important;
        }
      `}</style>
      
      <div className="ls-switcher">
        <div className="showing-result">
          <div className="text">
            <strong>{loading ? '...' : processedJobs.length}</strong> jobs 
            {totalJobs > 0 && totalJobs !== processedJobs.length && (
              <span> of <strong>{totalJobs}</strong> total</span>
            )}
            {loading && (
              <span className="ms-2">
                <small className="text-muted">Loading...</small>
              </span>
            )}
          </div>
        </div>
        {/* End .showing-result */}

        <JobSelect />
        {/* End job select filters */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          category !== "" ||
          jobTypeSelect !== "" ||
          datePosted !== "" ||
          experienceSelect !== "" ||
          salary?.min !== 0 ||
          salary?.max !== 20000 ||
          sort !== "" ||
          perPage.start !== 0 ||
          perPage.end !== 0 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            value={sort}
            className="chosen-single form-select"
            onChange={sortHandler}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>
          {/* End select */}

          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option
              value={JSON.stringify({
                start: 0,
                end: 0,
              })}
            >
              All
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 10,
              })}
            >
              10 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 20,
              })}
            >
              20 per page
            </option>
            <option
              value={JSON.stringify({
                start: 0,
                end: 30,
              })}
            >
              30 per page
            </option>
          </select>
          {/* End select */}
        </div>
        {/* End sort by filter */}
      </div>
      {/* <!-- ls Switcher --> */}

      <div className="row">{content}</div>
      {/* End .row with jobs */}

      <Pagination />
      {/* <!-- End Pagination --> */}
    </>
  );
};

export default FilterJobBox;
