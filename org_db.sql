-- Drop database if exists and create new one
DROP DATABASE IF EXISTS org_db;
CREATE DATABASE org_db;
USE org_db;

-- Disable foreign key checks temporarily for easier setup
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables if they exist (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS FEE;
DROP TABLE IF EXISTS SERVES_IN;
DROP TABLE IF EXISTS ORGANIZATION;
DROP TABLE IF EXISTS MEMBER;

-- Create MEMBER table
CREATE TABLE MEMBER (
    Student_number VARCHAR(10) PRIMARY KEY,
    Degree_program VARCHAR(255),
    Age INT,
    Gender VARCHAR(255),
    Name VARCHAR(255) NOT NULL,
    Date_graduated DATE
);

-- Create ORGANIZATION table
CREATE TABLE ORGANIZATION (
    Organization_id VARCHAR(255) PRIMARY KEY,
    Scope VARCHAR(15),
    Type VARCHAR(50),
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Address VARCHAR(255),
    ContactEmail VARCHAR(255),
    ContactPhone VARCHAR(255),
    Status ENUM('active', 'inactive') DEFAULT 'active',
    FoundedDate DATE
);

-- Create SERVES_IN table (removed problematic unique constraint)
CREATE TABLE SERVES_IN (
    Student_number VARCHAR(10),
    Organization_id VARCHAR(255),
    Role VARCHAR(50), 
    Status ENUM('active', 'inactive', 'alumni', 'expelled', 'suspended'),
    Semester VARCHAR(20), 
    Academic_year VARCHAR(15), 
    Committee VARCHAR(255),
    PRIMARY KEY (Student_number, Organization_id),
    FOREIGN KEY (Student_number) REFERENCES MEMBER(Student_number) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Organization_id) REFERENCES ORGANIZATION(Organization_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create FEE table
CREATE TABLE FEE (
    Transaction_id VARCHAR(255) PRIMARY KEY,
    Status ENUM('unpaid', 'paid'),
    Payment_date DATE,
    Amount DECIMAL(10, 2),
    Type VARCHAR(50),
    Semester VARCHAR(20), 
    Academic_year VARCHAR(15), 
    Is_late BOOLEAN DEFAULT FALSE,
    Student_number VARCHAR(10),
    Organization_id VARCHAR(255),
    FOREIGN KEY (Student_number) REFERENCES MEMBER(Student_number) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (Organization_id) REFERENCES ORGANIZATION(Organization_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert MEMBER data first
INSERT INTO MEMBER (Student_number, Degree_program, Age, Gender, Name, Date_graduated) VALUES
('2020123456', 'BS Computer Science', 21, 'Male', 'Juan Carlos Santos', NULL),
('2020123457', 'BS Biology', 20, 'Female', 'Maria Elena Rodriguez', NULL),
('2019123458', 'BS Agricultural Engineering', 22, 'Male', 'Roberto Miguel Cruz', NULL),
('2021123459', 'BS Mathematics', 19, 'Female', 'Ana Sofia Reyes', NULL),
('2020123460', 'BS Physics', 21, 'Male', 'Carlos Eduardo Morales', NULL),
('2019123461', 'BS Chemistry', 23, 'Female', 'Isabella Carmen Torres', NULL),
('2021123462', 'BS Agricultural Economics', 18, 'Male', 'Diego Antonio Flores', NULL),
('2020123463', 'BS Statistics', 20, 'Female', 'Lucia Fernanda Garcia', NULL),
('2019123464', 'BS Development Communication', 24, 'Male', 'Fernando Luis Mendoza', NULL),
('2022123465', 'BS Computer Science', 18, 'Female', 'Camila Beatriz Herrera', NULL),
('2020123466', 'BS Biology', 21, 'Male', 'Alejandro Rafael Jimenez', NULL),
('2019123467', 'BS Agricultural Engineering', 22, 'Female', 'Valentina Isabel Castro', NULL),
('2021123468', 'BS Mathematics', 19, 'Male', 'Sebastian David Vargas', NULL),
('2020123469', 'BS Physics', 20, 'Female', 'Natalia Andrea Ruiz', NULL),
('2019123470', 'BS Chemistry', 23, 'Male', 'Emilio Francisco Gutierrez', NULL),
('2021123471', 'BS Agricultural Economics', 18, 'Female', 'Gabriela Victoria Ramos', NULL),
('2020123472', 'BS Statistics', 21, 'Male', 'Mateo Ignacio Ortega', NULL),
('2019123473', 'BS Development Communication', 24, 'Female', 'Sophia Alejandra Delgado', NULL),
('2022123474', 'BS Computer Science', 18, 'Male', 'Nicolas Santiago Peña', NULL),
('2020123475', 'BS Biology', 20, 'Female', 'Elena Mariana Aguilar', NULL),
('2019123476', 'BS Agricultural Engineering', 22, 'Male', 'Joaquin Manuel Silva', NULL),
('2021123477', 'BS Mathematics', 19, 'Female', 'Adriana Paola Guerrero', NULL),
('2020123478', 'BS Physics', 21, 'Male', 'Lorenzo Gabriel Medina', NULL),
('2019123479', 'BS Chemistry', 23, 'Female', 'Daniela Cristina Romero', NULL),
('2021123480', 'BS Agricultural Economics', 18, 'Male', 'Andres Felipe Soto', NULL),
('2020123481', 'BS Statistics', 20, 'Female', 'Valeria Esperanza Campos', NULL),
('2019123482', 'BS Development Communication', 24, 'Male', 'Ricardo Humberto Vega', NULL),
('2022123483', 'BS Computer Science', 18, 'Female', 'Ximena Rosario Blanco', NULL),
('2020123484', 'BS Biology', 21, 'Male', 'Patricio Esteban Navarro', NULL),
('2019123485', 'BS Agricultural Engineering', 22, 'Female', 'Carolina Fernanda Ibarra', NULL),
('2021123486', 'BS Mathematics', 19, 'Male', 'Emiliano Arturo Molina', NULL),
('2020123487', 'BS Physics', 20, 'Female', 'Renata Alejandra Contreras', NULL),
('2019123488', 'BS Chemistry', 23, 'Male', 'Gonzalo Mauricio Espinoza', NULL),
('2021123489', 'BS Agricultural Economics', 18, 'Female', 'Martina Soledad Heredia', NULL),
('2020123490', 'BS Statistics', 21, 'Male', 'Maximiliano Bruno Paredes', NULL),
('2019123491', 'BS Development Communication', 24, 'Female', 'Antonella Guadalupe Sandoval', NULL),
('2022123492', 'BS Computer Science', 18, 'Male', 'Thiago Benjamin Calderon', NULL),
('2020123493', 'BS Biology', 20, 'Female', 'Julieta Carmen Fuentes', NULL),
('2019123494', 'BS Agricultural Engineering', 22, 'Male', 'Octavio Rodrigo Zuniga', NULL),
('2021123495', 'BS Mathematics', 19, 'Female', 'Fernanda Esperanza Cabrera', NULL),
('2020123496', 'BS Physics', 21, 'Male', 'Salvador Domingo Acosta', NULL),
('2019123497', 'BS Chemistry', 23, 'Female', 'Constanza Beatriz Ponce', NULL),
('2021123498', 'BS Agricultural Economics', 18, 'Male', 'Esteban Ricardo Gallardo', NULL),
('2020123499', 'BS Statistics', 20, 'Female', 'Macarena Josefina Villanueva', NULL),
('2019123500', 'BS Development Communication', 24, 'Male', 'Ignacio Valentino Moreno', NULL),
('2022123501', 'BS Computer Science', 18, 'Female', 'Catalina Esperanza Rojas', NULL),
('2020123502', 'BS Biology', 21, 'Male', 'Agustin Leonardo Becerra', NULL),
('2019123503', 'BS Agricultural Engineering', 22, 'Female', 'Violeta Magdalena Uribe', NULL),
('2021123504', 'BS Mathematics', 19, 'Male', 'Cristobal Emilio Cordova', NULL),
('2020123505', 'BS Physics', 20, 'Female', 'Esperanza Carolina Hidalgo', NULL);

-- Insert ORGANIZATION data second
INSERT INTO ORGANIZATION (Organization_id, Scope, Type, Name, Description, Address, ContactEmail, ContactPhone, Status, FoundedDate) VALUES
('AIESEC-UPLB', 'International', 'Professional', 'AIESEC in UPLB', 'Global platform for young people to explore and develop their leadership potential', 'UPLB Campus, Los Banos, Laguna', 'aiesec.uplb@gmail.com', '09171234567', 'active', '2010-08-15'),
('UPLB-ASTROSOC', 'University', 'Academic', 'ASTRONOMICAL SOCIETY', 'Organization for astronomy enthusiasts and students', 'UPLB Physics Building', 'astrosoc.uplb@gmail.com', '09181234568', 'active', '2005-03-20'),
('UP-BBALL', 'University', 'Sports', 'BASKETBOLEROS, BASKETBOLERAS: ANG LIGANG LAMANG', 'Basketball organization promoting sportsmanship and teamwork', 'UPLB Gymnasium', 'upbball.uplb@gmail.com', '09191234569', 'active', '2008-06-10'),
('CBI-UPLB', 'University', 'Religious', 'CHRISTIAN BROTHERHOOD INTERNATIONAL', 'Christian fellowship and service organization', 'UPLB Student Union Building', 'cbi.uplb@gmail.com', '09201234570', 'active', '2012-01-25'),
('UPLB-DSG', 'University', 'Academic', 'DATA SCIENCE GUILD', 'Organization for data science and analytics enthusiasts', 'UPLB Computer Science Building', 'dsg.uplb@gmail.com', '09211234571', 'active', '2018-09-05'),
('UPFC-UPLB', 'University', 'Arts', 'FILM CIRCLE', 'Film production and appreciation organization', 'UPLB Arts Building', 'filmcircle.uplb@gmail.com', '09221234572', 'active', '2007-11-12'),
('GY-UPLB', 'University', 'Advocacy', 'GABRIELA YOUTH - UPLB', 'Youth organization advocating for womens rights and social justice', 'UPLB Student Center', 'gy.uplb@gmail.com', '09231234573', 'active', '2015-02-28'),
('UPLB-MOUNTAINEERS', 'University', 'Sports', 'MOUNTAINEERS', 'Outdoor adventure and mountaineering organization', 'UPLB Recreation Center', 'mountaineers.uplb@gmail.com', '09241234574', 'active', '2000-04-18'),
('UP-MUN', 'University', 'Academic', 'MODEL UNITED NATIONS', 'Debate and diplomacy simulation organization', 'UPLB Social Sciences Building', 'mun.uplb@gmail.com', '09251234575', 'active', '2009-07-22'),
('YES-UP', 'University', 'Professional', 'YOUNG ENTREPRENEURS SOCIETY UP', 'Organization for aspiring entrepreneurs and business leaders', 'UPLB Business Building', 'yes.uplb@gmail.com', '09261234576', 'active', '2011-10-30');

-- Insert SERVES_IN records (now with proper foreign key references)
INSERT INTO SERVES_IN (Student_number, Organization_id, Role, Status, Semester, Academic_year, Committee) VALUES
-- AIESEC members
('2020123456', 'AIESEC-UPLB', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2020123457', 'AIESEC-UPLB', 'Vice President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2019123458', 'AIESEC-UPLB', 'Secretary', 'active', '1st Semester', '2024-2025', 'Administration'),
('2021123459', 'AIESEC-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Marketing'),
('2020123460', 'AIESEC-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Finance'),

-- ASTROSOC members  
('2019123461', 'UPLB-ASTROSOC', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2021123462', 'UPLB-ASTROSOC', 'Member', 'active', '1st Semester', '2024-2025', 'Research'),
('2020123463', 'UPLB-ASTROSOC', 'Member', 'active', '1st Semester', '2024-2025', 'Events'),
('2019123464', 'UPLB-ASTROSOC', 'Treasurer', 'active', '1st Semester', '2024-2025', 'Finance'),
('2022123465', 'UPLB-ASTROSOC', 'Member', 'active', '1st Semester', '2024-2025', 'Outreach'),

-- Basketball org members
('2020123466', 'UP-BBALL', 'Captain', 'active', '1st Semester', '2024-2025', 'Sports Committee'),
('2019123467', 'UP-BBALL', 'Vice Captain', 'active', '1st Semester', '2024-2025', 'Sports Committee'),
('2021123468', 'UP-BBALL', 'Member', 'active', '1st Semester', '2024-2025', 'Training'),
('2020123469', 'UP-BBALL', 'Member', 'active', '1st Semester', '2024-2025', 'Equipment'),
('2019123470', 'UP-BBALL', 'Member', 'alumni', '2nd Semester', '2023-2024', 'Sports Committee'),

-- CBI members
('2021123471', 'CBI-UPLB', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2020123472', 'CBI-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Worship'),
('2019123473', 'CBI-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Outreach'),
('2022123474', 'CBI-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Fellowship'),

-- Data Science Guild members
('2020123475', 'UPLB-DSG', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2019123476', 'UPLB-DSG', 'Vice President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2021123477', 'UPLB-DSG', 'Member', 'active', '1st Semester', '2024-2025', 'Projects'),
('2020123478', 'UPLB-DSG', 'Member', 'active', '1st Semester', '2024-2025', 'Workshop'),
('2019123479', 'UPLB-DSG', 'Member', 'active', '1st Semester', '2024-2025', 'Research'),

-- Film Circle members
('2021123480', 'UPFC-UPLB', 'Director', 'active', '1st Semester', '2024-2025', 'Executive'),
('2020123481', 'UPFC-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Production'),
('2019123482', 'UPFC-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Editing'),
('2022123483', 'UPFC-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Script'),

-- Gabriela Youth members
('2020123484', 'GY-UPLB', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2019123485', 'GY-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Advocacy'),
('2021123486', 'GY-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Education'),
('2020123487', 'GY-UPLB', 'Member', 'active', '1st Semester', '2024-2025', 'Campaign'),

-- Mountaineers members
('2019123488', 'UPLB-MOUNTAINEERS', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2021123489', 'UPLB-MOUNTAINEERS', 'Member', 'active', '1st Semester', '2024-2025', 'Training'),
('2020123490', 'UPLB-MOUNTAINEERS', 'Member', 'active', '1st Semester', '2024-2025', 'Equipment'),
('2019123491', 'UPLB-MOUNTAINEERS', 'Member', 'active', '1st Semester', '2024-2025', 'Safety'),
('2022123492', 'UPLB-MOUNTAINEERS', 'Member', 'active', '1st Semester', '2024-2025', 'Logistics'),

-- MUN members
('2020123493', 'UP-MUN', 'Secretary General', 'active', '1st Semester', '2024-2025', 'Executive'),
('2019123494', 'UP-MUN', 'Deputy Sec Gen', 'active', '1st Semester', '2024-2025', 'Executive'),
('2021123495', 'UP-MUN', 'Member', 'active', '1st Semester', '2024-2025', 'Research'),
('2020123496', 'UP-MUN', 'Member', 'active', '1st Semester', '2024-2025', 'Training'),

-- YES UP members
('2019123497', 'YES-UP', 'President', 'active', '1st Semester', '2024-2025', 'Executive'),
('2021123498', 'YES-UP', 'Member', 'active', '1st Semester', '2024-2025', 'Projects'),
('2020123499', 'YES-UP', 'Member', 'active', '1st Semester', '2024-2025', 'Marketing'),
('2019123500', 'YES-UP', 'Member', 'active', '1st Semester', '2024-2025', 'Finance');

-- Now insert FEE records (after all foreign key dependencies are satisfied)
INSERT INTO FEE (Transaction_id, Status, Payment_date, Amount, Type, Semester, Academic_year, Is_late, Student_number, Organization_id) VALUES
-- AIESEC fees
('TXN001', 'paid', '2024-08-15', 500.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123456', 'AIESEC-UPLB'),
('TXN002', 'paid', '2024-08-20', 500.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123457', 'AIESEC-UPLB'),
('TXN003', 'unpaid', NULL, 500.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2019123458', 'AIESEC-UPLB'),
('TXN004', 'paid', '2024-09-01', 1000.00, 'Event', '1st Semester', '2024-2025', TRUE, '2021123459', 'AIESEC-UPLB'),
('TXN005', 'paid', '2024-08-25', 500.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123460', 'AIESEC-UPLB'),

-- ASTROSOC fees
('TXN006', 'paid', '2024-08-18', 300.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123461', 'UPLB-ASTROSOC'),
('TXN007', 'paid', '2024-08-22', 300.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2021123462', 'UPLB-ASTROSOC'),
('TXN008', 'unpaid', NULL, 750.00, 'Equipment', '1st Semester', '2024-2025', FALSE, '2020123463', 'UPLB-ASTROSOC'),
('TXN009', 'paid', '2024-08-30', 300.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123464', 'UPLB-ASTROSOC'),
('TXN010', 'paid', '2024-09-05', 300.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2022123465', 'UPLB-ASTROSOC'),

-- Basketball fees
('TXN011', 'paid', '2024-08-12', 400.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123466', 'UP-BBALL'),
('TXN012', 'paid', '2024-08-15', 400.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123467', 'UP-BBALL'),
('TXN013', 'unpaid', NULL, 400.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2021123468', 'UP-BBALL'),
('TXN014', 'paid', '2024-08-28', 800.00, 'Uniform', '1st Semester', '2024-2025', FALSE, '2020123469', 'UP-BBALL'),

-- CBI fees
('TXN015', 'paid', '2024-08-20', 200.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2021123471', 'CBI-UPLB'),
('TXN016', 'paid', '2024-08-25', 200.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123472', 'CBI-UPLB'),
('TXN017', 'unpaid', NULL, 500.00, 'Retreat', '1st Semester', '2024-2025', FALSE, '2019123473', 'CBI-UPLB'),
('TXN018', 'paid', '2024-09-02', 200.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2022123474', 'CBI-UPLB'),

-- DSG fees
('TXN019', 'paid', '2024-08-16', 350.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123475', 'UPLB-DSG'),
('TXN020', 'paid', '2024-08-19', 350.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123476', 'UPLB-DSG'),
('TXN021', 'unpaid', NULL, 1200.00, 'Workshop', '1st Semester', '2024-2025', FALSE, '2021123477', 'UPLB-DSG'),
('TXN022', 'paid', '2024-08-30', 350.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123478', 'UPLB-DSG'),
('TXN023', 'paid', '2024-09-03', 350.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2019123479', 'UPLB-DSG'),

-- Film Circle fees
('TXN024', 'paid', '2024-08-21', 450.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2021123480', 'UPFC-UPLB'),
('TXN025', 'paid', '2024-08-24', 450.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123481', 'UPFC-UPLB'),
('TXN026', 'unpaid', NULL, 1500.00, 'Equipment', '1st Semester', '2024-2025', FALSE, '2019123482', 'UPFC-UPLB'),
('TXN027', 'paid', '2024-09-01', 450.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2022123483', 'UPFC-UPLB'),

-- Gabriela Youth fees
('TXN028', 'paid', '2024-08-17', 250.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123484', 'GY-UPLB'),
('TXN029', 'paid', '2024-08-23', 250.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123485', 'GY-UPLB'),
('TXN030', 'unpaid', NULL, 600.00, 'Campaign', '1st Semester', '2024-2025', FALSE, '2021123486', 'GY-UPLB'),
('TXN031', 'paid', '2024-08-29', 250.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123487', 'GY-UPLB'),

-- Mountaineers fees
('TXN032', 'paid', '2024-08-14', 600.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123488', 'UPLB-MOUNTAINEERS'),
('TXN033', 'paid', '2024-08-18', 600.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2021123489', 'UPLB-MOUNTAINEERS'),
('TXN034', 'unpaid', NULL, 2000.00, 'Equipment', '1st Semester', '2024-2025', FALSE, '2020123490', 'UPLB-MOUNTAINEERS'),
('TXN035', 'paid', '2024-08-26', 600.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123491', 'UPLB-MOUNTAINEERS'),
('TXN036', 'paid', '2024-09-04', 600.00, 'Membership', '1st Semester', '2024-2025', TRUE, '2022123492', 'UPLB-MOUNTAINEERS'),

-- MUN fees
('TXN037', 'paid', '2024-08-13', 400.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123493', 'UP-MUN'),
('TXN038', 'paid', '2024-08-17', 400.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123494', 'UP-MUN'),
('TXN039', 'unpaid', NULL, 1800.00, 'Conference', '1st Semester', '2024-2025', FALSE, '2021123495', 'UP-MUN'),
('TXN040', 'paid', '2024-08-31', 400.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2020123496', 'UP-MUN'),

-- YES UP fees
('TXN041', 'paid', '2024-08-19', 550.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123497', 'YES-UP'),
('TXN042', 'paid', '2024-08-22', 550.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2021123498', 'YES-UP'),
('TXN043', 'unpaid', NULL, 1000.00, 'Seminar', '1st Semester', '2024-2025', FALSE, '2020123499', 'YES-UP'),
('TXN044', 'paid', '2024-08-27', 550.00, 'Membership', '1st Semester', '2024-2025', FALSE, '2019123500', 'YES-UP');

-- Display summary information
SELECT 'Database Setup Complete!' as Status;
SELECT COUNT(*) as Total_Organizations FROM ORGANIZATION;
SELECT COUNT(*) as Total_Members FROM MEMBER;
SELECT COUNT(*) as Total_Memberships FROM SERVES_IN;
SELECT COUNT(*) as Total_Fee_Records FROM FEE;
SELECT 
    Status, 
    COUNT(*) as Count,
    SUM(Amount) as Total_Amount
FROM FEE 
GROUP BY Status;
