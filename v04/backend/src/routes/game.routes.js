const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllGames,
  getGamesByCategory,
  getGame,
  startGameSession,
  submitAnswer,
  endGameSession,
  getUserGameProgress,
  getUserAchievements,
  getUserGameHistory,
  getLeaderboard
} = require('../controllers/game.controller');

// Public routes
router.get('/', getAllGames);
router.get('/category/:category', getGamesByCategory);

// User game progress routes - these need to come before /:id routes
router.get('/user/progress', protect, getUserGameProgress);
router.get('/user/achievements', protect, getUserAchievements);
router.get('/user/history', protect, getUserGameHistory);

// Game specific routes with dynamic ids
router.get('/:id', getGame);
router.get('/:id/leaderboard', getLeaderboard);
router.post('/:id/start', protect, startGameSession);

// Session routes
router.post('/sessions/:sessionId/submit', protect, submitAnswer);
router.post('/sessions/:sessionId/end', protect, endGameSession);

module.exports = router; 