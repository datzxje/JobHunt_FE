'use client'

import { useState } from "react";
import Image from "next/image";

const TeamMembersGrid = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@techcorp.com",
      role: "Company Admin",
      department: "Management",
      joinDate: "2023-01-15",
      status: "active",
      avatar: "/images/resource/candidate-1.png",
      phone: "+1 234 567 8900",
      permissions: ["manage_users", "manage_company", "manage_jobs", "view_reports"]
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@techcorp.com", 
      role: "Company Admin",
      department: "Management",
      joinDate: "2023-02-20",
      status: "active",
      avatar: "/images/resource/candidate-2.png",
      phone: "+1 234 567 8901",
      permissions: ["manage_users", "manage_company", "manage_jobs", "view_reports"]
    },
    {
      id: 3,
      name: "Carol Wilson",
      email: "carol.wilson@techcorp.com",
      role: "HR", 
      department: "Human Resources",
      joinDate: "2023-01-10",
      status: "active",
      avatar: "/images/resource/candidate-3.png",
      phone: "+1 234 567 8902",
      permissions: ["manage_users", "manage_jobs", "view_reports"]
    },
    {
      id: 4,
      name: "David Brown",
      email: "david.brown@techcorp.com",
      role: "HR",
      department: "Human Resources",
      joinDate: "2023-03-01",
      status: "active",
      avatar: "/images/resource/candidate-4.png",
      phone: "+1 234 567 8903",
      permissions: ["manage_jobs", "view_reports"]
    },
    {
      id: 5,
      name: "Eva Garcia",
      email: "eva.garcia@techcorp.com",
      role: "HR",
      department: "Human Resources",
      joinDate: "2023-02-15",
      status: "inactive",
      avatar: "/images/resource/candidate-5.png",
      phone: "+1 234 567 8904",
      permissions: ["view_reports"]
    },
    {
      id: 6,
      name: "Frank Miller",
      email: "frank.miller@techcorp.com",
      role: "HR",
      department: "Human Resources", 
      joinDate: "2023-01-25",
      status: "active",
      avatar: "/images/resource/candidate-6.png",
      phone: "+1 234 567 8905",
      permissions: ["manage_jobs", "view_reports"]
    }
  ]);

  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleTransferAdmin = (member) => {
    setSelectedMember(member);
    setShowTransferModal(true);
  };

  const handleRemoveMember = (id) => {
    if (window.confirm("Are you sure you want to remove this member from the company?")) {
      setTeamMembers(members => members.filter(member => member.id !== id));
      // TODO: Call API to remove member
      console.log(`Removed member ${id}`);
    }
  };

  const handleToggleStatus = (id) => {
    setTeamMembers(members => 
      members.map(member => 
        member.id === id 
          ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
          : member
      )
    );
    // TODO: Call API to update status
  };

  const getRoleBadge = (role) => {
    const badges = {
      'Company Admin': 'badge badge-danger',
      'HR': 'badge badge-success'
    };
    return badges[role] || 'badge badge-light';
  };

  const getStatusBadge = (status) => {
    return status === 'active' ? 'badge badge-success' : 'badge badge-secondary';
  };

  return (
    <>
      <div className="table-outer">
        <table className="default-table manage-job-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Role</th>
              <th>Department</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="job-block d-flex align-items-center">
                    <div className="inner-box">
                      <div className="content d-flex align-items-center">
                        <span className="company-logo me-3">
                          <Image
                            width={50}
                            height={49}
                            src={member.avatar}
                            alt="avatar"
                          />
                        </span>
                        <div>
                          <h4 className="mb-1">{member.name}</h4>
                          <div className="job-info">
                            <span className="text-muted">{member.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>

                <td>
                  <span className={getRoleBadge(member.role)}>
                    {member.role}
                  </span>
                </td>

                <td>{member.department}</td>

                <td>
                  {new Date(member.joinDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>

                <td>
                  <span className={getStatusBadge(member.status)}>
                    {member.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>

                <td>
                  <div className="option-box d-flex gap-2">
                    <button
                      className="option-btn"
                      onClick={() => handleEditMember(member)}
                      title="Edit Member"
                    >
                      <span className="la la-edit"></span>
                    </button>

                    {member.role !== 'Company Admin' && (
                      <button
                        className="option-btn text-info"
                        onClick={() => handleTransferAdmin(member)}
                        title="Transfer Admin Rights"
                      >
                        <span className="la la-crown"></span>
                      </button>
                    )}

                    <button
                      className={`option-btn ${member.status === 'active' ? 'text-warning' : 'text-success'}`}
                      onClick={() => handleToggleStatus(member.id)}
                      title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      <span className={`la ${member.status === 'active' ? 'la-pause' : 'la-play'}`}></span>
                    </button>

                    <button
                      className="option-btn text-danger"
                      onClick={() => handleRemoveMember(member.id)}
                      title="Remove Member"
                    >
                      <span className="la la-trash"></span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Member: {selectedMember.name}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="row">
                    <div className="col-12 text-center mb-3">
                      <Image
                        width={80}
                        height={80}
                        src={selectedMember.avatar}
                        alt="avatar"
                        className="rounded-circle"
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          className="form-control"
                          defaultValue={selectedMember.name}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          className="form-control"
                          defaultValue={selectedMember.email}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Role</label>
                        <select className="form-control" defaultValue={selectedMember.role}>
                          <option value="HR">HR</option>
                          <option value="Company Admin">Company Admin</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Department</label>
                        <select className="form-control" defaultValue={selectedMember.department}>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Management">Management</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-group">
                        <label>Permissions</label>
                        <div className="permissions-grid">
                          {['manage_users', 'manage_company', 'manage_jobs', 'view_reports'].map(permission => (
                            <label key={permission} className="permission-item">
                              <input
                                type="checkbox"
                                defaultChecked={selectedMember.permissions.includes(permission)}
                              />
                              <span className="ms-2">
                                {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="theme-btn btn-style-one"
                  onClick={() => setShowEditModal(false)}
                >
                  Save Changes
                </button>
                <button
                  className="theme-btn btn-style-three"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Admin Modal */}
      {showTransferModal && selectedMember && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Transfer Admin Rights</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTransferModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center">
                  <i className="la la-crown text-warning" style={{ fontSize: '48px' }}></i>
                  <h5 className="mt-3">Transfer Admin Rights to {selectedMember.name}?</h5>
                  <p className="text-muted">
                    This will transfer all company admin privileges to {selectedMember.name}. 
                    You will become a regular HR member and lose admin access.
                  </p>
                  <div className="alert alert-warning">
                    <strong>Warning:</strong> This action cannot be undone easily. 
                    Make sure you trust this person with full company management access.
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="theme-btn btn-style-four"
                  onClick={() => {
                    // TODO: Call API to transfer admin rights
                    console.log(`Transferring admin rights to ${selectedMember.name}`);
                    setShowTransferModal(false);
                  }}
                >
                  <i className="la la-crown me-2"></i>
                  Transfer Admin Rights
                </button>
                <button
                  className="theme-btn btn-style-three"
                  onClick={() => setShowTransferModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TeamMembersGrid; 