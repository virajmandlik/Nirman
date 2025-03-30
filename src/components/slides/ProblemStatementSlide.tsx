import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const ProblemStatementSlide = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-3xl font-bold mb-6">
        Addressing Key Challenges in Modern Education
      </h2>
      <div className="space-y-4 text-lg max-w-3xl">
        <p>
          <strong>Personalized Learning:</strong> Current educational platforms
          often fail to adapt to individual learning styles and paces, leading
          to disengagement and knowledge gaps.
        </p>
        <p>
          <strong>Accessibility:</strong> Many students lack access to quality
          educational resources due to geographical, economic, or physical
          constraints.
        </p>
        <p>
          <strong>Engagement:</strong> Traditional learning methods can be
          monotonous, resulting in decreased motivation and retention among
          students.
        </p>
        <p>
          <strong>Relevance:</strong> Educational content is not always aligned
          with real-world applications, making it difficult for students to see
          the value in what they are learning.
        </p>
      </div>
    </motion.div>
  );
};

export default ProblemStatementSlide;
