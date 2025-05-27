const express = require('express');
const router = express.Router();
const { Member, Organization, Fee, ServesIn } = require('../models');

// Get all members with their organizations
router.get('/with-orgs', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Organization,
          through: {
            model: ServesIn,
            attributes: ['role', 'status', 'semester', 'academicYear', 'committee']
          },
          as: 'Organizations' // This alias should match what's defined in your associations
        }
      ]
    });
    
    console.log('Members with organizations fetched:', members.length);
    if (members.length > 0) {
      console.log('Sample member:', JSON.stringify(members[0], null, 2));
    }
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching members with organizations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all members (existing route)
router.get('/', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Organization,
          through: ServesIn,
          as: 'Organizations'
        },
        {
          model: Fee
        }
      ]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          through: ServesIn,
          as: 'Organizations'
        },
        {
          model: Fee
        }
      ]
    });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new member
router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    await member.update(req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    await member.destroy();
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;