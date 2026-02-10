import { useState, useEffect } from 'react';
import { getAllEmployees } from '../api/employees';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../api/leaveRequests';
import StatusBadge from '../components/StatusBadge';

function HRLeaveRequests() {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [employeesData, requestsData] = await Promise.all([
        getAllEmployees(),
        getAllLeaveRequests(),
      ]);
      setEmployees(employeesData);
      setLeaveRequests(requestsData);
    } catch (err) {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      fetchData();
    } catch (err) {
      setError('Failed to update leave request status.');
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  return (
    <div className="dashboard">
      <h1>Leave Requests</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {isLoading ? (
          <div className="loading">Loading leave requests...</div>
        ) : leaveRequests.length === 0 ? (
          <p className="empty-state">No leave requests found.</p>
        ) : (
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
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HRLeaveRequests;
