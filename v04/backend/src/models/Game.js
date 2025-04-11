const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide game title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide game description']
  },
  category: {
    type: String,
    enum: ['webDevelopment', 'database', 'coreProgramming'],
    required: [true, 'Please specify game category']
  },
  subcategory: {
    type: String,
    required: false
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  imageUrl: {
    type: String,
    default: 'default-game.png'
  },
  timeLimit: {
    type: Number, // In seconds
    default: 300 // 5 minutes
  },
  pointsPerCorrectAnswer: {
    type: Number,
    default: 10
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  playCount: {
    type: Number,
    default: 0
  },
  questions: [{
    questionId: {
      type: String,
      required: true
    },
    question: {
      type: String,
      required: true
    },
    options: [{
      id: String,
      text: String
    }],
    correctOption: {
      type: Number, // Index of the correct option
      required: true
    },
    explanation: String,
    points: {
      type: Number,
      default: 10
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy'
    },
    timeLimit: {
      type: Number, // In seconds
      default: 30
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Virtual for maximum possible score
gameSchema.virtual('maxScore').get(function() {
  return this.questions && this.questions.length > 0
    ? this.questions.reduce((total, question) => total + question.points, 0)
    : 0;
});

// Set virtuals when converting to JSON
gameSchema.set('toJSON', { virtuals: true });
gameSchema.set('toObject', { virtuals: true });

const Game = mongoose.model('Game', gameSchema);

module.exports = Game; 