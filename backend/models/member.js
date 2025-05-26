const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Member = sequelize.define('Member', {
  studentNumber: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    field: 'Student_number'
  },
  degreeProgram: {
    type: DataTypes.STRING(255),
    field: 'Degree_program'
  },
  age: {
    type: DataTypes.INTEGER,
    field: 'Age'
  },
  gender: {
    type: DataTypes.STRING(255),
    field: 'Gender'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'Name'
  },
  dateGraduated: {
    type: DataTypes.DATEONLY,
    field: 'Date_graduated'
  }
}, {
  tableName: 'MEMBER',
  timestamps: false
});

module.exports = Member; 