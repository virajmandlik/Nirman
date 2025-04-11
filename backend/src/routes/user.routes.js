const express = require('express');
const router = express.Router();
const { 
  updateProfile,
  updatePreferences,
  updateProgress,
  getCourses,
  getCourseContent,
  updateCourseProgress,
  getCertificates
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// User profile routes
router.put('/profile', updateProfile);
router.put('/preferences', updatePreferences);
router.put('/progress', updateProgress);

// Course routes
router.get('/courses', getCourses);
router.get('/course/:courseId/content', getCourseContent);
router.put('/course/:courseId/progress', updateCourseProgress);

// Certificate routes
router.get('/certificates', getCertificates);

module.exports = router; 