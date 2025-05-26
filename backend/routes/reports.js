const express = require('express');
const router = express.Router();
const { Member, Organization, Fee, ServesIn } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Helper function to handle errors
const handleError = (res, error) => {
  console.error('Report error details:', {
    message: error.message,
    stack: error.stack,
    name: error.name
  });
  
  // Check for specific error types
  if (error.name === 'SequelizeConnectionError') {
    return res.status(500).json({ 
      error: 'Database connection error',
      details: 'Unable to connect to the database. Please check your database configuration.'
    });
  }
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: 'Validation error',
      details: error.errors.map(e => e.message).join(', ')
    });
  }
  
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({ 
      error: 'Data integrity error',
      details: 'The operation violates database constraints. Please check your data.'
    });
  }

  res.status(500).json({ 
    error: 'An error occurred while generating the report',
    details: error.message,
    type: error.name
  });
};

// 1. View all members of the organization by role, status, gender, degree program, batch, and committee
router.get('/1', async (req, res) => {
  try {
    const { organization, role, status, gender, degreeProgram, batch, committee } = req.query;
    
    if (!organization) {
      return res.status(400).json({ 
        error: 'Organization is required' 
      });
    }

    // Build where clause for ServesIn
    const servesInWhere = {
      Organization_id: organization
    };
    if (role) servesInWhere.role = role;
    if (status) servesInWhere.status = status;
    if (batch) servesInWhere.academicYear = { [Op.like]: `${batch}%` };
    if (committee) servesInWhere.committee = committee;

    // Build where clause for Member
    const memberWhere = {};
    if (gender) memberWhere.gender = gender;
    if (degreeProgram) memberWhere.degreeProgram = degreeProgram;

    const members = await Member.findAll({
      where: memberWhere,
      include: [{
        model: Organization,
        as: 'Organizations',
        required: true,
        through: {
          model: ServesIn,
          attributes: ['role', 'status', 'semester', 'academicYear', 'committee'],
          where: servesInWhere
        }
      }],
      attributes: [
        'Student_number',
        'name',
        'gender',
        'degreeProgram'
      ],
      order: [
        [{ model: Organization, as: 'Organizations' }, { model: ServesIn }, 'role', 'ASC'],
        [{ model: Organization, as: 'Organizations' }, { model: ServesIn }, 'status', 'ASC'],
        ['gender', 'ASC'],
        ['degreeProgram', 'ASC']
      ]
    });

    // Format the response to match the frontend expectations
    const formattedMembers = members.map(member => ({
      Student_number: member.Student_number,
      name: member.name,
      gender: member.gender,
      degreeProgram: member.degreeProgram,
      role: member.Organizations[0]?.ServesIn?.role || 'No Role',
      status: member.Organizations[0]?.ServesIn?.status || 'Unknown',
      semester: member.Organizations[0]?.ServesIn?.semester || 'Unknown',
      academicYear: member.Organizations[0]?.ServesIn?.academicYear || 'Unknown',
      committee: member.Organizations[0]?.ServesIn?.committee || 'No Committee'
    }));

    res.json(formattedMembers);
  } catch (error) {
    console.error('Error in report type 1:', error);
    handleError(res, error);
  }
});

// 2. View members with unpaid fees for a given organization, semester and academic year
router.get('/2', async (req, res) => {
  try {
    const { organization, semester, academicYear } = req.query;
    if (!organization || !semester || !academicYear) {
      return res.status(400).json({ 
        error: 'Organization, semester and academic year are required' 
      });
    }

    // Find all unpaid fees for this org/semester/year, include member info
    const fees = await Fee.findAll({
      where: {
        status: 'unpaid',
        semester,
        academicYear,
        organizationId: organization
      },
      include: [{
        model: Member,
        attributes: ['studentNumber', 'name']
      }]
    });

    // Group by member and sum unpaid amounts
    const memberMap = new Map();
    fees.forEach(fee => {
      const { studentNumber, name } = fee.Member;
      if (!memberMap.has(studentNumber)) {
        memberMap.set(studentNumber, {
          studentNumber,
          name,
          totalUnpaid: 0,
          organization
        });
      }
      memberMap.get(studentNumber).totalUnpaid += parseFloat(fee.amount);
    });

    res.json(Array.from(memberMap.values()));
  } catch (error) {
    handleError(res, error);
  }
});

