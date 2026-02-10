import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeProfile from './pages/EmployeeProfile';
import EmployeeLeaveRequest from './pages/EmployeeLeaveRequest';
import EmployeePolicy from './pages/EmployeePolicy';
import HRDashboard from './pages/HRDashboard';
import HREmployees from './pages/HREmployees';
import HRLeaveRequests from './pages/HRLeaveRequests';
import HRPolicy from './pages/HRPolicy';
import About from './pages/About';

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/profile"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/leave-request"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeLeaveRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee/policy"
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeePolicy />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <ProtectedRoute allowedRole="hr">
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/employees"
            element={
              <ProtectedRoute allowedRole="hr">
                <HREmployees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/leave-requests"
            element={
              <ProtectedRoute allowedRole="hr">
                <HRLeaveRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr/policy"
            element={
              <ProtectedRoute allowedRole="hr">
                <HRPolicy />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
