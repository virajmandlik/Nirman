
import { motion } from "framer-motion";
import { User, Award, Code, Globe, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const KeyFeaturesSlide = () => {
  const features = [
    {
      icon: <User className="h-8 w-8 text-blue-400" />,
      title: "Personalized Content",
      color: "blue",
      points: [
        "AI-Based recommendation system tailors content to individual learning styles",
        "Personal user progress tracking with detailed analytics",
        "Real-time content adaptation based on performance metrics"
      ]
    },
    {
      icon: <Award className="h-8 w-8 text-green-400" />,
      title: "Gamification",
      color: "green",
      points: [
        "Skill-based challenge system with increasing difficulty levels",
        "Competitive leaderboards to compare progress with peers",
        "Achievement badges and reward system for learning milestones"
      ]
    },
    {
      icon: <Code className="h-8 w-8 text-purple-400" />,
      title: "Interactive Coding",
      color: "purple",
      points: [
        "Support for multiple programming languages with instant feedback",
        "Interactive coding environment with real-time results visualization",
        "Scaffolded exercises that build foundational skills progressively"
      ]
    },
    {
      icon: <Globe className="h-8 w-8 text-amber-400" />,
      title: "Multilingual LLM Assistant",
      color: "amber",
      points: [
        "Powered by Worqhat's advanced language models",
        "Context-aware coding assistance in multiple programming languages",
        "Natural language interactions for real-time learning support"
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getGradientClass = (color) => {
    const gradients = {
      blue: "from-blue-500/20 to-blue-700/20 border-blue-500/30",
      green: "from-green-500/20 to-green-700/20 border-green-500/30",
      purple: "from-purple-500/20 to-purple-700/20 border-purple-500/30",
      amber: "from-amber-500/20 to-amber-700/20 border-amber-500/30"
    };
    return gradients[color];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Key Features & Innovations</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Nirman's revolutionary approach combines four powerful pillars to transform digital learning
          </p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className={`bg-gradient-to-br ${getGradientClass(feature.color)} border backdrop-blur-sm hover:shadow-lg transition-all`}>
                <CardHeader className="flex flex-row items-center gap-3">
                  <div className={`bg-${feature.color}-500/30 p-2 rounded-full`}>
                    {feature.icon}
                  </div>
                  <CardTitle className={`text-${feature.color}-300 text-xl`}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.points.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className={`text-${feature.color}-400 mr-2`}>•</span>
                        <span className="text-black">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-3 bg-indigo-500/20 rounded-full">
            <MessageSquare className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold mt-3">
            Experience the future of learning with Nirman's integrated approach
          </h3>
        </motion.div>
      </div>
    </div>
  );
};

export default KeyFeaturesSlide;
