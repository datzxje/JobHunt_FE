import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import Image from "next/image.js";
import { useState, useEffect } from "react";
import applicationService from "../../../../../services/applicationService.js";

const JobListingsTable = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getMyApplications(0, 20);
      setAppliedJobs(response.data?.content || []);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      setError(error.message);
      // Fallback to static data
      setAppliedJobs(jobs.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawApplication = async (applicationId) => {
    if (confirm('Are you sure you want to withdraw this application?')) {
      try {
        await applicationService.withdrawApplication(applicationId);
        alert('Application withdrawn successfully!');
        fetchAppliedJobs(); // Refresh the list
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('Error withdrawing application. Please try again.');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'interviewing': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Pending';
  };

  if (loading) {
    return (
      <div className="text-center" style={{ padding: "50px" }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading applied jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Applied Jobs</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Date Applied</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {appliedJobs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center" style={{ padding: "40px" }}>
                      <div style={{ color: "#696969" }}>
                        <i className="la la-folder-open" style={{ fontSize: "48px", marginBottom: "15px", color: "#ddd" }}></i>
                        <p style={{ fontSize: "16px", margin: "0" }}>No applications found.</p>
                        <p style={{ fontSize: "14px", margin: "5px 0 0 0" }}>Start applying for jobs to see them here!</p>
                      </div>
                    </td>
                  </tr>
                ) : appliedJobs.map((application) => (
                  <tr key={application.id}>
                    <td>
                      {/* <!-- Job Block --> */}
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              <Image
                                width={50}
                                height={49}
                                src={application.job?.company?.logo || "/images/resource/company-1.png"}
                                alt="company logo"
                              />
                            </span>
                            <h4>
                              <Link href={`/job-single-v3/${application.job?.id}`}>
                                {application.job?.title || "Job Title"}
                              </Link>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-briefcase"></span>
                                {application.job?.company?.name || "Company"}
                              </li>
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                {application.job?.location || "Location"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="status">
                      <span 
                        style={{ 
                          backgroundColor: getStatusColor(application.status),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {getStatusText(application.status)}
                      </span>
                    </td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button 
                              data-text="View Application"
                              onClick={() => window.open(`/job-single-v3/${application.job?.id}`, '_blank')}
                            >
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li>
                            <button 
                              data-text="Download CV"
                              onClick={() => {
                                if (application.cvUrl) {
                                  window.open(application.cvUrl, '_blank');
                                } else {
                                  alert('CV not available');
                                }
                              }}
                            >
                              <span className="la la-download"></span>
                            </button>
                          </li>
                          <li>
                            <button 
                              data-text="Withdraw Application"
                              onClick={() => handleWithdrawApplication(application.id)}
                              style={{ color: '#dc3545' }}
                            >
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobListingsTable;
