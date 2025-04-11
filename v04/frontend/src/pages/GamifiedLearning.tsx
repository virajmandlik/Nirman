import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Gamepad2, ArrowRight, Code, Award, Timer, ChevronLeft, CheckCircle, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useNavigate, useParams } from 'react-router-dom';
import { formatTime } from '@/lib/gameApi';

// Define the progress data type
interface UserProgress {
  points: number;
  level: number;
  gameHistory: Array<{
    gameId: string;
    category: string;
    title: string;
    score: number;
    maxScore: number;
    correctAnswers: number;
    totalQuestions: number;
    completedAt: string | Date;
  }>;
  achievements: Array<{
    name: string;
    description: string;
    category: string;
    earnedAt: string | Date;
  }>;
}

const GamifiedLearning = () => {
  const navigate = useNavigate();
  const { category } = useParams<{ category?: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    games, 
    loading, 
    error, 
    fetchGames,
    fetchUserProgress,
    userProgress: contextUserProgress
  } = useGame();
  
  // Create a local state for user progress
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isProgressLoading, setIsProgressLoading] = useState(false);
  
  useEffect(() => {
    // Update local state when context state changes
    if (contextUserProgress) {
      setUserProgress(contextUserProgress);
    }
  }, [contextUserProgress]);
  
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          console.log('Loading game data for user:', user.id);
          
          // First try to fetch games - use category parameter if available
          try {
            await fetchGames(category);
            console.log('Games loaded successfully', category ? `for category: ${category}` : 'for all categories');
          } catch (gamesError) {
            console.error('Error fetching games:', gamesError);
            toast({
              title: "Error",
              description: "Failed to load games. Please refresh the page.",
              variant: "destructive"
            });
          }
          
          // Then try to fetch user progress
          try {
            setIsProgressLoading(true);
            const progressData = await fetchUserProgress();
            console.log('User progress loaded:', progressData ? 'success' : 'no data');
            
            if (progressData) {
              setUserProgress(progressData);
            } else {
              console.log('No user progress data received');
            }
          } catch (progressError) {
            console.error('Error fetching user progress:', progressError);
            toast({
              title: "Notice",
              description: "Could not load your progress. Some features may be limited.",
              variant: "default"
            });
          } finally {
            setIsProgressLoading(false);
          }
        } catch (error) {
          console.error('General error loading data:', error);
        }
      };
      
      loadData();
    } else {
      console.log('No user logged in, skipping data loading');
    }
  }, [user, category]); // Added category as a dependency to reload when it changes
  
  // Group games by category
  const webDevGames = games.filter(game => game.category === 'webDevelopment');
  const databaseGames = games.filter(game => game.category === 'database');
  const coreProgGames = games.filter(game => game.category === 'coreProgramming');
  
  // Calculate category stats
  const getStats = (categoryGames) => {
    if (!categoryGames.length) return { count: 0, avgDifficulty: 'beginner' };
    
    const count = categoryGames.length;
    const difficultyMap = { beginner: 0, intermediate: 1, advanced: 2 };
    const avgDiffValue = categoryGames.reduce((sum, game) => sum + difficultyMap[game.difficulty], 0) / count;
    
    let avgDifficulty = 'beginner';
    if (avgDiffValue > 0.66 && avgDiffValue <= 1.33) avgDifficulty = 'intermediate';
    if (avgDiffValue > 1.33) avgDifficulty = 'advanced';
    
    return { count, avgDifficulty };
  };
  
  const webDevStats = getStats(webDevGames);
  const dbStats = getStats(databaseGames);
  const coreStats = getStats(coreProgGames);
  
  const gameCategories = [
    { 
      id: 'webDevelopment',
      title: 'Web Development',
      description: 'Learn HTML, CSS, and JavaScript through interactive quizzes and challenges',
      count: webDevStats.count,
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
      difficulty: webDevStats.avgDifficulty,
      icon: <Code className="h-5 w-5" />
    },
    { 
      id: 'database',
      title: 'Database Adventure',
      description: 'Master MongoDB and SQL by solving database challenges and query problems',
      count: dbStats.count,
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
      difficulty: dbStats.avgDifficulty,
      icon: <Trophy className="h-5 w-5" />
    },
    { 
      id: 'coreProgramming',
      title: 'Core Programming',
      description: 'Challenge yourself with Python and Java programming quiz games',
      count: coreStats.count,
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
      difficulty: coreStats.avgDifficulty,
      icon: <Award className="h-5 w-5" />
    }
  ];
  
  // Determine which games to display based on category
  const displayGames = category 
    ? games // If category is specified in URL, games are already filtered by fetchGames
    : games.slice(0, 3); // On main page, just show first 3 games
  
  // Get the current category data if we're on a category-specific page
  const currentCategory = category && gameCategories.find(cat => cat.id === category);
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/games/${categoryId}`);
  };
  
  const handleViewGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };
  
  // Function to render category-specific page
  const renderCategoryPage = () => {
    if (!currentCategory) return null;
    
    return (
      <>
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="text-green-300 hover:text-white hover:bg-green-700/30"
            onClick={() => navigate('/games')}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Categories
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{currentCategory.title}</h1>
          <p className="text-green-200">{currentCategory.description}</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-300"></div>
          </div>
        ) : games.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game) => (
              <Card key={game._id} className="bg-green-800/50 border-green-600/30">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">{game.title}</CardTitle>
                    <Badge className={
                      game.difficulty === 'beginner' ? 'bg-green-600' : 
                      game.difficulty === 'intermediate' ? 'bg-yellow-600' : 
                      'bg-red-600'
                    }>
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-green-300">
                    {game.category === 'webDevelopment' ? 'Web Development' : 
                     game.category === 'database' ? 'Database' : 
                     'Core Programming'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 mb-4">{game.description}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-green-300 flex items-center">
                      <Timer className="h-4 w-4 mr-1" /> 
                      {formatTime(game.timeLimit)}
                    </span>
                    <span className="text-green-300 flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      {game.maxScore} pts
                    </span>
                  </div>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleViewGame(game._id)}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-green-800/20 rounded-lg border border-green-700/50">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-medium text-white mb-2">No Games Found</h3>
            <p className="text-green-200 max-w-md mx-auto">
              We don't have any games in this category yet. Check back soon for new additions!
            </p>
          </div>
        )}
      </>
    );
  };
  
  // Function to render the main games page
  const renderMainPage = () => (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Learn Programming Through Play</h1>
        <p className="text-xl text-green-200 max-w-2xl mx-auto">
          Transform your learning journey into an exciting adventure with game-based education
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {gameCategories.map((category, index) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="h-full overflow-hidden border-green-400/20 bg-white/10 backdrop-blur-sm text-white hover:border-green-400/50 transition-all">
              <div className="h-48 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <Badge className={
                    category.difficulty === 'beginner' ? 'bg-green-600' : 
                    category.difficulty === 'intermediate' ? 'bg-yellow-600' : 
                    'bg-red-600'
                  }>
                    {category.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-green-200">
                  {category.count} games available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-green-100 mb-4">{category.description}</p>
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  Browse Games <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Add User Progress Section */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-green-800/40 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Your Learning Progress</h2>
          
          {isProgressLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-300"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="bg-green-900/50 border-green-600/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Current Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-300 flex items-center">
                      <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
                      {userProgress?.level || 1}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-900/50 border-green-600/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Total Points</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-300">
                      {userProgress?.points || 0}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-green-900/50 border-green-600/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Games Played</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-300">
                      {userProgress?.gameHistory?.length || 0}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {userProgress?.gameHistory && userProgress.gameHistory.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-3">Recent Activity</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {userProgress.gameHistory.slice(0, 3).map((game, index) => (
                      <div key={index} className="bg-green-700/20 rounded-md p-3 flex justify-between items-center">
                        <div>
                          <div className="font-medium text-white">{game.title}</div>
                          <div className="text-sm text-green-300">
                            Score: {game.score}/{game.maxScore} • {game.correctAnswers}/{game.totalQuestions} correct
                          </div>
                        </div>
                        <Badge className="ml-2 bg-green-600">
                          {new Date(game.completedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-green-200">
                  No games played yet. Start playing to see your progress!
                </div>
              )}
            </>
          )}
        </motion.div>
      )}
      
      {/* Global Leaderboard Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-green-700/20 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm mb-12"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Leaderboard Rankings</h2>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-green-600/30 text-white border-green-500/50 hover:bg-green-600/50"
            onClick={() => navigate('/achievements')}
          >
            View All Achievements
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-300"></div>
          </div>
        ) : (
          <>
            {/* Leaderboard table */}
            <div className="overflow-hidden rounded-lg border border-green-600/30 bg-green-800/50">
              <div className="grid grid-cols-12 gap-2 p-4 font-medium text-green-200 border-b border-green-600/30">
                <div className="col-span-1">Rank</div>
                <div className="col-span-4">Player</div>
                <div className="col-span-2 text-right">Level</div>
                <div className="col-span-3 text-right">Total Score</div>
                <div className="col-span-2 text-right">Games</div>
              </div>
              
              {/* If we have user progress data, create a simulated leaderboard */}
              {userProgress ? (
                <div className="divide-y divide-green-600/20">
                  {/* Simulated top players - in a real app, this would come from an API */}
                  <div className="grid grid-cols-12 gap-2 p-4 bg-yellow-500/10">
                    <div className="col-span-1 flex items-center">
                      <Crown className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="col-span-4 font-medium text-white">AlphaCoderX</div>
                    <div className="col-span-2 text-right">{Math.max(userProgress.level + 3, 10)}</div>
                    <div className="col-span-3 text-right">{Math.max(userProgress.points * 3, 15000)} pts</div>
                    <div className="col-span-2 text-right">42</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-2 p-4">
                    <div className="col-span-1 flex items-center">
                      <div className="w-5 h-5 grid place-items-center rounded-full bg-gray-300 text-gray-800 font-bold text-xs">2</div>
                    </div>
                    <div className="col-span-4 font-medium text-white">CodeMaster99</div>
                    <div className="col-span-2 text-right">{Math.max(userProgress.level + 2, 8)}</div>
                    <div className="col-span-3 text-right">{Math.max(userProgress.points * 2, 12000)} pts</div>
                    <div className="col-span-2 text-right">38</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-2 p-4">
                    <div className="col-span-1 flex items-center">
                      <div className="w-5 h-5 grid place-items-center rounded-full bg-amber-700 text-amber-100 font-bold text-xs">3</div>
                    </div>
                    <div className="col-span-4 font-medium text-white">JavaScriptWizard</div>
                    <div className="col-span-2 text-right">{Math.max(userProgress.level + 1, 7)}</div>
                    <div className="col-span-3 text-right">{Math.max(userProgress.points * 1.5, 9800)} pts</div>
                    <div className="col-span-2 text-right">31</div>
                  </div>
                  
                  {/* Current user's position */}
                  <div className="grid grid-cols-12 gap-2 p-4 bg-green-600/20 border-l-4 border-green-500">
                    <div className="col-span-1 flex items-center">
                      <div className="w-5 h-5 grid place-items-center rounded-full bg-green-600 text-white font-bold text-xs">4</div>
                    </div>
                    <div className="col-span-4 font-medium text-white">{user?.name || 'You'}</div>
                    <div className="col-span-2 text-right">{userProgress.level}</div>
                    <div className="col-span-3 text-right">{userProgress.points} pts</div>
                    <div className="col-span-2 text-right">{userProgress.gameHistory?.length || 0}</div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-2 p-4">
                    <div className="col-span-1 flex items-center">
                      <div className="w-5 h-5 grid place-items-center font-semibold text-green-400">5</div>
                    </div>
                    <div className="col-span-4 font-medium text-white">ReactTrailblazer</div>
                    <div className="col-span-2 text-right">{Math.max(userProgress.level - 1, 4)}</div>
                    <div className="col-span-3 text-right">{Math.max(userProgress.points * 0.8, 7500)} pts</div>
                    <div className="col-span-2 text-right">25</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-green-400" />
                  <h3 className="text-lg font-semibold mb-2 text-white">Join the competition!</h3>
                  <p className="text-green-300 mb-6 max-w-md mx-auto">
                    Complete games and earn points to see your ranking on the leaderboard.
                  </p>
                  <Button 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => navigate('/games')}
                  >
                    Start Playing
                  </Button>
                </div>
              )}
            </div>
            
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-green-300 hover:text-white"
                onClick={() => navigate('/achievements')}
              >
                View Your Achievements
              </Button>
            </div>
          </>
        )}
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-green-700/30 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm mb-12"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Featured Games</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-300"></div>
          </div>
        ) : displayGames.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayGames.map((game) => (
              <Card key={game._id} className="bg-green-800/50 border-green-600/30">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg text-white">{game.title}</CardTitle>
                    <Badge className={
                      game.difficulty === 'beginner' ? 'bg-green-600' : 
                      game.difficulty === 'intermediate' ? 'bg-yellow-600' : 
                      'bg-red-600'
                    }>
                      {game.difficulty}
                    </Badge>
                  </div>
                  <CardDescription className="text-green-300">
                    {game.category === 'webDevelopment' ? 'Web Development' : 
                     game.category === 'database' ? 'Database' : 
                     'Core Programming'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-green-300 flex items-center">
                      <Timer className="h-4 w-4 mr-1" /> 
                      {formatTime(game.timeLimit)}
                    </span>
                    <span className="text-green-300 flex items-center">
                      <Trophy className="h-4 w-4 mr-1" />
                      {game.maxScore} pts
                    </span>
                  </div>
                  
                  <Button 
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleViewGame(game._id)}
                  >
                    Play Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-green-200 text-center py-4">No games available yet. Please check back soon!</p>
        )}
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4">
          <Gamepad2 className="h-8 w-8 text-green-300" />
        </div>
        <h3 className="text-xl font-bold text-white">
          Ready to level up your programming skills?
        </h3>
        <p className="text-green-200 mt-2 max-w-2xl mx-auto">
          Start your learning adventure today with our gamified approach to mastering programming languages
        </p>
        <Button 
          className="mt-6 bg-green-600 hover:bg-green-700 text-white"
          onClick={() => navigate('/games')}
        >
          Explore All Games <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-900 via-green-800 to-emerald-900">
      <Navbar
        currentSlide={2}
        totalSlides={4}
        onSlideChange={() => {}}
        title={category && currentCategory ? `${currentCategory.title} Games` : "Gamified Learning Experience"}
      />
      
      <main className="flex-grow mt-16 container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-md text-red-100">
            {error}
          </div>
        )}
        
        {category ? renderCategoryPage() : renderMainPage()}
      </main>
      
      <Footer />
    </div>
  );
};

export default GamifiedLearning;
