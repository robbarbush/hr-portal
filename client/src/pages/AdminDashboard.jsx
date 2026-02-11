import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees } from '../api/employees';
import { getAllLeaveRequests } from '../api/leaveRequests';
import { getAllActivityLogs } from '../api/activityLogs';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLeaveRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    deniedRequests: 0
  });
  const [activityLogs, setActivityLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

  useEffect(() => {
    fetchStats();
    fetchActivityLogs();
  }, []);

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

  const fetchActivityLogs = async () => {
    try {
      const logs = await getAllActivityLogs();
      setActivityLogs(logs);
    } catch (error) {
      console.error('Failed to fetch activity logs:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  // Get unique usernames for filter
  const uniqueUsers = [...new Set(activityLogs.map(log => log.username))].sort();

  // Filter logs
  const filteredLogs = activityLogs.filter(log => {
    if (filterUser !== 'all' && log.username !== filterUser) return false;
    if (filterRole !== 'all' && log.role !== filterRole) return false;
    return true;
  });

  // Sort logs
  const sortedLogs = [...filteredLogs].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'timestamp') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Export logs to CSV
  const exportLogsToCSV = () => {
    const headers = ['Timestamp', 'Username', 'Email', 'Role', 'Action', 'Details'];
    const rows = sortedLogs.map(log => [
      log.timestamp ? new Date(log.timestamp).toLocaleString() : '',
      log.username,
      log.email || '',
      log.role,
      log.action,
      log.details || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'hr': return 'badge-info';
      case 'employee': return 'badge-approved';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title" style={{ color: '#6f42c1' }}>Admin Dashboard</h1>
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

          <div className="divider" style={{ background: 'linear-gradient(to right, #6f42c1, #a855f7)' }}></div>

          {/* Activity Logs Section */}
          <div className="section">
            <div className="section-header">
              <h2>Activity Logs</h2>
              <button className="btn btn-success" onClick={exportLogsToCSV}>
                Export CSV
              </button>
            </div>

            {/* Filters */}
            <div className="filter-bar">
              <div className="filter-group">
                <label>Filter by User:</label>
                <select 
                  value={filterUser} 
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="form-control filter-select"
                >
                  <option value="all">All Users</option>
                  {uniqueUsers.map(username => (
                    <option key={username} value={username}>{username}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by Role:</label>
                <select 
                  value={filterRole} 
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="form-control filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>

            {logsLoading ? (
              <div className="loading">Loading activity logs...</div>
            ) : sortedLogs.length === 0 ? (
              <div className="card">
                <div className="empty-state">No activity logs found.</div>
              </div>
            ) : (
              <div className="card">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('timestamp')} className="sortable-header">
                          Timestamp {getSortIcon('timestamp')}
                        </th>
                        <th onClick={() => handleSort('username')} className="sortable-header">
                          Username {getSortIcon('username')}
                        </th>
                        <th onClick={() => handleSort('role')} className="sortable-header">
                          Role {getSortIcon('role')}
                        </th>
                        <th onClick={() => handleSort('action')} className="sortable-header">
                          Action {getSortIcon('action')}
                        </th>
                        <th>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedLogs.map(log => (
                        <tr key={log.id}>
                          <td>{formatTimestamp(log.timestamp)}</td>
                          <td>
                            <strong>{log.username}</strong>
                            {log.email && <div className="text-muted text-small">{log.email}</div>}
                          </td>
                          <td>
                            <span className={`badge ${getRoleBadgeClass(log.role)}`}>
                              {log.role}
                            </span>
                          </td>
                          <td>{log.action}</td>
                          <td>{log.details || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  Showing: {sortedLogs.length} of {activityLogs.length} log entries
                </div>
              </div>
            )}
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
