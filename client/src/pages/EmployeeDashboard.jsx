import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLeaveRequestsByEmployeeId, createLeaveRequest } from '../api/leaveRequests';
import StatusBadge from '../components/StatusBadge';

function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [user.id]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const data = await getLeaveRequestsByEmployeeId(user.id);
      setLeaveRequests(data);
    } catch (err) {
      setError('Failed to load leave requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setError('');

    try {
      await createLeaveRequest({
        employeeId: user.id,
        ...formData,
      });
      setFormData({ startDate: '', endDate: '', reason: '' });
      setSubmitSuccess(true);
      fetchLeaveRequests();
    } catch (err) {
      setError('Failed to submit leave request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h2>My Profile</h2>
          <div className="profile-info">
            <div className="profile-row">
              <span className="label">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="profile-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            <div className="profile-row">
              <span className="label">Phone:</span>
              <span className="value">{user.phone}</span>
            </div>
            <div className="profile-row">
              <span className="label">Department:</span>
              <span className="value">{user.department}</span>
            </div>
            <div className="profile-row">
              <span className="label">Title:</span>
              <span className="value">{user.title}</span>
            </div>
            <div className="profile-row">
              <span className="label">Start Date:</span>
              <span className="value">{user.startDate}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Request Leave</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {submitSuccess && (
            <div className="alert alert-success">Leave request submitted successfully!</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h2>My Leave Requests</h2>
        {isLoading ? (
          <div className="loading">Loading leave requests...</div>
        ) : leaveRequests.length === 0 ? (
          <p className="empty-state">No leave requests found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default EmployeeDashboard;
