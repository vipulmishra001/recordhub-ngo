const mongoose = require('mongoose');
const config = require('../config/env');
const User = require('../models/User');
const { hashPassword, validatePasswordStrength } = require('../utils/passwordHelper');
const logger = require('../utils/logger');

const seedAdmin = async () => {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(config.MONGODB_URI);
    logger.info('Connected to MongoDB.');

    // 1. Seed Admin
    const adminEmail = config.ADMIN_EMAIL.toLowerCase().trim();
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      logger.info(`Admin user already exists with email: ${adminEmail}`);
    } else {
      const passwordValidation = validatePasswordStrength(config.ADMIN_PASSWORD);
      if (!passwordValidation.isValid) {
        throw new Error(`Admin password does not meet security requirements: ${passwordValidation.message}`);
      }

      const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        firstName: 'System',
        lastName: 'Administrator',
        phone: '+1-555-0100',
        isActive: true
      });

      logger.info(`First Admin created successfully with email: ${adminEmail}`);
      // Security rule: Never print admin password in logs
    }

    // 2. Seed development accounts for other roles (for testing Phase 2 RBAC)
    const testUsers = [
      {
        email: 'staff@ngo.org',
        password: 'StaffPassword123!',
        role: 'staff',
        firstName: 'Sarah',
        lastName: 'Jenkins (Staff)',
        phone: '+1-555-0101',
        isActive: true
      },
      {
        email: 'volunteer@ngo.org',
        password: 'VolunteerPass123!',
        role: 'volunteer',
        firstName: 'David',
        lastName: 'Miller (Volunteer)',
        phone: '+1-555-0102',
        isActive: true
      },
      {
        email: 'student@ngo.org',
        password: 'StudentPass123!',
        role: 'student',
        firstName: 'Alex',
        lastName: 'Taylor (Student)',
        phone: '+1-555-0103',
        isActive: true
      },
      {
        email: 'inactive@ngo.org',
        password: 'InactivePass123!',
        role: 'student',
        firstName: 'Inactive',
        lastName: 'Beneficiary',
        phone: '+1-555-0104',
        isActive: false // Deactivated account for testing
      }
    ];

    for (const testUser of testUsers) {
      const exists = await User.findOne({ email: testUser.email });
      if (!exists) {
        const hashed = await hashPassword(testUser.password);
        await User.create({
          ...testUser,
          password: hashed
        });
        logger.info(`Test user created: ${testUser.email} [${testUser.role}] (Active: ${testUser.isActive})`);
      }
    }

    logger.info('Database seeding completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Error during database seeding:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
