const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateBody } = require('../middlewares/validationMiddleware');
const { loginSchema, changePasswordSchema } = require('../validations/authValidation');

// Public route: Login
router.post('/login', validateBody(loginSchema), authController.login);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/change-password', authMiddleware, validateBody(changePasswordSchema), authController.changePassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
