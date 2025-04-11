const mongoose = require('mongoose');

const gameProgressSchema = new mongoose.Schema({
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
  lastPlayed: {
    type: Date,
    default: Date.now
  },
  highScore: {
    type: Number,
    default: 0
  },
  bestAccuracy: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completedSessions: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  points: {
    type: Number,
    default: 0
  },
  gameHistory: [{
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GameSession'
    },
    score: Number,
    accuracy: Number,
    timeSpent: Number,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const GameProgress = mongoose.model('GameProgress', gameProgressSchema);

module.exports = GameProgress; 