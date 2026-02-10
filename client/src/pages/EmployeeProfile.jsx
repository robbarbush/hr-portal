import { useAuth } from '../context/AuthContext';

function EmployeeProfile() {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>My Profile</h1>
      <div className="card">
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
    </div>
  );
}

export default EmployeeProfile;
