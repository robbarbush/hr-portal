# HR Portal - React Application

A secure and user-friendly HR portal built with React that streamlines HR operations within an organization. This application enables HR professionals to manage employee data, approve leave requests, handle service requests, and facilitates the onboarding process. Employees can register, submit personal information, request leave, submit service requests, and access HR-related services efficiently.

## Technologies Used

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Context API** - State management for authentication
- **CSS3** - Custom styling with CSS variables and responsive design

### Backend (Mock)
- **JSON Server** - REST API mock server
- **db.json** - Data storage for employees, leave requests, service requests, and activity logs

## Features

### Authentication
- Role-based login (Employee, HR, Admin)
- Simulated authentication with localStorage persistence
- Protected routes based on user role
- Activity logging for all login/logout events

### Employee Features
- Employee registration/signup with personal details
- View personal profile with employment status and type
- **Edit personal details** (name, email, phone)
- Submit leave requests with **leave type dropdown** and date validation
- **Submit service requests** (IT Support, HR Support, Update Info, etc.)
- View leave request history and status
- View service request history and status
- Leave request stats (total, pending, approved, denied)

### HR Features
- Dashboard with overview statistics (total employees, active employees, pending requests)
- View and manage all employees
- Add new employees with status and employment type
- Edit and delete employees
- Highlighted employees needing attention (no status assigned)
- View and manage all leave requests with leave type
- Approve or deny leave requests
- **View and manage service requests**
- **Resolve service requests** (Start → Resolve workflow)
- Filter by status and type
- Sortable tables (click column headers)
- Export to CSV (employees, leave requests, service requests)

### Admin Features
- System overview dashboard with statistics
- Activity logs tracking all user actions
- Filter logs by username or role
- Sortable activity log table
- Export activity logs to CSV
- Access to all HR features

### Employee Status Options
- Probationary (default for new employees)
- Active
- On Leave
- Suspended
- Resigned
- Terminated
- Retired

### Employment Type Options
- Full-Time (default)
- Part-Time
- Contractor
- Intern

### Leave Types
- Annual Leave
- Sick Leave
- Personal Leave
- Bereavement Leave
- Maternity/Paternity Leave
- Unpaid Leave
- Other

### Service Request Types
- Update Personal Info
- HR Support
- IT Support
- Payroll Inquiry
- Benefits Question
- Training Request
- Equipment Request
- Other

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Mobile hamburger menu navigation
- Loading indicators
- Confirmation dialogs before delete
- Empty state messages
- Form validation messages
- Success feedback dialogs
- Color-coded status badges
- Highlighted rows for employees needing attention

## Project Structure

```
hr-portal/
├── server/
│   ├── package.json
│   └── db.json
└── client/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   ├── http.js
        │   ├── employees.js
        │   ├── leaveRequests.js
        │   ├── serviceRequests.js
        │   └── activityLogs.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── NavBar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── StatusBadge.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── EmployeeDashboard.jsx
        │   ├── EmployeeProfile.jsx
        │   ├── EmployeeEditProfile.jsx
        │   ├── EmployeeLeaveRequest.jsx
        │   ├── EmployeeServiceRequest.jsx
        │   ├── HRDashboard.jsx
        │   ├── HREmployees.jsx
        │   ├── HRLeaveRequests.jsx
        │   ├── HRServiceRequests.jsx
        │   ├── AdminDashboard.jsx
        │   ├── HRPolicy.jsx
        │   ├── EmployeePolicy.jsx
        │   └── About.jsx
        └── styles/
            └── app.css
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Step 1: Install Server Dependencies
```bash
cd server
npm install
```

### Step 2: Install Client Dependencies
```bash
cd client
npm install
```

## Running the Application

### Step 1: Start the JSON Server (Terminal 1)
```bash
cd server
npm start
```
The API server will run at `http://localhost:3001`

### Step 2: Start the React Application (Terminal 2)
```bash
cd client
npm run dev
```
The application will run at `http://localhost:3000`

## Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| HR | (any) | (any) - Select "HR" role |
| Employee | john.smith@company.com | (any) |

## API Endpoints

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /employees | Get all employees |
| GET | /employees/:id | Get employee by ID |
| POST | /employees | Create new employee |
| PATCH | /employees/:id | Update employee |
| DELETE | /employees/:id | Delete employee |

