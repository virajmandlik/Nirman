import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Trophy, Medal, Crown, Users } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

interface LeaderboardUser {
  userId: string;
  username: string;
  score: number;
  accuracyRate: number;
  timeSpent: number;
  dateCompleted: Date;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const Leaderboard: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { currentGame, leaderboard, loading, error, fetchGame, fetchLeaderboard } = useGame();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      if (gameId && !isLoading) {
        setIsLoading(true);
        try {
          await fetchGame(gameId);
          await fetchLeaderboard(gameId);
        } catch (error) {
          console.error("Error loading leaderboard data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    // Cleanup function to prevent memory leaks
    return () => {
      setIsLoading(false);
    };
  }, [gameId]);
  
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <span className="w-5 h-5 grid place-items-center font-semibold text-muted-foreground">{rank}</span>;
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-16 w-full mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/gamified-learning')} className="mt-4">
          Back to Games
        </Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      className="container mx-auto p-4 max-w-4xl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="h-7 w-7 mr-2 text-yellow-500" />
          Leaderboard
        </h1>
        {currentGame && (
          <p className="text-muted-foreground">
            Top players for {currentGame.title}
          </p>
        )}
      </div>
      
      {/* Game Info Card */}
      {currentGame && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle>{currentGame.title}</CardTitle>
            <CardDescription>{currentGame.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{currentGame.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Difficulty</p>
                <p className="font-medium">{currentGame.difficulty}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Questions</p>
                <p className="font-medium">{currentGame.questions?.length || 0}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Max Score</p>
                <p className="font-medium">{currentGame.maxScore || 0} points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Leaderboard Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg">
              <Users className="h-5 w-5 mr-2" />
              Top Players
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate(`/game/${gameId}`)}>
              Play Game
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leaderboard.length > 0 ? (
            <div className="space-y-3">
              {/* Table header */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 font-medium text-sm border-b">
                <div className="col-span-1">Rank</div>
                <div className="col-span-3">Player</div>
                <div className="col-span-2 text-right">Score</div>
                <div className="col-span-2 text-right">Accuracy</div>
                <div className="col-span-2 text-right">Time</div>
                <div className="col-span-2 text-right">Date</div>
              </div>
              
              {/* Leaderboard entries */}
              {leaderboard.map((entry, index) => (
                <motion.div
                  key={entry.userId}
                  className={`grid grid-cols-12 gap-2 px-4 py-3 rounded-md ${
                    index < 3 
                      ? 'bg-primary/5 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                  variants={itemVariants}
                >
                  <div className="col-span-1 flex items-center">
                    {getRankIcon(index + 1)}
                  </div>
                  <div className="col-span-3 font-medium">
                    {entry.username}
                  </div>
                  <div className="col-span-2 text-right">
                    {entry.score} pts
                  </div>
                  <div className="col-span-2 text-right">
                    {Math.round(entry.accuracyRate * 100)}%
                  </div>
                  <div className="col-span-2 text-right">
                    {formatTime(entry.timeSpent)}
                  </div>
                  <div className="col-span-2 text-right text-sm text-muted-foreground">
                    {new Date(entry.dateCompleted).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to complete this game and top the leaderboard!
              </p>
              <Button onClick={() => navigate(`/game/${gameId}`)}>
                Play Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Leaderboard; 