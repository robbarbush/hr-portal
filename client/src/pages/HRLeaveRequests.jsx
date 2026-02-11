import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../api/leaveRequests';
import { getAllEmployees } from '../api/employees';

function HRLeaveRequests() {
  const navigate = useNavigate();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsData, employeesData] = await Promise.all([
        getAllLeaveRequests(),
        getAllEmployees()
      ]);
      setLeaveRequests(requestsData);
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load leave requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : 'Unknown';
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateLeaveRequestStatus(id, status);
      setLeaveRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Filter logic
  const filteredRequests = leaveRequests.filter(req => {
    if (filterStatus === 'all') return true;
    return req.status === filterStatus;
  });

  // Sorting logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle employee name sorting
    if (sortConfig.key === 'employeeName') {
      aValue = getEmployeeName(a.employeeId);
      bValue = getEmployeeName(b.employeeId);
    }

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
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

  const getStatusBadge = (status) => {
    return <span className={`badge badge-${status}`}>{status}</span>;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Employee', 'Start Date', 'End Date', 'Reason', 'Status', 'Created At'];
    const rows = sortedRequests.map(req => [
      req.id,
      getEmployeeName(req.employeeId),
      req.startDate,
      req.endDate,
      req.reason,
      req.status,
      req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leave_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="dashboard"><div className="loading">Loading leave requests...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Leave Requests</h1>
        <div className="action-buttons">
          <button className="btn btn-success" onClick={exportToCSV}>
            Export CSV
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/hr')}>
            Back to Dashboard
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter */}
      <div className="filter-bar">
        <label>Filter by status: </label>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-control filter-select"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('employeeName')} className="sortable-header">
                  Employee {getSortIcon('employeeName')}
                </th>
                <th onClick={() => handleSort('startDate')} className="sortable-header">
                  Start Date {getSortIcon('startDate')}
                </th>
                <th onClick={() => handleSort('endDate')} className="sortable-header">
                  End Date {getSortIcon('endDate')}
                </th>
                <th>Reason</th>
                <th onClick={() => handleSort('status')} className="sortable-header">
                  Status {getSortIcon('status')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">No leave requests found.</td>
                </tr>
              ) : (
                sortedRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{getEmployeeName(request.employeeId)}</td>
                    <td>{request.startDate}</td>
                    <td>{request.endDate}</td>
                    <td>{request.reason}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>
                      {request.status === 'pending' ? (
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
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          Showing: {sortedRequests.length} of {leaveRequests.length} request{leaveRequests.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

export default HRLeaveRequests;
