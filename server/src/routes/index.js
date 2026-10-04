const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const studentRoutes = require('./studentRoutes');
const programRoutes = require('./programRoutes');
const testRoutes = require('./testRoutes');

// Health Check Route
router.use('/health', healthRoutes);

// Authentication & Profile Routes
router.use('/auth', authRoutes);

// User Management Routes (Admin only)
router.use('/users', userRoutes);

// Student Management Routes
router.use('/students', studentRoutes);

// Dynamic Program Management Routes
router.use('/programs', programRoutes);

// RBAC Test Routes (for role verification)
router.use('/test', testRoutes);

module.exports = router;

