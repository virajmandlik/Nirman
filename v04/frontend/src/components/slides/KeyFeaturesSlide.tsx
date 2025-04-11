import { motion } from "framer-motion";
import { User, Code, Award, Globe } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <User className="w-6 h-6" />,
      title: "Personalized Content",
      highlights: [
        "Tailored content delivery based on individual learning patterns",
        "Detailed progress tracking with actionable analytics",
        "Dynamic content adaptation responding to performance"
      ],
      color: "text-blue-400"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Interactive Coding",
      highlights: [
        "Multi-language support with immediate feedback",
        "Real-time coding environment with visual output",
        "Structured skill-building exercises"
      ],
      color: "text-purple-400"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Gamification",
      highlights: [
        "Adaptive challenge system scaling with skill",
        "Social leaderboards for peer comparison",
        "Reward ecosystem celebrating milestones"
      ],
      color: "text-green-400"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multilingual LLM Assistant",
      highlights: [
        "Advanced language model integration",
        "Context-aware programming support",
        "Conversational learning interface"
      ],
      color: "text-amber-400"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Learning Platform Features</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Modern educational tools designed for effective skill development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800 rounded-xl border border-gray-700 hover:border-blue-500 transition-all"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`p-2 rounded-lg bg-gray-700 ${feature.color} mr-4`}>
                    {feature.icon}
                  </div>
                  <h2 className={`text-2xl font-bold ${feature.color}`}>{feature.title}</h2>
                </div>
                
                <ul className="space-y-3 pl-2">
                  {feature.highlights.map((highlight, idx) => (
                    <motion.li 
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 + 0.5 }}
                      className="flex items-start text-gray-300"
                    >
                      <span className={`${feature.color} mr-2 mt-1`}>•</span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 text-center"
        >
         <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full border border-indigo-500/40 backdrop-blur-sm">
            
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-200">
              Experience the future of learning with Nirman's integrated approach
            </h3>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesSection;