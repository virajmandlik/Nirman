const { Game, User, GameSession, GameProgress } = require('../models');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all games
// @route   GET /api/games
// @access  Public
exports.getAllGames = asyncHandler(async (req, res) => {
  const games = await Game.find({ status: 'published' })
    .select('_id title description category difficulty imageUrl timeLimit maxScore tags');
    
  res.status(200).json({
    success: true,
    count: games.length,
    data: games
  });
});

// @desc    Get games by category
// @route   GET /api/games/category/:category
// @access  Public
exports.getGamesByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  
  // Validate category
  const allowedCategories = ['webDevelopment', 'database', 'coreProgramming'];
  if (!allowedCategories.includes(category)) {
    return next(new ErrorResponse(`Invalid category: ${category}`, 400));
  }
  
  const games = await Game.find({ 
    category, 
    status: 'published' 
  }).select('_id title description category subcategory difficulty imageUrl timeLimit maxScore tags');
  
  res.status(200).json({
    success: true,
    count: games.length,
    data: games
  });
});

// @desc    Get single game
// @route   GET /api/games/:id
// @access  Public
exports.getGame = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  
  if (!game) {
    return next(new ErrorResponse(`Game not found with id of ${req.params.id}`, 404));
  }
  
  // If game is not published and user is not admin, return error
  if (game.status !== 'published' && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Game not found with id of ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    success: true,
    data: game
  });
});

// @desc    Start a game session
// @route   POST /api/games/:id/start
// @access  Private
exports.startGameSession = asyncHandler(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  
  if (!game) {
    return next(new ErrorResponse(`Game not found with id of ${req.params.id}`, 404));
  }
  
  // Check if game has questions
  if (!game.questions || !Array.isArray(game.questions) || game.questions.length === 0) {
    return next(new ErrorResponse('This game has no questions and cannot be started', 400));
  }
  
  // Check for existing active sessions for this user and game
  // and end them to prevent conflicts
  const existingSessions = await GameSession.find({
    userId: req.user.id,
    gameId: game._id,
    status: 'active'
  });
  
  if (existingSessions.length > 0) {
    console.log(`Found ${existingSessions.length} existing active sessions for user ${req.user.id} and game ${game._id}. Ending them.`);
    
    // End all existing sessions
    for (const session of existingSessions) {
      session.status = 'abandoned';
      session.endTime = Date.now();
      await session.save();
    }
  }
  
  // Get the game time limit (ensure it's valid)
  const timeLimit = typeof game.timeLimit === 'number' && game.timeLimit > 0 
    ? game.timeLimit 
    : 300; // Default to 5 minutes if invalid
  
  console.log(`Starting game session with time limit of ${timeLimit} seconds`);
  
  // Create a new session
  const sessionId = uuidv4();
  const session = await GameSession.create({
    sessionId,
    userId: req.user.id,
    gameId: game._id,
    timeRemaining: timeLimit,
    totalQuestions: game.questions.length,
    // Explicitly set values to ensure proper initialization
    currentQuestionIndex: 0,
    score: 0,
    accuracyRate: 0,
    answeredQuestions: [],
    status: 'active',
    startTime: Date.now()
  });
  
  console.log(`New game session created: ${sessionId} for game ${game._id}`);
  
  // Increment play count for the game
  game.playCount += 1;
  await game.save();
  
  // Get the first question (with null checks)
  let currentQuestion = null;
  
  if (game.questions && game.questions[0]) {
    const firstQuestion = game.questions[0];
    currentQuestion = {
      questionId: firstQuestion.questionId,
      question: firstQuestion.question,
      options: firstQuestion.options || [],
      points: firstQuestion.points || 10,
      timeLimit: firstQuestion.timeLimit || 30,
      difficulty: firstQuestion.difficulty || 'easy'
    };
  }
  
  if (!currentQuestion) {
    return next(new ErrorResponse('Failed to retrieve first question', 500));
  }
  
  res.status(200).json({
    success: true,
    data: {
      sessionId: session.sessionId,
      gameId: game._id,
      title: game.title,
      category: game.category,
      timeLimit: timeLimit,
      timeRemaining: timeLimit,
      currentQuestionIndex: 0,
      totalQuestions: game.questions.length,
      currentQuestion,
      score: 0
    }
  });
});

