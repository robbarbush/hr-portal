import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServiceRequests, updateServiceRequestStatus } from '../api/serviceRequests';

function HRServiceRequests() {
  const navigate = useNavigate();
  const [serviceRequests, setServiceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    try {
      const data = await getAllServiceRequests();
      setServiceRequests(data);
    } catch (err) {
      setError('Failed to load service requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateServiceRequestStatus(id, status);
      setServiceRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      );
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Get unique request types for filter
  const uniqueTypes = [...new Set(serviceRequests.map(req => req.requestType))].sort();

  // Filter logic
  const filteredRequests = serviceRequests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterType !== 'all' && req.requestType !== filterType) return false;
    return true;
  });

  // Sorting logic
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === 'createdAt') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
    const statusClass = status === 'resolved' ? 'approved' : status;
    return <span className={`badge badge-${statusClass}`}>{status}</span>;
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Employee', 'Type', 'Description', 'Status', 'Created At'];
    const rows = sortedRequests.map(req => [
      req.id,
      req.employeeName || 'Unknown',
      req.requestType,
      req.description,
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
    link.setAttribute('download', `service_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="dashboard"><div className="loading">Loading service requests...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Service Requests</h1>
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

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '1rem' }}>
        <div className="stat-card">
          <div className="stat-number">{serviceRequests.length}</div>
          <div className="stat-label">Total Requests</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{serviceRequests.filter(r => r.status === 'pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-approved">
          <div className="stat-number">{serviceRequests.filter(r => r.status === 'resolved').length}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-control filter-select"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Type:</label>
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="form-control filter-select"
          >
            <option value="all">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
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
                <th onClick={() => handleSort('requestType')} className="sortable-header">
                  Type {getSortIcon('requestType')}
                </th>
                <th>Description</th>
                <th onClick={() => handleSort('status')} className="sortable-header">
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('createdAt')} className="sortable-header">
                  Created {getSortIcon('createdAt')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">No service requests found.</td>
                </tr>
              ) : (
                sortedRequests.map(request => (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.employeeName || 'Unknown'}</td>
                    <td>{request.requestType}</td>
                    <td>{request.description}</td>
                    <td>{getStatusBadge(request.status)}</td>
                    <td>{request.createdAt ? new Date(request.createdAt).toLocaleDateString() : '-'}</td>
                    <td>
                      {request.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                          >
                            Start
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleStatusUpdate(request.id, 'resolved')}
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                      {request.status === 'in-progress' && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleStatusUpdate(request.id, 'resolved')}
                        >
                          Resolve
                        </button>
                      )}
                      {request.status === 'resolved' && (
                        <span className="text-muted">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          Showing: {sortedRequests.length} of {serviceRequests.length} requests
        </div>
      </div>
    </div>
  );
}

export default HRServiceRequests;
