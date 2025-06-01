-- Sample Jobs Data for JobHunt Database
-- This script inserts sample data that matches frontend expectations

-- First, let's add some companies (assuming companies table exists)
INSERT INTO companies (name, logo_url, website_url, industry_type, team_size, establishment_year, phone_number, email, address, city, country, about, created_at, updated_at) VALUES
('Segment', '/images/resource/company-logo/1-1.png', 'https://segment.com', 'Technology', '100-500', 2011, '+1-555-0101', 'careers@segment.com', '1 Market Street', 'London', 'UK', 'Customer data platform for developers', NOW(), NOW()),
('Catalyst', '/images/resource/company-logo/1-2.png', 'https://www.catalyst.org', 'Non-profit', '50-100', 1962, '+1-555-0102', 'info@catalyst.org', '2 Innovation Way', 'London', 'UK', 'Workplace inclusion for women', NOW(), NOW()),
('Invision', '/images/resource/company-logo/1-3.png', 'https://www.invisionapp.com', 'Design Technology', '500-1000', 2011, '+1-555-0103', 'jobs@invisionapp.com', '3 Design Plaza', 'London', 'UK', 'Digital product design platform', NOW(), NOW()),
('Upwork', '/images/resource/company-logo/1-4.png', 'https://www.upwork.com', 'Freelance Platform', '1000+', 2015, '+1-555-0104', 'talent@upwork.com', '4 Freelance Street', 'London', 'UK', 'Global freelancing platform', NOW(), NOW()),
('Medium', '/images/resource/company-logo/1-5.png', 'https://medium.com', 'Publishing Platform', '200-500', 2012, '+1-555-0105', 'careers@medium.com', '5 Publishing Ave', 'London', 'UK', 'Online publishing platform', NOW(), NOW()),
('Figma', '/images/resource/company-logo/1-6.png', 'https://www.figma.com', 'Design Software', '500-1000', 2012, '+1-555-0106', 'jobs@figma.com', '6 Creative Lane', 'London', 'UK', 'Collaborative design tool', NOW(), NOW());

-- Now insert jobs that match frontend data structure and database schema
INSERT INTO jobs (title, description, requirements, employment_type, experience_level, location, salary_min, salary_max, is_remote, application_deadline, company_id, active, created_at, updated_at) VALUES

-- Job 1: Software Engineer (Android), Libraries - Segment
('Software Engineer (Android), Libraries', 
'We are looking for a skilled Android developer to join our Libraries team. You will be responsible for building and maintaining our core Android SDK that powers thousands of applications worldwide. This role involves working with cutting-edge mobile technologies and contributing to open-source projects.', 
'• 3+ years of Android development experience
• Strong knowledge of Kotlin and Java
• Experience with Android SDK, NDK, and Gradle
• Familiarity with REST APIs and mobile architecture patterns
• Experience with version control systems (Git)
• Understanding of mobile security best practices', 
'FULL_TIME', 'ENTRY_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-02-15 23:59:59', 1, true, NOW(), NOW()),

-- Job 2: Recruiting Coordinator - Catalyst
('Recruiting Coordinator', 
'Join our HR team as a Recruiting Coordinator where you will support our talent acquisition efforts. You will work closely with hiring managers to coordinate interviews, manage candidate communications, and help build diverse, inclusive teams.', 
'• 1-2 years of recruiting or HR experience
• Excellent communication and organizational skills
• Experience with ATS systems (Workday, Greenhouse, etc.)
• Strong attention to detail and ability to multitask
• Bachelor degree in HR, Business, or related field preferred
• Passion for diversity and inclusion initiatives', 
'PART_TIME', 'ENTRY_LEVEL', 'London, UK', 35000, 45000, true, 
'2024-02-20 23:59:59', 2, true, NOW(), NOW()),

-- Job 3: Product Manager, Studio - Invision
('Product Manager, Studio', 
'Lead product strategy and execution for our Studio product line. You will work cross-functionally with engineering, design, and marketing teams to deliver innovative features that help design teams collaborate more effectively.', 
'• 3-5 years of product management experience
• Experience with design tools and workflows
• Strong analytical and problem-solving skills
• Excellent communication and leadership abilities
• Experience with agile development methodologies
• Background in B2B SaaS products preferred', 
'FULL_TIME', 'MID_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-02-25 23:59:59', 3, true, NOW(), NOW()),