// 3. View member's unpaid fees for all organizations
router.get('/3', async (req, res) => {
  try {
    const { studentNumber } = req.query;
    
    if (!studentNumber) {
      return res.status(400).json({ 
        error: 'Student number is required' 
      });
    }

    const fees = await Fee.findAll({
      where: {
        studentNumber,
        status: 'unpaid'
      },
      include: [{
        model: Organization,
        attributes: ['name']
      }],
      attributes: [
        'semester',
        'academicYear',
        'amount',
        'type'
      ],
      order: [['academicYear', 'ASC']]
    });

    res.json(fees);
  } catch (error) {
    handleError(res, error);
  }
});

// 4. View executive committee members
router.get('/4', async (req, res) => {
  console.log('Fetching executive committee members...');
  console.log('Request query:', req.query);
  try {
    const { organization, academicYear } = req.query;

    console.log('Query parameters:', req.query);
    if (!organization || !academicYear) {
      return res.status(400).json({ 
        error: 'Organization and academic year are required' 
      });
    }

    const members = await Member.findAll({
      include: [{
        model: Organization,
        as: 'Organizations',
        where: { organizationId: organization },
        through: {
          model: ServesIn,
          attributes: ['role'], // Include the role attribute
          where: {
            committee: 'Executive',
            academicYear  
          }
        }
      }],
      attributes: [
        'studentNumber',
        'name'
      ],
      order: [
        [sequelize.literal('`Organizations->ServesIn`.`role`'), 'ASC']
      ]
    });

    // Format the response to show member info and their role in the org
    const formatted = members.map(member => ({
      studentNumber: member.studentNumber,
      name: member.name,
      role: member.Organizations[0]?.ServesIn?.role || 'Unknown'
    }));

    res.json(formatted);
  } catch (error) {
    handleError(res, error);
  }
});

// 5. View Presidents of organization
router.get('/5', async (req, res) => {
  try {
    const { organization } = req.query;
    
    if (!organization) {
      return res.status(400).json({ 
        error: 'Organization is required' 
      });
    }

    const members = await Member.findAll({
      include: [{
        model: Organization,
        where: { name: organization },
        through: {
          model: ServesIn,
          where: {
            role: 'President'
          }
        }
      }],
      attributes: [
        'studentNumber',
        'name'
      ],
      order: [
        [{ model: Organization, as: 'Organizations' }, { model: ServesIn, as: 'ServesIn' }, 'academicYear', 'DESC']
      ]
    });

    res.json(members);
  } catch (error) {
    handleError(res, error);
  }
});

// 6. View late payments
router.get('/6', async (req, res) => {
  try {
    const { organization, semester, academicYear } = req.query;
    
    if (!organization || !semester || !academicYear) {
      return res.status(400).json({ 
        error: 'Organization, semester and academic year are required' 
      });
    }

    const fees = await Fee.findAll({
      where: {
        isLate: true,
        semester,
        academicYear
      },
      include: [{
        model: Member,
        attributes: ['studentNumber', 'name']
      }, {
        model: Organization,
        where: { name: organization }
      }],
      attributes: [
        'amount',
        'paymentDate'
      ],
      order: [['paymentDate', 'DESC']]
    });

    res.json(fees);
  } catch (error) {
    handleError(res, error);
  }
});

