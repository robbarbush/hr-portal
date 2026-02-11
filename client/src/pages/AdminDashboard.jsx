import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees } from '../api/employees';
import { getAllLeaveRequests } from '../api/leaveRequests';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaveRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    deniedRequests: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employees, leaveRequests] = await Promise.all([
          getAllEmployees(),
          getAllLeaveRequests()
        ]);

        setStats({
          totalEmployees: employees.length,
          totalLeaveRequests: leaveRequests.length,
          pendingRequests: leaveRequests.filter(r => r.status === 'pending').length,
          approvedRequests: leaveRequests.filter(r => r.status === 'approved').length,
          deniedRequests: leaveRequests.filter(r => r.status === 'denied').length
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: '#6f42c1' }}>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">↪</span> Logout
        </button>
      </div>

      <div className="divider" style={{ background: 'linear-gradient(to right, #6f42c1, #a855f7)' }}></div>

      {isLoading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="section">
            <h2>System Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{stats.totalEmployees}</div>
                <div className="stat-label">Total Employees</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{stats.totalLeaveRequests}</div>
                <div className="stat-label">Total Leave Requests</div>
              </div>
              <div className="stat-card stat-pending">
                <div className="stat-number">{stats.pendingRequests}</div>
                <div className="stat-label">Pending Requests</div>
              </div>
              <div className="stat-card stat-approved">
                <div className="stat-number">{stats.approvedRequests}</div>
                <div className="stat-label">Approved Requests</div>
              </div>
              <div className="stat-card stat-denied">
                <div className="stat-number">{stats.deniedRequests}</div>
                <div className="stat-label">Denied Requests</div>
              </div>
            </div>
          </div>

          <div className="section">
            <h2>Quick Actions</h2>
            <div className="admin-actions">
              <button className="btn btn-primary" onClick={() => navigate('/hr')}>
                Go to HR Dashboard
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/hr/employees')}>
                Manage Employees
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/hr/leave-requests')}>
                Manage Leave Requests
              </button>
            </div>
          </div>

          <div className="section">
            <h2>System Information</h2>
            <div className="card">
              <div className="profile-info">
                <div className="profile-row">
                  <span className="label">Logged in as:</span>
                  <span className="value">{user?.name}</span>
                </div>
                <div className="profile-row">
                  <span className="label">Role:</span>
                  <span className="value">Administrator</span>
                </div>
                <div className="profile-row">
                  <span className="label">Email:</span>
                  <span className="value">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
