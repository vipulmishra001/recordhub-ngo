const { verifyToken } = require('../utils/jwtHelper');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Validates JWT Bearer Token, checks user existence and active status
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Authentication token missing or invalid format. Use Bearer <token>');
    }

    const token = authHeader.split(' ')[1];

    if (!token || token.trim() === '') {
      return errorResponse(res, 401, 'Authentication token is empty');
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return errorResponse(res, 401, 'Authentication token has expired. Please login again.');
      }
      return errorResponse(res, 401, 'Invalid authentication token');
    }

    if (!decoded || !decoded.id) {
      return errorResponse(res, 401, 'Invalid token payload');
    }

    // Verify user exists in MongoDB and is active
    const user = await User.findById(decoded.id);

    if (!user) {
      return errorResponse(res, 401, 'User account no longer exists');
    }

    if (!user.isActive) {
      return errorResponse(res, 401, 'User account is deactivated. Contact an administrator.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 500, 'Authentication error', error.message);
  }
};

module.exports = authMiddleware;
