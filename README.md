# ElbiNex: A Student Organization Management System

**Welcome to ElbiNex!**  
The name combines “Elbi” (short for Los Baños) and “Nexus” (meaning connection or series of connections linking two things), reflecting its purpose as a centralized system for student organizations.

ElbiNex is a full-stack application for managing organization memberships, fees, and generating reports. Built with React, Node.js, and MariaDB.

## Features

- Member management and registration
- Organization management
- Fee tracking and payment processing
- Role-based access control
- Comprehensive reporting system
- Modern UI with Material-UI components

## Tech Stack

### Frontend
- React 18
- Material-UI (MUI) v5
- React Router v6
- Axios for API calls
- Recharts for data visualization
- TailwindCSS for styling
- Date-fns for date manipulation

### Backend
- Node.js with Express
- Sequelize ORM
- MariaDB database
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled

## Prerequisites

- Node.js (v14 or higher)
- MariaDB (v10.6 or higher)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd org-membership-app
```

2. Install root dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

5. Database Setup:
   - Install MariaDB if you haven't already
   - Create a new database:
     ```sql
     CREATE DATABASE org_membership;
     ```
   - Create a new user and grant privileges:
     ```sql
     CREATE USER 'org_user'@'localhost' IDENTIFIED BY 'your_password';
     GRANT ALL PRIVILEGES ON org_membership.* TO 'org_user'@'localhost';
     FLUSH PRIVILEGES;
     ```
   - Create a `.env` file in the backend directory with the following content:
     ```
     DB_USER=org_user
     DB_PASSWORD=your_password
     DB_NAME=org_membership
     DB_HOST=localhost
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

6. Initialize the database:
```bash
cd backend
(OPTIONAL)node seed.js

SOURCE <sql-setup-file>
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```
The backend server will run on http://localhost:5000

2. In a new terminal, start the frontend development server:
```bash
cd frontend
npm start
```
The frontend will be available at http://localhost:3000

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Members
- GET `/api/members` - Get all members
- POST `/api/members` - Create new member
- GET `/api/members/:id` - Get member by ID
- PUT `/api/members/:id` - Update member
- DELETE `/api/members/:id` - Delete member

### Organizations
- GET `/api/organizations` - Get all organizations
- POST `/api/organizations` - Create new organization
- GET `/api/organizations/:id` - Get organization by ID
- PUT `/api/organizations/:id` - Update organization
- DELETE `/api/organizations/:id` - Delete organization

### Reports
1. View all members of an organization
   - GET `/api/reports/1?organization=<org_name>`

2. View members with unpaid fees
   - GET `/api/reports/2?organization=<org_name>&semester=<sem>&academicYear=<year>`

3. View member's unpaid fees
   - GET `/api/reports/3?studentNumber=<number>`

4. View executive committee members
   - GET `/api/reports/4?organization=<org_name>`

5. View Presidents of organization
   - GET `/api/reports/5`

6. View late payments
   - GET `/api/reports/6?date=<date>`

7. View active vs inactive members
   - GET `/api/reports/7?organization=<org_name>`

8. View alumni members
   - GET `/api/reports/8?organization=<org_name>`

9. View total fees status
   - GET `/api/reports/9?organization=<org_name>&semester=<sem>&academicYear=<year>`

10. View highest debt members
    - GET `/api/reports/10?organization=<org_name>`

## Development

### Frontend Development
- Uses Create React App
- Material-UI for component library
- TailwindCSS for custom styling
- React Router for navigation
- Axios for API communication

### Backend Development
- Express.js server
- Sequelize for database operations
- JWT for authentication
- Environment variables for configuration
- Nodemon for development

## Troubleshooting

1. Database Connection Issues:
   - Ensure MariaDB service is running
   - Verify database credentials in `.env` file
   - Check if the database and user exist

2. Backend Issues:
   - Check if port 5000 is available
   - Ensure all environment variables are set correctly
   - Check the console for detailed error messages

3. Frontend Issues:
   - Clear browser cache if changes aren't reflecting
   - Check browser console for errors
   - Ensure backend server is running

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Authors

Joshua Carlos
Jhuliana Ledesma
Sebastian Merdegia