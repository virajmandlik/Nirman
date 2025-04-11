
import { motion } from "framer-motion";
import { Server, Database, Cloud, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TechStackSlide = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="container mx-auto p-8 flex flex-col items-center"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Technology Stack Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Frontend Card */}
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" /> Frontend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>React</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>shadcn-ui</li>
            </ul>
          </CardContent>
        </Card>

        {/* Backend Card */}
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" /> Backend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>Node.js</li>
              <li>Express</li>
              <li>RESTful APIs</li>
              <li>Worqhat APIs</li>
            </ul>
          </CardContent>
        </Card>

        {/* Database Card */}
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" /> Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>MongoDB</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cloud Services Card */}
        <Card className="bg-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" /> Cloud Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5">
              <li>AWS</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default TechStackSlide;
