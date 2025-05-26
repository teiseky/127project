const sequelize = require('./config/database');
const { Member, Organization, Fee, ServesIn } = require('./models');

async function testConnection() {
    try {
        // Test database connection
        await sequelize.authenticate();
        console.log('✅ Database connection successful!');

        // Force recreate all tables
        await sequelize.sync({ force: true });
        console.log('✅ Tables recreated successfully!');

        // Test inserting a member
        const testMember = await Member.create({
            studentNumber: '2023001',
            name: 'Test User',
            degreeProgram: 'BS Computer Science',
            age: 20,
            gender: 'Male'
        });
        console.log('✅ Test member created successfully:', testMember.toJSON());

        // Test inserting an organization
        const testOrg = await Organization.create({
            organizationId: 'ORG001',
            name: 'Test Organization',
            scope: 'University',
            type: 'Academic'
        });
        console.log('✅ Test organization created successfully:', testOrg.toJSON());

        // Test inserting a fee
        const testFee = await Fee.create({
            transactionId: 'FEE001',
            amount: 100.00,
            status: 'unpaid',
            type: 'Membership',
            semester: '1st',
            academicYear: '2023-2024',
            isLate: false,
            studentNumber: '2023001',
            organizationId: 'ORG001'
        });
        console.log('✅ Test fee created successfully:', testFee.toJSON());

        // Test inserting a serves_in record
        const testServesIn = await ServesIn.create({
            studentNumber: '2023001',
            organizationId: 'ORG001',
            role: 'Member',
            status: 'active',
            semester: '1st',
            academicYear: '2023-2024',
            committee: 'General'
        });
        console.log('✅ Test serves_in record created successfully:', testServesIn.toJSON());

        // Test querying the data
        const members = await Member.findAll({
            include: [
                { model: Organization, through: ServesIn },
                { model: Fee }
            ]
        });
        console.log('✅ Successfully queried members with associations:', JSON.stringify(members, null, 2));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        // Close the database connection
        await sequelize.close();
        console.log('Database connection closed.');
    }
}

testConnection(); 