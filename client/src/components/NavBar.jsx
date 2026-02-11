import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavBar() {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <div className="logo-circle">
            <span>HR</span>
            <span className="logo-small">Portal</span>
          </div>
        </div>
        
        <button 
          className={`menu-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          {isAuthenticated ? (
            <button 
              className={`nav-link nav-logout-link`}
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${isActive('/login') ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Login
            </Link>
          )}
          <Link 
            to="/hr/policy" 
            className={`nav-link ${isActive('/hr/policy') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            HR Policy
          </Link>
          <Link 
            to="/employee/policy" 
            className={`nav-link ${isActive('/employee/policy') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            Employee Policy
          </Link>
          <Link 
            to="/about" 
            className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            onClick={handleLinkClick}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
