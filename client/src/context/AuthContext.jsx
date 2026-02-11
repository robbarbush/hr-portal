import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('hr_portal_user');
    const storedRole = localStorage.getItem('hr_portal_role');
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const logActivity = async (action, details = '') => {
    try {
      const logEntry = {
        username: user?.name || 'Unknown',
        email: user?.email || '',
        role: role || 'unknown',
        action,
        details,
        timestamp: new Date().toISOString()
      };

      await fetch('/api/activityLogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });
    } catch (error) {
      console.error('Failed to log activity:', error);
    }
  };

  const login = async (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
    setIsAuthenticated(true);
    localStorage.setItem('hr_portal_user', JSON.stringify(userData));
    localStorage.setItem('hr_portal_role', userRole);

    // Log the login action
    try {
      await fetch('/api/activityLogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userData.name,
          email: userData.email,
          role: userRole,
          action: 'Login',
          details: `User logged in as ${userRole}`,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log login:', error);
    }
  };

  const logout = async () => {
    // Log the logout action before clearing state
    if (user) {
      try {
        await fetch('/api/activityLogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: user.name,
            email: user.email,
            role: role,
            action: 'Logout',
            details: 'User logged out',
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Failed to log logout:', error);
      }
    }

    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    localStorage.removeItem('hr_portal_user');
    localStorage.removeItem('hr_portal_role');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role, 
      isAuthenticated, 
      login, 
      logout,
      logActivity 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
