const { Member, Organization, Fee, ServesIn, sequelize } = require('./models');

const seedDatabase = async () => {
  try {
    // Sync all models with the database
    await sequelize.sync({ force: true });
    console.log('Database tables recreated successfully');

    // Create 10 organizations
    const organizations = await Organization.bulkCreate([
      {
        organizationId: 'ORG001',
        name: 'Digital Arts Society',
        scope: 'university',
        type: 'Academic',
        description: 'Organization for digital artists and multimedia creators',
        address: '123 Creative Ave, University Campus',
        contactEmail: 'contact@digitalartsoc.org',
        contactPhone: '+63-917-1234567',
        status: 'active',
        foundedDate: '2018-03-15'
      },
      {
        organizationId: 'ORG002',
        name: 'Environmental Action Network',
        scope: 'college',
        type: 'Advocacy',
        description: 'Student-led environmental conservation and awareness group',
        address: '456 Green Street, Eco Building',
        contactEmail: 'info@enviroaction.ph',
        contactPhone: '+63-918-2345678',
        status: 'active',
        foundedDate: '2019-08-22'
      },
      {
        organizationId: 'ORG003',
        name: 'Business Innovation Hub',
        scope: 'department',
        type: 'Professional',
        description: 'Entrepreneurship and business development organization',
        address: '789 Commerce Plaza, Business Hall',
        contactEmail: 'hello@bizhub.edu',
        contactPhone: '+63-919-3456789',
        status: 'active',
        foundedDate: '2017-01-10'
      },
      {
        organizationId: 'ORG004',
        name: 'Cultural Heritage Foundation',
        scope: 'university',
        type: 'Cultural',
        description: 'Preservation and promotion of Filipino cultural traditions',
        address: '321 Heritage Lane, Cultural Center',
        contactEmail: 'admin@culturalheritage.org',
        contactPhone: '+63-920-4567890',
        status: 'active',
        foundedDate: '2016-06-05'
      },
      {
        organizationId: 'ORG005',
        name: 'Tech Innovators Club',
        scope: 'college',
        type: 'Academic',
        description: 'Technology research and development community',
        address: '654 Innovation Drive, Tech Building',
        contactEmail: 'team@techinnovators.net',
        contactPhone: '+63-921-5678901',
        status: 'active',
        foundedDate: '2020-02-14'
      },
      {
        organizationId: 'ORG006',
        name: 'Medical Outreach Society',
        scope: 'department',
        type: 'Service',
        description: 'Healthcare volunteers serving underserved communities',
        address: '987 Health Street, Medical Complex',
        contactEmail: 'volunteers@medoutreach.ph',
        contactPhone: '+63-922-6789012',
        status: 'active',
        foundedDate: '2015-11-30'
      },
      {
        organizationId: 'ORG007',
        name: 'Athletic Performance League',
        scope: 'university',
        type: 'Sports',
        description: 'Multi-sport organization promoting fitness and competition',
        address: '147 Sports Complex, Athletic Center',
        contactEmail: 'athletics@performanceleague.org',
        contactPhone: '+63-923-7890123',
        status: 'active',
        foundedDate: '2019-04-18'
      },
      {
        organizationId: 'ORG008',
        name: 'Literary Arts Collective',
        scope: 'college',
        type: 'Cultural',
        description: 'Writers, poets, and literature enthusiasts community',
        address: '258 Writers Row, Library Building',
        contactEmail: 'editors@literaryarts.edu',
        contactPhone: '+63-924-8901234',
        status: 'inactive',
        foundedDate: '2018-09-07'
      },
      {
        organizationId: 'ORG009',
        name: 'Social Justice Alliance',
        scope: 'university',
        type: 'Advocacy',
        description: 'Human rights and social justice advocacy group',
        address: '369 Justice Avenue, Student Center',
        contactEmail: 'advocate@socialjustice.ph',
        contactPhone: '+63-925-9012345',
        status: 'active',
        foundedDate: '2017-12-03'
      },
      {
        organizationId: 'ORG010',
        name: 'Future Leaders Forum',
        scope: 'department',
        type: 'Leadership',
        description: 'Leadership development and mentorship program',
        address: '741 Leadership Lane, Administration Building',
        contactEmail: 'mentors@futureleaders.org',
        contactPhone: '+63-926-0123456',
        status: 'active',
        foundedDate: '2020-07-25'
      }
    ]);

    console.log(`Created ${organizations.length} organizations`);

    // Create 20 members
    const members = await Member.bulkCreate([
      {
        studentNumber: '2021-54321',
        name: 'Maria Elena Santos',
        degreeProgram: 'BS Information Technology',
        age: 20,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2022-65432',
        name: 'Carlos Miguel Reyes',
        degreeProgram: 'BS Environmental Science',
        age: 19,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2020-76543',
        name: 'Patricia Anne Cruz',
        degreeProgram: 'BS Business Administration',
        age: 22,
        gender: 'Female',
        dateGraduated: '2024-04-15'
      },
      {
        studentNumber: '2021-87654',
        name: 'Roberto Luis Garcia',
        degreeProgram: 'BA Filipino Studies',
        age: 21,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2022-98765',
        name: 'Andrea Sofia Mendoza',
        degreeProgram: 'BS Computer Engineering',
        age: 18,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2019-12345',
        name: 'Miguel Antonio Torres',
        degreeProgram: 'BS Biology',
        age: 23,
        gender: 'Male',
        dateGraduated: '2023-05-20'
      },
      {
        studentNumber: '2021-23456',
        name: 'Isabella Marie Flores',
        degreeProgram: 'BS Sports Science',
        age: 20,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2022-34567',
        name: 'Gabriel Jose Morales',
        degreeProgram: 'BA Creative Writing',
        age: 19,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2020-45678',
        name: 'Sophia Grace Dela Cruz',
        degreeProgram: 'BA Political Science',
        age: 22,
        gender: 'Female',
        dateGraduated: '2024-03-10'
      },
      {
        studentNumber: '2021-56789',
        name: 'Alexander James Rivera',
        degreeProgram: 'BS Psychology',
        age: 21,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2022-67890',
        name: 'Camille Rose Villanueva',
        degreeProgram: 'BS Marketing',
        age: 18,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2021-78901',
        name: 'Diego Rafael Santos',
        degreeProgram: 'BS Civil Engineering',
        age: 20,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2020-89012',
        name: 'Valentina Kate Lopez',
        degreeProgram: 'BS Nursing',
        age: 22,
        gender: 'Female',
        dateGraduated: '2024-06-12'
      },
      {
        studentNumber: '2022-90123',
        name: 'Mateo David Gonzales',
        degreeProgram: 'BS Architecture',
        age: 19,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2021-01234',
        name: 'Luna Sofia Ramos',
        degreeProgram: 'BS Chemistry',
        age: 21,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2019-11111',
        name: 'Ethan Miguel Castillo',
        degreeProgram: 'BS Physics',
        age: 24,
        gender: 'Male',
        dateGraduated: '2023-07-18'
      },
      {
        studentNumber: '2022-22222',
        name: 'Zoe Catherine Aquino',
        degreeProgram: 'BS Mathematics',
        age: 18,
        gender: 'Female',
        dateGraduated: null
      },
      {
        studentNumber: '2021-33333',
        name: 'Lucas Antonio Perez',
        degreeProgram: 'BS Economics',
        age: 20,
        gender: 'Male',
        dateGraduated: null
      },
      {
        studentNumber: '2020-44444',
        name: 'Aria Isabelle Tan',
        degreeProgram: 'BS Hotel Management',
        age: 22,
        gender: 'Female',
        dateGraduated: '2024-05-08'
      },
      {
        studentNumber: '2022-55555',
        name: 'Noah Sebastian Lim',
        degreeProgram: 'BS Industrial Engineering',  
        age: 19,
        gender: 'Male',
        dateGraduated: null
      }
    ]);

    console.log(`Created ${members.length} members`);

    // Create member-organization relationships (each student in different orgs)
    const servesInRecords = await ServesIn.bulkCreate([
      // Organization 1 - Digital Arts Society
      { Student_number: '2021-54321', Organization_id: 'ORG001', Role: 'President', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Executive Board' },
      { Student_number: '2022-65432', Organization_id: 'ORG001', Role: 'Vice President', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Creative Committee' },
      
      // Organization 2 - Environmental Action Network
      { Student_number: '2020-76543', Organization_id: 'ORG002', Role: 'Secretary', Status: 'alumni', Semester: 'Second', Academic_year: '2023-2024', Committee: 'Advocacy Committee' },
      { Student_number: '2021-87654', Organization_id: 'ORG002', Role: 'Treasurer', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Finance Committee' },
      
      // Organization 3 - Business Innovation Hub
      { Student_number: '2022-98765', Organization_id: 'ORG003', Role: 'Member', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Marketing Committee' },
      { Student_number: '2019-12345', Organization_id: 'ORG003', Role: 'Advisor', Status: 'alumni', Semester: 'Second', Academic_year: '2022-2023', Committee: 'Advisory Board' },
      
      // Organization 4 - Cultural Heritage Foundation
      { Student_number: '2021-23456', Organization_id: 'ORG004', Role: 'Public Relations Officer', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Communications' },
      { Student_number: '2022-34567', Organization_id: 'ORG004', Role: 'Event Coordinator', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Events Committee' },
      
      // Organization 5 - Tech Innovators Club
      { Student_number: '2020-45678', Organization_id: 'ORG005', Role: 'Project Manager', Status: 'alumni', Semester: 'First', Academic_year: '2023-2024', Committee: 'Development Team' },
      { Student_number: '2021-56789', Organization_id: 'ORG005', Role: 'Member', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Research Committee' },
      
      // Organization 6 - Medical Outreach Society
      { Student_number: '2022-67890', Organization_id: 'ORG006', Role: 'Volunteer Coordinator', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Outreach Committee' },
      { Student_number: '2021-78901', Organization_id: 'ORG006', Role: 'Member', Status: 'inactive', Semester: 'Second', Academic_year: '2023-2024', Committee: 'Medical Team' },
      
      // Organization 7 - Athletic Performance League
      { Student_number: '2020-89012', Organization_id: 'ORG007', Role: 'Team Captain', Status: 'alumni', Semester: 'Second', Academic_year: '2023-2024', Committee: 'Athletics Committee' },
      { Student_number: '2022-90123', Organization_id: 'ORG007', Role: 'Training Officer', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Training Committee' },
      
      // Organization 8 - Literary Arts Collective
      { Student_number: '2021-01234', Organization_id: 'ORG008', Role: 'Editor-in-Chief', Status: 'suspended', Semester: 'First', Academic_year: '2024-2025', Committee: 'Editorial Board' },
      { Student_number: '2019-11111', Organization_id: 'ORG008', Role: 'Contributing Writer', Status: 'alumni', Semester: 'Second', Academic_year: '2022-2023', Committee: 'Publications' },
      
      // Organization 9 - Social Justice Alliance
      { Student_number: '2022-22222', Organization_id: 'ORG009', Role: 'Advocacy Officer', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Legal Affairs' },
      { Student_number: '2021-33333', Organization_id: 'ORG009', Role: 'Research Assistant', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Research Committee' },
      
      // Organization 10 - Future Leaders Forum
      { Student_number: '2020-44444', Organization_id: 'ORG010', Role: 'Mentor', Status: 'alumni', Semester: 'First', Academic_year: '2023-2024', Committee: 'Mentorship Program' },
      { Student_number: '2022-55555', Organization_id: 'ORG010', Role: 'Program Coordinator', Status: 'active', Semester: 'First', Academic_year: '2024-2025', Committee: 'Program Development' }
    ]);

    console.log(`Created ${servesInRecords.length} member-organization relationships`);

    console.log('Database seeded successfully!');
    console.log('Created:');
    console.log('- 10 Organizations');
    console.log('- 20 Members');
    console.log('- 20 Member-Organization relationships');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error('Error details:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors);
    }
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the seed function
seedDatabase();