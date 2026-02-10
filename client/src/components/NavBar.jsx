import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-circle">
            <span>HR</span>
            <span className="logo-small">Portal</span>
          </div>
        </div>
        <div className="navbar-links">
          <Link to="/login" className={`nav-link ${isActive('/login') ? 'active' : ''}`}>
            Login
          </Link>
          <Link to="/hr/policy" className={`nav-link ${isActive('/hr/policy') ? 'active' : ''}`}>
            HR Policy
          </Link>
          <Link to="/employee/policy" className={`nav-link ${isActive('/employee/policy') ? 'active' : ''}`}>
            Employee Policy
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
