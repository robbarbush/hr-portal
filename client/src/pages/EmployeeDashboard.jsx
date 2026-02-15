import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeaveRequestsByEmployeeId } from '../api/leaveRequests';

function EmployeeDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (user?.id) {
        try {
          const data = await getLeaveRequestsByEmployeeId(user.id);
          setLeaveRequests(data);
        } catch (error) {
          console.error('Failed to fetch leave requests:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchLeaveRequests();
  }, [user]);

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  const getEmploymentStatusBadgeClass = (status) => {
    if (!status) return 'badge-warning';
    switch (status.toLowerCase()) {
      case 'active': return 'badge-approved';
      case 'probationary': return 'badge-pending';
      case 'on leave': return 'badge-info';
      default: return 'badge-pending';
    }
  };

  // Calculate stats
  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    denied: leaveRequests.filter(r => r.status === 'denied').length
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}</h1>
      </div>

      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="card">
          <h2>My Profile</h2>
          <div className="profile-info">
            <div className="profile-row">
              <span className="label">Name:</span>
              <span className="value">{user?.name}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Department:</span>
              <span className="value">{user?.department || '-'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Title:</span>
              <span className="value">{user?.title || '-'}</span>
            </div>
            <div className="profile-row">
              <span className="label">Status:</span>
              <span className="value">
                {user?.status ? (
                  <span className={`badge ${getEmploymentStatusBadgeClass(user.status)}`}>
                    {user.status}
                  </span>
                ) : (
                  '-'
                )}
              </span>
            </div>
            <div className="profile-row">
              <span className="label">Type:</span>
              <span className="value">
                {user?.employmentType ? (
                  <span className="badge badge-info">{user.employmentType}</span>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/employee/profile')}
            >
              View Full Profile
            </button>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/employee/leave-request')}
            >
              Request Leave
            </button>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/employee/service-request')}
            >
              Service Request
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/employee/policy')}
            >
              View Policies
            </button>
          </div>
        </div>
      </div>

      {/* Leave Request Stats */}
      <div className="card">
        <h2>My Leave Requests</h2>
        <div className="stats-grid" style={{ marginBottom: '1rem' }}>
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Requests</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-number">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card stat-approved">
            <div className="stat-number">{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
          <div className="stat-card stat-denied">
            <div className="stat-number">{stats.denied}</div>
            <div className="stat-label">Denied</div>
          </div>
        </div>

        {isLoading ? (
          <div className="loading">Loading leave requests...</div>
        ) : leaveRequests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any leave requests yet.</p>
            <button 
              className="btn btn-primary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/employee/leave-request')}
            >
              Submit Your First Request
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.leaveType || 'Leave'}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>{getStatusBadge(request.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
