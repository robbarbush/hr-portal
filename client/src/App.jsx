import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeLeaveRequest from './pages/EmployeeLeaveRequest';
import HRDashboard from './pages/HRDashboard';
import HREmployees from './pages/HREmployees';
import HRLeaveRequests from './pages/HRLeaveRequests';
import AdminDashboard from './pages/AdminDashboard';
import HRPolicy from './pages/HRPolicy';
import EmployeePolicy from './pages/EmployeePolicy';
import About from './pages/About';

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />

          {/* Employee routes */}
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employee/profile" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeProfile />
            </ProtectedRoute>
          } />
          <Route path="/employee/leave-request" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeLeaveRequest />
            </ProtectedRoute>
          } />
          <Route path="/employee/policy" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeePolicy />
            </ProtectedRoute>
          } />

          {/* HR routes */}
          <Route path="/hr" element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/employees" element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <HREmployees />
            </ProtectedRoute>
          } />
          <Route path="/hr/leave-requests" element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <HRLeaveRequests />
            </ProtectedRoute>
          } />
          <Route path="/hr/policy" element={
            <ProtectedRoute allowedRoles={['hr', 'admin']}>
              <HRPolicy />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
