const { Member, Organization, Fee, ServesIn } = require('../models');

// Get all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [
        {
          model: Organization,
          through: ServesIn
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
};

// Get member by ID
exports.getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          through: ServesIn
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
};

// Create new member
exports.createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update member
exports.updateMember = async (req, res) => {
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
};

// Delete member
exports.deleteMember = async (req, res) => {
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
}; 