    /*
    * Triggers:
    * 1. When a Member's dateGraduated is set, update all ServesIn records for that member to 'alumni'.
    *
    */

function initializeTriggers({ Member, ServesIn, Fee, Organization, RoleAssignment, Sequelize }) {
    // Get Op from Sequelize or fallback to require
    const Op = (Sequelize && Sequelize.Op) ? Sequelize.Op : require('sequelize').Op;

    // 1. Update ServesIn status to 'alumni' when dateGraduated is set
    Member.addHook('afterUpdate', async (member, options) => {
        console.log('Member afterUpdate:', member);
        const studentNumber = member.get ? member.get('studentNumber') : member.studentNumber;
        if (member.changed('dateGraduated') && member.dateGraduated) {
            await ServesIn.update(
                { status: 'alumni' },
                { where: { studentNumber: studentNumber, status: { [Op.ne]: 'alumni' } } }
            );
        }
    });
}

module.exports = initializeTriggers;