const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'abandoned'],
    default: 'active'
  },
  currentQuestionIndex: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid question index!`
    }
  },
  totalQuestions: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid total questions count!`
    }
  },
  answeredQuestions: [{
    questionId: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeTaken: Number, // in seconds
    pointsEarned: Number
  }],
  score: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid score!`
    }
  },
  accuracyRate: {
    type: Number,
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0 && v <= 100;
      },
      message: props => `${props.value} is not a valid accuracy rate!`
    }
  },
  timeRemaining: {
    type: Number, // in seconds
    default: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: props => `${props.value} is not a valid time remaining!`
    }
  }
});

// Method to check if session is completed based on question index or time
gameSessionSchema.methods.isCompleted = function(totalQuestions) {
  return this.currentQuestionIndex >= totalQuestions || this.timeRemaining <= 0;
};

const GameSession = mongoose.model('GameSession', gameSessionSchema);

module.exports = GameSession; 