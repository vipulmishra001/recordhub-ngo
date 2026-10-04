const express = require('express');
const router = express.Router();

const programController = require('../controllers/programController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  validateBody,
  validateParams,
  validateQuery
} = require('../middlewares/validationMiddleware');
const {
  createProgramSchema,
  updateProgramSchema,
  updateProgramStatusSchema,
  programIdParamSchema,
  listProgramsQuerySchema
} = require('../validations/programValidation');

// All program routes require authentication
router.use(authMiddleware);

// 1. List programs (Admin, Staff, Volunteer)
router.get(
  '/',
  roleMiddleware('admin', 'staff', 'volunteer'),
  validateQuery(listProgramsQuerySchema),
  programController.listPrograms
);

// 2. Create program (Admin only)
router.post(
  '/',
  roleMiddleware('admin'),
  validateBody(createProgramSchema),
  programController.createProgram
);

// 3. Get program details by ID (Admin, Staff, Volunteer)
router.get(
  '/:id',
  roleMiddleware('admin', 'staff', 'volunteer'),
  validateParams(programIdParamSchema),
  programController.getProgramById
);

// 4. Update program (Admin only)
router.put(
  '/:id',
  roleMiddleware('admin'),
  validateParams(programIdParamSchema),
  validateBody(updateProgramSchema),
  programController.updateProgram
);

// 5. Update program status (Admin only)
router.patch(
  '/:id/status',
  roleMiddleware('admin'),
  validateParams(programIdParamSchema),
  validateBody(updateProgramStatusSchema),
  programController.updateProgramStatus
);

module.exports = router;
