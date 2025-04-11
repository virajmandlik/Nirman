const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String,
    default: 'default-avatar.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  preferences: {
    language: {
      type: String,
      default: 'english'
    },
    learningPath: {
      type: String,
      enum: ['webDev', 'programming', 'aiml', 'dataScience'],
      required: [true, 'Please select a learning path']
    },
  },
  progress: {
    completedModules: [String],
    webDevCourses: {
      course1: {
        name: { type: String, default: 'HTML, CSS, JavaScript' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      course2: {
        name: { type: String, default: 'React JS' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      course3: {
        name: { type: String, default: 'Node.js' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      course4: {
        name: { type: String, default: 'Express.js' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      course5: {
        name: { type: String, default: 'MongoDB' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      course6: {
        name: { type: String, default: 'MERN Project' },
        keywords: [{ type: String }],
        completed: { type: Boolean, default: false },
        progress: { type: Number, default: 0 }
      },
      overallProgress: { type: Number, default: 0 }
    },
    programmingCourses: {
      overallProgress: { type: Number, default: 0 }
      // Similar structure for programming courses can be added
    },
    aimlCourses: {
      overallProgress: { type: Number, default: 0 }
      // Similar structure for AI/ML courses can be added
    },
    dataScienceCourses: {
      overallProgress: { type: Number, default: 0 }
      // Similar structure for Data Science courses can be added
    },
    gameHistory: [{
      gameId: String,
      category: {
        type: String,
        enum: ['webDevelopment', 'database', 'coreProgramming']
      },
      title: String,
      score: Number,
      maxScore: Number,
      correctAnswers: Number,
      totalQuestions: Number,
      completedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: [{
      name: String,
      description: String,
      category: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    certificates: [{
      learningPath: String,
      issueDate: Date,
      certificateId: String
    }],
    points: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate JWT token
userSchema.methods.getSignedToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET || 'nirman-secret-key',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 