import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllEmployees, createEmployee } from '../api/employees';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../api/leaveRequests';
import StatusBadge from '../components/StatusBadge';

function HRDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    email: '',
  });

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoadingEmployees(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees.');
    } finally {
      setIsLoadingEmployees(false);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setIsLoadingRequests(true);
      const data = await getAllLeaveRequests();
      setLeaveRequests(data);
    } catch (err) {
      setError('Failed to load leave requests.');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      fetchLeaveRequests();
    } catch (err) {
      setError('Failed to update leave request status.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEmployee = async () => {
    try {
      await createEmployee({
        ...newEmployee,
        phone: '',
        title: '',
        startDate: new Date().toISOString().split('T')[0],
      });
      setShowModal(false);
      setNewEmployee({ name: '', department: '', email: '' });
      fetchEmployees();
    } catch (err) {
      setError('Failed to add employee.');
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  return (
    <div className="hr-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">HR Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          <span className="logout-icon">↪</span> Logout
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="add-employee-section">
        <div className="add-employee-card">
          <h3>Add New Employee</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add Employee
          </button>
        </div>
      </div>

      <div className="divider"></div>

      {employees.length > 0 && (
        <div className="section">
          <h2>All Employees</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {leaveRequests.length > 0 && (
        <div className="section">
          <h2>Leave Requests</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id}>
                  <td>{getEmployeeName(request.employeeId)}</td>
                  <td>{request.startDate}</td>
                  <td>{request.endDate}</td>
                  <td>{request.reason}</td>
                  <td>
                    <StatusBadge status={request.status} />
                  </td>
                  <td>
                    {request.status === 'pending' && (
                      <div className="action-buttons">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(request.id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleStatusUpdate(request.id, 'denied')}
                        >
                          Deny
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Employee</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newEmployee.name}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={newEmployee.department}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newEmployee.email}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={handleSaveEmployee}>
                Save Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HRDashboard;
