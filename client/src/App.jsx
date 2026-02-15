import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeEditProfile from './pages/EmployeeEditProfile';
import EmployeeLeaveRequest from './pages/EmployeeLeaveRequest';
import EmployeeServiceRequest from './pages/EmployeeServiceRequest';
import HRDashboard from './pages/HRDashboard';
import HREmployees from './pages/HREmployees';
import HRLeaveRequests from './pages/HRLeaveRequests';
import HRServiceRequests from './pages/HRServiceRequests';
import AdminDashboard from './pages/AdminDashboard';
import HRPolicy from './pages/HRPolicy';
import EmployeePolicy from './pages/EmployeePolicy';
import About from './pages/About';
import './styles/app.css';

function App() {
  const { isAuthenticated, role } = useAuth();

  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/hr/policy" element={<HRPolicy />} />
          <Route path="/employee/policy" element={<EmployeePolicy />} />
          <Route path="/about" element={<About />} />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/edit-profile"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeEditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-request"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeLeaveRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/service-request"
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeServiceRequest />
              </ProtectedRoute>
            }
          />

          {/* HR Routes */}
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <HREmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/leave-requests"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <HRLeaveRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/service-requests"
            element={
              <ProtectedRoute allowedRoles={['hr', 'admin']}>
                <HRServiceRequests />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                role === 'admin' ? (
                  <Navigate to="/admin" replace />
                ) : role === 'hr' ? (
                  <Navigate to="/hr" replace />
                ) : (
                  <Navigate to="/employee" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
