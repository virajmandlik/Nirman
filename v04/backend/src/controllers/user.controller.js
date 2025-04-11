const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Build fields to update
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        progress: user.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
exports.updatePreferences = async (req, res) => {
  try {
    const { language, learningPath } = req.body;
    
    // Build preferences to update
    const preferencesToUpdate = { preferences: {} };
    if (language) preferencesToUpdate.preferences.language = language;
    if (learningPath) preferencesToUpdate.preferences.learningPath = learningPath;
    
    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: preferencesToUpdate },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        progress: user.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message
    });
  }
};

// @desc    Update user progress
// @route   PUT /api/users/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { completedModule, pointsEarned } = req.body;
    
    // Get current user
    const user = await User.findById(req.user.id);
    
    // Update completed modules if provided
    if (completedModule && !user.progress.completedModules.includes(completedModule)) {
      user.progress.completedModules.push(completedModule);
    }
    
    // Update points if provided
    if (pointsEarned) {
      user.progress.points += pointsEarned;
      
      // Update level based on points
      // Simple algorithm: level = floor(points/100) + 1
      user.progress.level = Math.floor(user.progress.points / 100) + 1;
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        preferences: user.preferences,
        progress: user.progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating progress',
      error: error.message
    });
  }
};

// @desc    Get user courses
// @route   GET /api/users/courses
// @access  Private
exports.getCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const learningPath = user.preferences.learningPath;
    
    let courses = [];
    
    // Return courses based on learning path
    switch (learningPath) {
      case 'webDev':
        // Get course data from user's progress if it exists
        if (user.progress && user.progress.webDevCourses) {
          courses = [
            {
              id: 'webdev-course1',
              name: user.progress.webDevCourses.course1?.name || 'HTML, CSS, JavaScript',
              keywords: user.progress.webDevCourses.course1?.keywords || ['HTML', 'CSS', 'Javascript'],
              completed: user.progress.webDevCourses.course1?.completed || false,
              progress: user.progress.webDevCourses.course1?.progress || 0
            },
            {
              id: 'webdev-course2',
              name: user.progress.webDevCourses.course2?.name || 'React JS',
              keywords: user.progress.webDevCourses.course2?.keywords || ['React JS'],
              completed: user.progress.webDevCourses.course2?.completed || false,
              progress: user.progress.webDevCourses.course2?.progress || 0
            },
            {
              id: 'webdev-course3',
              name: user.progress.webDevCourses.course3?.name || 'Node.js',
              keywords: user.progress.webDevCourses.course3?.keywords || ['Nodejs'],
              completed: user.progress.webDevCourses.course3?.completed || false,
              progress: user.progress.webDevCourses.course3?.progress || 0
            },
            {
              id: 'webdev-course4',
              name: user.progress.webDevCourses.course4?.name || 'Express.js',
              keywords: user.progress.webDevCourses.course4?.keywords || ['Express js'],
              completed: user.progress.webDevCourses.course4?.completed || false,
              progress: user.progress.webDevCourses.course4?.progress || 0
            },
            {
              id: 'webdev-course5',
              name: user.progress.webDevCourses.course5?.name || 'MongoDB',
              keywords: user.progress.webDevCourses.course5?.keywords || ['Mongo DB'],
              completed: user.progress.webDevCourses.course5?.completed || false,
              progress: user.progress.webDevCourses.course5?.progress || 0
            },
            {
              id: 'webdev-course6',
              name: user.progress.webDevCourses.course6?.name || 'MERN Project',
              keywords: user.progress.webDevCourses.course6?.keywords || ['MERN'],
              completed: user.progress.webDevCourses.course6?.completed || false,
              progress: user.progress.webDevCourses.course6?.progress || 0
            }
          ];
        } else {
          // Default courses if progress data doesn't exist
          courses = [
            { id: 'webdev-course1', name: 'HTML, CSS, JavaScript', keywords: ['HTML', 'CSS', 'Javascript'], completed: false, progress: 0 },
            { id: 'webdev-course2', name: 'React JS', keywords: ['React JS'], completed: false, progress: 0 },
            { id: 'webdev-course3', name: 'Node.js', keywords: ['Nodejs'], completed: false, progress: 0 },
            { id: 'webdev-course4', name: 'Express.js', keywords: ['Express js'], completed: false, progress: 0 },
            { id: 'webdev-course5', name: 'MongoDB', keywords: ['Mongo DB'], completed: false, progress: 0 },
            { id: 'webdev-course6', name: 'MERN Project', keywords: ['MERN'], completed: false, progress: 0 }
          ];
        }
        break;
      case 'programming':
        // Add programming courses
        courses = [
          { id: 'prog-course1', name: 'Programming Fundamentals', keywords: ['Programming basics', 'Algorithms'], completed: false, progress: 0 }
          // Add more programming courses
        ];
        break;
      case 'aiml':
        // Add AI/ML courses
        courses = [
          { id: 'aiml-course1', name: 'Machine Learning Basics', keywords: ['Machine Learning', 'Python'], completed: false, progress: 0 }
          // Add more AI/ML courses
        ];
        break;
      case 'dataScience':
        // Add Data Science courses
        courses = [
          { id: 'ds-course1', name: 'Data Analysis', keywords: ['Data Science', 'Python', 'Statistics'], completed: false, progress: 0 }
          // Add more Data Science courses
        ];
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid learning path'
        });
    }
    
    const overallProgress = user.progress && user.progress[`${learningPath}Courses`] ? 
      user.progress[`${learningPath}Courses`].overallProgress || 0 : 0;
    
    res.status(200).json({
      success: true,
      learningPath,
      courses,
      overallProgress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
};

// @desc    Get course content
// @route   GET /api/users/course/:courseId/content
// @access  Private
exports.getCourseContent = async (req, res) => {
  try {
    console.log(`[getCourseContent] Request received for courseId: ${req.params.courseId}`);
    const { courseId } = req.params;
    const user = await User.findById(req.user.id);
    
    // Extract the learning path and course number from the course ID
    const [pathPrefix, courseNum] = courseId.split('-');
    let keywords = [];
    
    // Map path prefix to actual learning path
    const pathMap = {
      'webdev': 'webDev',
      'prog': 'programming',
      'aiml': 'aiml',
      'ds': 'dataScience'
    };
    
    const learningPath = pathMap[pathPrefix];
    
    if (!learningPath) {
      console.error(`[getCourseContent] Invalid course ID: ${courseId}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    
    console.log(`[getCourseContent] Processing request for learning path: ${learningPath}, course number: ${courseNum}`);
    
    // Get keywords based on learning path and course
    if (learningPath === 'webDev') {
      const courseIndex = courseNum.replace('course', '');
      if (user.progress.webDevCourses && 
          user.progress.webDevCourses[`course${courseIndex}`] && 
          user.progress.webDevCourses[`course${courseIndex}`].keywords) {
        keywords = user.progress.webDevCourses[`course${courseIndex}`].keywords;
        console.log(`[getCourseContent] Using keywords from user progress: ${keywords.join(', ')}`);
      } else {
        // Default keywords if not set in user progress
        switch(courseIndex) {
          case '1': 
            keywords = ['HTML', 'CSS', 'Javascript'];
            break;
          case '2':
            keywords = ['React JS'];
            break;
          case '3':
            keywords = ['Nodejs'];
            break;
          case '4':
            keywords = ['Express js'];
            break;
          case '5':
            keywords = ['Mongo DB'];
            break;
          case '6':
            keywords = ['MERN'];
            break;
          default:
            keywords = ['web development'];
        }
        console.log(`[getCourseContent] Using default keywords: ${keywords.join(', ')}`);
      }
    } else {
      // Handle other learning paths similarly
      // This is a simplification - would need to be expanded for other paths
      keywords = ['programming', 'learning'];
      console.log(`[getCourseContent] Using default keywords for non-webDev path: ${keywords.join(', ')}`);
    }
    
    // Combine keywords for better search results
    const keywordString = keywords.join(',');
    console.log(`[getCourseContent] Combined keywords for API calls: ${keywordString}`);
    
    // Fetch videos and books content
    try {
      // Now actually call the Flask API for recommendations
      const FLASK_API_URL = process.env.FLASK_API_URL || 'http://localhost:5001';
      
      console.log(`[getCourseContent] Calling Flask API at ${FLASK_API_URL} for videos with keywords: ${keywordString}`);
      const videoResponse = await axios.get(`${FLASK_API_URL}/videos`, {
        params: { query: keywordString }
      });
      
      console.log(`[getCourseContent] Calling Flask API at ${FLASK_API_URL} for books with keywords: ${keywordString}`);
      const bookResponse = await axios.get(`${FLASK_API_URL}/books`, {
        params: { query: keywordString }
      });
      
      console.log(`[getCourseContent] Received responses from Flask API. Videos: ${videoResponse.data.items ? videoResponse.data.items.length : 0} items, Books: ${bookResponse.data ? bookResponse.data.length : 0} items`);
      
      res.status(200).json({
        success: true,
        courseId,
        content: {
          videos: videoResponse.data,
          books: bookResponse.data
        }
      });
    } catch (error) {
      console.error(`[getCourseContent] Error fetching from Flask API: ${error.message}`);
      console.error(error.stack);
      return res.status(500).json({
        success: false,
        message: 'Error fetching course content from external APIs',
        error: error.message
      });
    }
  } catch (error) {
    console.error(`[getCourseContent] General error: ${error.message}`);
    console.error(error.stack);
    res.status(500).json({
      success: false,
      message: 'Error fetching course content',
      error: error.message
    });
  }
};

// @desc    Update course progress
// @route   PUT /api/users/course/:courseId/progress
// @access  Private
exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { completed, progress } = req.body;
    
    console.log('Received update request:', { courseId, completed, progress });
    
    // Extract the learning path and course number from the course ID
    const [pathPrefix, courseNum] = courseId.split('-');
    
    // Map path prefix to actual learning path
    const pathMap = {
      'webdev': 'webDevCourses',
      'prog': 'programmingCourses',
      'aiml': 'aimlCourses',
      'ds': 'dataScienceCourses'
    };
    
    const learningPathField = pathMap[pathPrefix];
    
    if (!learningPathField) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }
    
    const user = await User.findById(req.user.id);
    console.log('Current user progress:', user.progress[learningPathField]);
    
    // Update course progress
    const courseIndex = courseNum.replace('course', '');
    const courseField = `${learningPathField}.course${courseIndex}`;
    
    // Create update object with proper MongoDB syntax
    const updateFields = {};
    
    if (completed !== undefined) {
      updateFields[`progress.${learningPathField}.course${courseIndex}.completed`] = completed;
      
      // If course is completed, award points
      if (completed && !user.progress[learningPathField][`course${courseIndex}`].completed) {
        user.progress.points += 100; // Award 100 points for completing a course
        user.progress.level = Math.floor(user.progress.points / 100) + 1;
        updateFields['progress.points'] = user.progress.points;
        updateFields['progress.level'] = user.progress.level;
      }
    }
    
    if (progress !== undefined) {
      updateFields[`progress.${learningPathField}.course${courseIndex}.progress`] = progress;
    }
    
    console.log('Updating user with fields:', updateFields);
    
    // Update user with all fields at once
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    
    console.log('Updated user progress:', updatedUser.progress[learningPathField]);
    
    // Calculate overall progress for the learning path
    const learningPath = pathPrefix === 'webdev' ? 'webDevCourses' : learningPathField;
    let totalCourses = 0;
    let totalProgress = 0;
    
    // For webDev, count all 6 courses
    if (learningPath === 'webDevCourses') {
      totalCourses = 6;
      for (let i = 1; i <= 6; i++) {
        const course = updatedUser.progress.webDevCourses[`course${i}`];
        totalProgress += course.progress || 0;
      }
    }
    
    // Calculate overall progress as average of individual course progress
    const overallProgress = totalCourses > 0 ? Math.round(totalProgress / totalCourses) : 0;
    
    console.log('Calculated overall progress:', overallProgress);
    
    // Update overall progress
    const finalUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          [`progress.${learningPath}.overallProgress`]: overallProgress
        }
      },
      { new: true }
    );
    
    console.log('Final user progress:', finalUser.progress[learningPathField]);
    
    // Check if all courses are completed to issue certificate
    let certificate = null;
    if (overallProgress === 100) {
      // Generate certificate only if one doesn't exist
      const existingCertificate = finalUser.progress.certificates.find(
        cert => cert.learningPath === learningPath
      );
      
      if (!existingCertificate) {
        const newCertificate = {
          learningPath: learningPath,
          issueDate: new Date(),
          certificateId: `CERT-${finalUser._id}-${Date.now()}`
        };
        
        await User.findByIdAndUpdate(
          req.user.id,
          { $push: { 'progress.certificates': newCertificate } }
        );
        
        certificate = newCertificate;
      } else {
        certificate = existingCertificate;
      }
    }
    
    // Get the final updated user to ensure we have the latest state
    const finalUpdatedUser = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Course progress updated',
      courseId,
      progress: finalUpdatedUser.progress[learningPathField][`course${courseIndex}`].progress,
      completed: finalUpdatedUser.progress[learningPathField][`course${courseIndex}`].completed,
      overallProgress: finalUpdatedUser.progress[learningPathField].overallProgress,
      certificate,
      user: {
        points: finalUpdatedUser.progress.points,
        level: finalUpdatedUser.progress.level
      }
    });
  } catch (error) {
    console.error('Error updating course progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course progress',
      error: error.message
    });
  }
};

// @desc    Get user certificates
// @route   GET /api/users/certificates
// @access  Private
exports.getCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      certificates: user.progress.certificates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching certificates',
      error: error.message
    });
  }
}; 