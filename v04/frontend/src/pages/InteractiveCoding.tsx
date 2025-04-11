"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Code, Play, ArrowRight, Laptop } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { runWithJudge0 } from "./api";

const languages = [
  { id: "javascript", name: "JavaScript", icon: "📜" },
  { id: "python", name: "Python", icon: "🐍" },
  { id: "java", name: "Java", icon: "☕" },
  { id: "cpp", name: "C++", icon: "⚙️" },
  { id: "html", name: "HTML/CSS", icon: "🌐" },
];

const InteractiveCoding = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(`// Write your JavaScript code here
function greet() {
  console.log("Hello, Nirman!");
}

// Call the function
greet();`);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      setOutput("Loading Python runtime...");
      try {
        // @ts-ignore
        pyodideRef.current = await window.loadPyodide();
        setOutput("Python runtime loaded. Ready to run code.");
      } catch (error: any) {
        setOutput("Failed to load Pyodide: " + error.message);
      }
    };
    loadPyodide();
  }, []);

  const handleLanguageChange = (langId: string) => {
    setSelectedLanguage(langId);
    switch (langId) {
      case "javascript":
        setCode(`// Write your JavaScript code here
function greet() {
  console.log("Hello, Nirman!");
}
greet();`);
        break;
      case "python":
        setCode(`# Write your Python code here
def greet():
    print("Hello, Nirman!")

greet()`);
        break;
      case "java":
        setCode(`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Nirman!");
    }
}`);
        break;
      case "cpp":
        setCode(`#include <iostream>
int main() {
    std::cout << "Hello, Nirman!" << std::endl;
    return 0;
}`);
        break;
      case "html":
        setCode(`<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial; text-align: center; }
        h1 { color: #6366f1; }
    </style>
</head>
<body>
    <h1>Hello, Nirman!</h1>
    <p>This is my first webpage.</p>
</body>
</html>`);
        break;
    }
    setOutput("");
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput("");

    setTimeout(async () => {
      let simulatedOutput = "";

      if (selectedLanguage === "javascript") {
        try {
          let logOutput = "";
          const originalConsoleLog = console.log;
          console.log = (...args) => {
            logOutput += args.join(" ") + "\n";
          };

          eval(code);

          console.log = originalConsoleLog;
          simulatedOutput = logOutput.trim() || "Code executed successfully!";
        } catch (error: any) {
          simulatedOutput = `Error: ${error.message}`;
        }
      } else if (selectedLanguage === "python") {
        if (!pyodideRef.current) {
          simulatedOutput = "Pyodide not loaded yet!";
        } else {
          try {
            pyodideRef.current.setStdout({
              batched: (text: string) => {
                simulatedOutput += text;
              },
            });

            await pyodideRef.current.runPythonAsync(code);
            simulatedOutput =
              simulatedOutput.trim() || "Code executed successfully!";
          } catch (err: any) {
            simulatedOutput = `Error: ${err.message}`;
          }
        }
      } else {
        // Use Judge0 API for compiled languages
        if (selectedLanguage === "java" || selectedLanguage === "cpp") {
          simulatedOutput = await runWithJudge0(code, selectedLanguage);
        } else if (selectedLanguage === "html") {
          const wrappedHtml = `
          <script>
            const originalLog = console.log;
            console.log = function(...args) {
              window.parent.postMessage({ source: 'html-log', payload: args.join(' ') }, '*');
              originalLog.apply(console, args);
            };
          </script>
          ${code}
        `;
          setCode(wrappedHtml);
          simulatedOutput = "HTML rendered in preview pane";
        }
      }

      setOutput(simulatedOutput);
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data?.source === "html-log") {
        setOutput((prev) => prev + event.data.payload + "\n");
      }
    };

    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800">
      <Navbar
        currentSlide={3}
        totalSlides={4}
        onSlideChange={() => {}}
        title="Interactive Coding Environment"
      />

      <main className="flex-grow mt-16 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Code, Run, Learn
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
            Nirman's interactive coding environment lets you write and execute
            code in multiple languages with real-time feedback
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {languages.map((language) => (
            <motion.div
              key={language.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * languages.indexOf(language) }}
            >
              <Card
                className={`cursor-pointer transition-all ${
                  selectedLanguage === language.id
                    ? "bg-indigo-600 border-indigo-400"
                    : "bg-white/10 border-indigo-300/20 hover:bg-white/20"
                } backdrop-blur-sm`}
                onClick={() => handleLanguageChange(language.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{language.icon}</div>
                  <p className="text-white font-medium">{language.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-gray-900 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-700">
                <CardTitle className="text-xl font-medium">
                  Code Editor
                </CardTitle>
                <Code className="h-5 w-5 text-indigo-300" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-900 rounded-b-lg">
                  <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-sm text-indigo-300">
                      {languages.find((l) => l.id === selectedLanguage)?.name}
                    </span>
                    <Button
                      size="sm"
                      onClick={runCode}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                    >
                      {isLoading ? (
                        "Running..."
                      ) : (
                        <>
                          Run <Play className="h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm w-full h-64 p-4 bg-gray-900 text-indigo-100 outline-none resize-none"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full bg-gray-900 border-indigo-300/20 text-white backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-700">
                <CardTitle className="text-xl font-medium">Output</CardTitle>
                <Laptop className="h-5 w-5 text-indigo-300" />
              </CardHeader>
              <CardContent>
                {selectedLanguage === "html" ? (
                  <div className="mt-4 p-4 bg-white rounded-lg h-64 overflow-auto">
                    <iframe
                      srcDoc={code}
                      title="HTML Preview"
                      className="w-full h-full border-none"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-black/30 rounded-lg h-64 font-mono overflow-auto">
                    {output ? (
                      <pre className="text-green-400 whitespace-pre-wrap">{`> ${output}`}</pre>
                    ) : (
                      <p className="text-gray-500">
                        Click 'Run' to see your code output here
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-3 bg-indigo-500/20 rounded-full mb-4">
            <ArrowRight className="h-8 w-8 text-indigo-300" />
          </div>
          <h3 className="text-xl font-bold text-white">
            Try more complex challenges
          </h3>
          <p className="text-indigo-200 mt-2 max-w-2xl mx-auto">
            Progress to more advanced coding exercises and real-world projects
            with guidance from our intelligent tutoring system.
          </p>
          <Button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white">
            View Coding Challenges
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default InteractiveCoding;
