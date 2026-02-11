import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees } from '../api/employees';

function HREmployees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

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

  // Sorting logic
  const sortedEmployees = [...employees].sort((a, b) => {
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Department', 'Title', 'Start Date'];
    const rows = sortedEmployees.map(emp => [
      emp.id,
      emp.name,
      emp.email,
      emp.phone || '',
      emp.department,
      emp.title || '',
      emp.startDate || ''
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
                <th onClick={() => handleSort('title')} className="sortable-header">
                  Title {getSortIcon('title')}
                </th>
                <th onClick={() => handleSort('startDate')} className="sortable-header">
                  Start Date {getSortIcon('startDate')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-state">No employees found.</td>
                </tr>
              ) : (
                sortedEmployees.map(employee => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.name}</td>
                    <td>{employee.email}</td>
                    <td>{employee.department}</td>
                    <td>{employee.title || '-'}</td>
                    <td>{employee.startDate || '-'}</td>
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
    </div>
  );
}

export default HREmployees;
