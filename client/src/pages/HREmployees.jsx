import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees, updateEmployee, deleteEmployee } from '../api/employees';

const STATUS_OPTIONS = [
  'Probationary',
  'Active',
  'On Leave',
  'Suspended',
  'Resigned',
  'Terminated',
  'Retired'
];

const EMPLOYMENT_TYPE_OPTIONS = [
  'Full-Time',
  'Part-Time',
  'Contractor',
  'Intern'
];

function HREmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    title: '',
    startDate: '',
    status: '',
    employmentType: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if employee needs attention (no status assigned)
  const needsAttention = (employee) => {
    return !employee.status || employee.status === '';
  };

  // Sorting logic
  const sortedEmployees = [...employees].sort((a, b) => {
    // Always put employees needing attention at top
    if (needsAttention(a) && !needsAttention(b)) return -1;
    if (!needsAttention(a) && needsAttention(b)) return 1;

    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
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

  // Edit functionality
  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setEditFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      title: employee.title || '',
      startDate: employee.startDate || '',
      status: employee.status || 'Probationary',
      employmentType: employee.employmentType || ''
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      await updateEmployee(selectedEmployee.id, editFormData);
      setEmployees(prev =>
        prev.map(emp => emp.id === selectedEmployee.id ? { ...emp, ...editFormData } : emp)
      );
      setShowEditModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError('Failed to update employee.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete functionality
  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSaving(true);
    setError('');

    try {
      await deleteEmployee(selectedEmployee.id);
      setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));
      setShowDeleteModal(false);
      setSelectedEmployee(null);
    } catch (err) {
      setError('Failed to delete employee.');
    } finally {
      setIsSaving(false);
    }
  };

  // Get status badge class
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Title', 'Start Date', 'Status', 'Employment Type'];
    const rows = sortedEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.phone || '',
      emp.department,
      emp.title || '',
      emp.startDate || '',
      emp.status || '',
      emp.employmentType || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Count employees needing attention
  const needsAttentionCount = employees.filter(needsAttention).length;

  if (isLoading) {
    return <div className="dashboard"><div className="loading">Loading employees...</div></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>All Employees</h1>
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

      {needsAttentionCount > 0 && (
        <div className="alert alert-warning">
          <strong>Attention:</strong> {needsAttentionCount} employee{needsAttentionCount > 1 ? 's' : ''} need{needsAttentionCount === 1 ? 's' : ''} status assignment (highlighted below).
        </div>
      )}

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')} className="sortable-header">
                  ID {getSortIcon('id')}
                </th>
                <th onClick={() => handleSort('name')} className="sortable-header">
                  Name {getSortIcon('name')}
                </th>
                <th onClick={() => handleSort('email')} className="sortable-header">
                  Email {getSortIcon('email')}
                </th>
                <th onClick={() => handleSort('department')} className="sortable-header">
                  Department {getSortIcon('department')}
                </th>
                <th onClick={() => handleSort('status')} className="sortable-header">
                  Status {getSortIcon('status')}
                </th>
                <th onClick={() => handleSort('employmentType')} className="sortable-header">
                  Type {getSortIcon('employmentType')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-state">No employees found.</td>
                </tr>
              ) : (
                sortedEmployees.map(employee => (
                  <tr key={employee.id} className={needsAttention(employee) ? 'row-highlight' : ''}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>
                      {employee.status ? (
                        <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                          {employee.status}
                        </span>
                      ) : (
                        <span className="badge badge-warning">Not Set</span>
                      )}
                    </td>
                    <td>{employee.employmentType || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditClick(employee)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteClick(employee)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          Total: {employees.length} employee{employees.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <input
                      type="text"
                      name="department"
                      value={editFormData.department}
                      onChange={handleEditInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={editFormData.startDate}
                      onChange={handleEditInputChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">-- Select Status --</option>
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select
                      name="employmentType"
                      value={editFormData.employmentType}
                      onChange={handleEditInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">-- Select Type --</option>
                      {EMPLOYMENT_TYPE_OPTIONS.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedEmployee?.name}</strong>?</p>
              <p className="text-muted">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm} disabled={isSaving}>
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HREmployees;
