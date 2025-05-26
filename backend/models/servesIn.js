const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServesIn = sequelize.define('ServesIn', {
  studentNumber: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    field: 'Student_number',
    references: {
      model: 'MEMBER',
      key: 'Student_number'
    }
  },
  organizationId: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    field: 'Organization_id',
    references: {
      model: 'ORGANIZATION',
      key: 'Organization_id'
    }
  },
  role: {
    type: DataTypes.STRING(14),
    field: 'Role'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'alumni', 'expelled', 'suspended'),
    field: 'Status'
  },
  semester: {
    type: DataTypes.STRING(12),
    field: 'Semester'
  },
  academicYear: {
    type: DataTypes.STRING(9),
    field: 'Academic_year'
  },
  committee: {
    type: DataTypes.STRING(255),
    field: 'Committee'
  }
}, {
  tableName: 'SERVES_IN',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['Student_number', 'Organization_id', 'Role', 'Status', 'Semester', 'Academic_year', 'Committee'],
      name: 'serves_in_unique_idx'
    }
  ]
});

module.exports = ServesIn; 