import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees, createEmployee } from '../api/employees';
import { getAllLeaveRequests } from '../api/leaveRequests';

function HRDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    deniedRequests: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    title: '',
    startDate: ''
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [employees, leaveRequests] = await Promise.all([
        getAllEmployees(),
        getAllLeaveRequests()
      ]);

      setStats({
        totalEmployees: employees.length,
        pendingRequests: leaveRequests.filter(r => r.status === 'pending').length,
        approvedRequests: leaveRequests.filter(r => r.status === 'approved').length,
        deniedRequests: leaveRequests.filter(r => r.status === 'denied').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await createEmployee(formData);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        title: '',
        startDate: ''
      });
      fetchStats();
    } catch (err) {
      setError('Failed to add employee. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">HR Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">↪</span> Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="section">
        <h2>Overview</h2>
        {statsLoading ? (
          <div className="loading">Loading statistics...</div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalEmployees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
            <div className="stat-card stat-pending">
              <div className="stat-number">{stats.pendingRequests}</div>
              <div className="stat-label">Pending Requests</div>
            </div>
            <div className="stat-card stat-approved">
              <div className="stat-number">{stats.approvedRequests}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card stat-denied">
              <div className="stat-number">{stats.deniedRequests}</div>
              <div className="stat-label">Denied</div>
            </div>
          </div>
        )}
      </div>

      <div className="divider"></div>

      <div className="add-employee-section">
        <div className="add-employee-card">
          <h3>Add New Employee</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Employee
          </button>
        </div>
      </div>

      <div className="divider"></div>

      {/* Quick Links */}
      <div className="section">
        <h2>Quick Actions</h2>
        <div className="admin-actions">
          <button className="btn btn-primary" onClick={() => navigate('/hr/employees')}>
            Manage Employees
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/hr/leave-requests')}>
            Manage Leave Requests
          </button>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;
