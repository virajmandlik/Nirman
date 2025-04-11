const User = require('../models/User');

// @desc    Register user (first step)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log('Registration attempt:', { name, email, password: '***' });
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    // Create temporary user without persisting to database
    const userData = {
      name,
      email,
      password
    };
    
    // Store user data in session or return as part of a token
    // For simplicity, we'll return it directly to be sent back in the next step
    res.status(200).json({
      success: true,
      message: 'First step completed, please select a learning path',
      userData: {
        name,
        email
      }
    });
  } catch (error) {
    console.error('Registration first step error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration',
      error: error.message
    });
  }
};

// @desc    Complete user registration with learning path
// @route   POST /api/auth/complete-registration
// @access  Public
exports.completeRegistration = async (req, res) => {
  try {
    const { name, email, password, learningPath } = req.body;
    
    // Validate learning path
    if (!learningPath || !['webDev', 'programming', 'aiml', 'dataScience'].includes(learningPath)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid learning path'
      });
    }
    
    // Check if user already exists again (just to be safe)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    
    // Create new user with learning path
    const userData = {
      name,
      email,
      password,
      preferences: {
        language: 'english',
        learningPath
      }
    };
    
    // Set default keywords for webDev courses
    if (learningPath === 'webDev') {
      userData.progress = {
        webDevCourses: {
          course1: {
            keywords: ['HTML', 'CSS', 'Javascript']
          },
          course2: {
            keywords: ['React JS']
          },
          course3: {
            keywords: ['Nodejs']
          },
          course4: {
            keywords: ['Express js']
          },
          course5: {
            keywords: ['Mongo DB']
          },
          course6: {
            keywords: ['MERN']
          }
        }
      };
    }
    
    const user = await User.create(userData);
    
    // Generate token
    const token = user.getSignedToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Registration completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing registration',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = user.getSignedToken();
    
    res.status(200).json({
      success: true,
      token,
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
      message: 'Error logging in',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
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
      message: 'Error fetching user data',
      error: error.message
    });
  }
}; 