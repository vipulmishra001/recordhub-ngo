const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

/**
 * @route   GET /api/v1/health
 * @desc    System health check endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'NGO Digital Record System API is running',
    environment: process.env.NODE_ENV || 'development',
    database: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
