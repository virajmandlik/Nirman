import React, { useState, useEffect, useId } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, AlertCircle, Clock, Trophy } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Generate unique IDs for accessibility
  const confirmEndDialogId = useId();
  const completionDialogId = useId();
  
  const {
    currentGame,
    currentSession,
    currentQuestion,
    loading,
    error,
    timeRemaining,
    fetchGame,
    startGame,
    submitAnswer,
    endGame
  } = useGame();
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    pointsEarned: number;
    explanation: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [showConfirmEndDialog, setShowConfirmEndDialog] = useState<boolean>(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState<boolean>(false);
  const [gameResults, setGameResults] = useState<any>(null);
  
  // Load game on component mount
  useEffect(() => {
    let isMounted = true;
    
    if (gameId) {
      // Only fetch game if it's not already in state
      if (!currentGame || currentGame._id !== gameId) {
        fetchGame(gameId);
      }
    }
    
    // Cleanup function to handle component unmount
    return () => {
      isMounted = false;
    };
  }, [gameId]); // Remove fetchGame from dependencies to prevent infinite loop

  // Filter out duplicate API calls for the same game
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the page becomes visible again, we don't need to reload
      // the game data, as it's already loaded and cached
      if (document.visibilityState === 'visible' && currentGame) {
        console.log('Page is visible again, using cached game data');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentGame?._id]); // Only depend on game ID, not the entire game object
  
  // Reset question timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      setQuestionStartTime(Date.now());
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setAnswerResult(null);
    }
  }, [currentQuestion]);
  
  // Show game completion dialog when the session ends
  useEffect(() => {
    if (currentSession?.status === 'completed') {
      setShowCompletionDialog(true);
    }
  }, [currentSession]);
  
  // Start the game
  const handleStartGame = async () => {
    if (!gameId) return;
    
    try {
      await startGame(gameId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start the game. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionId);
  };
  
  // Submit answer
  const handleSubmitAnswer = async () => {
    if (!currentQuestion || !selectedOption) return;
    
    const timeTaken = Math.floor((Date.now() - questionStartTime) / 1000);
    
    try {
      // Process the answer based on the question type
      let processedAnswer: string | number | boolean = selectedOption;
      
      // Check if this is a boolean question with true/false options
      const isBooleanQuestion = currentQuestion.options.length === 2 && 
        currentQuestion.options.some(opt => ["true", "false", "True", "False"].includes(opt.text));
      
      if (isBooleanQuestion) {
        // Find the selected option
        const selectedOptionObj = currentQuestion.options.find(opt => opt.id === selectedOption);
        
        // Convert to boolean based on text
        if (selectedOptionObj) {
          const text = selectedOptionObj.text.toLowerCase();
          if (text === 'true') processedAnswer = true;
          else if (text === 'false') processedAnswer = false;
          else processedAnswer = parseInt(selectedOption); // Fallback to option index
        }
      } else {
        // Try to convert to number if the option ID is numeric
        // This helps with questions where the correctOption is an index
        const numericAnswer = parseInt(selectedOption);
        if (!isNaN(numericAnswer)) {
          processedAnswer = numericAnswer;
        }
      }
      
      console.log(`Submitting answer: ${selectedOption} (processed: ${processedAnswer})`);
      
      const result = await submitAnswer(
        currentQuestion.questionId,
        processedAnswer,
        timeTaken
      );
      
      console.log('Answer submission result:', result);
      
      // Log correctAnswers information to help debug
      if (result.correctAnswers !== undefined) {
        console.log(`Server reported ${result.correctAnswers} correct answers`);
      }
      
      setIsAnswerSubmitted(true);
      setAnswerResult({
        isCorrect: result.isCorrect,
        pointsEarned: result.pointsEarned || 0,
        explanation: result.explanation || "No explanation available"
      });
      
      // If the game is completed, store the results
      if (result.isCompleted) {
        console.log('Game completed, storing results:', result);
        
        // Ensure we have all the necessary data
        const gameCompletionData = {
          isCorrect: result.isCorrect,
          pointsEarned: result.pointsEarned || 0,
          totalScore: result.totalScore || result.score || 0,
          maxScore: result.maxScore || (currentSession?.totalQuestions || 5) * 10,
          correctAnswers: typeof result.correctAnswers === 'number' ? result.correctAnswers : 0,
          totalQuestions: result.totalQuestions || currentSession?.totalQuestions || 5,
          accuracy: result.accuracy || 0,
          timeSpent: result.timeSpent || 0,
          level: result.level,
          points: result.points
        };
        
        setGameResults(gameCompletionData);
        
        // Show the completion dialog immediately if this was the last question
        if (currentSession && 
            (currentSession.currentQuestionIndex === currentSession.totalQuestions - 1 ||
             result.currentQuestionIndex >= currentSession.totalQuestions)) {
          setShowCompletionDialog(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit your answer. Please try again.",
        variant: "destructive"
      });
      console.error("Answer submission error:", error);
    }
  };
  
  // Go to next question
  const handleNextQuestion = () => {
    // Add a loading state during transition
    if (!currentQuestion) {
      console.log('No current question available');
    }
    
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    setAnswerResult(null);
    
    // If the game is still active and we've moved to a new question index
    // the GameContext will have already updated currentQuestion
    if (!currentQuestion && currentSession && currentSession.status !== 'completed') {
      console.log('No next question available but session is still active. Ending game...');
      // If we don't have a current question but the session is still active,
      // it might be a synchronization issue - end the game or reload
      handleEndGame();
    }
  };
  
  // End game
  const handleEndGame = async () => {
    try {
      const result = await endGame();
      setGameResults(result);
      setShowCompletionDialog(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end the game. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Return to games list
  const handleReturnToGames = () => {
    navigate('/gamified-learning');
  };
  
  // Render functions
  const renderGameInfo = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{currentGame?.title}</CardTitle>
            <CardDescription>{currentGame?.description}</CardDescription>
          </div>
          <div className="flex flex-col items-end">
            <Badge variant="outline" className="mb-2">
              {currentGame?.category}
            </Badge>
            <Badge variant={
              currentGame?.difficulty === 'beginner' ? 'secondary' :
              currentGame?.difficulty === 'intermediate' ? 'default' : 'destructive'
            }>
              {currentGame?.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Time Limit:</span> {currentGame?.timeLimit} minutes
          </div>
          <div>
            <span className="font-medium">Questions:</span> {currentGame?.questions?.length || 0}
          </div>
          <div>
            <span className="font-medium">Tags:</span> {currentGame?.tags?.join(', ')}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleStartGame} className="w-full">Start Game</Button>
      </CardFooter>
    </Card>
  );
  
  const renderSessionProgress = () => {
    if (!currentSession) return null;
    
    const progressPercentage = (currentSession.currentQuestionIndex / currentSession.totalQuestions) * 100;
    
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">
            Question {currentSession.currentQuestionIndex + 1} of {currentSession.totalQuestions}
          </span>
          <span className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-1" /> {formatTime(timeRemaining)}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between mt-2">
          <span className="text-sm">
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
              <span className="font-semibold">Score: {currentSession.score || 0}</span>
            </div>
          </span>
          <span className="text-sm">
            {Math.round(progressPercentage)}% complete
          </span>
        </div>
      </div>
    );
  };
  
  const renderQuestion = () => {
    // Defensive check - don't render if we don't have a question or options
    if (!currentQuestion || !currentQuestion.options || !Array.isArray(currentQuestion.options)) {
      return (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Loading next question...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-300"></div>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Check if this is the last question
    const isLastQuestion = currentSession && 
      currentSession.currentQuestionIndex === currentSession.totalQuestions - 1;
    
    // Handle display of correct option
    // For boolean questions, we may have true/false options but numeric correctOption (0/1)
    const isBooleanQuestion = currentQuestion.options.length === 2 && 
      currentQuestion.options.some(opt => ["true", "false", "True", "False"].includes(opt.text));
    
    const getCorrectOptionId = () => {
      if (currentQuestion.correctOption === undefined) return null;
      
      if (isBooleanQuestion) {
        // For boolean questions, correctOption is likely 0 or 1
        // Map this to the corresponding option ID that represents true/false
        const boolIndex = typeof currentQuestion.correctOption === 'boolean' 
          ? (currentQuestion.correctOption ? 0 : 1) // If boolean, true=0, false=1
          : currentQuestion.correctOption; // If numeric, use as is
          
        return currentQuestion.options[boolIndex]?.id;
      }
      
      // For normal questions, find the option with matching ID
      const correctOption = currentQuestion.options.find((opt, index) => 
        currentQuestion.correctOption === index || 
        currentQuestion.correctOption?.toString() === opt.id
      );
      
      return correctOption?.id;
    };
    
    const correctOptionId = getCorrectOptionId();
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          <CardDescription>
            Points: {currentQuestion.points || 0} • Time limit: {currentQuestion.timeLimit || 60}s
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {currentQuestion.options.map((option) => {
              const isCorrect = option.id === correctOptionId;
              const isSelected = option.id === selectedOption;
              const showCorrect = isAnswerSubmitted && isCorrect;
              const showIncorrect = isAnswerSubmitted && isSelected && !isCorrect;
              
              let buttonVariant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" = "outline";
              if (isAnswerSubmitted) {
                if (showCorrect) buttonVariant = "secondary";
                else if (showIncorrect) buttonVariant = "destructive";
              } else if (isSelected) {
                buttonVariant = "default";
              }
              
              return (
                <Button
                  key={option.id}
                  variant={buttonVariant}
                  className={`w-full justify-start text-left p-4 ${
                    showCorrect ? "border-green-500" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={isAnswerSubmitted}
                >
                  {option.text}
                  {showCorrect && (
                    <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                  )}
                  {showIncorrect && (
                    <XCircle className="ml-auto h-5 w-5 text-red-500" />
                  )}
                </Button>
              );
            })}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowConfirmEndDialog(true)}
          >
            End Game
          </Button>
          {!isAnswerSubmitted ? (
            <Button 
              onClick={handleSubmitAnswer} 
              disabled={!selectedOption}
              className={isLastQuestion ? "bg-purple-600 hover:bg-purple-700" : ""}
            >
              {isLastQuestion ? "Submit Final Answer" : "Submit Answer"}
            </Button>
          ) : (
            <Button 
              onClick={isLastQuestion ? handleEndGame : handleNextQuestion}
              className={isLastQuestion ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"}
            >
              {isLastQuestion ? "Complete Test" : "Next Question"}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };
  
  const renderAnswerFeedback = () => {
    if (!answerResult || !isAnswerSubmitted) return null;
    
    // Check if this is the last question
    const isLastQuestion = currentSession && 
      currentSession.currentQuestionIndex === currentSession.totalQuestions - 1;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Alert variant={answerResult.isCorrect ? "default" : "destructive"} className="mb-4">
          <div className="flex items-center">
            {answerResult.isCorrect ? (
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 mr-2 text-red-500" />
            )}
            <AlertTitle>
              {answerResult.isCorrect ? "Correct!" : "Incorrect!"}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">
            <p>{answerResult.explanation}</p>
            <div className="mt-1 font-medium">
              {answerResult.isCorrect 
                ? (
                  <div className="flex items-center text-green-600">
                    <Trophy className="h-4 w-4 mr-1" />
                    You earned {answerResult.pointsEarned} points!
                  </div>
                ) 
                : "Keep learning and try again!"}
            </div>
            {currentSession && (
              <div className="mt-2 text-sm">
                Current score: {currentSession.score || 0} points
              </div>
            )}
            <div className="mt-4">
              <Button 
                onClick={isLastQuestion ? handleEndGame : handleNextQuestion}
                size="lg"
                className={`w-full ${
                  isLastQuestion 
                    ? "bg-green-700 hover:bg-green-800" 
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-semibold`}
              >
                {isLastQuestion ? "Complete Test" : "Next Question →"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  };
  
  // Loading state
  if (loading && !currentGame) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-64 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleReturnToGames} className="mt-4">
          Return to Games
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto p-4 max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {!currentSession ? (
        renderGameInfo()
      ) : (
        <>
          {renderSessionProgress()}
          {renderAnswerFeedback()}
          {renderQuestion()}
        </>
      )}
      
      {/* Confirm End Game Dialog */}
      <AlertDialog open={showConfirmEndDialog} onOpenChange={setShowConfirmEndDialog}>
        <AlertDialogContent aria-describedby={confirmEndDialogId}>
          <AlertDialogHeader>
            <AlertDialogTitle>End the game?</AlertDialogTitle>
            <AlertDialogDescription id={confirmEndDialogId}>
              Are you sure you want to end this game? Your current progress will be saved, but you won't be able to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEndGame}>End Game</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Game Completion Dialog */}
      <AlertDialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <AlertDialogContent aria-describedby={completionDialogId} className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
              Game Completed!
            </AlertDialogTitle>
            <AlertDialogDescription id={completionDialogId}>
              Congratulations! You've completed the game.
            </AlertDialogDescription>
            <div className="mt-4">
              {gameResults && (
                <div className="bg-muted/50 p-4 rounded-md">
                  <div className="font-semibold mb-2 text-base">Your Results</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>Final Score:</div>
                    <div className="font-medium">
                      {gameResults.totalScore !== undefined ? gameResults.totalScore : 
                       gameResults.score !== undefined ? gameResults.score : 0} points
                    </div>
                    
                    <div>Max Possible:</div>
                    <div className="font-medium">
                      {gameResults.maxScore || (currentGame?.questions?.length || 5) * 10} points
                    </div>
                    
                    <div>Correct Answers:</div>
                    <div className="font-medium">
                      {typeof gameResults.correctAnswers === 'number' ? gameResults.correctAnswers : 0} / {typeof gameResults.totalQuestions === 'number' ? gameResults.totalQuestions : (currentGame?.questions?.length || 5)}
                    </div>
                    
                    <div>Accuracy:</div>
                    <div className="font-medium">
                      {typeof gameResults.accuracy === 'number' ? gameResults.accuracy : 
                       (typeof gameResults.correctAnswers === 'number' && typeof gameResults.totalQuestions === 'number' && gameResults.totalQuestions > 0) 
                         ? Math.round((gameResults.correctAnswers / gameResults.totalQuestions) * 100) 
                         : 0}%
                    </div>
                    
                    <div>Time Spent:</div>
                    <div className="font-medium">
                      {gameResults.timeSpent ? formatTime(gameResults.timeSpent) : formatTime(Math.round((Date.now() - questionStartTime) / 1000))}
                    </div>
                    
                    {gameResults.level && (
                      <>
                        <div>Current Level:</div>
                        <div className="font-medium">
                          Level {gameResults.level}
                        </div>
                      </>
                    )}
                    
                    {gameResults.points !== undefined && (
                      <>
                        <div>Total Points:</div>
                        <div className="font-medium">
                          {gameResults.points} points
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Progress visualization */}
                  <div className="mt-4">
                    <div className="mb-1 text-xs">Score achieved:</div>
                    <Progress 
                      value={((gameResults.score || gameResults.totalScore || 0) / (gameResults.maxScore || (currentGame?.questions?.length || 5) * 10)) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <Button
              onClick={handleReturnToGames}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Return to Games
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default Game; 