'use client'

import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";
import Image from "next/image.js";
import { useState } from "react";

const JobAlertsTable = () => {
  const [selectedTopic, setSelectedTopic] = useState("Software Engineer");
  const [timeFilter, setTimeFilter] = useState("Last 6 Months");

  const jobTopics = [
    "Software Engineer",
    "Frontend Developer", 
    "Backend Developer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Product Manager",
    "UI/UX Designer",
    "Mobile Developer",
    "Machine Learning Engineer"
  ];

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleTimeFilterChange = (e) => {
    setTimeFilter(e.target.value);
  };

  return (
    <div className="tabs-box enhanced-job-alerts">
      {/* Enhanced Header Section */}
      <div className="widget-title-enhanced">
        <div className="title-section">
          <div className="title-with-badge">
            <h4 className="dynamic-title">Recent Jobs Related to {selectedTopic}</h4>
            <span className="new-jobs-badge">
              <span className="pulse-dot"></span>
              {jobs.slice(4, 8).length} New Jobs
            </span>
          </div>
          <p className="subtitle">Stay updated with the latest opportunities in your field</p>
        </div>

        {/* Enhanced Filter Controls */}
        <div className="filter-controls">
          <div className="filter-group">
            <label className="filter-label">Job Category</label>
            <select 
              className="enhanced-select topic-select"
              value={selectedTopic}
              onChange={handleTopicChange}
            >
              {jobTopics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Time Period</label>
            <select 
              className="enhanced-select time-select"
              value={timeFilter}
              onChange={handleTimeFilterChange}
            >
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>Last 16 Months</option>
              <option>Last 24 Months</option>
              <option>Last 5 years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Table Content */}
      <div className="widget-content enhanced-content">
        <div className="table-container">
          <table className="enhanced-job-table">
            <thead>
              <tr>
                <th className="job-column">
                  <div className="th-content">
                    <span className="icon-briefcase"></span>
                    Job Details
                  </div>
                </th>
                <th className="criteria-column">
                  <div className="th-content">
                    <span className="icon-filter"></span>
                    Criteria
                  </div>
                </th>
                <th className="date-column">
                  <div className="th-content">
                    <span className="icon-calendar"></span>
                    Posted Date
                  </div>
                </th>
                <th className="action-column">
                  <div className="th-content">
                    <span className="icon-settings"></span>
                    Actions
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              {jobs.slice(4, 8).map((item, index) => (
                <tr key={item.id} className="job-row">
                  <td className="job-cell">
                    <div className="job-block-enhanced">
                      <div className="company-logo-wrapper">
                        <Image
                          width={50}
                          height={50}
                          src={item.logo}
                          alt="company logo"
                          className="company-logo-img"
                        />
                        <div className="verified-badge">✓</div>
                      </div>
                      
                      <div className="job-content">
                        <h5 className="job-title">
                          <Link href={`/job-single-v3/${item.id}`} className="job-link">
                            {item.jobTitle}
                          </Link>
                        </h5>
                        
                        <div className="job-meta">
                          <span className="job-meta-item">
                            <i className="icon-briefcase"></i>
                            Segment
                          </span>
                          <span className="job-meta-item">
                            <i className="icon-location"></i>
                            London, UK
                          </span>
                          <span className="job-meta-item salary">
                            <i className="icon-dollar"></i>
                            $60k - $80k
                          </span>
                        </div>
                        
                        <div className="job-tags">
                          <span className="job-tag remote">Remote</span>
                          <span className="job-tag full-time">Full-time</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="criteria-cell">
                    <div className="criteria-content">
                      <span className="criteria-main">Human Resources</span>
                      <span className="criteria-level junior">Junior Level</span>
                      <div className="match-score">
                        <span className="match-text">95% Match</span>
                        <div className="match-bar">
                          <div className="match-fill" style={{width: '95%'}}></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="date-cell">
                    <div className="date-content">
                      <span className="date-main">Nov 12, 2021</span>
                      <span className="date-relative">2 days ago</span>
                      <span className="freshness-indicator fresh">Fresh</span>
                    </div>
                  </td>
                  
                  <td className="action-cell">
                    <div className="action-buttons">
                      <button className="action-btn view-btn" title="View Details">
                        <i className="la la-eye"></i>
                        <span>View</span>
                      </button>
                      <button className="action-btn save-btn" title="Save Job">
                        <i className="la la-heart-o"></i>
                        <span>Save</span>
                      </button>
                      <button className="action-btn delete-btn" title="Remove Alert">
                        <i className="la la-trash"></i>
                        <span>Remove</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Enhanced Footer */}
        <div className="table-footer">
          <div className="results-info">
            Showing {jobs.slice(4, 8).length} of {jobs.length} job alerts for <strong>{selectedTopic}</strong>
          </div>
          <button className="load-more-btn">
            <i className="la la-refresh"></i>
            Load More Jobs
          </button>
        </div>
      </div>

      {/* Enhanced Styles */}
      <style jsx>{`
        .enhanced-job-alerts {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .widget-title-enhanced {
          margin-bottom: 24px;
        }

        .title-section {
          margin-bottom: 20px;
        }

        .title-with-badge {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }

        .dynamic-title {
          color: #1e293b;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .new-jobs-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          animation: slideInFromRight 0.5s ease-out;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #fff;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slideInFromRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .subtitle {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .filter-controls {
          display: flex;
          gap: 20px;
          align-items: end;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .filter-label {
          font-size: 12px;
          font-weight: 600;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .enhanced-select {
          padding: 10px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          font-size: 14px;
          font-weight: 500;
          color: #1e293b;
          transition: all 0.3s ease;
          min-width: 160px;
        }

        .enhanced-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .enhanced-select:hover {
          border-color: #cbd5e1;
        }

        .enhanced-content {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .table-container {
          overflow-x: auto;
        }

        .enhanced-job-table {
          width: 100%;
          border-collapse: collapse;
        }

        .enhanced-job-table thead {
          background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
        }

        .enhanced-job-table th {
          padding: 16px 20px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        .th-content {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .job-row {
          transition: all 0.3s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .job-row:hover {
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .job-row td {
          padding: 20px;
          vertical-align: top;
        }

        .job-block-enhanced {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }

        .company-logo-wrapper {
          position: relative;
          flex-shrink: 0;
        }

        .company-logo-img {
          border-radius: 12px;
          border: 2px solid #f1f5f9;
          transition: transform 0.3s ease;
        }

        .job-row:hover .company-logo-img {
          transform: scale(1.05);
        }

        .verified-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 18px;
          height: 18px;
          background: #10b981;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }

        .job-content {
          flex: 1;
        }

        .job-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
        }

        .job-link {
          color: #1e293b;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .job-link:hover {
          color: #3b82f6;
        }

        .job-meta {
          display: flex;
          gap: 16px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }

        .job-meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #64748b;
        }

        .job-meta-item.salary {
          color: #059669;
          font-weight: 600;
        }

        .job-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .job-tag {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .job-tag.remote {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .job-tag.full-time {
          background: #d1fae5;
          color: #065f46;
        }

        .criteria-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .criteria-main {
          font-weight: 600;
          color: #1e293b;
        }

        .criteria-level {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .criteria-level.junior {
          background: #fef3c7;
          color: #92400e;
        }

        .match-score {
          margin-top: 8px;
        }

        .match-text {
          font-size: 12px;
          color: #059669;
          font-weight: 600;
        }

        .match-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-top: 4px;
        }

        .match-fill {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          border-radius: 2px;
          transition: width 0.8s ease;
        }

        .date-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-main {
          font-weight: 600;
          color: #1e293b;
        }

        .date-relative {
          font-size: 12px;
          color: #64748b;
        }

        .freshness-indicator {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          align-self: flex-start;
        }

        .freshness-indicator.fresh {
          background: #dcfce7;
          color: #166534;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .view-btn {
          background: #e0f2fe;
          color: #0369a1;
        }

        .view-btn:hover {
          background: #0369a1;
          color: white;
          transform: translateY(-1px);
        }

        .save-btn {
          background: #fce7f3;
          color: #be185d;
        }

        .save-btn:hover {
          background: #be185d;
          color: white;
          transform: translateY(-1px);
        }

        .delete-btn {
          background: #fee2e2;
          color: #dc2626;
        }

        .delete-btn:hover {
          background: #dc2626;
          color: white;
          transform: translateY(-1px);
        }

        .table-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .results-info {
          color: #64748b;
          font-size: 14px;
        }

        .load-more-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .load-more-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .enhanced-job-alerts {
            padding: 16px;
          }
          
          .filter-controls {
            flex-direction: column;
            gap: 12px;
          }
          
          .enhanced-select {
            min-width: 100%;
          }
          
          .job-block-enhanced {
            flex-direction: column;
            gap: 12px;
          }
          
          .job-meta {
            flex-direction: column;
            gap: 8px;
          }
          
          .action-buttons {
            justify-content: center;
          }
          
          .table-footer {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JobAlertsTable;