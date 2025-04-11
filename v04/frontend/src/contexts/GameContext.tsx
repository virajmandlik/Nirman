import React, { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchAllGames,
  fetchGamesByCategory,
  fetchGameById,
  startGameSession,
  submitAnswer,
  endGameSession,
  fetchUserGameProgress,
  fetchUserAchievements,
  fetchGameLeaderboard
} from '../lib/gameApi';

// Define types
interface Game {
  _id: string;
  title: string;
  description: string;
  category: 'webDevelopment' | 'database' | 'coreProgramming';
  subcategory?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  imageUrl: string;
  timeLimit: number;
  maxScore: number;
  tags: string[];
  status: string;
  questions: Question[];
}

interface Question {
  questionId: string;
  question: string;
  options: Option[];
  correctOption: number;
  explanation: string;
  points: number;
  difficulty: string;
  timeLimit: number;
}

interface Option {
  id: string;
  text: string;
}

interface GameSession {
  sessionId: string;
  gameId: string;
  title: string;
  category: string;
  timeLimit: number;
  timeRemaining: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: Question | null;
  score: number;
  status: 'active' | 'completed' | 'abandoned';
}

interface UserProgress {
  points: number;
  level: number;
  gameHistory: GameHistory[];
  achievements: Achievement[];
}

interface GameHistory {
  gameId: string;
  category: string;
  title: string;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: Date;
}

interface Achievement {
  name: string;
  description: string;
  category: string;
  isEarned: boolean;
  earnedAt?: Date;
}

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  accuracyRate: number;
  timeSpent: number;
  dateCompleted: Date;
}

interface GameState {
  games: Game[];
  currentGame: Game | null;
  currentSession: GameSession | null;
  currentQuestion: Question | null;
  userProgress: UserProgress | null;
  achievements: Achievement[];
  gameHistory: GameHistory[];
  leaderboard: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  timeRemaining: number;
}

interface Action {
  type: string;
  payload?: any;
}

interface GameContextType extends GameState {
  fetchGames: (category?: string) => Promise<Game[] | undefined>;
  fetchGame: (gameId: string) => Promise<Game | undefined>;
  startGame: (gameId: string) => Promise<GameSession | undefined>;
  submitAnswer: (questionId: string, answer: any, timeTaken: number) => Promise<any>;
  endGame: () => Promise<any>;
  fetchUserProgress: () => Promise<UserProgress | undefined>;
  fetchAchievements: () => Promise<Achievement[] | undefined>;
  fetchGameHistory: () => Promise<GameHistory[] | undefined>;
  fetchLeaderboard: (gameId: string) => Promise<LeaderboardEntry[] | undefined>;
  clearError: () => void;
}

interface GameProviderProps {
  children: ReactNode;
}

// Initial state
const initialState: GameState = {
  games: [],
  currentGame: null,
  currentSession: null,
  currentQuestion: null,
  userProgress: null,
  achievements: [],
  gameHistory: [],
  leaderboard: [],
  loading: false,
  error: null,
  timeRemaining: 0
};

// Create context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_GAMES: 'SET_GAMES',
  SET_CURRENT_GAME: 'SET_CURRENT_GAME',
  SET_CURRENT_SESSION: 'SET_CURRENT_SESSION',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_USER_PROGRESS: 'SET_USER_PROGRESS',
  SET_ACHIEVEMENTS: 'SET_ACHIEVEMENTS',
  SET_GAME_HISTORY: 'SET_GAME_HISTORY',
  SET_LEADERBOARD: 'SET_LEADERBOARD',
  SET_TIME_REMAINING: 'SET_TIME_REMAINING',
  CLEAR_CURRENT_SESSION: 'CLEAR_CURRENT_SESSION'
};

