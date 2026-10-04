const User = require('../models/User');
const { hashPassword, validatePasswordStrength } = require('../utils/passwordHelper');
const logger = require('../utils/logger');

/**
 * List users with pagination, search, role and status filtering
 */
const listUsers = async ({
  page = 1,
  limit = 10,
  search = '',
  role = 'all',
  status = 'all',
  sortBy = 'createdAt',
  sortOrder = 'desc'
}) => {
  const query = {};

  // 1. Search across firstName, lastName, email, phone
  if (search && search.trim() !== '') {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escaped, 'i');
    query.$or = [
      { firstName: searchRegex },
      { lastName: searchRegex },
      { email: searchRegex },
      { phone: searchRegex }
    ];
  }

  // 2. Role filter
  if (role && role !== 'all') {
    query.role = role;
  }

  // 3. Status filter
  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  // Count total matching documents
  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limitNum) || 1;
  const skip = (pageNum - 1) * limitNum;

  // Execute query with sorting and pagination
  const sortDirection = sortOrder === 'asc' ? 1 : -1;
  const users = await User.find(query)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(limitNum);

  return {
    users,
    pagination: {
      totalUsers,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  };
};

/**
 * Create a new user (Staff, Volunteer, Student only)
 */
const createUser = async ({ firstName, lastName, email, phone, role, password, avatar }) => {
  // Reject Admin role creation
  if (role === 'admin') {
    const error = new Error('Admin accounts cannot be created through User Management.');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email.toLowerCase().trim();

  // Check duplicate email
  const existingUser = await User.findOne({ email: cleanEmail });
  if (existingUser) {
    const error = new Error('Email address is already registered.');
    error.statusCode = 409;
    throw error;
  }

  // Validate password complexity
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    const error = new Error(passwordValidation.message);
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    role,
    password: hashedPassword,
    avatar: avatar || '',
    isActive: true
  });

  logger.info(`User created successfully by admin: ${newUser.email} [${newUser.role}]`);

  return newUser;
};

/**
 * Retrieve user by ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

/**
 * Update user details (no password update via this endpoint)
 */
const updateUser = async (id, { firstName, lastName, email, phone, role, avatar }) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Prevent setting role to admin
  if (role === 'admin') {
    const error = new Error('Role cannot be changed to admin.');
    error.statusCode = 400;
    throw error;
  }

  // Prevent demoting existing admin via this endpoint
  if (user.role === 'admin' && role && role !== 'admin') {
    const error = new Error('Admin role cannot be modified through User Management.');
    error.statusCode = 400;
    throw error;
  }

  const cleanEmail = email ? email.toLowerCase().trim() : user.email;

  // Check duplicate email if changed
  if (cleanEmail !== user.email) {
    const emailConflict = await User.findOne({
      email: cleanEmail,
      _id: { $ne: id }
    });
    if (emailConflict) {
      const error = new Error('Email address is already registered.');
      error.statusCode = 409;
      throw error;
    }
    user.email = cleanEmail;
  }

  user.firstName = firstName.trim();
  user.lastName = lastName.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (role && user.role !== 'admin') user.role = role;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  logger.info(`User updated successfully: ${user.email} [${user.role}]`);
  return user;
};

/**
 * Update user active status (soft deactivation)
 */
const updateUserStatus = async (id, isActive, currentAdminId) => {
  // Prevent admin from deactivating their own account
  if (id.toString() === currentAdminId.toString()) {
    const error = new Error('You cannot deactivate your own admin account.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.isActive = Boolean(isActive);
  await user.save();

  logger.info(`User status updated: ${user.email} -> isActive: ${user.isActive}`);
  return user;
};

module.exports = {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  updateUserStatus
};
