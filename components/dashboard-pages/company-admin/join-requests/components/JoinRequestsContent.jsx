'use client'

import { useState, useRef } from "react";
import JoinRequestsTable from "./JoinRequestsTable";

const JoinRequestsContent = () => {
  const [filter, setFilter] = useState("all");
  const tableRef = useRef();

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleReload = () => {
    if (tableRef.current && tableRef.current.handleReload) {
      tableRef.current.handleReload();
    }
  };

  return (
    <div className="row">
      <div className="col-lg-12">
        {/* <!-- Join Requests Widget --> */}
        <div className="ls-widget">
          <div className="tabs-box">
            <div className="widget-title">
              <h4>Yêu cầu tham gia / Join Requests</h4>
              <div className="chosen-outer">
                <button 
                  className="reload-btn me-3"
                  onClick={handleReload}
                  title="Tải lại dữ liệu / Reload data"
                >
                  <i className="la la-refresh"></i>
                </button>
                <select 
                  className="chosen-single form-select"
                  value={filter}
                  onChange={handleFilterChange}
                >
                  <option value="all">Tất cả / All Requests</option>
                  <option value="pending">Đang chờ / Pending</option>
                  <option value="approved">Đã duyệt / Approved</option>
                  <option value="rejected">Đã từ chối / Rejected</option>
                </select>
              </div>
            </div>
            {/* End widget-title */}

            <div className="widget-content">
              <JoinRequestsTable ref={tableRef} filter={filter} />
            </div>
            {/* End widget-content */}
          </div>
        </div>
        {/* <!-- End Join Requests Widget --> */}
      </div>
    </div>
  );
};

export default JoinRequestsContent; 