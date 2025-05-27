const { Member, Organization, Fee, ServesIn } = require('../models');

exports.getUserById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [
        {
          model: Organization,
          as: 'Organizations',
          through: ServesIn
        },
        {
          model: Fee
        }
      ]
    });

    if (!member) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
