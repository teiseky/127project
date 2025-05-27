const express = require('express');
const cors = require('cors');
const app = express();
// ######################################### COMMENT OUT THIS BLOCK IF YOU DON'T WANT TO USE TRIGGERS ########################################

const triggers =  './config/initializeTriggers.js';

// Require your Sequelize models here
const { Member, ServesIn, Fee, Organization, RoleAssignment, Sequelize } = require('./models/index');
// Import and initialize triggers
const initializeTriggers = require('./config/initializeTriggers');
initializeTriggers({ Member, ServesIn, Fee, Organization, RoleAssignment, Sequelize });

// ######################################### COMMENT OUT THIS BLOCK IF YOU DON'T WANT TO USE TRIGGERS ########################################

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Import routes
const memberRoutes = require('./routes/members');
const organizationRoutes = require('./routes/organizations');
const feeRoutes = require('./routes/fees');
const reportsRoutes = require('./routes/reports');

// User Dashboard Routes
const userRoutes = require('./routes/userRoutes');

app.use('/api/users', userRoutes); 

// (Admin Routes
app.use('/api/members', memberRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/reports', reportsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;