-- Job 4: Senior Product Designer - Upwork
('Senior Product Designer', 
'Drive design strategy for our marketplace platform. You will be responsible for creating user-centered designs that improve the freelancer and client experience on our platform, working closely with product and engineering teams.', 
'• 5+ years of product design experience
• Strong portfolio demonstrating UX/UI design skills
• Experience with design systems and component libraries
• Proficiency in Figma, Sketch, or similar design tools
• Understanding of frontend development (HTML/CSS/JS)
• Experience with user research and testing methodologies', 
'CONTRACT', 'SENIOR_LEVEL', 'London, UK', 35000, 45000, true, 
'2024-03-01 23:59:59', 4, true, NOW(), NOW()),

-- Job 5: Senior Full Stack Engineer, Creator Success - Medium
('Senior Full Stack Engineer, Creator Success', 
'Join our Creator Success team to build tools and features that help writers and creators succeed on our platform. You will work on both frontend and backend systems, focusing on creator monetization and engagement features.', 
'• 5+ years of full-stack development experience
• Strong skills in JavaScript, Node.js, React, and Python
• Experience with database design (PostgreSQL, MongoDB)
• Knowledge of cloud platforms (AWS, GCP)
• Experience with microservices architecture
• Understanding of payment systems and creator economy', 
'FULL_TIME', 'SENIOR_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-03-05 23:59:59', 5, true, NOW(), NOW()),

-- Job 6: Software Engineer (Android), Libraries - Figma
('Software Engineer (Android), Libraries', 
'Help us build the future of collaborative design on mobile platforms. You will work on our Android application and contribute to our mobile libraries that enable real-time collaboration and design editing on mobile devices.', 
'• 2-4 years of Android development experience
• Experience with real-time collaboration systems
• Knowledge of graphics programming and canvas manipulation
• Familiarity with design tools and workflows
• Strong problem-solving and debugging skills
• Experience with performance optimization', 
'INTERNSHIP', 'ENTRY_LEVEL', 'London, UK', 35000, 45000, true, 
'2024-03-10 23:59:59', 6, true, NOW(), NOW()),

-- Job 7: Product Manager, Risk - Medium
('Product Manager, Risk', 
'Lead our risk management and content moderation product initiatives. You will work on building systems that ensure platform safety while maintaining our commitment to free expression and open dialogue.', 
'• 4+ years of product management experience
• Experience with content moderation and safety systems
• Understanding of machine learning and AI applications
• Strong analytical skills and data-driven decision making
• Experience with compliance and regulatory requirements
• Background in risk management or security preferred', 
'FULL_TIME', 'MID_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-03-15 23:59:59', 5, true, NOW(), NOW()),

-- Job 8: Technical Architect - Medium
('Technical Architect', 
'Drive technical strategy and architecture decisions for our publishing platform. You will work with engineering leadership to design scalable systems that support millions of readers and writers worldwide.', 
'• 8+ years of software engineering experience
• 3+ years in technical leadership or architecture roles
• Deep knowledge of distributed systems and microservices
• Experience with high-scale web applications
• Strong understanding of database design and optimization
• Experience with cloud infrastructure and DevOps practices', 
'FULL_TIME', 'SENIOR_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-03-20 23:59:59', 5, true, NOW(), NOW()),

-- Job 9: Web Developer - Figma
('Web Developer', 
'Join our web team to build and maintain our marketing website and web application features. You will work on both user-facing features and internal tools that support our growing user base.', 
'• 2-3 years of web development experience
• Strong skills in HTML, CSS, JavaScript, and modern frameworks
• Experience with React, Vue.js, or similar frameworks
• Knowledge of responsive design and cross-browser compatibility
• Understanding of web performance optimization
• Familiarity with content management systems', 
'PART_TIME', 'ENTRY_LEVEL', 'London, UK', 35000, 45000, true, 
'2024-03-25 23:59:59', 6, true, NOW(), NOW()),

-- Job 10: Senior BI Analyst - Figma
('Senior BI Analyst', 
'Lead business intelligence initiatives to drive data-informed decisions across the organization. You will build dashboards, conduct analysis, and partner with stakeholders to identify growth opportunities and optimize business performance.', 
'• 5+ years of business intelligence or data analysis experience
• Strong skills in SQL, Python/R, and data visualization tools
• Experience with BI platforms (Tableau, Looker, PowerBI)
• Knowledge of statistical analysis and A/B testing
• Understanding of business metrics and KPIs
• Excellent communication and stakeholder management skills', 
'TEMPORARY', 'SENIOR_LEVEL', 'London, UK', 35000, 45000, false, 
'2024-03-30 23:59:59', 6, true, NOW(), NOW()); 