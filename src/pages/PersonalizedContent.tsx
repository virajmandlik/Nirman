
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, LineChart, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const topics = [
  { id: 1, title: 'JavaScript Fundamentals', progress: 85, recommended: true },
  { id: 2, title: 'React Hooks', progress: 60, recommended: true },
  { id: 3, title: 'CSS Grid Layout', progress: 40, recommended: false },
  { id: 4, title: 'TypeScript Basics', progress: 20, recommended: true },
  { id: 5, title: 'Node.js API Development', progress: 10, recommended: false },
];

const activities = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 30 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 20 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 40 },
];

const PersonalizedContent = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      <Navbar
        currentSlide={1}
        totalSlides={4}
        onSlideChange={() => {}}
        title="Personalized Learning Experience"
      />
      
      <main className="flex-grow mt-16 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Your Personalized Learning Journey</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Nirman adapts to your unique learning style, progress, and goals using sophisticated AI algorithms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-2"
          >
            <Card className="h-full bg-white/10 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Recommended Topics</CardTitle>
                <User className="h-5 w-5 text-indigo-300" />
              </CardHeader>
              <CardContent>
                <p className="text-indigo-200 mb-6">Based on your learning patterns, we recommend:</p>
                
                <div className="space-y-4">
                  {topics.map(topic => (
                    <div 
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedTopicId === topic.id 
                          ? 'bg-indigo-600/40 border-indigo-400' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      } ${topic.recommended ? 'relative overflow-hidden' : ''}`}
                    >
                      {topic.recommended && (
                        <div className="absolute top-0 right-0">
                          <div className="bg-green-500 text-xs px-2 py-1 rounded-bl-md flex items-center">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Recommended
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium">{topic.title}</h3>
                        <span className="text-sm text-indigo-300">{topic.progress}% complete</span>
                      </div>
                      
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full" 
                          style={{ width: `${topic.progress}%` }}
                        ></div>
                      </div>
                      
                      {selectedTopicId === topic.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 pt-4 border-t border-indigo-500/30"
                        >
                          <p className="text-sm text-indigo-200 mb-3">
                            Our AI has identified this as an ideal next topic based on your previous learning patterns and career goals.
                          </p>
                          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            Continue Learning <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-white/10 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">Your Learning Analytics</CardTitle>
                <LineChart className="h-5 w-5 text-indigo-300" />
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-indigo-200 mb-2">Weekly Activity</h3>
                  <div className="flex items-end h-40 gap-1 pt-4">
                    {activities.map((item, i) => (
                      <div key={item.day} className="flex flex-col items-center flex-1">
                        <div 
                          className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t" 
                          style={{ height: `${(item.minutes / 90) * 100}%` }}
                        ></div>
                        <span className="text-xs mt-1 text-indigo-200">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-indigo-200 mb-3">Your Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Learning streak:</span>
                      <span className="font-medium">7 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total time this week:</span>
                      <span className="font-medium">335 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mastery level:</span>
                      <span className="font-medium">Intermediate</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-3 bg-indigo-500/20 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Continue your personalized learning journey
          </h3>
          <p className="text-indigo-200 mt-2 max-w-2xl mx-auto">
            Our AI continuously adapts to your progress, providing the most relevant content
            tailored specifically to your learning style and goals.
          </p>
          <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">
            Explore Personalized Path
          </Button>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PersonalizedContent;
