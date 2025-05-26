const express = require('express');
const router = express.Router();
const { Fee, Member, Organization } = require('../models');
const sequelize = require('../config/database'); // Import sequelize instance

// Get all fees
router.get('/', async (req, res) => {
  try {
    const fees = await Fee.findAll({
      include: [
        {
          model: Member,
          attributes: ['studentNumber', 'name'],
          required: false
        },
        {
          model: Organization,
          attributes: ['organizationId', 'name'],
          required: false
        }
      ],
      order: [['transactionId', 'DESC']]
    });

    console.log('Fetched fees data:', JSON.stringify(fees, null, 2));

    if (!fees || fees.length === 0) {
      return res.json([]);
    }

    res.json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new fee
router.post('/', async (req, res) => {
  try {
    console.log('Received data for creating fee:', req.body);

    // Validate required fields
    const requiredFields = ['transactionId', 'status', 'amount', 'type', 'semester', 'academicYear', 'studentNumber', 'organizationId'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}` 
      });
    }

    // Validate status
    if (!['paid', 'unpaid'].includes(req.body.status)) {
      return res.status(400).json({ 
        message: 'Status must be either "paid" or "unpaid"' 
      });
    }

    // Validate payment date for paid fees
    if (req.body.status === 'paid' && !req.body.paymentDate) {
      return res.status(400).json({ 
        message: 'Payment date is required for paid fees' 
      });
    }

    // Create fee using Sequelize model
    const fee = await Fee.create({
      transactionId: req.body.transactionId,
      status: req.body.status,
      paymentDate: req.body.paymentDate || null,
      amount: parseFloat(req.body.amount),
      type: req.body.type,
      semester: req.body.semester,
      academicYear: req.body.academicYear,
      isLate: req.body.isLate || false,
      studentNumber: req.body.studentNumber,
      organizationId: req.body.organizationId
    });

    res.status(201).json(fee);
  } catch (error) {
    console.error('Error creating fee:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ message: 'A fee with this transaction ID already exists' });
    } else if (error.name === 'SequelizeValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Update a fee
router.put('/:transactionId', async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.transactionId);
    if (fee) {
      await fee.update(req.body);
      res.json(fee);
    } else {
      res.status(404).json({ message: 'Fee not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a fee
router.delete('/:transactionId', async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.transactionId);
    if (fee) {
      await fee.destroy();
      res.json({ message: 'Fee deleted' });
    } else {
      res.status(404).json({ message: 'Fee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 