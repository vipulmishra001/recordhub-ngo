const User = require('../models/User');
const { comparePassword, hashPassword } = require('../utils/passwordHelper');
const { signToken } = require('../utils/jwtHelper');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const logger = require('../utils/logger');

/**
 * @desc    Authenticate user & return JWT token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Search user with password field explicitly included
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Check account status
    if (!user.isActive) {
      return errorResponse(res, 401, 'Account has been deactivated. Please contact an administrator.');
    }

    // Verify password with bcrypt
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = signToken({
      id: user._id,
      role: user.role,
      email: user.email
    });

    const safeUser = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone || '',
      avatar: user.avatar || ''
    };

    logger.info(`User logged in successfully: ${user.email} [${user.role}]`);

    return successResponse(res, 200, 'Login successful', {
      user: safeUser,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/v1/auth/me
 * @access  Protected
 */
const getMe = async (req, res, next) => {
  try {
    const safeUser = {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
      phone: req.user.phone || '',
      avatar: req.user.avatar || '',
      isActive: req.user.isActive,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt
    };

    return successResponse(res, 200, 'User profile retrieved successfully', {
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change current user's password
 * @route   POST /api/v1/auth/change-password
 * @access  Protected
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (currentPassword === newPassword) {
      return errorResponse(res, 400, 'New password cannot be identical to the current password');
    }

    // Re-fetch user with password included
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    // Verify current password
    const isCurrentMatch = await comparePassword(currentPassword, user.password);
    if (!isCurrentMatch) {
      return errorResponse(res, 400, 'Current password verification failed. Please enter your correct current password.');
    }

    // Hash new password and save
    user.password = await hashPassword(newPassword);
    await user.save();

    logger.info(`Password successfully changed for user: ${user.email}`);

    return successResponse(res, 200, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stateless logout endpoint
 * @route   POST /api/v1/auth/logout
 * @access  Protected / Public
 */
const logout = async (req, res) => {
  // In stateless JWT architecture, client discards the token.
  return successResponse(res, 200, 'Logged out successfully');
};

module.exports = {
  login,
  getMe,
  changePassword,
  logout
};
