const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organization = sequelize.define('Organization', {
  organizationId: {
    type: DataTypes.STRING(255),
    primaryKey: true,
    field: 'Organization_id'
  },
  scope: {
    type: DataTypes.STRING(15),
    field: 'Scope'
  },
  type: {
    type: DataTypes.STRING(50),
    field: 'Type'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'Name'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  foundedDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  }
}, {
  tableName: 'ORGANIZATION',
  timestamps: false
});

module.exports = Organization; 