const express = require('express');
const router = express.Router();
const { register, completeRegistration, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/complete-registration', completeRegistration);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router; 