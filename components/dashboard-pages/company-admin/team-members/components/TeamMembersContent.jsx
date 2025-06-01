'use client'

import { useState, useEffect } from "react";
import api from "../../../../../utils/api/api";
import { useCompanyAdminAuth } from "../../../../../context/CompanyAdminAuthContext";
import TeamStats from "./TeamStats";

const TeamMembersContent = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalAdmins: 0,
    activeEmployers: 0,
    pendingRequests: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const { user, companyId, isAdmin } = useCompanyAdminAuth();

  // Load team members and stats from API
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        
        console.log("Loading team members for company:", companyId);
        
        // Fetch team members and stats in parallel
        const [membersResponse, statsResponse] = await Promise.all([
          api.getTeamMembers(companyId, { page: 0, size: 100 }),
          api.getTeamStats(companyId)
        ]);
        
        const members = membersResponse.data?.content || membersResponse.content || [];
        
        // Transform backend response to frontend format
        const transformedMembers = members.map(member => ({
          id: member.id,
          name: member.userName,
          email: member.userEmail,
          avatar: member.userProfilePicture || "/images/resource/candidate-1.png",
          role: member.role?.toLowerCase() || "member",
          department: member.department || "N/A",
          position: "N/A", // Not available in backend response
          status: member.status?.toLowerCase() || "active",
          joinDate: member.joinedAt || member.createdAt,
          lastLogin: member.updatedAt, // Using updatedAt as proxy for last activity
          permissions: [] // Not available in backend response
        }));
        
        console.log("Team members loaded:", transformedMembers);
        setTeamMembers(transformedMembers);
        setFilteredMembers(transformedMembers);
        
        // Set stats from API response
        const statsData = statsResponse.data || statsResponse;
        const newStats = {
          totalMembers: statsData.totalMembers || 0,
          totalAdmins: statsData.admins || 0,
          activeEmployers: statsData.activeMembers || 0,
          pendingRequests: statsData.pendingRequests || 0
        };
        setStats(newStats);
        
      } catch (err) {
        console.error("Error loading team data:", err);
        setError(`Không thể tải dữ liệu nhóm: ${err.message}`);
        
        // Fallback to mock data if API fails
        const mockMembers = [
          {
            id: 1,
            name: "John Smith",
            email: "john.smith@company.com",
            avatar: "/images/resource/team-1.jpg",
            role: "admin",
            department: "Engineering",
            position: "Technical Lead",
            status: "active",
            joinDate: "2023-01-15",
            lastLogin: "2024-01-15T10:30:00Z",
            permissions: ["manage_team", "manage_projects", "admin_access"]
          },
          {
            id: 2,
            name: "Jane Doe",
            email: "jane.doe@company.com",
            avatar: "/images/resource/team-2.jpg",
            role: "member",
            department: "Engineering",
            position: "Senior Developer",
            status: "active",
            joinDate: "2023-03-20",
            lastLogin: "2024-01-14T15:45:00Z",
            permissions: ["view_projects", "edit_profile"]
          }
        ];
        
        setTeamMembers(mockMembers);
        setFilteredMembers(mockMembers);
        setStats({
          totalMembers: mockMembers.length,
          totalAdmins: mockMembers.filter(m => m.role === 'admin').length,
          activeEmployers: mockMembers.filter(m => m.status === 'active').length,
          pendingRequests: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [companyId]);

  // Filter members based on selected filter
  useEffect(() => {
    let filtered = teamMembers;
    
    switch (filter) {
      case "admins":
        filtered = teamMembers.filter(member => member.role === 'admin');
        break;
      case "hr":
        filtered = teamMembers.filter(member => member.role === 'hr');
        break;
      case "active":
        filtered = teamMembers.filter(member => member.status === 'active');
        break;
      case "inactive":
        filtered = teamMembers.filter(member => member.status === 'inactive');
        break;
      default:
        filtered = teamMembers;
    }
    
    setFilteredMembers(filtered);
  }, [filter, teamMembers]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleUpdateMember = async (memberId, updateData) => {
    try {
      setActionLoading(true);
      
      // Call real API to update team member
      await api.updateTeamMember(memberId, updateData);
      
      // Update local state
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, ...updateData }
            : member
        )
      );
      
      console.log("Team member updated successfully");
      setShowEditModal(false);
    } catch (err) {
      console.error("Error updating team member:", err);
      alert(`Lỗi khi cập nhật thành viên: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleActivateMember = async (memberId) => {
    try {
      setActionLoading(true);
      
      // Call real API to toggle member status (this will activate if inactive)
      await api.toggleMemberStatus(memberId);
      
      // Update local state
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, status: "active" }
            : member
        )
      );
      
      console.log("Team member activated successfully");
    } catch (err) {
      console.error("Error activating team member:", err);
      alert(`Lỗi khi kích hoạt thành viên: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivateMember = async (memberId) => {
    try {
      setActionLoading(true);
      
      // Call real API to toggle member status (this will deactivate if active)
      await api.toggleMemberStatus(memberId);
      
      // Update local state
      setTeamMembers(prevMembers => 
        prevMembers.map(member => 
          member.id === memberId 
            ? { ...member, status: "inactive" }
            : member
        )
      );
      
      console.log("Team member deactivated successfully");
    } catch (err) {
      console.error("Error deactivating team member:", err);
      alert(`Lỗi khi vô hiệu hóa thành viên: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thành viên này? / Are you sure you want to remove this member?")) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      // Call real API to remove team member
      await api.removeTeamMember(memberId);
      
      // Update local state
      setTeamMembers(prevMembers => 
        prevMembers.filter(member => member.id !== memberId)
      );
      
      console.log("Team member removed successfully");
    } catch (err) {
      console.error("Error removing team member:", err);
      alert(`Lỗi khi xóa thành viên: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferAdmin = (member) => {
    setSelectedMember(member);
    setShowTransferModal(true);
  };

  const handleTransferAdminRights = async (memberId) => {
    if (!user?.id || !companyId) {
      alert("Không thể xác định thông tin cần thiết / Cannot identify required information");
      return;
    }

    try {
      setActionLoading(true);
      
      // Call real API to transfer admin rights
      await api.transferAdminRights(memberId, user.id, companyId);
      
      // Update local state
      setTeamMembers(prevMembers => 
        prevMembers.map(member => {
          if (member.id === memberId) {
            return { ...member, role: "admin", permissions: [...member.permissions, "manage_team", "manage_projects", "admin_access"] };
          } else if (member.role === "admin") {
            return { ...member, role: "member", permissions: member.permissions.filter(p => !["manage_team", "manage_projects", "admin_access"].includes(p)) };
          }
          return member;
        })
      );
      
      console.log("Admin rights transferred successfully");
      setShowTransferModal(false);
    } catch (err) {
      console.error("Error transferring admin rights:", err);
      alert(`Lỗi khi chuyển quyền admin: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: "badge-danger",
      hr: "badge-warning", 
      member: "badge-info"
    };
    
    const labels = {
      admin: "Admin",
      hr: "HR",
      member: "Thành viên"
    };
    
    return (
      <span className={`badge ${badges[role] || "badge-secondary"}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: "badge-success",
      inactive: "badge-secondary",
      pending: "badge-warning"
    };
    
    const labels = {
      active: "Hoạt động",
      inactive: "Không hoạt động",
      pending: "Đang chờ"
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
        <p className="mt-2">Đang tải dữ liệu nhóm...</p>
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

  return (
    <>
      {error && (
        <div className="alert alert-warning mb-4">
          <i className="fas fa-exclamation-triangle"></i> {error}
          <p className="mb-0 mt-2">
            <small>Hiển thị dữ liệu mẫu để demo / Showing mock data for demo</small>
          </p>
        </div>
      )}

      {/* Development Warning */}
      {companyId === 1 && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle"></i> 
          <strong>Development Mode:</strong> Sử dụng companyId mặc định (1). Trong production, user cần có role ADMIN và thuộc về company. / 
          Using default companyId (1). In production, user needs ADMIN role and company membership.
        </div>
      )}

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="ls-widget stats-card">
            <div className="widget-title">
              <div className="icon">
                <i className="la la-users"></i>
              </div>
              <div className="count">{stats.totalMembers}</div>
              <div className="title">Tổng thành viên / Total Members</div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="ls-widget stats-card">
            <div className="widget-title">
              <div className="icon">
                <i className="la la-user-shield"></i>
              </div>
              <div className="count">{stats.totalAdmins}</div>
              <div className="title">Quản trị viên / Admins</div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="ls-widget stats-card">
            <div className="widget-title">
              <div className="icon">
                <i className="la la-user-check"></i>
              </div>
              <div className="count">{stats.activeEmployers}</div>
              <div className="title">Đang hoạt động / Active</div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6 col-md-6">
          <div className="ls-widget stats-card">
            <div className="widget-title">
              <div className="icon">
                <i className="la la-clock"></i>
              </div>
              <div className="count">{stats.pendingRequests}</div>
              <div className="title">Đang chờ / Pending</div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="row">
        <div className="col-lg-12">
          <div className="ls-widget">
            <div className="tabs-box">
              <div className="widget-title">
                <h4>Thành viên nhóm / Team Members</h4>
                <div className="chosen-outer">
                  <select 
                    className="chosen-single form-select" 
                    value={filter}
                    onChange={handleFilterChange}
                  >
                    <option value="all">Tất cả / All Members</option>
                    <option value="admins">Quản trị viên / Admins</option>
                    <option value="hr">HR Members</option>
                    <option value="active">Hoạt động / Active</option>
                    <option value="inactive">Không hoạt động / Inactive</option>
                  </select>
                </div>
              </div>

              <div className="widget-content">
                <div className="table-outer">
                  <div className="table-responsive">
                    <table className="default-table manage-job-table">
                      <thead>
                        <tr>
                          <th>Thành viên / Member</th>
                          <th>Vai trò / Role</th>
                          <th>Phòng ban / Department</th>
                          <th>Trạng thái / Status</th>
                          <th>Ngày tham gia / Join Date</th>
                          <th>Hành động / Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <div className="empty-state">
                                <i className="las la-users" style={{fontSize: "48px", color: "#ddd"}}></i>
                                <p className="mt-2 mb-0">
                                  {filter === "all" 
                                    ? "Không có thành viên nào / No team members found"
                                    : `Không có thành viên nào với bộ lọc "${filter}" / No members found with "${filter}" filter`
                                  }
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member) => (
                            <tr key={member.id}>
                              <td>
                                <div className="job-block">
                                  <div className="inner-box">
                                    <div className="content">
                                      <span className="company-logo">
                                        <img 
                                          src={member.avatar || "/images/resource/candidate-1.png"} 
                                          alt={member.name}
                                          style={{width: "40px", height: "40px", borderRadius: "50%"}}
                                        />
                                      </span>
                                      <h4>
                                        <a href="#" onClick={() => handleEditMember(member)}>
                                          {member.name}
                                        </a>
                                      </h4>
                                      <ul className="job-info">
                                        <li>
                                          <span className="icon flaticon-mail"></span>
                                          {member.email}
                                        </li>
                                        <li>
                                          <span className="icon flaticon-briefcase"></span>
                                          {member.position}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{getRoleBadge(member.role)}</td>
                              <td>{member.department}</td>
                              <td>{getStatusBadge(member.status)}</td>
                              <td>{new Date(member.joinDate).toLocaleDateString('vi-VN')}</td>
                              <td>
                                <div className="option-box">
                                  <ul className="option-list">
                                    <li>
                                      <button 
                                        onClick={() => handleEditMember(member)}
                                        className="btn btn-sm btn-outline-primary"
                                        title="Chỉnh sửa / Edit"
                                      >
                                        <i className="la la-edit"></i>
                                      </button>
                                    </li>
                                    
                                    {isAdmin() && member.id !== user?.id && (
                                      <>
                                        {member.status === "active" ? (
                                          <li>
                                            <button 
                                              onClick={() => handleDeactivateMember(member.id)}
                                              className="btn btn-sm btn-warning"
                                              title="Hủy kích hoạt / Deactivate"
                                              disabled={actionLoading}
                                            >
                                              <i className="la la-pause"></i>
                                            </button>
                                          </li>
                                        ) : (
                                          <li>
                                            <button 
                                              onClick={() => handleActivateMember(member.id)}
                                              className="btn btn-sm btn-success"
                                              title="Kích hoạt / Activate"
                                              disabled={actionLoading}
                                            >
                                              <i className="la la-play"></i>
                                            </button>
                                          </li>
                                        )}
                                        
                                        <li>
                                          <button 
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="btn btn-sm btn-danger"
                                            title="Xóa / Remove"
                                            disabled={actionLoading}
                                          >
                                            <i className="la la-trash"></i>
                                          </button>
                                        </li>
                                        
                                        {member.role !== "admin" && (
                                          <li>
                                            <button 
                                              onClick={() => {
                                                setSelectedMember(member);
                                                setShowTransferModal(true);
                                              }}
                                              className="btn btn-sm btn-info"
                                              title="Chuyển quyền admin / Transfer Admin"
                                              disabled={actionLoading}
                                            >
                                              <i className="la la-crown"></i>
                                            </button>
                                          </li>
                                        )}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Member Modal */}
      {selectedMember && showEditModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chỉnh sửa thành viên / Edit Member
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <label>Vai trò / Role</label>
                      <select 
                        className="form-select"
                        defaultValue={selectedMember.role}
                        onChange={(e) => {
                          setSelectedMember({...selectedMember, role: e.target.value});
                        }}
                      >
                        <option value="member">Thành viên / Member</option>
                        <option value="hr">HR</option>
                        <option value="admin">Quản trị viên / Admin</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Phòng ban / Department</label>
                      <input 
                        type="text" 
                        className="form-control"
                        defaultValue={selectedMember.department}
                        onChange={(e) => {
                          setSelectedMember({...selectedMember, department: e.target.value});
                        }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Vị trí / Position</label>
                      <input 
                        type="text" 
                        className="form-control"
                        defaultValue={selectedMember.position}
                        onChange={(e) => {
                          setSelectedMember({...selectedMember, position: e.target.value});
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => handleUpdateMember(selectedMember.id, {
                    role: selectedMember.role,
                    department: selectedMember.department,
                    position: selectedMember.position
                  })}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Lưu / Save
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy / Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Admin Modal */}
      {selectedMember && showTransferModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Chuyển quyền quản trị / Transfer Admin Rights
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowTransferModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-warning">
                  <i className="fas fa-exclamation-triangle"></i>
                  <p className="mb-2">
                    <strong>Cảnh báo / Warning:</strong>
                  </p>
                  <p>
                    Bạn đang chuẩn bị chuyển quyền quản trị cho <strong>{selectedMember.name}</strong>. 
                    Sau khi chuyển, bạn sẽ không còn là quản trị viên và không thể hoàn tác hành động này.
                  </p>
                  <p className="mb-0">
                    You are about to transfer admin rights to <strong>{selectedMember.name}</strong>. 
                    After transfer, you will no longer be an admin and this action cannot be undone.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => handleTransferAdminRights(selectedMember.id)}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : null}
                  Xác nhận chuyển / Confirm Transfer
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowTransferModal(false)}
                >
                  Hủy / Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showEditModal || showTransferModal) && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default TeamMembersContent; 