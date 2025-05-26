# Organization Membership Application

A full-stack application for managing organization memberships, fees, and generating reports.

## Features

- Member management
- Organization management
- Fee tracking
- Role management
- Comprehensive reporting system

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

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Database Setup:
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
   - Update the database configuration in `backend/config/database.js`:
     ```javascript
     {
       username: 'org_user',
       password: 'your_password',
       database: 'org_membership',
       host: 'localhost',
       dialect: 'mariadb'
     }
     ```

5. Initialize the database:
```bash
cd backend
node seed.js
```
This will create the necessary tables and populate them with sample data.

6. Git Configuration:
   - The repository includes a `.gitignore` file that excludes:
     - Node modules and dependencies
     - Environment files (.env)
     - Build outputs
     - Log files
     - IDE-specific files
     - Database files
     - System files
   - Make sure to keep your `.env` file local and never commit it to the repository

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

## Technologies Used

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Router

- Backend:
  - Node.js
  - Express
  - Sequelize
  - MariaDB

## Troubleshooting

1. Database Connection Issues:
   - Ensure MariaDB service is running
   - Verify database credentials in `backend/config/database.js`
   - Check if the database and user exist

2. Backend Issues:
   - Check if port 5000 is available
   - Ensure all environment variables are set correctly
   - Check the console for detailed error messages

3. Frontend Issues:
   - Clear browser cache if changes aren't reflecting
   - Check browser console for errors
   - Ensure backend server is running

## License

MIT 