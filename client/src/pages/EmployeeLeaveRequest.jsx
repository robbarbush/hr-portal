import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createLeaveRequest } from '../api/leaveRequests';

function EmployeeLeaveRequest() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [dateError, setDateError] = useState('');

  // Get tomorrow's date as minimum start date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const minStartDate = getTomorrowDate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear date error when user changes dates
    if (name === 'startDate' || name === 'endDate') {
      setDateError('');
    }
  };

  const validateDates = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const start = new Date(formData.startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(formData.endDate);
    end.setHours(0, 0, 0, 0);

    if (start < tomorrow) {
      setDateError('Start date must be tomorrow or later');
      return false;
    }

    if (end < start) {
      setDateError('End date cannot be before start date');
      return false;
    }

    // Limit max leave duration to 30 days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) {
      setDateError('Leave request cannot exceed 30 days');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDateError('');

    if (!validateDates()) {
      return;
    }

    setIsLoading(true);

    try {
      await createLeaveRequest({
        employeeId: user.id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/employee');
      }, 2000);
    } catch (err) {
      setError('Failed to submit leave request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate number of days for display
  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
    }
    return 0;
  };

  const days = calculateDays();

  if (success) {
    return (
      <div className="page-container">
        <div className="success-dialog">
          <div className="success-icon">✓</div>
          <h2>Request Submitted!</h2>
          <p>Your leave request has been submitted for approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Request Leave</h1>
      
      <div className="card" style={{ maxWidth: '500px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="form-control"
              min={minStartDate}
              required
            />
            <small className="form-hint">Earliest start date: tomorrow</small>
          </div>
          
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="form-control"
              min={formData.startDate || minStartDate}
              required
            />
          </div>

          {dateError && (
            <div className="alert alert-error">{dateError}</div>
          )}

          {days > 0 && !dateError && (
            <div className="alert alert-success">
              Total: {days} day{days > 1 ? 's' : ''}
            </div>
          )}
          
          <div className="form-group">
            <label>Reason *</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              className="form-control"
              rows="4"
              placeholder="Please provide a reason for your leave request..."
              required
            />
          </div>
          
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate('/employee')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLeaveRequest;
