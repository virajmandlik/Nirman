import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Award, Trophy, Star, CheckCircle } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Define achievement categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'webDevelopment', label: 'Web Development' },
  { id: 'database', label: 'Database' },
  { id: 'coreProgramming', label: 'Core Programming' },
  { id: 'general', label: 'General' }
];

// Determine icon based on achievement rarity
const getAchievementIcon = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return <CheckCircle className="h-8 w-8 text-blue-500" />;
    case 'uncommon':
      return <Award className="h-8 w-8 text-green-500" />;
    case 'rare':
      return <Trophy className="h-8 w-8 text-yellow-500" />;
    case 'legendary':
      return <Star className="h-8 w-8 text-purple-500" />;
    default:
      return <Award className="h-8 w-8 text-blue-500" />;
  }
};

// Get color based on achievement tier
const getTierColor = (tier: string) => {
  switch (tier) {
    case 'bronze':
      return 'bg-amber-700/20 text-amber-700 dark:bg-amber-700/30 dark:text-amber-400';
    case 'silver':
      return 'bg-slate-400/20 text-slate-700 dark:bg-slate-400/30 dark:text-slate-300';
    case 'gold':
      return 'bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/30 dark:text-yellow-400';
    case 'platinum':
      return 'bg-blue-500/20 text-blue-700 dark:bg-blue-500/30 dark:text-blue-400';
    case 'diamond':
      return 'bg-purple-500/20 text-purple-700 dark:bg-purple-500/30 dark:text-purple-400';
    default:
      return 'bg-slate-400/20 text-slate-700 dark:bg-slate-400/30 dark:text-slate-300';
  }
};

interface Achievement {
  name: string;
  description: string;
  category: string;
  isEarned: boolean;
  earnedAt?: Date;
  tier?: string;
  rarity?: string;
  pointsAwarded?: number;
}

