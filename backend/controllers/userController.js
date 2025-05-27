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

// For report 3: View member's unpaid fees for all organizations
exports.getLateFees = async (req, res) => {
    
  console.log('Fetching unpaid fees for member...');
  console.log('Request query:', req.query);
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

    console.log('Unpaid fees found:', fees.length);
    res.json(fees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
