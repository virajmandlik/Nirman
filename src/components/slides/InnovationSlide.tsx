
import { motion } from "framer-motion";
import { Sparkles, Gauge, LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const InnovationSlide = () => {
  const noveltyMetrics = [
    { name: "Personalization Accuracy", value: 85, baseline: 45 },
    { name: "Learning Engagement Increase", value: 70, baseline: 0 },
    { name: "AI-Driven Adaptive Learning", description: "First-of-its-kind Integrated Approach" }
  ];

  const technicalInnovations = [
    { title: "Machine Learning Algorithm", features: [
      "Adaptive Learning Path Generation",
      "Real-time Skill Assessment",
      "Personalized Content Recommendation"
    ]},
    { title: "Hybrid Learning Model", features: [
      "Combines Coding + Language Learning",
      "Multi-modal Learning Interfaces",
      "Context-Aware AI Assistance"
    ]}
  ];

  const marketScalability = [
    { metric: "Estimated Indian EdTech Market", value: "₹39,600 Crore (2024)" },
    { metric: "Target Segment", value: "15-35 Age Group Learners" },
    { metric: "Projected User Acquisition", value: "500,000 in First Year" },
    { metric: "Potential Annual Revenue", value: "₹75-100 Crore" }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="inline-block p-3 bg-purple-500/20 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Innovation & Creativity</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Breaking new ground with our innovative approach to learning technologies
          </p>
        </motion.div>

        <div className="grid gap-12">
          {/* Novelty Metrics */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <motion.h3 
              variants={item}
              className="text-2xl font-bold mb-6 text-center text-purple-300"
            >
              Novelty Metrics
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={item} className="space-y-6">
                {noveltyMetrics.slice(0, 2).map((metric, index) => (
                  <div key={index} className="bg-white/10 p-5 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-200">{metric.name}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-purple-300">{metric.value}%</span>
                        <span className="text-xs text-gray-400">vs {metric.baseline}% baseline</span>
                      </div>
                    </div>
                    <div className="relative pt-1">
                      <div className="flex mb-2 items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-900">
                            Progress
                          </span>
                        </div>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/20">
                        <div
                          style={{ width: `${metric.value}%` }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-500 to-pink-500"
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={item} className="bg-white/10 p-5 rounded-lg">
                <h4 className="text-lg font-semibold mb-3 text-purple-300">{noveltyMetrics[2].name}</h4>
                <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-4 rounded-lg border border-purple-500/20">
                  <p className="text-gray-200 text-lg">{noveltyMetrics[2].description}</p>
                  <div className="mt-4 flex gap-2">
                    <span className="px-2 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full">Industry First</span>
                    <span className="px-2 py-1 bg-pink-500/30 text-pink-200 text-xs rounded-full">Patent Pending</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* Technical Innovation */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <motion.h3 
              variants={item}
              className="text-2xl font-bold mb-6 text-center text-blue-300"
            >
              Technical Innovation
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              {technicalInnovations.map((tech, index) => (
                <motion.div key={index} variants={item}>
                  <Card className="bg-white/10 border-white/10 text-white hover:border-blue-500/40 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl text-blue-300">{tech.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tech.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Market Scalability */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h3 
              variants={item}
              className="text-2xl font-bold mb-6 text-center text-green-300"
            >
              Market Scalability
            </motion.h3>
            <motion.div variants={item} className="bg-white/10 p-6 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {marketScalability.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="mb-2 text-green-300 font-medium text-sm">{item.metric}</div>
                    <div className="text-lg font-bold">{item.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default InnovationSlide;
