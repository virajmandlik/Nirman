
import { motion } from 'framer-motion';
import { Trophy, Gamepad2, ArrowRight, Code } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const languageGames = [
  { 
    id: 'html-css-js',
    title: 'Web Development Quest',
    description: 'Learn HTML, CSS, and JavaScript through interactive games and challenges',
    languages: ['HTML', 'CSS', 'JavaScript'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    level: 'Beginner',
    popularity: '96%'
  },
  { 
    id: 'mongodb-sql',
    title: 'Database Adventure',
    description: 'Master MongoDB and SQL by building your own database systems in a game environment',
    languages: ['MongoDB', 'SQL'],
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    level: 'Intermediate',
    popularity: '89%'
  },
  { 
    id: 'java-c-cpp',
    title: 'Core Programming Challenge',
    description: 'Become proficient in Java, C, and C++ by solving puzzles and building mini-games',
    languages: ['Java', 'C', 'C++'],
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    level: 'Advanced',
    popularity: '92%'
  }
];

const GamifiedLearning = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-900 via-green-800 to-emerald-900">
      <Navbar
        currentSlide={2}
        totalSlides={4}
        onSlideChange={() => {}}
        title="Gamified Learning Experience"
      />
      
      <main className="flex-grow mt-16 container mx-auto px-4 py-8">
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
          {languageGames.map((game, index) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full overflow-hidden border-green-400/20 bg-white/10 backdrop-blur-sm text-white hover:border-green-400/50 transition-all">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={game.image} 
                    alt={game.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">{game.title}</CardTitle>
                    <Trophy className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {game.languages.map(lang => (
                      <span 
                        key={lang} 
                        className="bg-green-700 text-green-100 text-xs px-2 py-1 rounded-full"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-green-100 mb-4">{game.description}</p>
                  
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-green-300">Level: {game.level}</span>
                    <span className="text-green-300">Popularity: {game.popularity}</span>
                  </div>
                  
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Start Playing <Gamepad2 className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-green-700/30 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Why Gamified Learning Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-300 mb-2">Increased Engagement</h3>
              <p className="text-green-100">Games make learning fun and engaging, leading to higher retention rates and better focus</p>
            </div>
            
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-300 mb-2">Practical Application</h3>
              <p className="text-green-100">Learn by doing in simulated environments that apply concepts in real-world scenarios</p>
            </div>
            
            <div className="bg-green-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-300 mb-2">Immediate Feedback</h3>
              <p className="text-green-100">Get instant feedback on your solutions, helping you learn from mistakes quickly</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-3 bg-green-500/20 rounded-full mb-4">
            <Code className="h-8 w-8 text-green-300" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Ready to level up your programming skills?
          </h3>
          <p className="text-green-200 mt-2 max-w-2xl mx-auto">
            Start your learning adventure today with our gamified approach to mastering programming languages
          </p>
          <Button className="mt-6 bg-green-600 hover:bg-green-700 text-white">
            Explore All Games <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GamifiedLearning;
