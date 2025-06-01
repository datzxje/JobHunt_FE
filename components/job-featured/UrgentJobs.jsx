'use client'

import Link from "next/link";
import urgentJobs from "../../data/urgent-jobs";
import Image from "next/image";

const UrgentJobs = () => {
  return (
    <div className="urgent-jobs-container">
      {/* Header with animation */}
      <div className="urgent-header">
        <div className="urgent-title">
          <span className="fire-icon">🔥</span>
          <h3>VIỆC LÀM THỜI VỤ - CẦN GẤP</h3>
          <span className="urgent-badge">HOT</span>
        </div>
        <p className="urgent-subtitle">
          Cơ hội việc làm ngắn hạn, mức lương cao, bắt đầu ngay! ⚡
        </p>
      </div>

      {/* Jobs Grid */}
      <div className="urgent-jobs-grid">
        {urgentJobs.slice(0, 6).map((item) => (
          <div className={`urgent-job-card urgency-${item.urgencyLevel}`} key={item.id}>
            {/* Urgency Badge */}
            <div className={`urgency-badge ${item.urgencyLevel}`}>
              {item.urgencyText}
            </div>

            <div className="job-content">
              <div className="job-header">
                <span className="company-logo">
                  <Image
                    width={40}
                    height={40}
                    src={item.logo}
                    alt="company logo"
                  />
                </span>
                <div className="job-meta">
                  <h4>
                    <Link href={`/job-single-v3/${item.id}`}>
                      {item.jobTitle}
                    </Link>
                  </h4>
                  <span className="company-name">{item.company}</span>
                </div>
              </div>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location}
                </li>
                <li>
                  <span className="icon flaticon-money"></span>
                  {item.hourlyRate}
                </li>
                <li>
                  <span className="icon flaticon-clock-3"></span>
                  {item.time}
                </li>
              </ul>

              {/* Urgent Info */}
              <div className="urgent-details">
                <div className="detail-item">
                  <span className="label">⏰ Deadline:</span>
                  <span className={`value deadline-${item.urgencyLevel}`}>
                    {item.deadline}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">🚀 Bắt đầu:</span>
                  <span className="value">{item.startDate}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="skills-tags">
                {item.skills?.slice(0, 3).map((skill, i) => (
                  <span key={i} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Action Button */}
              <div className="job-actions">
                <button className={`apply-btn ${item.urgencyLevel}`}>
                  {item.urgencyLevel === 'critical' ? 'ỨNG TUYỂN NGAY!' : 'Ứng tuyển'}
                </button>
                <button className="bookmark-btn">
                  <span className="flaticon-bookmark"></span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      <div className="view-more-section">
        <Link href="/job-list-v5?jobType=temporary" className="view-more-btn">
          <span>🔍 Xem Tất Cả Việc Thời Vụ</span>
        </Link>
      </div>

      <style jsx>{`
        .urgent-jobs-container {
          background: linear-gradient(135deg, #ff4757 0%, #ff6b7a 50%, #ff8fab 100%);
          padding: 40px 0;
          margin: 20px 0;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .urgent-jobs-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
        }

        .urgent-header {
          text-align: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 2;
        }

        .urgent-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .fire-icon {
          font-size: 40px;
          animation: fire-flicker 1.5s infinite alternate;
        }

        .urgent-title h3 {
          color: white;
          font-size: 28px;
          font-weight: 800;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          letter-spacing: 1px;
        }

        .urgent-badge {
          background: #ffeb3b;
          color: #d84315;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
          animation: pulse-badge 2s infinite;
        }

        .urgent-subtitle {
          color: rgba(255, 255, 255, 0.95);
          font-size: 16px;
          margin: 0;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .urgent-jobs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          padding: 0 20px;
          position: relative;
          z-index: 2;
        }

        .urgent-job-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 15px;
          padding: 20px;
          position: relative;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          backdrop-filter: blur(10px);
        }

        .urgent-job-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          border-color: rgba(255, 255, 255, 0.8);
        }

        .urgency-badge {
          position: absolute;
          top: -10px;
          right: 15px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          z-index: 3;
        }

        .urgency-badge.critical {
          background: linear-gradient(45deg, #d32f2f, #f44336);
          animation: urgent-blink 1s infinite;
        }

        .urgency-badge.high {
          background: linear-gradient(45deg, #f57c00, #ff9800);
          animation: pulse-urgent 2s infinite;
        }

        .urgency-badge.medium {
          background: linear-gradient(45deg, #fbc02d, #ffeb3b);
          color: #d84315;
        }

        .job-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
        }

        .company-logo img {
          border-radius: 8px;
        }

        .job-meta h4 {
          margin: 0 0 5px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .job-meta h4 a {
          color: #1a1a1a;
          text-decoration: none;
        }

        .job-meta h4 a:hover {
          color: #ff4757;
        }

        .company-name {
          font-size: 13px;
          color: #666;
          font-weight: 500;
        }

        .job-info {
          list-style: none;
          padding: 0;
          margin: 15px 0;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
        }

        .job-info li {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #555;
        }

        .job-info .icon {
          color: #ff4757;
          font-size: 14px;
        }

        .urgent-details {
          background: rgba(255, 71, 87, 0.1);
          padding: 12px;
          border-radius: 8px;
          margin: 15px 0;
          border-left: 3px solid #ff4757;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .label {
          color: #666;
          font-weight: 500;
        }

        .value {
          font-weight: 600;
          color: #1a1a1a;
        }

        .deadline-critical {
          color: #d32f2f;
          animation: urgent-text 1s infinite;
        }

        .deadline-high {
          color: #f57c00;
        }

        .skills-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 15px 0;
        }

        .skill-tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .job-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-top: 15px;
        }

        .apply-btn {
          flex: 1;
          padding: 10px 15px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s ease;
          color: white;
        }

        .apply-btn.critical {
          background: linear-gradient(45deg, #d32f2f, #f44336);
          animation: pulse-apply 2s infinite;
        }

        .apply-btn.high {
          background: linear-gradient(45deg, #f57c00, #ff9800);
        }

        .apply-btn.medium {
          background: linear-gradient(45deg, #fbc02d, #ffeb3b);
          color: #d84315;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }

        .bookmark-btn {
          background: white;
          border: 2px solid #ddd;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bookmark-btn:hover {
          border-color: #ff4757;
          color: #ff4757;
        }

        .view-more-section {
          text-align: center;
          margin-top: 40px;
          position: relative;
          z-index: 2;
        }

        .view-more-btn {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .view-more-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          transform: translateY(-2px);
        }

        @keyframes fire-flicker {
          0% { transform: rotate(-2deg) scale(1); }
          100% { transform: rotate(2deg) scale(1.1); }
        }

        @keyframes pulse-badge {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes urgent-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.7; }
        }

        @keyframes pulse-urgent {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes urgent-text {
          0%, 50% { color: #d32f2f; }
          51%, 100% { color: #f44336; }
        }

        @keyframes pulse-apply {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @media (max-width: 768px) {
          .urgent-jobs-grid {
            grid-template-columns: 1fr;
            padding: 0 15px;
          }
          
          .urgent-title h3 {
            font-size: 20px;
          }
          
          .urgent-subtitle {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default UrgentJobs; 