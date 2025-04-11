import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

const InspirationSlide = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Lightbulb className="w-16 h-16 mb-4 text-yellow-500" />
      <h2 className="text-3xl font-bold mb-4">
        Inspired by Real-World Challenges
      </h2>
      <p className="text-lg text-gray-400 mb-8 px-16 text-center">
        We aim to address the limitations of traditional education by creating
        a personalized and adaptive learning experience.
      </p>
      <motion.button
        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
        <ArrowRight className="w-5 h-5 ml-2" />
      </motion.button>
    </motion.div>
  );
};

export default InspirationSlide;
