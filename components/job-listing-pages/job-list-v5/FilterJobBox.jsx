'use client'

import Link from "next/link";
import { useEffect } from "react";
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
  clearAllFilters,
} from "../../../features/filter/filterSlice";
import { useJobSearch } from "../../../hooks/useJobSearch";
import Image from "next/image";

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
  
  // Use job search hook
  const { jobs, loading, error, pagination, handlePageChange, fullReset } = useJobSearch();

  // clear all filters - defined early to avoid reference error
  const clearAll = async () => {
    try {
      console.log('Clearing all filters from FilterJobBox...');
      dispatch(clearAllFilters());
      await fullReset();
      console.log('All filters cleared from FilterJobBox successfully');
    } catch (error) {
      console.error('Error clearing filters from FilterJobBox:', error);
    }
  };

  // Handle URL parameters for automatic filtering
  useEffect(() => {
    const jobTypeParam = searchParams.get('jobType');
    if (jobTypeParam === 'temporary') {
      dispatch(addJobTypeSelect('temporary'));
    }
  }, [searchParams, dispatch]);

  // Render job content from API
  const renderJobContent = () => {
    if (loading) {
      return (
        <div className="loading-container text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p>Searching jobs...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container text-center">
          <p className="text-danger">Error: {error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!jobs || jobs.length === 0) {
      return (
        <div className="no-results text-center">
          <p>No jobs found matching your criteria.</p>
          <button 
            className="btn btn-outline-primary"
            onClick={clearAll}
          >
            Clear Filters
          </button>
        </div>
      );
    }

    return jobs.map((item) => (
      <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
        <div className="inner-box">
          <div className="content">
            <span className="company-logo">
              <Image 
                width={50} 
                height={49} 
                src={item.company?.logoUrl || "/images/resource/company-logo/1-1.png"} 
                alt={item.company?.name || "Company"} 
              />
            </span>
            <h4>
              <Link href={`/job-single-v3/${item.id}`}>{item.title}</Link>
            </h4>

            <ul className="job-info">
              <li>
                <span className="icon flaticon-briefcase"></span>
                {item.company?.name || "Company"}
              </li>
              <li>
                <span className="icon flaticon-map-locator"></span>
                {item.location}
              </li>
              <li>
                <span className="icon flaticon-clock-3"></span> 
                {item.employmentType?.replace('_', ' ')}
              </li>
              <li>
                <span className="icon flaticon-money"></span> 
                {item.salaryMin && item.salaryMax 
                  ? `$${item.salaryMin} - $${item.salaryMax}`
                  : "Negotiable"
                }
              </li>
            </ul>

            <ul className="job-other-info">
              <li className="privacy">{item.employmentType?.replace('_', ' ')}</li>
              {item.isRemote && <li className="remote">Remote</li>}
              {item.experienceLevel && <li className="time">{item.experienceLevel}</li>}
            </ul>

            <button className="bookmark-btn">
              <span className="flaticon-bookmark"></span>
            </button>
          </div>
        </div>
      </div>
    ));
  };

  let content = renderJobContent();

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  return (
    <>
      <div className="ls-switcher">
        <JobSelect />
        {/* End .showing-result */}

        <div className="sort-by">
          {keyword !== "" ||
          location !== "" ||
          category !== "" ||
          jobTypeSelect !== "" ||
          datePosted !== "" ||
          experienceSelect !== "" ||
          salary?.min !== 0 ||
          salary?.max !== 10000 ||
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

      {!loading && !error && jobs.length > 0 && (
        <div className="pagination-wrapper">
          <div className="showing-result">
            <div className="text">
              Showing <strong>{pagination.current * pagination.size + 1}</strong> to{" "}
              <strong>
                {Math.min((pagination.current + 1) * pagination.size, pagination.totalElements)}
              </strong>{" "}
              of <strong>{pagination.totalElements}</strong> results
            </div>
          </div>
          <Pagination 
            currentPage={pagination.current} 
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {/* <!-- End Pagination --> */}
    </>
  );
};

export default FilterJobBox;
