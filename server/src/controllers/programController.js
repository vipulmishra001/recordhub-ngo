const programService = require('../services/programService');
const { successResponse } = require('../utils/apiResponse');

/**
 * @desc    Get all programs with search, filters, sorting and pagination
 * @route   GET /api/v1/programs
 * @access  Admin, Staff, Volunteer (Student: restricted)
 */
const listPrograms = async (req, res, next) => {
  try {
    const result = await programService.listPrograms(req.query, req.user);
    return successResponse(
      res,
      200,
      'Programs retrieved successfully',
      {
        programs: result.programs,
        pagination: result.pagination
      },
      result.pagination
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new program
 * @route   POST /api/v1/programs
 * @access  Admin only
 */
const createProgram = async (req, res, next) => {
  try {
    const program = await programService.createProgram(req.body, req.user._id);
    return successResponse(res, 201, 'Program created successfully', { program });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get program details by ID
 * @route   GET /api/v1/programs/:id
 * @access  Admin, Staff, Volunteer (if assigned)
 */
const getProgramById = async (req, res, next) => {
  try {
    const program = await programService.getProgramById(req.params.id, req.user);
    return successResponse(res, 200, 'Program retrieved successfully', { program });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update program details
 * @route   PUT /api/v1/programs/:id
 * @access  Admin only
 */
const updateProgram = async (req, res, next) => {
  try {
    const program = await programService.updateProgram(req.params.id, req.body, req.user);
    return successResponse(res, 200, 'Program updated successfully', { program });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update program status
 * @route   PATCH /api/v1/programs/:id/status
 * @access  Admin only
 */
const updateProgramStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const program = await programService.updateProgramStatus(req.params.id, status, req.user);
    return successResponse(res, 200, `Program status updated to '${status}' successfully`, { program });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listPrograms,
  createProgram,
  getProgramById,
  updateProgram,
  updateProgramStatus
};
