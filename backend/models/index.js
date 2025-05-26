const sequelize = require('../config/database');
const Member = require('./member');
const Organization = require('./organization');
const Fee = require('./fee');
const ServesIn = require('./servesIn');

// Fee associations
Member.hasMany(Fee, { 
    foreignKey: 'Student_number',
    sourceKey: 'studentNumber'
});
Fee.belongsTo(Member, { 
    foreignKey: 'Student_number',
    targetKey: 'studentNumber'
});

Organization.hasMany(Fee, { 
    foreignKey: 'Organization_id',
    sourceKey: 'organizationId'
});
Fee.belongsTo(Organization, { 
    foreignKey: 'Organization_id',
    targetKey: 'organizationId'
});

// ServesIn associations
Member.hasMany(ServesIn, {
    foreignKey: 'Student_number',
    sourceKey: 'studentNumber'
});
ServesIn.belongsTo(Member, {
    foreignKey: 'Student_number',
    targetKey: 'studentNumber'
});

Organization.hasMany(ServesIn, {
    foreignKey: 'Organization_id',
    sourceKey: 'organizationId'
});
ServesIn.belongsTo(Organization, {
    foreignKey: 'Organization_id',
    targetKey: 'organizationId'
});

// Many-to-many relationship through ServesIn
Member.belongsToMany(Organization, {
    through: ServesIn,
    foreignKey: 'Student_number',
    otherKey: 'Organization_id',
    as: 'Organizations'
});

Organization.belongsToMany(Member, {
    through: ServesIn,
    foreignKey: 'Organization_id',
    otherKey: 'Student_number',
    as: 'Members'
});

// Export models
module.exports = {
    sequelize,
    Member,
    Organization,
    Fee,
    ServesIn
}; 