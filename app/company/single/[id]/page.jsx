'use client'

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import companyService from "@/services/companyService";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import JobDetailsDescriptions from "@/components/employer-single-pages/shared-components/JobDetailsDescriptions";
import RelatedJobs from "@/components/employer-single-pages/related-jobs/RelatedJobs";
import MapJobFinder from "@/components/job-listing-pages/components/MapJobFinder";
import Social from "@/components/employer-single-pages/social/Social";
import PrivateMessageBox from "@/components/employer-single-pages/shared-components/PrivateMessageBox";
import Image from "next/image";

const CompanySingle = ({ params }) => {
  const id = params.id;

  // State management
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company data
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching company with ID:', id);
        const response = await companyService.getCompany(id);
        console.log('Company response:', response);

        if (response.data) {
          setCompany(response.data);
          
          // Update document title dynamically
          document.title = `${response.data.name} || JobHunt - Employment Marketplace`;
        }
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Failed to load company information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <>
        <span className="header-span"></span>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        
        <section className="job-detail-section">
          <div className="auto-container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading company...</span>
              </div>
              <p className="mt-3 h5">Loading company information...</p>
            </div>
          </div>
        </section>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <span className="header-span"></span>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        
        <section className="job-detail-section">
          <div className="auto-container">
            <div className="alert alert-danger text-center py-5">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  // Company not found
  if (!company) {
    return (
      <>
        <span className="header-span"></span>
        <LoginPopup />
        <DefaulHeader />
        <MobileMenu />
        
        <section className="job-detail-section">
          <div className="auto-container">
            <div className="alert alert-warning text-center py-5">
              <h3>Company Not Found</h3>
              <p>The company you're looking for doesn't exist or has been removed.</p>
              <a href="/company/list" className="btn btn-primary">
                Browse All Companies
              </a>
            </div>
          </div>
        </section>
        
        <FooterDefault footerStyle="alternate5" />
      </>
    );
  }

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        {/* <!-- Upper Box --> */}
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven">
              <div className="inner-box">
                <div className="content">
                  <span className="company-logo">
                    <Image
                      width={100}
                      height={100}
                      src={company?.logoUrl || '/images/resource/company-logo/default.png'}
                      alt={`${company?.name} logo`}
                    />
                  </span>
                  <h4>{company?.name}</h4>

                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {company?.city && company?.country ? `${company.city}, ${company.country}` : company?.address || 'Location not specified'}
                    </li>
                    {/* company info */}
                    <li>
                      <span className="icon flaticon-briefcase"></span>
                      {company?.industryType || 'Not specified'}
                    </li>
                    {/* location info */}
                    <li>
                      <span className="icon flaticon-telephone-1"></span>
                      {company?.phoneNumber || 'Not available'}
                    </li>
                    {/* time info */}
                    <li>
                      <span className="icon flaticon-mail"></span>
                      {company?.email || 'Not available'}
                    </li>
                    {/* salary info */}
                  </ul>
                  {/* End .job-info */}

                  <ul className="job-other-info">
                    <li className="time">Open Jobs – {company?.activeJobsCount || 0}</li>
                  </ul>
                  {/* End .job-other-info */}
                </div>
                {/* End .content */}

                <div className="btn-box">
                  <button
                    className="theme-btn btn-style-one"
                    data-bs-toggle="modal"
                    data-bs-target="#privateMessage"
                  >
                    Private Message
                  </button>
                  <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button>
                </div>
                {/* End btn-box */}

                {/* <!-- Modal --> */}
                <div
                  className="modal fade"
                  id="privateMessage"
                  tabIndex="-1"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="apply-modal-content modal-content">
                      <div className="text-center">
                        <h3 className="title">
                          Send message to {company.name}
                        </h3>
                        <button
                          type="button"
                          className="closed-modal"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      {/* End modal-header */}

                      <PrivateMessageBox />
                      {/* End PrivateMessageBox */}
                    </div>
                    {/* End .send-private-message-wrapper */}
                  </div>
                </div>
                {/* End .modal */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        {/* <!-- job-detail-outer--> */}
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                {/*  job-detail */}
                <JobDetailsDescriptions company={company} />
                {/* End job-detail */}

                {/* <!-- Related Jobs --> */}
                <div className="related-jobs">
                  <div className="title-box">
                    <h3>{company?.activeJobsCount > 0 ? `${company.activeJobsCount} job${company.activeJobsCount > 1 ? 's' : ''} available at ${company.name}` : 'No jobs available at this company'}</h3>
                    <div className="text">
                      {company?.activeJobsCount > 0 ? 'Explore exciting career opportunities.' : 'Check back later for new openings.'}
                    </div>
                  </div>
                  {/* End .title-box */}

                  {company?.activeJobsCount > 0 && <RelatedJobs />}
                  {/* End RelatedJobs */}
                </div>
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      {/*  company-info */}
                      <ul className="company-info mt-0">
                        <li>
                          Primary industry: <span>{company?.industryType || 'Software'}</span>
                        </li>
                        <li>
                          Company size: <span>{company?.teamSize || '501-1,000'}</span>
                        </li>
                        <li>
                          Founded in: <span>{company?.establishmentYear || '2011'}</span>
                        </li>
                        <li>
                          Phone: <span>{company?.phoneNumber || 'Not available'}</span>
                        </li>
                        <li>
                          Email: <span>{company?.email || 'Not available'}</span>
                        </li>
                        <li>
                          Location: <span>{company?.city && company?.country ? `${company.city}, ${company.country}` : company?.address || 'Location not specified'}</span>
                        </li>
                        {company?.averageRating > 0 && (
                          <li>
                            Rating: <span>{company.averageRating.toFixed(1)}/5.0 ({company.totalReviews} reviews)</span>
                          </li>
                        )}
                        <li>
                          Social media:
                          <Social />
                        </li>
                      </ul>
                      {/* End company-info */}

                      <div className="btn-box">
                        {company?.websiteUrl ? (
                          <a
                            href={company.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="theme-btn btn-style-three"
                          >
                            Visit Website
                          </a>
                        ) : (
                          <a
                            href={`mailto:${company?.email}`}
                            className="theme-btn btn-style-three"
                            style={{ textTransform: "lowercase" }}
                          >
                            {company?.email || 'Contact Us'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* End company-widget */}

                  <div className="sidebar-widget">
                    {/* <!-- Map Widget --> */}
                    <h4 className="widget-title">Job Location</h4>
                    <div className="widget-content">
                      <div style={{ height: "300px", width: "100%" }}>
                        <MapJobFinder />
                      </div>
                    </div>
                    {/* <!--  Map Widget --> */}
                  </div>
                  {/* End sidebar-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CompanySingle), { ssr: false }); 