### Leave Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /leaveRequests | Get all leave requests |
| POST | /leaveRequests | Create leave request |
| PATCH | /leaveRequests/:id | Update leave request status |

### Service Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /serviceRequests | Get all service requests |
| POST | /serviceRequests | Create service request |
| PATCH | /serviceRequests/:id | Update service request status |

### Activity Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /activityLogs | Get all activity logs |
| POST | /activityLogs | Create activity log entry |

## Data Models

### Employee
```json
{
  "id": 1,
  "name": "John Smith",
  "email": "john.smith@company.com",
  "phone": "555-0101",
  "department": "Engineering",
  "title": "Software Developer",
  "startDate": "2023-01-15",
  "status": "Active",
  "employmentType": "Full-Time"
}
```

### Leave Request
```json
{
  "id": 1,
  "employeeId": 1,
  "leaveType": "Annual Leave",
  "startDate": "2024-03-01",
  "endDate": "2024-03-05",
  "reason": "Family vacation",
  "status": "pending",
  "createdAt": "2024-02-15T10:30:00.000Z"
}
```

### Service Request
```json
{
  "id": 1,
  "employeeId": 1,
  "employeeName": "John Smith",
  "requestType": "IT Support",
  "description": "Need access to dashboard",
  "status": "pending",
  "createdAt": "2024-02-12T11:30:00.000Z"
}
```

### Activity Log
```json
{
  "id": 1,
  "username": "John Smith",
  "email": "john.smith@company.com",
  "role": "employee",
  "action": "Login",
  "details": "User logged in as employee",
  "timestamp": "2024-02-10T10:00:00.000Z"
}
```

## Key Features Explained

### Date Validation
- Leave request start date must be tomorrow or later
- End date cannot be before start date
- Maximum leave duration: 30 days
- Shows total days count before submission

### Sorting
- Click any column header to sort ascending/descending
- Sort indicators (↑↓) show current sort direction
- Employees needing attention are always sorted to top

### CSV Export
- Export employee list from HR Employees page
- Export leave requests from HR Leave Requests page
- Export service requests from HR Service Requests page
- Export activity logs from Admin Dashboard
- Files named with current date (e.g., `employees_2024-02-12.csv`)

### Service Request Workflow
1. Employee submits request → Status: **Pending**
2. HR starts working on it → Status: **In Progress**
3. HR resolves the request → Status: **Resolved**

### Activity Logging
- Automatic logging of login/logout events
- Tracks user actions with timestamps
- Filterable by username and role
- Exportable for auditing purposes

## Testing Checklist

### Project Initialization
- [x] React project initialized using Vite
- [x] Clean folder structure
- [x] Component-based architecture
- [x] Functional components with hooks
- [x] Proper state management
- [x] Application runs without console errors

### Authentication
- [x] Login form with username, password, role selection
- [x] Basic form validation
- [x] Redirect after login based on role
- [x] Logout functionality
- [x] Employee registration form
- [x] Registration saves to JSON

### Role-Based Access Control
- [x] HR and Employee roles defined
- [x] Role-based route protection
- [x] Navigation adapts by role

### HR Dashboard
- [x] Dashboard with summary cards
- [x] Employee management (view, add, edit, delete)
- [x] Leave request management (approve/deny)
- [x] Service request management (start/resolve)

### Employee Status System
- [x] All employment statuses implemented
- [x] All employment types implemented
- [x] Status badges with color coding
- [x] Status filter functionality

### Leave Management
- [x] Leave request form with type dropdown
- [x] Date validation
- [x] Leave status tracking (pending/approved/denied)

### Service Request System
- [x] Service request form with type dropdown
- [x] Submit and view requests
- [x] HR view of service requests
- [x] Request status tracking

### Employee Self-Service
- [x] View personal profile
- [x] Update personal details
- [x] View leave history
- [x] View service requests

### Responsive Design
- [x] Mobile-friendly layout
- [x] Hamburger menu navigation
- [x] Forms usable on mobile

### Navigation
- [x] Navbar with Login/Logout, HR Policy, Employee Policy, About
- [x] Functional routing
- [x] Protected routes

## Screenshots (Required for Submission)

1. Login Page
2. HR Dashboard
3. Add Employee Modal
4. Leave Request Page
5. Employee Dashboard

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

[Your Name]

## License

This project is created for educational purposes as part of the Simplilearn Full Stack Development Program.