// Helper function to normalize answers for comparison
const normalizeAnswer = (answer, options) => {
  // If the answer is a string that can be parsed as a number
  if (typeof answer === 'string' && !isNaN(parseInt(answer)) && options) {
    const numericAnswer = parseInt(answer);
    // Check if this might be an index
    if (numericAnswer >= 0 && numericAnswer < options.length) {
      // This might be an index, so return both the numeric form and the option ID
      return {
        asNumber: numericAnswer,
        asIndex: numericAnswer,
        asOptionId: options[numericAnswer]?.id
      };
    }
  }
  
  // If the answer is a number
  if (typeof answer === 'number' && options) {
    // It could be an index
    if (answer >= 0 && answer < options.length) {
      return {
        asNumber: answer,
        asIndex: answer,
        asOptionId: options[answer]?.id
      };
    }
  }
  
  // Default case: return the original answer in various forms
  return {
    original: answer,
    asString: String(answer),
    asNumber: typeof answer === 'string' ? parseInt(answer) : answer
  };
};

// @desc    Submit answer for a question
// @route   POST /api/games/sessions/:sessionId/submit
// @access  Private
exports.submitAnswer = asyncHandler(async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { questionId, answer, timeTaken } = req.body;
    
    console.log(`Processing answer submission - Session: ${sessionId}, Question: ${questionId}, Answer:`, answer, `TimeTaken: ${timeTaken}s`);
    
    if (!questionId || answer === undefined || !timeTaken) {
      return next(new ErrorResponse('Please provide questionId, answer and timeTaken', 400));
    }
    
    // Find the session
    const session = await GameSession.findOne({ sessionId });
    
    if (!session) {
      return next(new ErrorResponse(`Session not found with id of ${sessionId}`, 404));
    }
    
    // Validate user
    if (session.userId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to access this session', 401));
    }
    
    // Check if session is active
    if (session.status !== 'active') {
      return next(new ErrorResponse('This session is no longer active', 400));
    }
    
    // Get the game
    const game = await Game.findById(session.gameId);
    
    if (!game) {
      return next(new ErrorResponse('Game not found for this session', 404));
    }
    
    // Verify the game has questions
    if (!game.questions || !Array.isArray(game.questions) || game.questions.length === 0) {
      return next(new ErrorResponse('Game has no questions', 400));
    }
    
    // Ensure the current question index is valid
    if (session.currentQuestionIndex < 0 || session.currentQuestionIndex >= game.questions.length) {
      return next(new ErrorResponse('Invalid question index', 400));
    }
    
    // Find the current question
    const currentQuestion = game.questions[session.currentQuestionIndex];
    
    if (!currentQuestion || currentQuestion.questionId !== questionId) {
      console.error(`Question ID mismatch: expected ${currentQuestion?.questionId}, got ${questionId}`);
      return next(new ErrorResponse('Invalid question ID', 400));
    }
    
    // Check if answer is correct - handle different types of answers
    let isCorrect = false;
    const correctOption = currentQuestion.correctOption;
    
    console.log(`Checking answer correctness - User answer: ${JSON.stringify(answer)}, Correct option: ${JSON.stringify(correctOption)}`);

    // IMPROVED ANSWER CHECKING LOGIC FOR ALL ANSWER TYPES
    try {
      // Extract the correct index value regardless of format
      let correctIndex = correctOption;
      
      // Handle MongoDB numeric format - if it's an object with $numberInt property
      if (typeof correctOption === 'object' && correctOption.$numberInt !== undefined) {
        correctIndex = parseInt(correctOption.$numberInt);
      }
      
      console.log(`Correct index parsed as: ${correctIndex}`);
      
      // Check the submitted answer type and handle it properly
      if (typeof answer === 'number') {
        // NUMERIC ANSWER COMPARISON - most important fix
        // If the answer is a plain number, we need to check if:
        // 1. It directly matches the correct index
        // 2. It matches the ID of the correct option
        isCorrect = answer === correctIndex;
        
        // If not correct, try comparing with option IDs
        if (!isCorrect && currentQuestion.options && Array.isArray(currentQuestion.options)) {
          // Check if this number might be an option index instead of ID
          if (correctIndex >= 0 && correctIndex < currentQuestion.options.length) {
            // If the answer is the index of the option in the array
            isCorrect = parseInt(answer) === correctIndex;
            
            if (isCorrect) {
              console.log(`Matched by option index: ${answer} === ${correctIndex}`);
            }
          }
        }
        
        console.log(`Number comparison result: ${isCorrect}`);
      } 
      else if (typeof answer === 'string') {
        // STRING ANSWER COMPARISON
        // If the answer is a string (likely an option ID), we need to:
        // 1. Check if it exactly matches the correctOption as string
        // 2. Check if it matches the ID of the correct option based on index
        // 3. Check if it's a string representation of the correct index
        
        // First try direct string comparison
        if (answer === correctOption.toString()) {
          isCorrect = true;
          console.log(`Matched by direct string comparison`);
        }
        // Then try to match by option ID
        else if (
          currentQuestion.options && 
          Array.isArray(currentQuestion.options) && 
          typeof correctIndex === 'number' && 
          correctIndex >= 0 && 
          correctIndex < currentQuestion.options.length
        ) {
          const correctOptionObj = currentQuestion.options[correctIndex];
          
          // Compare the provided answer with the correct option's ID
          if (correctOptionObj && correctOptionObj.id === answer) {
            isCorrect = true;
            console.log(`Matched by option ID comparison: ${answer} === ${correctOptionObj.id}`);
          }
          // Also check if the answer is the string representation of the index
          else if (answer === correctIndex.toString()) {
            isCorrect = true;
            console.log(`Matched by string index: ${answer} === ${correctIndex.toString()}`);
          }
        }
        
        // If still not correct, check text content of options
        if (!isCorrect && currentQuestion.options && Array.isArray(currentQuestion.options)) {
          // Find the selected option by ID
          const selectedOption = currentQuestion.options.find(opt => opt.id === answer);
          const correctOptionObj = currentQuestion.options[correctIndex];
          
          // Compare text of selected option with text of correct option
          if (selectedOption && correctOptionObj && 
              selectedOption.text.toLowerCase() === correctOptionObj.text.toLowerCase()) {
            isCorrect = true;
            console.log(`Matched by option text comparison: ${selectedOption.text} === ${correctOptionObj.text}`);
          }
        }
      } 
      else if (typeof answer === 'boolean') {
        // BOOLEAN ANSWER COMPARISON
        let correctBool;
        if (typeof correctIndex === 'boolean') {
          correctBool = correctIndex;
        } else if (typeof correctIndex === 'number') {
          correctBool = correctIndex === 1;
        } else {
          correctBool = correctIndex === "true" || correctIndex === "1" || correctIndex === 1;
        }
        
        isCorrect = answer === correctBool;
        console.log(`Boolean comparison: ${answer} === ${correctBool} = ${isCorrect}`);
      }
      
      // CRITICAL FIX: Handle the case where answer is the ID of an option
      // This is important if the frontend is sending the option ID instead of index
      if (!isCorrect && currentQuestion.options && Array.isArray(currentQuestion.options)) {
        // Try to find the option with the given ID
        const optionIndex = currentQuestion.options.findIndex(opt => {
          if (typeof answer === 'string') {
            // If answer is a string, compare directly with option ID
            return opt.id === answer;
          } else if (typeof answer === 'number') {
            // If answer is a number, it could be the index or an ID converted to number
            return opt.id === answer.toString() || 
                   parseInt(opt.id) === answer;
          }
          return false;
        });
        
        if (optionIndex !== -1 && optionIndex === correctIndex) {
          isCorrect = true;
          console.log(`Matched by finding option index from ID: ${optionIndex} === ${correctIndex}`);
        }
      }
      
    } catch (comparisonError) {
      console.error('Error comparing answers:', comparisonError);
      // Default to false on error
      isCorrect = false;
    }
    
    // Final logging of the result
    console.log(`Final answer evaluation: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
    
    // Calculate points - ensure we have a valid points value
    const pointsValue = currentQuestion.points || 10; // Default to 10 if not specified
    const pointsEarned = isCorrect ? pointsValue : 0;
    
    console.log(`Answer evaluated: Question=${questionId}, Answer=${answer}, Correct=${isCorrect}, Points=${pointsEarned}`);
    
    // Update session with DEFINITIVE true/false for isCorrect
    session.answeredQuestions.push({
      questionId,
      userAnswer: answer,
      isCorrect: isCorrect === true, // Force boolean true/false
      timeTaken,
      pointsEarned
    });
    
    // ONLY add points to session score when answer is correct
    if (isCorrect) {
      // Explicitly update the score
      if (!session.score) session.score = 0;
      session.score += pointsEarned;
      console.log(`Points added to score: +${pointsEarned}, new total=${session.score}`);
    } else {
      // Make sure score exists, but don't add points
      if (session.score === undefined) session.score = 0;
      console.log(`Incorrect answer, no points added. Current score remains ${session.score}`);
    }
    
    // IMPORTANT: Correctly count answered questions and calculate accuracy rate
    // Use filter with explicit comparison to count correctly answered questions
    const answeredQuestionsCount = session.answeredQuestions.length;
    const correctAnswers = session.answeredQuestions.filter(q => q.isCorrect === true).length;
    console.log(`Correct answers so far: ${correctAnswers}/${answeredQuestionsCount}`);
    
    // Calculate accurate percentage - ensure we have a value to avoid NaN
    if (answeredQuestionsCount > 0) {
      session.accuracyRate = Math.round((correctAnswers / answeredQuestionsCount) * 100);
    } else {
      session.accuracyRate = 0;
    }
    console.log(`Updated accuracy rate: ${session.accuracyRate}%`);
    
    // Log current session state for debugging
    console.log(`Session state: score=${session.score}, accuracy=${session.accuracyRate}%, answered=${answeredQuestionsCount}, correct=${correctAnswers}`);
    
    // Move to next question - AFTER ALL STATUS CHECKS
    session.currentQuestionIndex += 1;
    
    // Update time remaining
    session.timeRemaining = Math.max(0, session.timeRemaining - timeTaken);
    
    // Check if game is completed - either last question or out of time
    const isLastQuestion = session.currentQuestionIndex >= game.questions.length;
    const isOutOfTime = session.timeRemaining <= 0;
    
    if (isLastQuestion || isOutOfTime) {
      console.log('Game completed! Last question:', isLastQuestion, 'Out of time:', isOutOfTime);
      
      session.status = 'completed';
      session.endTime = Date.now();
      
      // Save the session immediately to ensure data is recorded
      await session.save();
      
      // Calculate final stats - CRITICAL for game completion display
      // Get DEFINITIVE count of correct answers - log details for debugging
      session.answeredQuestions.forEach((q, i) => {
        console.log(`Q${i+1}: Answer=${q.userAnswer}, isCorrect=${q.isCorrect}, Points=${q.pointsEarned}`);
      });
      
      const correctAnswers = session.answeredQuestions
        .filter(q => q.isCorrect === true)
        .length;
        
      console.log(`Game completed stats - Correct answers: ${correctAnswers}/${session.answeredQuestions.length}`);
      
      const totalQuestions = game.questions.length; // Use total game questions count
      const accuracy = session.answeredQuestions.length > 0 ? 
        Math.round((correctAnswers / session.answeredQuestions.length) * 100) : 0;
      const timeSpent = Math.round((session.endTime - session.startTime) / 1000); // in seconds
      
      // Recalculate final score to ensure it matches points earned
      const calculatedScore = session.answeredQuestions.reduce((sum, q) => sum + (q.pointsEarned || 0), 0);
      if (session.score !== calculatedScore) {
        console.log(`Score mismatch detected: ${session.score} vs ${calculatedScore}. Using calculated score.`);
        session.score = calculatedScore;
        await session.save();
      }
      
      // Get game max score
      const maxScore = game.maxScore || game.questions.reduce((sum, q) => sum + (q.points || 10), 0);
      
      try {
        // Add to user history
        const gameCompletionData = await exports.endGameSession(req, res, next, session, game);
        
        console.log('Game completion recorded successfully:', gameCompletionData);
        
        // CRITICAL: Build the final response with accurate data
        const completionResponse = {
          success: true,
          data: {
            isCorrect, // Result of the last question
            pointsEarned,
            explanation: currentQuestion.explanation || "No explanation provided",
            isCompleted: true,
            
            // Game results summary - BE EXPLICIT about each value
            currentQuestionIndex: session.currentQuestionIndex,
            score: session.score || 0,
            totalScore: session.score || 0,
            maxScore,
            accuracy,
            correctAnswers, // Explicit count of correct answers
            totalQuestions,
            timeSpent,
            
            // User progress data
            level: gameCompletionData?.level || 1,
            points: gameCompletionData?.points || 0
          }
        };
        
        console.log('Sending game completion response:', completionResponse);
        return res.status(200).json(completionResponse);
      } catch (endGameError) {
        console.error('Error ending game session:', endGameError);
        
        // Still return the basic completion data without the progress update
        const basicCompletionResponse = {
          success: true,
          data: {
            isCorrect,
            pointsEarned,
            explanation: currentQuestion.explanation || "No explanation provided",
            totalScore: session.score || 0,
            isCompleted: true,
            currentQuestionIndex: session.currentQuestionIndex,
            score: session.score || 0,
            maxScore,
            accuracy,
            correctAnswers,
            totalQuestions,
            timeSpent,
            error: 'Failed to update progress, but game was completed'
          }
        };
        
        console.log('Sending fallback completion response due to error:', basicCompletionResponse);
        return res.status(200).json(basicCompletionResponse);
      }
    }
    
    await session.save();
    
    // Get the next question
    const nextQuestion = game.questions[session.currentQuestionIndex] ? {
      questionId: game.questions[session.currentQuestionIndex].questionId,
      question: game.questions[session.currentQuestionIndex].question,
      options: game.questions[session.currentQuestionIndex].options,
      points: game.questions[session.currentQuestionIndex].points || 0,
      timeLimit: game.questions[session.currentQuestionIndex].timeLimit || 60,
      difficulty: game.questions[session.currentQuestionIndex].difficulty || 'beginner'
    } : null;
    
    res.status(200).json({
      success: true,
      data: {
        isCorrect,
        pointsEarned,
        totalScore: session.score,
        explanation: currentQuestion.explanation || "No explanation provided",
        nextQuestion,
        currentQuestionIndex: session.currentQuestionIndex,
        timeRemaining: session.timeRemaining,
        isCompleted: session.status === 'completed',
        correctAnswers
      }
    });
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    return next(new ErrorResponse('An error occurred while processing your answer', 500));
  }
});

// @desc    End a game session
// @route   POST /api/games/sessions/:sessionId/end
// @access  Private
exports.endGameSession = asyncHandler(async (req, res, next, session, game) => {
  let responseSent = false;
  try {
    console.log('Ending game session', session?._id);
    
    // If session not provided, find it
    if (!session) {
      const { sessionId } = req.params;
      console.log('Finding session by ID', sessionId);
      session = await GameSession.findOne({ sessionId });
      
      if (!session) {
        console.error(`Session not found with id of ${sessionId}`);
        return next(new ErrorResponse(`Session not found with id of ${sessionId}`, 404));
      }
    }
    
    // If game not provided, find it
    if (!game) {
      console.log('Finding game by ID', session.gameId);
      game = await Game.findById(session.gameId);
      
      if (!game) {
        console.error('Game not found for this session');
        return next(new ErrorResponse('Game not found for this session', 404));
      }
    }
    
    // Mark session as completed if not already
    if (session.status !== 'completed') {
      session.status = 'completed';
      session.endTime = Date.now();
    }
    
    // Get user
    const user = await User.findById(session.userId);
    
    if (!user) {
      console.error(`User not found with id of ${session.userId}`);
      return next(new ErrorResponse(`User not found with id of ${session.userId}`, 404));
    }
    
    // Calculate stats - ENSURE WE'RE COUNTING CORRECTLY
    // CRITICAL: Be explicit about the filter condition
    let correctAnswers = 0;
    if (session.answeredQuestions && Array.isArray(session.answeredQuestions)) {
      // Count only questions where isCorrect is EXPLICITLY true
      // Log each answer for debugging
      console.log('Detailed answer review:');
      session.answeredQuestions.forEach((q, index) => {
        const status = q.isCorrect === true ? 'CORRECT' : 'INCORRECT';
        console.log(`Question ${index+1}: ${status} (${q.pointsEarned} points)`);
      });
      
      // Count only explicit true values
      correctAnswers = session.answeredQuestions.filter(q => q.isCorrect === true).length;
      console.log(`Found ${correctAnswers} correct answers out of ${session.answeredQuestions.length} answered questions`);
    } else {
      console.log('No answered questions found in session');
    }
    
    // For total questions, use the game questions length as the source of truth
    const totalQuestions = game.questions?.length || 0;
    
    // Calculate accuracy properly
    const answeredCount = session.answeredQuestions?.length || 0;
    // Avoid division by zero
    const accuracy = answeredCount > 0 ? Math.round((correctAnswers / answeredCount) * 100) : 0;
    
    // Ensure score matches points earned from correct answers
    const calculatedScore = session.answeredQuestions?.reduce((sum, q) => sum + (q.pointsEarned || 0), 0) || 0;
    
    // Update session score if needed
    if (session.score !== calculatedScore) {
      console.log(`⚠️ Score mismatch detected: session.score=${session.score}, calculated=${calculatedScore}. Updating to calculated value.`);
      session.score = calculatedScore;
    }
    
    // Final verification of score and correct answers
    console.log(`FINAL STATS: Score: ${session.score}, Correct Answers: ${correctAnswers}/${totalQuestions}, Accuracy: ${accuracy}%`);
    
    const timeSpent = Math.round((session.endTime - session.startTime) / 1000); // in seconds
    
    console.log(`Game stats - Correct: ${correctAnswers}/${totalQuestions}, Accuracy: ${accuracy}%, Time: ${timeSpent}s, Score: ${session.score}`);
    
    // Update the session with the final stats for consistency
    session.accuracyRate = accuracy;
    await session.save();
    
    try {
      // Get user's game progress or create new one
      let gameProgress = await GameProgress.findOne({
        userId: user._id,
        gameId: game._id
      });
      
      if (!gameProgress) {
        console.log('Creating new game progress record');
        gameProgress = new GameProgress({
          userId: user._id,
          gameId: game._id,
          lastPlayed: Date.now(),
          highScore: session.score,
          bestAccuracy: accuracy,
          timeSpent,
          completedSessions: 1,
          level: 1,
          points: session.score,
          gameHistory: [{
            sessionId: session._id,
            score: session.score,
            accuracy,
            correctAnswers,
            totalQuestions,
            timeSpent,
            completedAt: Date.now()
          }]
        });
      } else {
        console.log('Updating existing game progress record');
        // Update existing progress
        gameProgress.lastPlayed = Date.now();
        gameProgress.highScore = Math.max(gameProgress.highScore || 0, session.score);
        gameProgress.bestAccuracy = Math.max(gameProgress.bestAccuracy || 0, accuracy);
        gameProgress.timeSpent = (gameProgress.timeSpent || 0) + timeSpent;
        gameProgress.completedSessions = (gameProgress.completedSessions || 0) + 1;
        
        // Initialize gameHistory array if it doesn't exist
        if (!gameProgress.gameHistory) {
          gameProgress.gameHistory = [];
        }
        
        // Add session to history
        gameProgress.gameHistory.push({
          sessionId: session._id,
          score: session.score,
          accuracy,
          correctAnswers,
          totalQuestions,
          timeSpent,
          completedAt: Date.now()
        });
        
        // Update points and level
        gameProgress.points = (gameProgress.points || 0) + session.score;
        
        // Level progression (basic implementation)
        const pointsPerLevel = 100; // Customize as needed
        const newLevel = Math.floor(gameProgress.points / pointsPerLevel) + 1;
        
        // Initialize level if it doesn't exist
        if (!gameProgress.level) {
          gameProgress.level = 1;
        }
        
        // Check if level up occurred
        const didLevelUp = newLevel > gameProgress.level;
        if (didLevelUp) {
          console.log(`User leveled up from ${gameProgress.level} to ${newLevel}`);
          gameProgress.level = newLevel;
        }
      }
      
      // Also update the user model for backward compatibility
      // Initialize progress field if it doesn't exist
      if (!user.progress) {
        user.progress = {
          points: 0,
          level: 1,
          gameHistory: [],
          achievements: []
        };
      }
      
      // Add to user's points and update level
      if (!user.progress.points) {
        user.progress.points = 0;
      }
      
      user.progress.points += session.score;
      
      // Calculate new level based on total points
      const pointsPerLevel = 100; // Keep consistent with GameProgress
      const newUserLevel = Math.floor(user.progress.points / pointsPerLevel) + 1;
      
      if (!user.progress.level) {
        user.progress.level = 1;
      }
      
      user.progress.level = Math.max(user.progress.level || 1, newUserLevel);
      
      // Add to user's game history
      if (!user.progress.gameHistory) {
        user.progress.gameHistory = [];
      }
      
      // IMPORTANT: Update the gameHistory with CORRECT values
      user.progress.gameHistory.push({
        gameId: game._id,
        category: game.category,
        title: game.title,
        score: session.score,
        maxScore: game.maxScore || totalQuestions * 10,
        correctAnswers,  // Make sure this is the correct count
        totalQuestions,  // Use game.questions.length for consistency
        completedAt: new Date()
      });
      
      // Log the entry being added to gameHistory
      console.log('Adding to gameHistory:', {
        gameId: game._id.toString(),
        category: game.category,
        title: game.title,
        score: session.score,
        maxScore: game.maxScore || totalQuestions * 10,
        correctAnswers,
        totalQuestions,
        completedAt: new Date()
      });
      
      // Save all changes
      await session.save();
      await gameProgress.save();
      await user.save();
      
      console.log('Game session completed and progress updated');
      
      // Return the completion data - if this function is called directly by submitAnswer
      const completionData = {
        sessionId: session.sessionId,
        score: session.score,
        accuracy,
        correctAnswers,
        totalQuestions,
        timeSpent,
        level: gameProgress.level,
        points: gameProgress.points,
        highScore: gameProgress.highScore,
        completedSessions: gameProgress.completedSessions
      };
      
      // Only send response if res is defined and function is called directly (not through submitAnswer)
      if (res && !responseSent && (req.originalUrl || '').includes('/end')) {
        responseSent = true;
        res.status(200).json({
          success: true,
          data: completionData
        });
      }
      
      return completionData;
    } catch (progressError) {
      console.error('Error updating game progress:', progressError);
      
      // Save just the session status at minimum
      await session.save();
      
      // Return basic completion data
      const basicCompletionData = {
        sessionId: session.sessionId,
        score: session.score,
        accuracy,
        correctAnswers,
        totalQuestions,
        timeSpent
      };
      
      // Send basic response if this is a direct API call
      if (res && !responseSent && (req.originalUrl || '').includes('/end')) {
        responseSent = true;
        res.status(200).json({
          success: true,
          data: basicCompletionData,
          message: 'Game completed but progress update failed'
        });
      }
      
      return basicCompletionData;
    }
  } catch (error) {
    console.error('Error ending game session:', error);
    
    if (next && !responseSent) {
      return next(new ErrorResponse('Failed to end game session', 500));
    }
    
    // Return minimal data if we can't do anything else
    return {
      score: session?.score || 0,
      completed: true,
      error: 'Failed to process game completion'
    };
  }
});

// @desc    Get user game progress
// @route   GET /api/games/user/progress
// @access  Private
exports.getUserGameProgress = asyncHandler(async (req, res, next) => {
  try {
    // Find game progress records for this user
    const gameProgress = await GameProgress.find({ userId: req.user.id });
    
    if (!gameProgress || gameProgress.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          points: 0,
          level: 1,
          gameHistory: [],
          achievements: []
        }
      });
    }
    
    // Get user data for full profile
    const user = await User.findById(req.user.id);
    
    // Calculate total points and highest level
    const totalPoints = gameProgress.reduce((sum, progress) => sum + (progress.points || 0), 0);
    const highestLevel = Math.max(...gameProgress.map(progress => progress.level || 1));
    
    // Combine game history from all progress records
    const gameHistory = [];
    
    // Use user.progress.gameHistory if available (for backward compatibility)
    if (user && user.progress && Array.isArray(user.progress.gameHistory)) {
      gameHistory.push(...user.progress.gameHistory);
    } else {
      // Otherwise collect from GameProgress records
      gameProgress.forEach(progress => {
        if (progress.gameHistory && Array.isArray(progress.gameHistory)) {
          progress.gameHistory.forEach(history => {
            gameHistory.push({
              gameId: progress.gameId,
              score: history.score,
              accuracy: history.accuracy,
              correctAnswers: history.correctAnswers,
              totalQuestions: history.totalQuestions,
              completedAt: history.completedAt
            });
          });
        }
      });
    }
    
    // Sort game history by completion date (most recent first)
    gameHistory.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    res.status(200).json({
      success: true,
      data: {
        points: totalPoints,
        level: highestLevel,
        gameHistory: gameHistory,
        achievements: user?.progress?.achievements || []
      }
    });
  } catch (error) {
    console.error('Error fetching user game progress:', error);
    next(new ErrorResponse('Failed to fetch user game progress', 500));
  }
});

// @desc    Get user achievements
// @route   GET /api/games/user/achievements
// @access  Private
exports.getUserAchievements = asyncHandler(async (req, res, next) => {
  try {
    // Find user with achievements
    const user = await User.findById(req.user.id);
    
    if (!user || !user.progress || !user.progress.achievements) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    res.status(200).json({
      success: true,
      data: user.progress.achievements
    });
  } catch (error) {
    next(new ErrorResponse('Failed to fetch user achievements', 500));
  }
});

// @desc    Get user game history
// @route   GET /api/games/user/history
// @access  Private
exports.getUserGameHistory = asyncHandler(async (req, res, next) => {
  try {
    // Find user with game history
    const user = await User.findById(req.user.id);
    
    if (!user || !user.progress || !user.progress.gameHistory) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Sort by completion date (most recent first)
    const gameHistory = [...user.progress.gameHistory].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
    );
    
    res.status(200).json({
      success: true,
      data: gameHistory
    });
  } catch (error) {
    next(new ErrorResponse('Failed to fetch user game history', 500));
  }
});

// @desc    Get game leaderboard
// @route   GET /api/games/:id/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res, next) => {
  try {
    // Find game progress entries for this game
    const gameProgress = await GameProgress.find({ gameId: req.params.id })
      .sort({ highScore: -1 })
      .limit(10);
    
    if (!gameProgress || gameProgress.length === 0) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }
    
    // Get user data for each leaderboard entry
    const leaderboardWithUserData = await Promise.all(
      gameProgress.map(async (progress) => {
        const user = await User.findById(progress.userId).select('name profilePicture');
        return {
          userId: progress.userId,
          username: user ? user.name : 'Unknown Player',
          profilePicture: user ? user.profilePicture : 'default-avatar.png',
          score: progress.highScore || 0,
          level: progress.level || 1,
          bestAccuracy: progress.bestAccuracy || 0,
          completedSessions: progress.completedSessions || 0,
          lastPlayed: progress.lastPlayed
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: leaderboardWithUserData
    });
  } catch (error) {
    next(new ErrorResponse('Failed to fetch leaderboard', 500));
  }
});