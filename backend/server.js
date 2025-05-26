const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const memberRoutes = require('./routes/memberRoutes');
const feesRoutes = require('./routes/fees');
const reportsRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/members', memberRoutes);
app.use('/api/fees', feesRoutes);
app.use('/api/reports', reportsRoutes);

// Database connection and server start
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    // Note: { force: true } will drop existing tables
    // Use { alter: true } to update existing tables
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized.');

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1); // Exit if database connection fails
  }
}

startServer(); 