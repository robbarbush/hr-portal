import { useState, useEffect } from 'react';
import { getAllEmployees } from '../api/employees';

function HREmployees() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>All Employees</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <div className="card">
        {isLoading ? (
          <div className="loading">Loading employees...</div>
        ) : employees.length === 0 ? (
          <p className="empty-state">No employees found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Title</th>
                <th>Start Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>{employee.department}</td>
                  <td>{employee.title}</td>
                  <td>{employee.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default HREmployees;
