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
          <Link to="#" className="nav-link">HR Policy</Link>
          <Link to="#" className="nav-link">Employee Policy</Link>
          <Link to="#" className="nav-link">About</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
