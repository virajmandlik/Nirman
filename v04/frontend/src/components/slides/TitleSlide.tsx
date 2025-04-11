import { motion } from "framer-motion";
import { Code, Languages, BrainCircuit } from "lucide-react";

const TitleSlide = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-white relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1508780709619-79562169bc64')",
      }}
    >
      {/* Proper gradient overlay */}
      <div className="absolute inset-0 bg-black opacity-75 z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        {/* Icon Row */}
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

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Nirman</h1>

        {/* Subtitle */}
        <motion.h2
          className="text-xl md:text-3xl font-medium text-indigo-200 mb-12"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Building the Future of Adaptive Learning
        </motion.h2>

        {/* Feature Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-black/70 px-4 py-2 rounded-full">AI-Powered Personalization</div>
          <div className="bg-black/70 px-4 py-2 rounded-full">Gamified Learning</div>
          <div className="bg-black/70 px-4 py-2 rounded-full">Interactive Coding</div>
          <div className="bg-black/70 px-4 py-2 rounded-full">Multilingual LLM Assistant</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TitleSlide;
