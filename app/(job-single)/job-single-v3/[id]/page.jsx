"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import jobService from "@/services/jobService";
import CompnayInfo from "@/components/job-single-pages/shared-components/CompanyInfo";
import SocialTwo from "@/components/job-single-pages/social/SocialTwo";
import Contact from "@/components/job-single-pages/shared-components/Contact";
import JobDetailsDescriptions from "@/components/job-single-pages/shared-components/JobDetailsDescriptions";
import RelatedJobs2 from "@/components/job-single-pages/related-jobs/RelatedJobs2";
import JobOverView2 from "@/components/job-single-pages/job-overview/JobOverView2";
import ApplyJobModalContent from "@/components/job-single-pages/shared-components/ApplyJobModalContent";
import Image from "next/image";
import CommonLayout from "@/layout/CommonLayout";

const JobSingleDynamicV3 = ({ params }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = params.id;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching job with ID:', id);
        
        const response = await jobService.getJob(id);
        console.log('Job response:', response);
        
        if (response && response.data) {
          setJob(response.data);
          // Update document title for SEO
          const companyName = response.data.company?.name || 'Company';
          document.title = `${response.data.title} at ${companyName} || JobHunt - Employment Marketplace`;
        } else {
          setError('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        setError(error.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <CommonLayout>
        <section className="job-detail-section">
          <div className="job-detail-outer">
            <div className="auto-container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="loading-wrapper" style={{ padding: '100px 0' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-3">Loading job details...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CommonLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <CommonLayout>
        <section className="job-detail-section">
          <div className="job-detail-outer">
            <div className="auto-container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="error-wrapper" style={{ padding: '100px 0' }}>
                    <div className="alert alert-danger">
                      <h4>Error loading job</h4>
                      <p>{error}</p>
                      <button 
                        className="btn btn-primary mt-3"
                        onClick={() => window.location.reload()}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CommonLayout>
    );
  }

  // No job found
  if (!job) {
    return (
      <CommonLayout>
        <section className="job-detail-section">
          <div className="job-detail-outer">
            <div className="auto-container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="not-found-wrapper" style={{ padding: '100px 0' }}>
                    <h4>Job Not Found</h4>
                    <p>The job you're looking for doesn't exist or has been removed.</p>
                    <a href="/job-list-v5" className="btn btn-primary mt-3">
                      Browse All Jobs
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CommonLayout>
    );
  }

  // Parse JSON fields safely
  const parseJsonField = (field) => {
    if (!field) return [];
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch (error) {
        console.warn('Failed to parse JSON field:', field);
        return [];
      }
    }
    return Array.isArray(field) ? field : [];
  };

  // Helper functions to format data like the original UI
  const formatEmploymentType = (type) => {
    const typeMap = {
      'FULL_TIME': 'Full Time',
      'PART_TIME': 'Part Time', 
      'CONTRACT': 'Contract',
      'TEMPORARY': 'Temporary',
      'INTERNSHIP': 'Internship'
    };
    return typeMap[type] || type;
  };

  const formatExperienceLevel = (level) => {
    const levelMap = {
      'ENTRY': 'Entry Level',
      'JUNIOR': 'Junior',
      'MID': 'Mid Level', 
      'SENIOR': 'Senior',
      'LEAD': 'Lead',
      'MANAGER': 'Manager'
    };
    return levelMap[level] || level;
  };

  const formatSalary = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${job.salaryMin} - $${job.salaryMax}`;
    } else if (job.salaryMin) {
      return `$${job.salaryMin}+`;
    }
    return 'Negotiable';
  };

  // Parse categories
  const categories = parseJsonField(job.categories);

  // Create company object for UI compatibility using API company data
  const company = {
    id: job.id,
    jobTitle: job.title,
    company: job.company?.name || 'Hiring Company', // Use company name from API
    location: job.location,
    time: formatEmploymentType(job.employmentType),
    salary: formatSalary(),
    logo: job.company?.logoUrl || "/images/resource/company-1.png", // Use company logo from API
    link: job.company?.websiteUrl || "Visit Website",
    // Additional company info for sidebar
    companyInfo: job.company
  };

  return (
    <CommonLayout>
      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-block-outer">
                  <div className="job-block-seven style-two">
                    <div className="inner-box">
                      <div className="content">
                        <h4>{company?.jobTitle}</h4>

                        <ul className="job-info">
                          <li>
                            <span className="icon flaticon-briefcase"></span>
                            {company?.company}
                          </li>
                          {/* company info */}
                          <li>
                            <span className="icon flaticon-map-locator"></span>
                            {company?.location}
                          </li>
                          {/* location info */}
                          <li>
                            <span className="icon flaticon-money"></span>{" "}
                            {company?.salary}
                          </li>
                          {/* salary info */}
                        </ul>
                        {/* End .job-info */}

                        <ul className="job-other-info">
                          <li className="privacy">
                            {formatEmploymentType(job.employmentType)}
                          </li>
                          {categories.length > 0 && (
                            <li className="category">
                              {categories[0]}
                            </li>
                          )}
                          {job.remote && (
                            <li className="remote">Remote</li>
                          )}
                          {job.experienceLevel && (
                            <li className="time">
                              {formatExperienceLevel(job.experienceLevel)}
                            </li>
                          )}
                        </ul>
                        {/* End .job-other-info */}
                      </div>
                      {/* End .content */}
                    </div>
                  </div>
                  {/* <!-- Job Block --> */}
                </div>
                {/* <!-- job block outer --> */}

                <div className="job-overview-two">
                  <h4>Job Description</h4>
                  <JobOverView2 job={job} />
                </div>
                {/* <!-- job-overview-two --> */}

                <JobDetailsDescriptions job={job} />
                {/* End job-details */}

                <div className="other-options">
                  <div className="social-share">
                    <h5>Share this job</h5>
                    <SocialTwo />
                  </div>
                </div>
                {/* <!-- Other Options --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="btn-box">
                    <a
                      href="#"
                      className="theme-btn btn-style-one"
                      data-bs-toggle="modal"
                      data-bs-target="#applyJobModal"
                    >
                      Apply For Job
                    </a>
                    <button className="bookmark-btn">
                      <i className="flaticon-bookmark"></i>
                    </button>
                  </div>
                  {/* End apply for job btn */}

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="applyJobModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="apply-modal-content modal-content">
                        <div className="text-center">
                          <h3 className="title">Apply for this job</h3>
                          <button
                            type="button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/* End modal-header */}

                        <ApplyJobModalContent jobId={id} />
                        {/* End PrivateMessageBox */}
                      </div>
                      {/* End .send-private-message-wrapper */}
                    </div>
                  </div>
                  {/* End .modal */}

                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <Image
                            width={54}
                            height={53}
                            src={company.logo}
                            alt="resource"
                          />
                        </div>
                        <h5 className="company-name">{company.company}</h5>
                        <a href={`/company/single/${job.company?.id}`} className="profile-link">
                          View company profile
                        </a>
                      </div>
                      {/* End company title */}

                      <CompnayInfo company={job.company} />

                                              <div className="btn-box">
                          {company?.companyInfo?.websiteUrl ? (
                            <a
                              href={company.companyInfo.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="theme-btn btn-style-three"
                            >
                              Visit Website
                            </a>
                          ) : (
                            <a
                              href="#"
                              className="theme-btn btn-style-three"
                            >
                              Visit Website
                            </a>
                          )}
                        </div>
                      {/* End btn-box */}
                    </div>
                  </div>
                  {/* End .company-widget */}

                  <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                      {/* End .default-form */}
                    </div>
                  </div>
                  {/* End contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
            {/* End .row  */}

            <div className="related-jobs">
              <div className="title-box">
                <h3>Related Jobs</h3>
                <div className="text">2020 jobs live - 293 added today.</div>
              </div>
              {/* End title box */}

              <div className="row">
                <RelatedJobs2 />
              </div>
              {/* End .row */}
            </div>
            {/* <!-- Related Jobs --> */}
          </div>
          {/* End auto-container */}
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}
    </CommonLayout>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV3), {
  ssr: false,
});
