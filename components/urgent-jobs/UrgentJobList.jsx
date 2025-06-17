'use client'

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { calculateDistance } from '../../utils/locationUtils';

const UrgentJobList = ({ jobs, userLocation }) => {
  const [sortBy, setSortBy] = useState('distance'); // 'distance' or 'time'

  const sortedJobs = [...jobs].sort((a, b) => {
    if (sortBy === 'distance') {
      return a.distance - b.distance;
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="urgent-jobs-list">
      {/* Sorting Controls */}
      <div className="sorting-options mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4>Available Jobs</h4>
          <div className="sort-buttons">
            <button
              className={`btn ${sortBy === 'distance' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
              onClick={() => setSortBy('distance')}
            >
              Sort by Distance
            </button>
            <button
              className={`btn ${sortBy === 'time' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setSortBy('time')}
            >
              Sort by Time
            </button>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="row">
        {sortedJobs.map((job) => (
          <div key={job.id} className="col-lg-6 col-md-12 mb-4">
            <div className="job-block style-two shadow rounded border border-danger position-relative">
              <div className="urgent-badge position-absolute top-0 end-0 m-3 px-3 py-1 bg-danger text-white fw-bold rounded-pill" style={{zIndex:2, fontSize:'1rem', letterSpacing:'1px'}}>
                Gấp
              </div>
              <div className="inner-box">
                <div className="content">
                  <span className="company-logo">
                    <Image
                      width={50}
                      height={50}
                      src={job.provider.avatar || '/images/resource/company-logo/1-1.png'}
                      alt={job.provider.name}
                    />
                  </span>
                  <h4>
                    <Link href={`/urgent-jobs/${job.id}`}>{job.title}</Link>
                  </h4>
                  <p className="text-muted mb-2" style={{minHeight:'40px'}}>{job.description}</p>
                  <ul className="job-info">
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {job.location}
                      {typeof job.distance === 'number' && (
                        <span className="distance-badge ms-2 px-2 py-1 bg-warning text-dark rounded-pill" style={{fontSize:'0.9rem'}}>
                          {job.distance.toFixed(1)} km gần bạn
                        </span>
                      )}
                    </li>
                    <li>
                      <span className="icon flaticon-money"></span>
                      {job.budget}
                    </li>
                    <li>
                      <span className="icon flaticon-clock"></span>
                      Đăng {job.timeAgo}
                    </li>
                  </ul>
                  <div className="job-tags mb-2">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="tag bg-light text-danger border border-danger me-1 mb-1 px-2 py-1 rounded-pill" style={{fontSize:'0.85rem'}}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="job-footer d-flex justify-content-between align-items-center mt-3">
                    <div className="provider-info">
                      <span className="provider-name fw-bold">{job.provider.name}</span>
                      <div className="rating d-inline-block ms-2">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${i < Math.round(job.provider.rating) ? 'filled text-warning' : 'text-secondary'}`}
                            style={{fontSize:'1rem'}}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-count text-muted ms-1" style={{fontSize:'0.9rem'}}>({job.provider.reviewCount})</span>
                      </div>
                    </div>
                    <button className="theme-btn btn-style-one bg-danger border-0 px-4 py-2 text-white rounded-pill fw-bold shadow-sm">
                      Ứng tuyển ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentJobList; 