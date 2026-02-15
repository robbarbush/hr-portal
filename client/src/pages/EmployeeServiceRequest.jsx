import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getServiceRequestsByEmployeeId, createServiceRequest } from '../api/serviceRequests';

const REQUEST_TYPES = [
  'Update Personal Info',
  'HR Support',
  'IT Support',
  'Payroll Inquiry',
  'Benefits Question',
  'Training Request',
  'Equipment Request',
  'Other'
];

function EmployeeServiceRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [formData, setFormData] = useState({
    requestType: '',
    description: ''
  });

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (user?.id) {
      try {
        const data = await getServiceRequestsByEmployeeId(user.id);
        setRequests(data);
      } catch (error) {
        console.error('Failed to fetch service requests:', error);
      } finally {
        setRequestsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.requestType) {
      setError('Please select a request type');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a description');
      return;
    }

    setIsLoading(true);

    try {
      await createServiceRequest({
        employeeId: user.id,
        employeeName: user.name,
        requestType: formData.requestType,
        description: formData.description
      });
      setSuccess(true);
      setFormData({ requestType: '', description: '' });
      fetchRequests();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  return (
    <div className="dashboard">
      <h1>Service Requests</h1>
      
      <div className="dashboard-grid">
        {/* Submit Request Card */}
        <div className="card">
          <h2>Submit New Request</h2>
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">Request submitted successfully!</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Request Type *</label>
              <select
                name="requestType"
                value={formData.requestType}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">-- Select Request Type --</option>
                {REQUEST_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-control"
                rows="4"
                placeholder="Please describe your request in detail..."
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%' }}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Request Stats */}
        <div className="card">
          <h2>Request Summary</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{requests.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card stat-pending">
              <div className="stat-number">{requests.filter(r => r.status === 'pending').length}</div>
              <div className="stat-label">Pending</div>
            </div>
            <div className="stat-card stat-approved">
              <div className="stat-number">{requests.filter(r => r.status === 'resolved').length}</div>
              <div className="stat-label">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Request History */}
      <div className="card">
        <h2>My Service Requests</h2>
        {requestsLoading ? (
          <div className="loading">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="empty-state">
            <p>You haven't submitted any service requests yet.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.requestType}</td>
                    <td>{request.description}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/employee')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default EmployeeServiceRequest;
