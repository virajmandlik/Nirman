import { motion } from "framer-motion";
import { AlertTriangle, Lightbulb, Globe, TrendingUp, Target } from "lucide-react";

const ProblemStatementSlide = () => {
  const problems = [
    {
      title: "Personalized Learning",
      description: "Current educational platforms often fail to adapt to individual learning styles and paces, leading to disengagement and knowledge gaps.",
      icon: <Lightbulb className="w-8 h-8 text-yellow-400" />
    },
    {
      title: "Accessibility",
      description: "Many students lack access to quality educational resources due to geographical, economic, or physical constraints.",
      icon: <Globe className="w-8 h-8 text-blue-400" />
    },
    {
      title: "Engagement",
      description: "Traditional learning methods can be monotonous, resulting in decreased motivation and retention among students.",
      icon: <TrendingUp className="w-8 h-8 text-green-400" />
    },
    {
      title: "Relevance",
      description: "Educational content is not always aligned with real-world applications, making it difficult for students to see the value in what they are learning.",
      icon: <Target className="w-8 h-8 text-red-400" />
    }
  ];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8"
      >
        <AlertTriangle className="w-20 h-20 text-red-500" />
      </motion.div>
      
      <motion.h2 
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-300"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Addressing Key Challenges in Modern Education
      </motion.h2> <br />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
        {problems.map((problem, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-yellow-400 transition-all duration-300"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)" }}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gray-700 rounded-lg">
                {problem.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-yellow-400">{problem.title}</h3>
                <p className="text-gray-300">{problem.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        className="mt-12 text-gray-400 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        
      </motion.div>
    </motion.div>
  );
};

export default ProblemStatementSlide;