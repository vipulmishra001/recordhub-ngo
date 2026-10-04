const userService = require('../services/userService');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all users with search, filtering and pagination
 * @route   GET /api/v1/users
 * @access  Admin only
 */
const listUsers = async (req, res, next) => {
  try {
    const result = await userService.listUsers(req.query);
    return successResponse(
      res,
      200,
      'Users retrieved successfully',
      {
        users: result.users,
        pagination: result.pagination
      },
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new Staff, Volunteer, or Student user
 * @route   POST /api/v1/users
 * @access  Admin only
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);
    return successResponse(res, 201, 'User created successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user details by ID
 * @route   GET /api/v1/users/:id
 * @access  Admin only
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, 200, 'User details retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user details (firstName, lastName, email, phone, role)
 * @route   PUT /api/v1/users/:id
 * @access  Admin only
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return successResponse(res, 200, 'User updated successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Activate or Deactivate user (soft status change)
 * @route   PATCH /api/v1/users/:id/status
 * @access  Admin only
 */
const updateStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await userService.updateUserStatus(req.params.id, isActive, req.user._id);
    const action = user.isActive ? 'activated' : 'deactivated';
    return successResponse(res, 200, `User account ${action} successfully`, { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listUsers,
  createUser,
  getUserById,
  updateUser,
  updateStatus
};
