import axios from 'axios';

// API base URL from environment or default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Debounce helper
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// Cache for game data
const gameCache: Record<string, any> = {};
// Track in-flight requests to prevent duplicates
const pendingRequests: Record<string, Promise<any>> = {};

// Create API instance with Authorization header
const createApiInstance = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Using authorization token:', token.substring(0, 15) + '...');
  } else {
    console.log('No authorization token provided');
  }
  
  return axios.create({
    baseURL: API_URL,
    headers,
  });
};

/**
 * Format seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Fetch all games
 */
export const fetchAllGames = async (token?: string) => {
  console.log('Fetching all games from:', `${API_URL}/games`);
  try {
    const api = createApiInstance(token);
    const response = await api.get('/games');
    console.log('Games data received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

/**
 * Fetch games by category
 */
export const fetchGamesByCategory = async (category: string, token?: string) => {
  console.log('Fetching games by category:', category);
  try {
    const api = createApiInstance(token);
    const response = await api.get(`/games/category/${category}`);
    console.log('Category games data received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching games for category ${category}:`, error);
    throw error;
  }
};

/**
 * Fetch game by ID
 */
export const fetchGameById = async (gameId: string, token?: string) => {
  console.log('Fetching game by ID:', gameId);
  
  // Return from cache if available
  if (gameCache[gameId]) {
    console.log('Returning cached game data for:', gameId);
    return gameCache[gameId];
  }
  
  // If there's already a request in flight for this game, return that promise
  if (pendingRequests[gameId]) {
    console.log('Using existing request for game:', gameId);
    return pendingRequests[gameId];
  }
  
  try {
    // Create a new request and store it
    const requestPromise = (async () => {
      const api = createApiInstance(token);
      const response = await api.get(`/games/${gameId}`);
      console.log('Game data received:', response.data);
      
      // Cache the result
      gameCache[gameId] = response.data.data;
      
      // Clear the pending request
      delete pendingRequests[gameId];
      
      return response.data.data;
    })();
    
    // Store the request promise
    pendingRequests[gameId] = requestPromise;
    
    return requestPromise;
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    // Clear the pending request on error
    delete pendingRequests[gameId];
    throw error;
  }
};

/**
 * Start a game session
 */
export const startGameSession = async (gameId: string, token?: string) => {
  console.log('Starting game session for game:', gameId);
  try {
    const api = createApiInstance(token);
    const response = await api.post(`/games/${gameId}/start`);
    console.log('Game session started:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error starting game session for ${gameId}:`, error);
    throw error;
  }
};

/**
 * Submit an answer for a question
 */
export const submitAnswer = async (
  sessionId: string,
  questionId: string,
  answer: any,
  timeTaken: number,
  token?: string
) => {
  console.log('Submitting answer:', { sessionId, questionId, answer, timeTaken });
  try {
    const api = createApiInstance(token);
    const response = await api.post(`/games/sessions/${sessionId}/submit`, {
      questionId,
      answer,
      timeTaken
    });
    console.log('Answer submission result:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

/**
 * End a game session
 */
export const endGameSession = async (sessionId: string, token?: string) => {
  console.log('Ending game session:', sessionId);
  try {
    const api = createApiInstance(token);
    const response = await api.post(`/games/sessions/${sessionId}/end`);
    console.log('Game session ended:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error ending game session ${sessionId}:`, error);
    throw error;
  }
};

/**
 * Fetch user game progress
 */
export const fetchUserGameProgress = async (token?: string): Promise<any> => {
  try {
    console.log('Fetching user game progress from:', `${API_URL}/games/user/progress`);
    
    if (!token) {
      console.warn('No token provided for fetchUserGameProgress');
      return {
        points: 0,
        level: 1,
        gameHistory: [],
        achievements: []
      };
    }
    
    const api = createApiInstance(token);
    const response = await api.get('/games/user/progress');
    console.log('User progress data received:', response.data);
    
    // Validate the response structure before returning
    if (response.data && response.data.success && response.data.data) {
      const progressData = response.data.data;
      
      // Ensure gameHistory is an array (this was causing issues)
      if (!progressData.gameHistory || !Array.isArray(progressData.gameHistory)) {
        console.warn('Game history is missing or not an array, initializing empty array');
        progressData.gameHistory = [];
      }
      
      // Ensure achievements is an array
      if (!progressData.achievements || !Array.isArray(progressData.achievements)) {
        console.warn('Achievements is missing or not an array, initializing empty array');
        progressData.achievements = [];
      }
      
      return progressData;
    } else {
      console.error('Invalid user progress data format:', response.data);
      
      // Return default structure instead of throwing to prevent UI errors
      return {
        points: 0,
        level: 1,
        gameHistory: [],
        achievements: []
      };
    }
  } catch (error) {
    console.error('Error fetching user game progress:', error);
    
    // Add more detailed error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    
    // Return default data structure instead of throwing
    return {
      points: 0,
      level: 1,
      gameHistory: [],
      achievements: []
    };
  }
};

/**
 * Fetch user achievements
 */
export const fetchUserAchievements = async (token?: string) => {
  console.log('Fetching user achievements from:', `${API_URL}/games/user/achievements`);
  try {
    const api = createApiInstance(token);
    const response = await api.get('/games/user/achievements');
    console.log('User achievements data received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    throw error;
  }
};

/**
 * Fetch user game history
 */
export const fetchUserGameHistory = async (token?: string) => {
  console.log('Fetching user game history from:', `${API_URL}/games/user/history`);
  try {
    const api = createApiInstance(token);
    const response = await api.get('/games/user/history');
    console.log('User game history data received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user game history:', error);
    throw error;
  }
};

/**
 * Fetch game leaderboard
 */
export const fetchGameLeaderboard = async (gameId: string, token?: string) => {
  console.log('Fetching leaderboard for game:', gameId);
  try {
    const api = createApiInstance(token);
    const response = await api.get(`/games/${gameId}/leaderboard`);
    console.log('Leaderboard data received:', response.data);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching leaderboard for game ${gameId}:`, error);
    throw error;
  }
}; 