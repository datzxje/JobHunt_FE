'use client'

import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import api from "../../../../../utils/api/api";
import { useCompanyAdminAuth } from "../../../../../context/CompanyAdminAuthContext";

const JoinRequestsTable = forwardRef(({ filter = "all" }, ref) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { user, companyId, refreshPendingRequestsCount } = useCompanyAdminAuth();

  // Expose handleReload to parent component
  useImperativeHandle(ref, () => ({
    handleReload: fetchJoinRequests
  }));

  // Add debug logging for auth context
  useEffect(() => {
    console.log("=== JOIN REQUESTS TABLE AUTH DEBUG ===");
    console.log("User context:", user);
    console.log("Company ID:", companyId);
    console.log("User role:", user?.role);
    console.log("Is admin:", user?.role === 'ADMIN');
  }, [user, companyId]);

  // Load join requests from API
  useEffect(() => {
    fetchJoinRequests();
  }, [companyId, user]);

  const fetchJoinRequests = async () => {
    if (!companyId) {
      console.log("No companyId available:", companyId);
      setLoading(false);
      return;
    }

    if (!user) {
      console.log("No user available:", user);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("=== FETCHING JOIN REQUESTS ===");
      console.log("Company ID:", companyId);
      console.log("User:", user);
      console.log("User role:", user.role);
      console.log("Request params:", { page: 0, size: 100 });
      
      const response = await api.getJoinRequests(companyId, {
        page: 0,
        size: 100 
      });
      
      console.log("=== API RESPONSE ===");
      console.log("Raw response:", response);
      
      // Extract data from response - fix for actual response format
      const requests = Array.isArray(response.data) ? response.data : [];
      console.log("Extracted requests array:", requests);
      
      if (!Array.isArray(requests)) {
        console.error("Invalid response format - expected array:", requests);
        setError("Invalid response format from server");
        return;
      }
      
      // Transform backend response with new requirements
      const transformedRequests = requests.map(request => {
        console.log("Processing request:", request);
        
        const transformed = {
          id: request.id,
          fullName: request.userName || 'N/A',
          email: request.userEmail || 'N/A',
          avatar: request.userProfilePicture || "/images/resource/candidate-1.png",
          position: request.position || "Employer",
          department: request.department || "HR",
          requestDate: request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A',
          status: request.status?.toLowerCase() || "pending",
          message: request.message || "",
          reviewedBy: request.reviewedByName,
          reviewedAt: request.reviewedAt
        };
        
        console.log("Transformed request:", transformed);
        return transformed;
      });
      
      console.log("Final transformed requests:", transformedRequests);
      setJoinRequests(transformedRequests);
    } catch (err) {
      console.error("=== API ERROR ===");
      console.error("Error loading join requests:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data,
        stack: err.stack
      });
      setError(`Không thể tải danh sách yêu cầu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Add debug logging for filtered requests
  useEffect(() => {
    console.log("Current filter:", filter);
    console.log("Current joinRequests:", joinRequests);
    
    if (filter === "all") {
      setFilteredRequests(joinRequests);
    } else {
      const filtered = joinRequests.filter(request => request.status === filter);
      console.log("Filtered requests:", filtered);
      setFilteredRequests(filtered);
    }
  }, [filter, joinRequests]);

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleApprove = async (requestId) => {
    if (!user?.id) {
      alert("Không thể xác định người duyệt / Cannot identify reviewer");
      return;
    }

    try {
      setActionLoading(true);
      
      // Call real API to approve join request
      await api.approveJoinRequest(requestId, user.id);
      
      // Update local state
      setJoinRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: "approved", reviewedBy: user.name || user.email }
            : request
        )
      );
      
      // Refresh pending requests count in context
      if (refreshPendingRequestsCount) {
        await refreshPendingRequestsCount();
      }
      
      console.log("Join request approved successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Error approving join request:", err);
      alert(`Lỗi khi duyệt yêu cầu: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId, reason = "") => {
    if (!user?.id) {
      alert("Không thể xác định người duyệt / Cannot identify reviewer");
      return;
    }

    try {
      setActionLoading(true);
      
      // Call real API to reject join request
      await api.rejectJoinRequest(requestId, user.id);
      
      // Update local state
      setJoinRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: "rejected", rejectionReason: reason, reviewedBy: user.name || user.email }
            : request
        )
      );
      
      // Refresh pending requests count in context
      if (refreshPendingRequestsCount) {
        await refreshPendingRequestsCount();
      }
      
      console.log("Join request rejected successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Error rejecting join request:", err);
      alert(`Lỗi khi từ chối yêu cầu: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "badge-warning",
      approved: "badge-success",
      rejected: "badge-danger"
    };
    
    const labels = {
      pending: "Đang chờ",
      approved: "Đã duyệt", 
      rejected: "Đã từ chối"
    };
    
    return (
      <span className={`badge ${badges[status] || "badge-secondary"}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Đang tải danh sách yêu cầu...</p>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle"></i> 
        Không thể xác định ID công ty. Vui lòng đăng nhập lại. / Cannot determine company ID. Please login again.
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-warning">
        <i className="fas fa-exclamation-triangle"></i> {error}
        <p className="mb-0 mt-2">
          <small>Hiển thị dữ liệu mẫu để demo / Showing mock data for demo</small>
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Development Warning */}
      {companyId === 1 && (
        <div className="alert alert-info mb-3">
          <i className="fas fa-info-circle"></i> 
          <strong>Development Mode:</strong> Sử dụng companyId mặc định (1). Trong production, user cần có role ADMIN và thuộc về company. / 
          Using default companyId (1). In production, user needs ADMIN role and company membership.
        </div>
      )}

      <div className="table-outer">
        <div className="table-responsive">
          <table className="default-table manage-job-table">
            <thead>
              <tr>
                <th>Họ và tên</th>
                <th>Vị trí</th>
                <th>Phòng ban</th>
                <th>Ngày yêu cầu</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    <div className="empty-state">
                      <i className="las la-inbox" style={{fontSize: "48px", color: "#ddd"}}></i>
                      <p className="mt-2 mb-0">
                        {filter === "all" 
                          ? "Không có yêu cầu tham gia nào"
                          : `Không có yêu cầu nào với trạng thái "${filter}"`
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              <img 
                                src={request.avatar}
                                alt={request.fullName}
                                style={{width: "40px", height: "40px", borderRadius: "50%"}}
                              />
                            </span>
                            <h4>
                              <a href="#" onClick={() => handleViewDetails(request)}>
                                {request.fullName}
                              </a>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-mail"></span>
                                {request.email}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{request.position}</td>
                    <td>{request.department}</td>
                    <td>{request.requestDate}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button 
                              onClick={() => handleViewDetails(request)}
                              className="btn btn-sm btn-outline-primary"
                              title="Xem chi tiết"
                            >
                              <i className="la la-eye"></i>
                            </button>
                          </li>
                          {request.status === "pending" && (
                            <>
                              <li>
                                <button 
                                  onClick={() => handleApprove(request.id)}
                                  className="btn btn-sm btn-success"
                                  title="Duyệt"
                                  disabled={actionLoading}
                                >
                                  <i className="la la-check"></i>
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => handleReject(request.id)}
                                  className="btn btn-sm btn-danger"
                                  title="Từ chối"
                                  disabled={actionLoading}
                                >
                                  <i className="la la-times"></i>
                                </button>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className={`modal fade ${showModal ? 'show' : ''}`} 
             style={{display: showModal ? 'block' : 'none'}}
             tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chi tiết yêu cầu tham gia / Join Request Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img 
                      src={selectedRequest.avatar}
                      alt={selectedRequest.fullName}
                      className="rounded-circle mb-3"
                      style={{width: "120px", height: "120px", objectFit: "cover"}}
                    />
                    <h5>{selectedRequest.fullName}</h5>
                    <p className="text-muted">{selectedRequest.email}</p>
                  </div>
                  <div className="col-md-8">
                    <div className="candidate-info">
                      <div className="info-item mb-3">
                        <strong>Vị trí ứng tuyển / Applied Position:</strong>
                        <p>{selectedRequest.position}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Phòng ban / Department:</strong>
                        <p>{selectedRequest.department}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Kinh nghiệm / Experience:</strong>
                        <p>{selectedRequest.candidate?.experience}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Địa điểm / Location:</strong>
                        <p>{selectedRequest.candidate?.location}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Số điện thoại / Phone:</strong>
                        <p>{selectedRequest.candidate?.phone}</p>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Kỹ năng / Skills:</strong>
                        <div className="skills-tags">
                          {selectedRequest.candidate?.skills?.map((skill, index) => (
                            <span key={index} className="badge bg-light text-dark me-1 mb-1">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="info-item mb-3">
                        <strong>Thông điệp / Message:</strong>
                        <p className="border p-3 bg-light rounded">
                          {selectedRequest.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                {selectedRequest.status === "pending" && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-success"
                      onClick={() => handleApprove(selectedRequest.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="la la-check me-2"></i>
                      )}
                      Duyệt / Approve
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger"
                      onClick={() => handleReject(selectedRequest.id)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <span className="spinner-border spinner-border-sm me-2"></span>
                      ) : (
                        <i className="la la-times me-2"></i>
                      )}
                      Từ chối / Reject
                    </button>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowModal(false)}
                >
                  Đóng / Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
});

export default JoinRequestsTable; 