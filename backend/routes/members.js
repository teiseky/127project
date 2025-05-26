const express = require('express');
const router = express.Router();
const { Member, Organization, ServesIn } = require('../models');

// Get all members including their organizations
router.get('/with-orgs', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Organization,
        through: ServesIn,
        attributes: ['organizationId', 'name'], // Include relevant organization fields
        through: { attributes: [] } // Exclude join table attributes if not needed
      }]
    });
    res.json(members);
  } catch (error) {
    console.error('Error fetching members with organizations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.findAll();
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single member
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new member
router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a member
router.put('/:studentNumber', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.studentNumber);
    if (member) {
      await member.update(req.body);
      res.json(member);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a member
router.delete('/:studentNumber', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.studentNumber);
    if (member) {
      await member.destroy();
      res.json({ message: 'Member deleted' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 