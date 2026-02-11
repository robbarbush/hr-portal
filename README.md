# HR Portal - React Application

A secure and user-friendly HR portal built with React that streamlines HR operations within an organization. This application enables HR professionals to manage employee data, approve leave requests, and facilitates the onboarding process. Employees can register, submit personal information, and access HR-related services efficiently.

## Technologies Used

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **React Router v6** - Client-side routing
- **Context API** - State management for authentication
- **CSS3** - Custom styling with CSS variables and responsive design

### Backend (Mock)
- **JSON Server** - REST API mock server
- **db.json** - Data storage for employees and leave requests

## Features

### Authentication
- Role-based login (Employee, HR, Admin)
- Simulated authentication with localStorage persistence
- Protected routes based on user role

### Employee Features
- Employee registration/signup
- View personal profile
- Submit leave requests
- View leave request status

### HR Features
- View all employees
- Add new employees
- View all leave requests
- Approve or deny leave requests

### Admin Features
- System overview dashboard with statistics
- Access to all HR features
- View total employees, pending/approved/denied requests

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Mobile hamburger menu navigation
- Loading and error states
- Success feedback dialogs

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
        │   └── leaveRequests.js
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
        │   ├── EmployeeLeaveRequest.jsx
        │   ├── HRDashboard.jsx
        │   ├── HREmployees.jsx
        │   ├── HRLeaveRequests.jsx
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

The JSON Server provides the following endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /employees | Get all employees |
| GET | /employees/:id | Get employee by ID |
| POST | /employees | Create new employee |
| GET | /leaveRequests | Get all leave requests |
| POST | /leaveRequests | Create leave request |
| PATCH | /leaveRequests/:id | Update leave request status |

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
  "startDate": "2023-01-15"
}
```

### Leave Request
```json
{
  "id": 1,
  "employeeId": 1,
  "startDate": "2024-03-01",
  "endDate": "2024-03-05",
  "reason": "Family vacation",
  "status": "pending",
  "createdAt": "2024-02-15T10:30:00.000Z"
}
```

## Testing Checklist

- [x] Login as Employee
- [x] Register new employee via Signup
- [x] View employee profile
- [x] Submit leave request
- [x] Login as HR
- [x] View all employees
- [x] Add new employee
- [x] View leave requests
- [x] Approve leave request
- [x] Deny leave request
- [x] Verify db.json updates
- [x] Login as Admin
- [x] View system statistics
- [x] Access HR dashboard from Admin

## Screenshots

### Login Page
![Login Page](screenshots/login.png)

### HR Dashboard
![HR Dashboard](screenshots/hr-dashboard.png)

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)

*Note: Add your own screenshots to a `screenshots` folder*

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Author

[Your Name]

## License

This project is created for educational purposes as part of the Simplilearn Full Stack Development Program.
