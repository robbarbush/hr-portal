import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateEmployee } from '../api/employees';

function EmployeeEditProfile() {
  const { user, login, role } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updatedEmployee = await updateEmployee(user.id, formData);
      // Update the user in context with new data
      login({ ...user, ...formData }, role);
      setSuccess(true);
      setTimeout(() => {
        navigate('/employee/profile');
      }, 2000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page-container">
        <div className="success-dialog">
          <div className="success-icon">✓</div>
          <h2>Profile Updated!</h2>
          <p>Your personal details have been updated successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Edit Profile</h1>
      
      <div className="card" style={{ maxWidth: '500px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
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
            <label>Email *</label>
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
              placeholder="555-0100"
            />
          </div>

          <div className="alert alert-info" style={{ marginTop: '1rem' }}>
            <strong>Note:</strong> To update other details like department, title, or employment status, please submit a service request to HR.
          </div>

          <div className="action-buttons" style={{ marginTop: '1rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/employee/profile')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeEditProfile;
