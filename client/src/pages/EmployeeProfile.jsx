import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function EmployeeProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    if (!status) return 'badge-warning';
    switch (status.toLowerCase()) {
      case 'active': return 'badge-approved';
      case 'probationary': return 'badge-pending';
      case 'on leave': return 'badge-info';
      case 'suspended': return 'badge-warning';
      case 'resigned':
      case 'terminated':
      case 'retired': return 'badge-denied';
      default: return 'badge-pending';
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>

      <div className="card">
        <h2>Personal Information</h2>
        <div className="profile-info">
          <div className="profile-row">
            <span className="label">Name:</span>
            <span className="value">{user?.name || '-'}</span>
          </div>
          <div className="profile-row">
            <span className="label">Email:</span>
            <span className="value">{user?.email || '-'}</span>
          </div>
          <div className="profile-row">
            <span className="label">Phone:</span>
            <span className="value">{user?.phone || '-'}</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Employment Details</h2>
        <div className="profile-info">
          <div className="profile-row">
            <span className="label">Department:</span>
            <span className="value">{user?.department || '-'}</span>
          </div>
          <div className="profile-row">
            <span className="label">Title:</span>
            <span className="value">{user?.title || '-'}</span>
          </div>
          <div className="profile-row">
            <span className="label">Start Date:</span>
            <span className="value">{user?.startDate || '-'}</span>
          </div>
          <div className="profile-row">
            <span className="label">Employment Status:</span>
            <span className="value">
              {user?.status ? (
                <span className={`badge ${getStatusBadgeClass(user.status)}`}>
                  {user.status}
                </span>
              ) : (
                '-'
              )}
            </span>
          </div>
          <div className="profile-row">
            <span className="label">Employment Type:</span>
            <span className="value">
              {user?.employmentType ? (
                <span className="badge badge-info">{user.employmentType}</span>
              ) : (
                '-'
              )}
            </span>
          </div>
        </div>
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

export default EmployeeProfile;
