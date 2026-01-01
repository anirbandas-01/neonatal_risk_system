// backend/src/routes/doctor.js - NEW FILE
const express = require('express');
const doctorController = require('../controllers/doctor.controller');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

console.log('✅ Doctor authentication routes loaded');

// Public routes
router.post('/register', doctorController.register);
router.post('/login', doctorController.login);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, doctorController.getProfile);
router.put('/profile', authMiddleware, doctorController.updateProfile);

module.exports = router;