// Reducer
const gameReducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ACTIONS.SET_GAMES:
      return { ...state, games: action.payload, loading: false };
    case ACTIONS.SET_CURRENT_GAME:
      return { ...state, currentGame: action.payload, loading: false };
    case ACTIONS.SET_CURRENT_SESSION:
      return { ...state, currentSession: action.payload, loading: false };
    case ACTIONS.SET_CURRENT_QUESTION:
      return { ...state, currentQuestion: action.payload };
    case ACTIONS.SET_USER_PROGRESS:
      return { ...state, userProgress: action.payload, loading: false };
    case ACTIONS.SET_ACHIEVEMENTS:
      return { ...state, achievements: action.payload, loading: false };
    case ACTIONS.SET_GAME_HISTORY:
      return { ...state, gameHistory: action.payload, loading: false };
    case ACTIONS.SET_LEADERBOARD:
      return { ...state, leaderboard: action.payload, loading: false };
    case ACTIONS.SET_TIME_REMAINING:
      return { ...state, timeRemaining: action.payload };
    case ACTIONS.CLEAR_CURRENT_SESSION:
      return { 
        ...state, 
        currentSession: null, 
        currentQuestion: null,
        timeRemaining: 0
      };
    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { user } = useAuth();
  const [gameCache, setGameCache] = useState<Record<string, Game>>({});
  const [leaderboardCache, setLeaderboardCache] = useState<Record<string, LeaderboardEntry[]>>({});
  const [achievementsCache, setAchievementsCache] = useState<Achievement[] | null>(null);
  
  // Timer effect for game sessions
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    
    if (state.currentSession && state.currentSession.status === 'active' && state.timeRemaining > 0) {
      timer = setInterval(() => {
        dispatch({ type: ACTIONS.SET_TIME_REMAINING, payload: state.timeRemaining - 1 });
        
        if (state.timeRemaining <= 1) {
          if (timer) clearInterval(timer);
          // End the game when time runs out
          if (state.currentSession) {
            endGame();
          }
        }
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [state.currentSession, state.timeRemaining]);
  
  // Reset caches when user changes
  useEffect(() => {
    // Clear caches when user changes (e.g., on logout)
    setGameCache({});
    setLeaderboardCache({});
    setAchievementsCache(null);
    
    // Also clear state
    dispatch({ type: ACTIONS.SET_GAMES, payload: [] });
    dispatch({ type: ACTIONS.SET_CURRENT_GAME, payload: null });
    dispatch({ type: ACTIONS.SET_USER_PROGRESS, payload: null });
    dispatch({ type: ACTIONS.SET_ACHIEVEMENTS, payload: [] });
    dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: [] });
  }, [user?.id]);
  
  // Get auth token
  const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
  };
  
  // Fetch games (with optional category filter)
  const fetchGames = async (category?: string) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      let gamesData;
      const authToken = getAuthToken();
      
      if (category) {
        gamesData = await fetchGamesByCategory(category, authToken);
      } else {
        gamesData = await fetchAllGames(authToken);
      }
      
      dispatch({ type: ACTIONS.SET_GAMES, payload: gamesData });
      
      // Cache individual games
      const gamesCacheUpdate = { ...gameCache };
      gamesData.forEach((game: Game) => {
        gamesCacheUpdate[game._id] = game;
      });
      setGameCache(gamesCacheUpdate);
      
      return gamesData;
    } catch (error: any) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch games' 
      });
    }
  };
  
  // Fetch single game
  const fetchGame = async (gameId: string) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    // Check if we have this game in cache already
    if (gameCache[gameId]) {
      console.log('Using cached game data for:', gameId);
      dispatch({ type: ACTIONS.SET_CURRENT_GAME, payload: gameCache[gameId] });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return gameCache[gameId];
    }
    
    try {
      const authToken = getAuthToken();
      const gameData = await fetchGameById(gameId, authToken);
      
      // Save to cache
      setGameCache({
        ...gameCache,
        [gameId]: gameData
      });
      
      dispatch({ type: ACTIONS.SET_CURRENT_GAME, payload: gameData });
      return gameData;
    } catch (error: any) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch game' 
      });
    }
  };
  
  // Start a game session
  const startGame = async (gameId: string) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      // Clear any existing session first to prevent issues with previous game state
      dispatch({ type: ACTIONS.CLEAR_CURRENT_SESSION });
      
      const authToken = getAuthToken();
      if (!authToken) {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'You must be logged in to start a game' 
        });
        return;
      }
      
      console.log('Starting fresh game session for game ID:', gameId);
      
      // Ensure we have the game data first
      let gameData = state.currentGame;
      if (!gameData || gameData._id !== gameId) {
        console.log('Fetching game data before starting session');
        gameData = await fetchGame(gameId);
        if (!gameData) {
          throw new Error('Failed to fetch game data');
        }
      }
      
      // Start the new session
      const sessionData = await startGameSession(gameId, authToken);
      
      // Validate the session data
      if (!sessionData || !sessionData.sessionId) {
        throw new Error('Invalid session data received from server');
      }
      
      console.log('New game session started:', sessionData);
      
      // Verify we have the correct question index and a valid current question
      if (sessionData.currentQuestionIndex !== 0) {
        console.warn('Session started with incorrect question index, resetting to 0');
        sessionData.currentQuestionIndex = 0;
      }
      
      if (!sessionData.currentQuestion) {
        console.error('No current question provided in session data');
        throw new Error('Session started without a valid question');
      }
      
      // Initialize the session state
      dispatch({ 
        type: ACTIONS.SET_CURRENT_SESSION, 
        payload: {
          ...sessionData,
          status: 'active',
          totalQuestions: sessionData.totalQuestions || gameData.questions?.length || 0
        }
      });
      
      dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: sessionData.currentQuestion });
      dispatch({ type: ACTIONS.SET_TIME_REMAINING, payload: sessionData.timeRemaining });
      
      return sessionData;
    } catch (error: any) {
      console.error('Error starting game:', error);
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to start game' 
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return undefined;
    }
  };
  
  // Submit answer for question
  const submitAnswerAction = async (questionId: string, answer: any, timeTaken: number) => {
    if (!state.currentSession) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: 'No active game session' 
      });
      return {
        isCorrect: false,
        pointsEarned: 0,
        explanation: "No active game session. Please start a new game.",
        isCompleted: false,
        error: true
      };
    }
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'You must be logged in to submit an answer' 
        });
        return {
          isCorrect: false,
          pointsEarned: 0,
          explanation: "You must be logged in to submit an answer.",
          isCompleted: false,
          error: true
        };
      }
      
      // Try to submit the answer - if it fails with a 500 error, try ending the game instead
      try {
        console.log(`Submitting answer for question ${questionId}, session ${state.currentSession.sessionId}`);
        
        // Sanitize the answer if needed
        let processedAnswer = answer;
        // If answer is extremely long string, truncate it
        if (typeof answer === 'string' && answer.length > 1000) {
          processedAnswer = answer.substring(0, 1000);
        }
        
        const result = await submitAnswer(
          state.currentSession.sessionId, 
          questionId, 
          processedAnswer, 
          timeTaken, 
          authToken
        );
        
        console.log('Answer submission result:', result);
        
        // Log detailed result information
        if (result.isCorrect !== undefined) {
          console.log(`Answer was ${result.isCorrect ? 'correct' : 'incorrect'}`);
        }
        if (result.correctAnswers !== undefined) {
          console.log(`Server reports ${result.correctAnswers} correct answers so far`);
        }
        
        // If this is the final question and we have complete game results
        // (maxScore, accuracy, etc. are present), treat it as a game completion
        const isFinalResults = result && (
          result.maxScore !== undefined ||
          result.accuracy !== undefined ||
          result.timeSpent !== undefined ||
          result.isCompleted === true
        );
        
        if (isFinalResults) {
          console.log('Final game results detected, ending the game session');
          
          // Clear the current session
          dispatch({ type: ACTIONS.CLEAR_CURRENT_SESSION });
          dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: null });
          
          // Fetch updated game history in the background
          try {
            fetchUserProgress().catch(err => console.error('Error updating progress after completion', err));
          } catch (progressError) {
            console.error('Error updating game progress after completion:', progressError);
          }
          
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          
          // Ensure we have definitive values for the result
          const correctAnswers = typeof result.correctAnswers === 'number' ? result.correctAnswers : 0;
          const totalQuestions = result.totalQuestions || state.currentSession.totalQuestions || 5;
          const accuracy = typeof result.accuracy === 'number' ? result.accuracy : 
                           (correctAnswers > 0 && totalQuestions > 0) ? 
                             Math.round((correctAnswers / totalQuestions) * 100) : 0;
          
          console.log(`Final game stats: ${correctAnswers}/${totalQuestions} correct, ${accuracy}% accuracy`);
          
          return {
            isCorrect: result.isCorrect || false,
            pointsEarned: result.pointsEarned || 0,
            explanation: result.explanation || "No explanation provided",
            isCompleted: true,
            score: result.score || result.totalScore || 0,
            totalScore: result.score || result.totalScore || 0,
            maxScore: result.maxScore || 0,
            correctAnswers,
            totalQuestions,
            accuracy,
            timeSpent: result.timeSpent || 0,
            level: result.level || 1,
            points: result.points || 0
          };
        }
        
        // Regular question answer processing
        // Update session state
        const updatedScore = result.totalScore !== undefined ? result.totalScore : 
                             result.score !== undefined ? result.score : 
                             state.currentSession.score;
        
        const updatedQuestionIndex = result.currentQuestionIndex !== undefined 
          ? result.currentQuestionIndex 
          : state.currentSession.currentQuestionIndex + 1;
        
        console.log(`Updated score: ${updatedScore}, next question index: ${updatedQuestionIndex}`);
        
        dispatch({ 
          type: ACTIONS.SET_CURRENT_SESSION, 
          payload: {
            ...state.currentSession,
            currentQuestionIndex: updatedQuestionIndex,
            score: updatedScore,
            status: result.isCompleted ? 'completed' : 'active'
          }
        });
        
        // Log the score after each answer
        console.log(`Session score updated: ${updatedScore} points`);
        
        // Update current question if there is a next question
        if (result.nextQuestion) {
          console.log('Moving to next question:', result.nextQuestion.questionId);
          // Ensure the nextQuestion has all required properties
          const safeNextQuestion = {
            ...result.nextQuestion,
            correctOption: result.nextQuestion.correctOption || 0,
            options: result.nextQuestion.options || []
          };
          dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: safeNextQuestion });
        } else if (result.isCompleted) {
          console.log('Game completed, clearing current question');
          dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: null });
        }
        
        // Update time remaining
        dispatch({ type: ACTIONS.SET_TIME_REMAINING, payload: result.timeRemaining || 0 });
        
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        
        return {
          isCorrect: result.isCorrect,
          pointsEarned: result.pointsEarned || 0,
          explanation: result.explanation || "No explanation provided",
          isCompleted: result.isCompleted || false,
          totalScore: updatedScore,
          score: updatedScore,
          correctAnswers: result.correctAnswers || 0,
          totalQuestions: state.currentSession.totalQuestions
        };
      } catch (submitError: any) {
        console.error("Error in submitAnswer:", submitError);
        
        // If this is the last question and we get a 500 error, try to gracefully end the game
        const isLastOrNearLastQuestion = state.currentSession.currentQuestionIndex >= state.currentSession.totalQuestions - 2; 
        
        if ((submitError?.response?.status === 500 || submitError?.response?.status === 404) && isLastOrNearLastQuestion) {
          console.log("Last question encountered an error. Attempting to end the game gracefully...");
          
          try {
            const result = await endGameSession(state.currentSession.sessionId, authToken);
            console.log('Successfully ended game after error:', result);
            
            // Clear the current session
            dispatch({ type: ACTIONS.CLEAR_CURRENT_SESSION });
            dispatch({ type: ACTIONS.SET_CURRENT_QUESTION, payload: null });
            
            // Fetch updated game history in background
            fetchUserProgress().catch(err => console.error('Error updating progress after completion', err));
            
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            
            return {
              isCorrect: false, // We don't know if it was correct since there was an error
              pointsEarned: 0,
              explanation: "Your answer was recorded, but we encountered an issue. The test has been completed.",
              isCompleted: true,
              score: result?.score || state.currentSession.score || 0,
              totalScore: result?.score || state.currentSession.score || 0,
              correctAnswers: result?.correctAnswers || 0,
              totalQuestions: state.currentSession.totalQuestions,
              accuracy: result?.accuracy || 0,
              timeSpent: result?.timeSpent || 0
            };
          } catch (endError) {
            console.error("Failed to end game after submit error:", endError);
            
            // We couldn't end the game, but we can still clear the session and give feedback
            dispatch({ type: ACTIONS.CLEAR_CURRENT_SESSION });
            
            return {
              isCorrect: false,
              pointsEarned: 0,
              explanation: "There was an error processing your answer, but we've saved your progress.",
              isCompleted: true,
              score: state.currentSession.score || 0,
              totalScore: state.currentSession.score || 0,
              totalQuestions: state.currentSession.totalQuestions,
            };
          }
        } else {
          // For other errors, show an error message but don't end the game
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          throw submitError;
        }
      }
    } catch (error: any) {
      console.error("Error in submitAnswerAction:", error);
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to submit answer' 
      });
      
      // Return a basic error result for the UI to handle
      return {
        isCorrect: false,
        pointsEarned: 0,
        explanation: "There was an error processing your answer. Please try again or end the test.",
        isCompleted: false,
        error: true,
        // Return current session info for recovery
        currentQuestionIndex: state.currentSession.currentQuestionIndex,
        score: state.currentSession.score,
        totalQuestions: state.currentSession.totalQuestions
      };
    }
  };
  
  // End game session
  const endGame = async () => {
    if (!state.currentSession) {
      return;
    }
    
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'You must be logged in to end the game' 
        });
        return;
      }
      
      const result = await endGameSession(state.currentSession.sessionId, authToken);
      
      // Clear the current session
      dispatch({ type: ACTIONS.CLEAR_CURRENT_SESSION });
      
      // Fetch updated game history
      await fetchUserGameProgress();
      
      return result;
    } catch (error: any) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to end game' 
      });
    }
  };
  
  // Fetch user game progress
  const fetchUserProgress = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    // If user is not logged in, don't attempt to fetch progress
    if (!user) {
      console.log('User not logged in, skipping progress fetch');
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        console.log('No auth token available, skipping progress fetch');
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }

      console.log('Fetching user game progress...');
      const progressData = await fetchUserGameProgress(authToken);
      
      if (!progressData) {
        console.error('Empty progress data received');
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return;
      }
      
      console.log('User progress received:', progressData);
      
      // Ensure gameHistory is properly initialized
      const gameHistory = Array.isArray(progressData.gameHistory) 
        ? progressData.gameHistory 
        : [];
      
      // Create a standardized user progress object
      const userProgress = {
        points: progressData.points || 0,
        level: progressData.level || 1,
        gameHistory: gameHistory,
        achievements: progressData.achievements || []
      };
      
      dispatch({ type: ACTIONS.SET_USER_PROGRESS, payload: userProgress });
      
      // Also update the game history separately
      if (gameHistory.length > 0) {
        dispatch({ type: ACTIONS.SET_GAME_HISTORY, payload: gameHistory });
      }
      
      return userProgress;
    } catch (error: any) {
      console.error('Error fetching user progress:', error);
      // Check if the error is a 401 (unauthorized)
      const isAuthError = error.response?.status === 401;
      
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: isAuthError 
          ? 'Please log in to view your progress' 
          : (error.response?.data?.message || 'Failed to fetch user progress')
      });
      
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Fetch user achievements
  const fetchUserAchievementsAction = async () => {
    if (!user) return;
    
    // Check cache first
    if (achievementsCache) {
      console.log('Using cached achievements data');
      dispatch({ type: ACTIONS.SET_ACHIEVEMENTS, payload: achievementsCache });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return achievementsCache;
    }
    
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        dispatch({ 
          type: ACTIONS.SET_ERROR, 
          payload: 'You must be logged in to view achievements' 
        });
        return;
      }
      
      const achievementsData = await fetchUserAchievements(authToken);
      
      // Save to cache
      setAchievementsCache(achievementsData);
      
      dispatch({ type: ACTIONS.SET_ACHIEVEMENTS, payload: achievementsData });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return achievementsData;
    } catch (error: any) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch achievements' 
      });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Fetch leaderboard
  const fetchLeaderboard = async (gameId: string) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    // Check cache first
    if (leaderboardCache[gameId]) {
      console.log('Using cached leaderboard data for:', gameId);
      dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: leaderboardCache[gameId] });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return leaderboardCache[gameId];
    }
    
    try {
      const authToken = getAuthToken();
      const leaderboardData = await fetchGameLeaderboard(gameId, authToken);
      
      // Save to cache
      setLeaderboardCache({
        ...leaderboardCache,
        [gameId]: leaderboardData
      });
      
      dispatch({ type: ACTIONS.SET_LEADERBOARD, payload: leaderboardData });
      return leaderboardData;
    } catch (error: any) {
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch leaderboard' 
      });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  };
  
  // Clear error message
  const clearError = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };
  
  // Fetch user game history
  const fetchGameHistory = async () => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    
    // If user is not logged in, don't attempt to fetch progress
    if (!user) {
      console.log('User not logged in, skipping game history fetch');
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return [];
    }

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        console.log('No auth token available, skipping game history fetch');
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return [];
      }

      console.log('Fetching user game history...');
      const progressData = await fetchUserGameProgress(authToken);
      
      if (!progressData) {
        console.error('Empty progress data received');
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        return [];
      }
      
      // Ensure gameHistory is properly initialized
      const gameHistory = Array.isArray(progressData.gameHistory) 
        ? progressData.gameHistory 
        : [];
      
      dispatch({ type: ACTIONS.SET_GAME_HISTORY, payload: gameHistory });
      
      return gameHistory;
    } catch (error: any) {
      console.error('Error fetching user game history:', error);
      
      dispatch({ 
        type: ACTIONS.SET_ERROR, 
        payload: error.response?.data?.message || 'Failed to fetch game history'
      });
      
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return [];
    }
  };
  
  // Create context object
  const gameContextValue: GameContextType = {
    ...state,
    fetchGames,
    fetchGame,
    startGame,
    submitAnswer: submitAnswerAction,
    endGame,
    fetchUserProgress,
    fetchAchievements: fetchUserAchievementsAction,
    fetchGameHistory,
    fetchLeaderboard,
    clearError
  };
  
  return (
    <GameContext.Provider value={gameContextValue}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 