const Achievements: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { achievements, loading, error, fetchAchievements, userProgress } = useGame();
  const [activeTab, setActiveTab] = useState('all');
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [generatedAchievements, setGeneratedAchievements] = useState<Achievement[]>([]);
  
  // Fetch achievements on component mount - only once
  useEffect(() => {
    if (!hasInitialized) {
      setHasInitialized(true);
      fetchAchievements();
    }
  }, [hasInitialized, fetchAchievements]);
  
  // Generate placeholder achievements based on game history
  useEffect(() => {
    if (userProgress && (!achievements || achievements.length === 0)) {
      const gameHistory = userProgress.gameHistory || [];
      const points = userProgress.points || 0;
      const gamesPlayed = gameHistory.length;
      
      const placeholderAchievements: Achievement[] = [
        // Generated based on games played
        {
          name: "Learning Explorer",
          description: "Started your learning journey by playing your first game.",
          category: "general",
          isEarned: gamesPlayed > 0,
          earnedAt: gamesPlayed > 0 ? new Date() : undefined,
          tier: "bronze",
          rarity: "common",
          pointsAwarded: 10
        },
        {
          name: "Dedicated Learner",
          description: "Completed 5 or more games in total.",
          category: "general",
          isEarned: gamesPlayed >= 5,
          earnedAt: gamesPlayed >= 5 ? new Date() : undefined,
          tier: "silver",
          rarity: "uncommon",
          pointsAwarded: 25
        },
        {
          name: "Learning Master",
          description: "Completed 10 or more games in total.",
          category: "general",
          isEarned: gamesPlayed >= 10,
          earnedAt: gamesPlayed >= 10 ? new Date() : undefined,
          tier: "gold",
          rarity: "rare",
          pointsAwarded: 50
        },
        {
          name: "Point Gatherer",
          description: "Earned at least 50 points across all games.",
          category: "general",
          isEarned: points >= 50,
          earnedAt: points >= 50 ? new Date() : undefined,
          tier: "silver",
          rarity: "uncommon",
          pointsAwarded: 20
        },
        {
          name: "Knowledge Champion",
          description: "Earned at least 100 points across all games.",
          category: "general",
          isEarned: points >= 100,
          earnedAt: points >= 100 ? new Date() : undefined,
          tier: "gold",
          rarity: "rare",
          pointsAwarded: 50
        },
      ];
      
      // Add category-specific achievements
      const webDevGames = gameHistory.filter(g => g.category === 'webDevelopment').length;
      const dbGames = gameHistory.filter(g => g.category === 'database').length;
      const coreGames = gameHistory.filter(g => g.category === 'coreProgramming').length;
      
      if (webDevGames > 0) {
        placeholderAchievements.push({
          name: "Web Novice",
          description: "Completed your first Web Development game.",
          category: "webDevelopment",
          isEarned: true,
          earnedAt: new Date(),
          tier: "bronze",
          rarity: "common",
          pointsAwarded: 15
        });
      }
      
      if (webDevGames >= 3) {
        placeholderAchievements.push({
          name: "Front-End Developer",
          description: "Completed 3 or more Web Development games.",
          category: "webDevelopment",
          isEarned: true,
          earnedAt: new Date(),
          tier: "silver",
          rarity: "uncommon",
          pointsAwarded: 30
        });
      }
      
      if (dbGames > 0) {
        placeholderAchievements.push({
          name: "Data Explorer",
          description: "Completed your first Database game.",
          category: "database",
          isEarned: true,
          earnedAt: new Date(),
          tier: "bronze",
          rarity: "common",
          pointsAwarded: 15
        });
      }
      
      if (dbGames >= 3) {
        placeholderAchievements.push({
          name: "Database Administrator",
          description: "Completed 3 or more Database games.",
          category: "database",
          isEarned: true,
          earnedAt: new Date(),
          tier: "silver",
          rarity: "uncommon",
          pointsAwarded: 30
        });
      }
      
      if (coreGames > 0) {
        placeholderAchievements.push({
          name: "Algorithm Apprentice",
          description: "Completed your first Core Programming game.",
          category: "coreProgramming",
          isEarned: true,
          earnedAt: new Date(),
          tier: "bronze",
          rarity: "common",
          pointsAwarded: 15
        });
      }
      
      if (coreGames >= 3) {
        placeholderAchievements.push({
          name: "Coding Craftsman",
          description: "Completed 3 or more Core Programming games.",
          category: "coreProgramming",
          isEarned: true,
          earnedAt: new Date(),
          tier: "silver",
          rarity: "uncommon",
          pointsAwarded: 30
        });
      }
      
      // Add coding fact achievements (always locked to discover)
      const codingFacts = [
        {
          name: "AI Visionary",
          description: "Did you know? The term 'Artificial Intelligence' was first coined in 1956 at the Dartmouth Conference.",
          category: "general",
          isEarned: false,
          tier: "platinum",
          rarity: "legendary",
          pointsAwarded: 100
        },
        {
          name: "Web Pioneer",
          description: "Did you know? The first website was published on August 6, 1991, by British physicist Tim Berners-Lee.",
          category: "webDevelopment",
          isEarned: false,
          tier: "gold",
          rarity: "rare",
          pointsAwarded: 50
        },
        {
          name: "Database Oracle",
          description: "Did you know? The relational database model was proposed by E.F. Codd in 1970 while working for IBM.",
          category: "database",
          isEarned: false,
          tier: "gold",
          rarity: "rare",
          pointsAwarded: 50
        },
        {
          name: "Python Master",
          description: "Did you know? Python was created as a hobby project by Guido van Rossum over the Christmas holiday in 1989.",
          category: "coreProgramming",
          isEarned: false,
          tier: "gold",
          rarity: "rare",
          pointsAwarded: 50
        },
        {
          name: "Machine Learning Pioneer",
          description: "Did you know? The term 'Machine Learning' was first coined by Arthur Samuel in 1959 while at IBM.",
          category: "general",
          isEarned: false,
          tier: "diamond",
          rarity: "legendary",
          pointsAwarded: 75
        },
      ];
      
      setGeneratedAchievements([...placeholderAchievements, ...codingFacts]);
    }
  }, [userProgress, achievements]);
  
  // Use generated achievements if no real ones exist
  const displayAchievements = achievements && achievements.length > 0 ? achievements : generatedAchievements;
  
  // Filter achievements when active tab or achievements change
  useEffect(() => {
    if (displayAchievements && displayAchievements.length > 0) {
      if (activeTab === 'all') {
        setFilteredAchievements(displayAchievements);
      } else {
        setFilteredAchievements(displayAchievements.filter(a => a.category === activeTab));
      }
    } else {
      setFilteredAchievements([]);
    }
  }, [activeTab, displayAchievements]);
  
  // Calculate achievement stats
  const earnedCount = displayAchievements?.filter(a => a.isEarned).length || 0;
  const totalCount = displayAchievements?.length || 0;
  const earnedPercentage = totalCount > 0 ? Math.round((earnedCount / totalCount) * 100) : 0;
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <Skeleton className="h-12 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2" />
        </div>
        <Skeleton className="h-10 w-full mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="h-48" />
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
        <h1 className="text-3xl font-bold">Achievements</h1>
        <p className="text-muted-foreground">
          Showcase your learning journey with earned achievements.
        </p>
      </div>
      
      {/* Achievement Progress Summary */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            Your journey so far...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
              <span className="text-3xl font-bold">{earnedCount}</span>
              <span className="text-sm text-muted-foreground">Earned</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
              <span className="text-3xl font-bold">{totalCount}</span>
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
              <span className="text-3xl font-bold">{earnedPercentage}%</span>
              <span className="text-sm text-muted-foreground">Completion</span>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-4 bg-primary/10 rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${earnedPercentage}%` }}
            ></div>
          </div>
          
          {/* Game stats summary if available */}
          {userProgress && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{userProgress.points}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">Level {userProgress.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{userProgress.gameHistory?.length || 0}</div>
                <div className="text-sm text-muted-foreground">Games Completed</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Achievement Categories Tabs */}
      <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4 flex flex-wrap">
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    variants={itemVariants}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className={`border-2 ${achievement.isEarned ? 'border-primary/50' : 'border-muted'} ${!achievement.isEarned ? 'opacity-75' : ''}`}>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {getAchievementIcon(achievement.rarity || 'common')}
                            </div>
                            <div>
                              <CardTitle className="text-lg font-bold">
                                {achievement.name}
                              </CardTitle>
                              <CardDescription>
                                {category.id === 'all' ? achievement.category : ''}
                              </CardDescription>
                            </div>
                          </div>
                          {achievement.tier && (
                            <Badge className={getTierColor(achievement.tier)}>
                              {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-2">{achievement.description}</p>
                        <div className="flex justify-between items-center mt-4">
                          {achievement.isEarned ? (
                            <Badge variant="outline" className="text-green-500 bg-green-50 dark:bg-green-950/50">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Earned
                              {achievement.earnedAt && (
                                <span className="ml-1">
                                  {new Date(achievement.earnedAt).toLocaleDateString()}
                                </span>
                              )}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500 bg-gray-50 dark:bg-gray-950/50">
                              Locked
                            </Badge>
                          )}
                          {achievement.pointsAwarded && (
                            <span className="text-xs text-muted-foreground">
                              {achievement.pointsAwarded} points
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 text-center p-6">
                  <Trophy className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-1">No achievements found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all' 
                      ? "You haven't earned any achievements yet. Start playing games to earn achievements!"
                      : `You haven't earned any achievements in this category yet.`
                    }
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate('/gamified-learning')}
                  >
                    Browse Games
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </motion.div>
  );
};

export default Achievements;

 