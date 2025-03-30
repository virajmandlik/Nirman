
import { motion } from "framer-motion";
import { Code, Languages, BrainCircuit } from "lucide-react";

const TitleSlide = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6 max-w-4xl"
      >
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="bg-white/20 p-4 rounded-full">
            <Code className="h-10 w-10" />
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Languages className="h-10 w-10" />
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <BrainCircuit className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Nirman
        </h1>
        <motion.h2 
          className="text-xl md:text-3xl font-medium text-indigo-200 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Revolutionizing Coding & Language Education
        </motion.h2>

        <motion.div 
          className="flex flex-wrap justify-center gap-4 text-sm md:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-white/10 px-4 py-2 rounded-full">AI-Powered Personalization</div>
          <div className="bg-white/10 px-4 py-2 rounded-full">Gamified Learning</div>
          <div className="bg-white/10 px-4 py-2 rounded-full">Interactive Coding</div>
          <div className="bg-white/10 px-4 py-2 rounded-full">Multilingual LLM Assistant</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TitleSlide;
