const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fee = sequelize.define('Fee', {
  transactionId: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    field: 'Transaction_id'
  },
  status: {
    type: DataTypes.ENUM('unpaid', 'paid'),
    field: 'Status'
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    field: 'Payment_date'
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'Amount'
  },
  type: {
    type: DataTypes.STRING(50),
    field: 'Type'
  },
  semester: {
    type: DataTypes.STRING(12),
    field: 'Semester'
  },
  academicYear: {
    type: DataTypes.STRING(9),
    field: 'Academic_year'
  },
  isLate: {
    type: DataTypes.BOOLEAN,
    field: 'Is_late'
  },
  studentNumber: {
    type: DataTypes.STRING(10),
    field: 'Student_number',
    references: {
      model: 'MEMBER',
      key: 'Student_number'
    }
  },
  organizationId: {
    type: DataTypes.STRING(255),
    field: 'Organization_id',
    references: {
      model: 'ORGANIZATION',
      key: 'Organization_id'
    }
  }
}, {
  tableName: 'FEE',
  timestamps: false
});

module.exports = Fee; 