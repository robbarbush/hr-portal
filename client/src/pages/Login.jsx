import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployeeByEmail } from '../api/employees';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check for admin login
      if (username === 'admin' && password === 'admin') {
        login({ id: 0, name: 'Administrator', email: 'admin@company.com' }, 'admin');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/admin');
        }, 1500);
      } else if (role === 'hr') {
        login({ id: 0, name: 'HR Admin', email: 'hr@company.com' }, 'hr');
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/hr');
        }, 1500);
      } else {
        const employee = await getEmployeeByEmail(username);
        if (employee) {
          login(employee, 'employee');
          setShowSuccess(true);
          setTimeout(() => {
            navigate('/employee');
          }, 1500);
        } else {
          setError('Employee not found. Please check your username or sign up.');
          setIsLoading(false);
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
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
              HR
            </label>
          </div>
          <button type="submit" className="btn btn-primary btn-login" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="signup-link">
          <Link to="/signup">SignUp</Link>
        </div>
        <div className="demo-credentials">
          <strong>Demo Credentials:</strong>
          <p><strong>Admin:</strong> admin / admin</p>
          <p><strong>HR:</strong> Select "HR" and click Login</p>
          <p><strong>Employee:</strong> john.smith@company.com</p>
        </div>
      </div>

      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-dialog">
            <div className="success-icon">✓</div>
            <h2>Login Successful!</h2>
            <p>Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
