import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployeeByEmail } from '../api/employees';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('hr');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'hr') {
        login({ id: 0, name: 'HR Admin', email: 'hr@company.com' }, 'hr');
        navigate('/hr');
      } else {
        const employee = await getEmployeeByEmail(username);
        if (employee) {
          login(employee, 'employee');
          navigate('/employee');
        } else {
          setError('Employee not found. Please check your username or sign up.');
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Username"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="role-selector">
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="employee"
                checked={role === 'employee'}
                onChange={(e) => setRole(e.target.value)}
              />
              Employee
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="role"
                value="hr"
                checked={role === 'hr'}
                onChange={(e) => setRole(e.target.value)}
              />
              Hr
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-login" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="signup-link">
          <Link to="/signup">SignUp</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
