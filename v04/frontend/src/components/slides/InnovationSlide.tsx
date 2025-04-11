import { motion, useAnimation } from "framer-motion";
import { Sparkles, Gauge, LineChart, Rocket, Lightbulb, BarChart3, Zap, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";

const InnovationSlide = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  const noveltyMetrics = [
    { 
      name: "Personalization Accuracy", 
      value: 85, 
      baseline: 45,
      icon: <Gauge className="h-5 w-5" />,
      color: "purple"
    },
    { 
      name: "Learning Engagement Increase", 
      value: 70, 
      baseline: 0,
      icon: <LineChart className="h-5 w-5" />,
      color: "pink"
    },
    { 
      name: "AI-Driven Adaptive Learning", 
      description: "First-of-its-kind Integrated Approach",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "blue"
    }
  ];

  const technicalInnovations = [
    { 
      title: "Machine Learning Algorithm", 
      features: [
        "Adaptive Learning Path Generation",
        "Real-time Skill Assessment",
        "Personalized Content Recommendation"
      ],
      icon: <Rocket className="h-6 w-6" />,
      color: "blue"
    },
    { 
      title: "Hybrid Learning Model", 
      features: [
        "Combines Coding + Language Learning",
        "Multi-modal Learning Interfaces",
        "Context-Aware AI Assistance"
      ],
      icon: <Zap className="h-6 w-6" />,
      color: "amber"
    }
  ];

  const marketScalability = [
    { metric: "Estimated Indian EdTech Market", value: "₹39,600 Crore (2024)", icon: "📈" },
    { metric: "Target Segment", value: "15-35 Age Group Learners", icon: "🎯" },
    { metric: "Projected User Acquisition", value: "500,000 in First Year", icon: "🚀" },
    { metric: "Potential Annual Revenue", value: "₹75-100 Crore", icon: "💰" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 12
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  const techItem = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.4
      }
    })
  };

  const getColorClass = (color) => {
    const colors = {
      purple: {
        bg: "bg-gradient-to-br from-purple-900/30 to-purple-800/40",
        border: "border-purple-500/40",
        text: "text-purple-300",
        progressFrom: "from-purple-500",
        progressTo: "to-pink-500"
      },
      pink: {
        bg: "bg-gradient-to-br from-pink-900/30 to-pink-800/40",
        border: "border-pink-500/40",
        text: "text-pink-300",
        progressFrom: "from-pink-500",
        progressTo: "to-rose-500"
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-900/30 to-blue-800/40",
        border: "border-blue-500/40",
        text: "text-blue-300",
        progressFrom: "from-blue-500",
        progressTo: "to-cyan-500"
      },
      amber: {
        bg: "bg-gradient-to-br from-amber-900/30 to-amber-800/40",
        border: "border-amber-500/40",
        text: "text-amber-300",
        progressFrom: "from-amber-500",
        progressTo: "to-orange-500"
      }
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl relative">
        {/* Animated background elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-600 blur-3xl"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="mb-16 text-center relative"
        >
          <motion.div
            animate={{
              y: [0, -5, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-20"
          >
            <div className="w-64 h-64 rounded-full bg-purple-500 blur-3xl"></div>
          </motion.div>
          
          <div className="inline-flex items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Sparkles className="h-10 w-10 text-purple-400" />
            </motion.div>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Innovation & Market Potential
            </motion.h2>
          </div>
          <motion.p 
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Revolutionizing education through cutting-edge technology and data-driven learning
          </motion.p>
        </motion.div>

        <div className="grid gap-16 relative z-10">
          {/* Novelty Metrics */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h3 
              variants={item}
              className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300"
            >
              <div className="inline-flex items-center gap-3">
                <BarChart3 className="h-8 w-8" />
                <span>Novelty Metrics</span>
              </div>
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={item} className="space-y-6">
                {noveltyMetrics.slice(0, 2).map((metric, index) => {
                  const color = getColorClass(metric.color);
                  return (
                    <motion.div 
                      key={index}
                      variants={item}
                      whileHover="hover"
                      className={`${color.bg} ${color.border} backdrop-blur-sm rounded-xl border p-6 relative overflow-hidden`}
                    >
                      {/* Decorative glow */}
                      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-${metric.color}-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                      
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-2 rounded-lg ${color.bg.replace('bg-', 'bg-')} ${color.border}`}>
                          {metric.icon}
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${color.text}`}>{metric.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-2xl font-bold">{metric.value}%</span>
                            <span className="text-sm text-gray-400">vs {metric.baseline}% baseline</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-2 text-xs flex rounded-full bg-gray-700">
                          <div
                            style={{ width: `${metric.value}%` }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${color.progressFrom} ${color.progressTo}`}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>0%</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
              <motion.div variants={item}>
                {noveltyMetrics.slice(2).map((metric, index) => {
                  const color = getColorClass(metric.color);
                  return (
                    <motion.div
                      key={index}
                      variants={item}
                      whileHover="hover"
                      className={`${color.bg} ${color.border} backdrop-blur-sm rounded-xl border p-6 h-full flex flex-col`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`p-2 rounded-lg ${color.bg.replace('bg-', 'bg-')} ${color.border}`}>
                          {metric.icon}
                        </div>
                        <h4 className={`text-lg font-semibold ${color.text}`}>{metric.name}</h4>
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <div className={`p-6 rounded-lg bg-gradient-to-r ${color.bg.replace('bg-', 'bg-')} border ${color.border}`}>
                          <p className="text-gray-100 text-lg">{metric.description}</p>
                          <div className="mt-4 flex gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-purple-500/30 text-purple-200 text-xs rounded-full font-medium">Industry First</span>
                            <span className="px-3 py-1 bg-pink-500/30 text-pink-200 text-xs rounded-full font-medium">Patent Pending</span>
                            <span className="px-3 py-1 bg-blue-500/30 text-blue-200 text-xs rounded-full font-medium">AI-Powered</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </motion.section>

          {/* Technical Innovation */}
          <motion.section
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.h3 
              variants={item}
              className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-300"
            >
              <div className="inline-flex items-center gap-3">
                <Award className="h-8 w-8" />
                <span>Technical Innovation</span>
              </div>
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-6">
              {technicalInnovations.map((tech, index) => {
                const color = getColorClass(tech.color);
                return (
                  <motion.div 
                    key={index} 
                    variants={item}
                    whileHover="hover"
                    className={`${color.bg} ${color.border} backdrop-blur-sm rounded-xl border overflow-hidden`}
                  >
                    <Card className="bg-transparent border-none">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg ${color.bg.replace('bg-', 'bg-')} ${color.border}`}>
                            {tech.icon}
                          </div>
                          <CardTitle className={`text-2xl ${color.text}`}>{tech.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {tech.features.map((feature, idx) => (
                            <motion.li 
                              key={idx}
                              custom={idx}
                              variants={techItem}
                              initial="hidden"
                              animate={controls}
                              className="flex items-start gap-3 text-gray-200"
                            >
                              <span className={`${color.text} text-xl mt-0.5`}>•</span>
                              <span className="text-lg">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
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
              className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-300"
            >
              <div className="inline-flex items-center gap-3">
                <LineChart className="h-8 w-8" />
                <span>Market Scalability</span>
              </div>
            </motion.h3>
            <motion.div 
              variants={item}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 rounded-xl border border-emerald-500/30 backdrop-blur-sm p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketScalability.map((item, index) => (
    <motion.div 
      key={index}
      variants={item}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(74, 222, 128, 0.2)",
        borderColor: "rgba(16, 185, 129, 0.5)"
      }}
      className="text-center bg-gray-800/60 rounded-xl p-6 border border-gray-600 hover:border-emerald-400/60 transition-all backdrop-blur-sm"
    >
      <motion.div
        whileHover={{ scale: 1.2, rotate: 5 }}
        className="text-4xl mb-4"
      >
        {item.icon}
      </motion.div>
      <div className="text-emerald-300/90 font-medium text-sm mb-3 uppercase tracking-wider">
        {item.metric}
      </div>
      <div className="text-2xl font-bold text-white bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
        {item.value}
      </div>
      {/* Decorative glow on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500/10 to-transparent blur-md"></div>
      </div>
    </motion.div>
  ))}
              </div>
            </motion.div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="mt-20 text-center relative z-10"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600/40 to-purple-600/40 rounded-full border border-indigo-500/50 backdrop-blur-sm hover:shadow-indigo-500/20 hover:shadow-lg transition-all">
            <Rocket className="h-6 w-6 text-indigo-300 animate-pulse" />
            <span className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-100">
              Transforming Education Through Innovation
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InnovationSlide;