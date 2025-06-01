'use client'

import { useState, useEffect } from "react";
import api from "../../../../../utils/api/api";
import { useCompanyAdminAuth } from "../../../../../context/CompanyAdminAuthContext";

const JoinRequestsTable = ({ filter = "all" }) => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { user, companyId } = useCompanyAdminAuth();

  // Load join requests from API
  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        console.log("Loading join requests for company:", companyId);
        
        // Call real API to get join requests
        const response = await api.getJoinRequests(companyId, {
          page: 0,
          size: 100 // Get all requests for now
        });
        
        const requests = response.data?.content || response.content || [];
        
        // Transform backend response to frontend format
        const transformedRequests = requests.map(request => ({
          id: request.id,
          candidate: {
            name: request.userName,
            email: request.userEmail,
            avatar: request.userProfilePicture || "/images/resource/candidate-1.png",
            phone: "N/A", // Not available in backend response
            location: "N/A", // Not available in backend response  
            experience: "N/A", // Not available in backend response
            skills: [] // Not available in backend response
          },
          position: "N/A", // Not available in backend response - might need to add this field
          department: "N/A", // Not available in backend response - might need to add this field
          requestDate: request.requestedAt || request.createdAt,
          status: request.status?.toLowerCase() || "pending",
          message: request.message || "",
          reviewedBy: request.reviewedByName,
          reviewedAt: request.reviewedAt
        }));
        
        console.log("Join requests loaded:", transformedRequests);
        setJoinRequests(transformedRequests);
      } catch (err) {
        console.error("Error loading join requests:", err);
        setError(`Không thể tải danh sách yêu cầu: ${err.message}`);
        
        // Fallback to mock data if API fails
        const mockRequests = [
          {
            id: 1,
            candidate: {
              name: "John Doe",
              email: "john.doe@example.com",
              avatar: "/images/resource/candidate-1.png",
              phone: "+84 123 456 789",
              location: "Ho Chi Minh City",
              experience: "5 years",
              skills: ["React", "Node.js", "JavaScript", "TypeScript"]
            },
            position: "Senior Frontend Developer",
            department: "Engineering",
            requestDate: "2024-01-15",
            status: "pending",
            message: "Tôi rất quan tâm đến vị trí này và muốn đóng góp cho sự phát triển của công ty."
          },
          {
            id: 2,
            candidate: {
              name: "Jane Smith",
              email: "jane.smith@example.com",
              avatar: "/images/resource/candidate-2.png",
              phone: "+84 987 654 321",
              location: "Hanoi",
              experience: "3 years",
              skills: ["UI/UX Design", "Figma", "Adobe Creative Suite"]
            },
            position: "UI/UX Designer",
            department: "Design",
            requestDate: "2024-01-14",
            status: "approved",
            message: "I have strong background in user experience design and would love to join your creative team."
          }
        ];
        
        setJoinRequests(mockRequests);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinRequests();
  }, [companyId]);

  // Filter requests based on status from parent component
  useEffect(() => {
    if (filter === "all") {
      setFilteredRequests(joinRequests);
    } else {
      setFilteredRequests(joinRequests.filter(request => request.status === filter));
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
                <th>Ứng viên / Candidate</th>
                <th>Vị trí / Position</th>
                <th>Phòng ban / Department</th>
                <th>Ngày yêu cầu / Request Date</th>
                <th>Trạng thái / Status</th>
                <th>Hành động / Action</th>
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
                          ? "Không có yêu cầu tham gia nào / No join requests found"
                          : `Không có yêu cầu nào với trạng thái "${filter}" / No requests with "${filter}" status`
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
                                src={request.candidate?.avatar || "/images/resource/candidate-1.png"} 
                                alt={request.candidate?.name}
                                style={{width: "40px", height: "40px", borderRadius: "50%"}}
                              />
                            </span>
                            <h4>
                              <a href="#" onClick={() => handleViewDetails(request)}>
                                {request.candidate?.name}
                              </a>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-mail"></span>
                                {request.candidate?.email}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>{request.position}</td>
                    <td>{request.department}</td>
                    <td>{new Date(request.requestDate).toLocaleDateString('vi-VN')}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button 
                              onClick={() => handleViewDetails(request)}
                              className="btn btn-sm btn-outline-primary"
                              title="Xem chi tiết / View Details"
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
                                  title="Duyệt / Approve"
                                  disabled={actionLoading}
                                >
                                  <i className="la la-check"></i>
                                </button>
                              </li>
                              <li>
                                <button 
                                  onClick={() => handleReject(request.id)}
                                  className="btn btn-sm btn-danger"
                                  title="Từ chối / Reject"
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
                      src={selectedRequest.candidate?.avatar || "/images/resource/candidate-1.png"}
                      alt={selectedRequest.candidate?.name}
                      className="rounded-circle mb-3"
                      style={{width: "120px", height: "120px", objectFit: "cover"}}
                    />
                    <h5>{selectedRequest.candidate?.name}</h5>
                    <p className="text-muted">{selectedRequest.candidate?.email}</p>
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
};

export default JoinRequestsTable; 