// 7. View percentage of active vs inactive members
router.get('/7', async (req, res) => {
  try {
    const { organization, n } = req.query;
    
    if (!organization || !n) {
      return res.status(400).json({ 
        error: 'Organization and number of semesters (n) are required' 
      });
    }

    const result = await sequelize.query(`
      SELECT  
        s.Status, 
        COUNT(*) * 100 / SUM(COUNT(*)) OVER() AS "Percentage"
      FROM 
        SERVES_IN s
      JOIN 
        ORGANIZATION o ON s.Organization_id = o.Organization_id
      JOIN (
        SELECT Semester, Academic_year
        FROM SERVES_IN
        WHERE Organization_id = (SELECT Organization_id FROM ORGANIZATION WHERE Name = :organization)
        GROUP BY Academic_year, Semester
        ORDER BY Academic_year DESC 
        LIMIT :n
      ) AS recent_semesters
      ON s.Semester = recent_semesters.Semester 
         AND s.Academic_year = recent_semesters.Academic_year
      WHERE 
        o.Name = :organization AND
        s.Status IN ('active', 'inactive')  
      GROUP BY 
        s.Status
    `, {
      replacements: { organization, n: parseInt(n) },
      type: sequelize.QueryTypes.SELECT
    });

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

// 8. View alumni members
router.get('/8', async (req, res) => {
  try {
    const { organization, date } = req.query;
    
    if (!organization || !date) {
      return res.status(400).json({ 
        error: 'Organization and date are required' 
      });
    }

    const members = await Member.findAll({
      include: [{
        model: Organization,
        where: { name: organization },
        through: {
          model: ServesIn,
          where: {
            status: 'alumni'
          }
        }
      }],
      where: {
        dateGraduated: {
          [Op.lte]: date
        }
      },
      attributes: [
        'studentNumber',
        'name',
        'degreeProgram'
      ],
      order: [['dateGraduated', 'ASC']]
    });

    res.json(members);
  } catch (error) {
    handleError(res, error);
  }
});

// 9. View total amount of unpaid and paid fees
router.get('/9', async (req, res) => {
  try {
    const { organization, date } = req.query;
    
    if (!organization || !date) {
      return res.status(400).json({ 
        error: 'Organization and date are required' 
      });
    }

    const result = await Fee.findAll({
      include: [{
        model: Organization,
        where: { name: organization }
      }],
      where: {
        paymentDate: {
          [Op.lte]: date
        }
      },
      attributes: [
        'status',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      group: ['status']
    });

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

// 10. View member with highest debt
router.get('/10', async (req, res) => {
  try {
    const { organization, semester, academicYear } = req.query;
    
    if (!organization || !semester || !academicYear) {
      return res.status(400).json({ 
        error: 'Organization, semester and academic year are required' 
      });
    }

    const result = await Fee.findAll({
      include: [{
        model: Member,
        attributes: ['studentNumber', 'name']
      }, {
        model: Organization,
        where: { name: organization }
      }],
      where: {
        semester,
        academicYear,
        status: 'unpaid'
      },
      attributes: [
        'studentNumber',
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalDebt']
      ],
      group: ['studentNumber'],
      order: [[sequelize.fn('SUM', sequelize.col('amount')), 'DESC']],
      limit: 1
    });

    res.json(result);
  } catch (error) {
    handleError(res, error);
  }
});

// Get all organizations
router.get('/organizations', async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      order: [['name', 'ASC']]
    });
    res.json(organizations);
  } catch (error) {
    handleError(res, error);
  }
});

// Get membership report
router.get('/membership', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Organization,
        through: ServesIn,
        attributes: ['name'],
      }],
      attributes: ['studentNumber', 'name', 'status'],
    });

    const formattedData = members.map(member => ({
      'Student Number': member.studentNumber,
      'Name': member.name,
      'Status': member.status,
      'Organizations': member.Organizations.map(org => org.name).join(', ')
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching membership report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get fee collection report
router.get('/fees', async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [
        {
          model: Organization,
          attributes: ['name'],
        },
        {
          model: Member,
          attributes: ['studentNumber', 'name'],
        }
      ],
      attributes: ['id', 'amount', 'description', 'status', 'createdAt'],
    });

    const formattedData = fees.map(fee => ({
      'Student Number': fee.Member.studentNumber,
      'Name': fee.Member.name,
      'Organization': fee.Organization.name,
      'Amount': fee.amount,
      'Description': fee.description,
      'Status': fee.status,
      'Date': new Date(fee.createdAt).toLocaleDateString()
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching fee collection report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get organization membership report
router.get('/organization', async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [{
        model: Member,
        through: ServesIn,
        attributes: ['studentNumber', 'name', 'status'],
      }],
      attributes: ['id', 'name', 'description'],
    });

    const formattedData = organizations.map(org => ({
      'Organization': org.name,
      'Description': org.description,
      'Total Members': org.Members.length,
      'Active Members': org.Members.filter(m => m.status === 'active').length,
      'Inactive Members': org.Members.filter(m => m.status === 'inactive').length
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching organization report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get member details report
router.get('/member', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Organization,
          through: ServesIn,
          attributes: ['name'],
        },
        {
          model: Fee,
          attributes: ['amount', 'description', 'status'],
        }
      ],
      attributes: ['studentNumber', 'name', 'status'],
    });

    const formattedData = members.map(member => ({
      'Student Number': member.studentNumber,
      'Name': member.name,
      'Status': member.status,
      'Organizations': member.Organizations.map(org => org.name).join(', '),
      'Total Fees': member.Fees.reduce((sum, fee) => sum + fee.amount, 0),
      'Unpaid Fees': member.Fees.filter(fee => fee.status === 'unpaid')
        .reduce((sum, fee) => sum + fee.amount, 0)
    }));

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching member details report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all members with their organizations
router.get('/members-with-orgs', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Organization,
        through: ServesIn
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all organizations with their members
router.get('/orgs-with-members', async (req, res) => {
  try {
    const organizations = await Organization.findAll({
      include: [{
        model: Member,
        through: ServesIn
      }]
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all fees with their organizations
router.get('/fees-with-orgs', async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [Organization]
    });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;