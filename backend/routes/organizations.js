const express = require('express');
const router = express.Router();
const { Organization, Member, ServesIn } = require('../models');

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await Organization.findAll();
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new organization
router.post('/', async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an organization
router.put('/:organizationId', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.organizationId);
    if (organization) {
      await organization.update(req.body);
      res.json(organization);
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an organization
router.delete('/:organizationId', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.organizationId);
    if (organization) {
      await organization.destroy();
      res.json({ message: 'Organization deleted' });
    } else {
      res.status(404).json({ message: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all members of an organization
router.get('/:organizationId/members', async (req, res) => {
  try {
    const memberships = await ServesIn.findAll({
      where: { Organization_id: req.params.organizationId },
      include: [{
        model: Member,
        required: true
      }]
    });

    // Format the response to include only the necessary data
    const formattedMemberships = memberships.map(membership => ({
      Student_number: membership.Student_number,
      role: membership.role || 'No Role',
      status: membership.status || 'Unknown',
      semester: membership.semester || 'Unknown',
      academicYear: membership.academicYear || 'Unknown',
      committee: membership.committee || 'No Committee',
      Member: membership.Member ? membership.Member.name : 'Unknown Member'
    }));

    res.json(formattedMemberships);
  } catch (error) {
    console.error('Error in get members:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add a member to an organization
router.post('/:organizationId/members', async (req, res) => {
  try {
    const { studentNumber, role, status, semester, academicYear, committee } = req.body;
    const organizationId = req.params.organizationId;
    
    console.log('Backend received - organizationId from params:', organizationId); // Debug log
    console.log('Backend received - studentNumber from body:', studentNumber); // Debug log
    console.log('Backend received - req.body:', req.body); // Debug log

    console.log('Adding member to organization:', {
      organizationId,
      studentNumber,
      role,
      status,
      semester,
      academicYear,
      committee
    });

    // Check if member exists
    const member = await Member.findByPk(studentNumber);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if organization exists
    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    // Check if membership already exists
    const existingMembership = await ServesIn.findOne({
      where: {
        Student_number: studentNumber,
        Organization_id: organizationId
      }
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Member is already part of this organization' });
    }

    // Create membership using model field names
    const membership = await ServesIn.create({
      studentNumber: studentNumber, // Use model field name
      organizationId: organizationId, // Use model field name
      role: role,
      status: status,
      semester: semester,
      academicYear: academicYear,
      committee: committee
    });

    // Return the membership with member details
    const membershipWithMember = await ServesIn.findOne({
      where: { 
        Student_number: studentNumber,
        Organization_id: organizationId
      },
      include: [{
        model: Member,
        required: true
      }]
    });

    res.status(201).json(membershipWithMember);
  } catch (error) {
    console.error('Error in add member:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a member's role in an organization
router.put('/:organizationId/members/:studentNumber', async (req, res) => {
  try {
    const membership = await ServesIn.findOne({
      where: {
        Organization_id: req.params.organizationId,
        Student_number: req.params.studentNumber
      },
      include: [{
        model: Member,
        required: true
      }]
    });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    await membership.update(req.body);
    
    // Return updated membership with member details
    const updatedMembership = await ServesIn.findOne({
      where: {
        Organization_id: req.params.organizationId,
        Student_number: req.params.studentNumber
      },
      include: [{
        model: Member,
        required: true
      }]
    });

    res.json(updatedMembership);
  } catch (error) {
    console.error('Error in update member:', error);
    res.status(400).json({ message: error.message });
  }
});

// Remove a member from an organization
router.delete('/:organizationId/members/:studentNumber', async (req, res) => {
  try {
    const membership = await ServesIn.findOne({
      where: {
        Organization_id: req.params.organizationId,
        Student_number: req.params.studentNumber
      }
    });

    if (!membership) {
      return res.status(404).json({ message: 'Membership not found' });
    }

    await membership.destroy();
    res.json({ message: 'Member removed from organization successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 