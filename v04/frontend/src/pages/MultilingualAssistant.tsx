import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Globe, Sparkles, User, Mic, MicOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ReactMarkdown from 'react-markdown';
import { voiceService } from '@/lib/voiceService';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  explanation?: string; // For code explanations
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

// System messages for different languages
const systemMessages = {
  en: "You are a helpful programming assistant. Provide clear, concise, and accurate programming help.",
  es: "Eres un asistente de programación útil. Proporciona ayuda de programación clara, concisa y precisa.",
  fr: "Vous êtes un assistant de programmation utile. Fournissez une aide à la programmation claire, concise et précise.",
  de: "Sie sind ein hilfreicher Programmierassistent. Bieten Sie klare, prägnante und genaue Programmierhilfe.",
  zh: "你是一个有用的编程助手。提供清晰、简洁和准确的编程帮助。",
  hi: "आप एक सहायक प्रोग्रामिंग सहायक हैं। स्पष्ट, संक्षिप्त और सटीक प्रोग्रामिंग सहायता प्रदान करें।"
};

// Function to parse and clean API response
const parseApiResponse = (responseData: any): { content: string, explanation?: string } => {
  // Handle different response formats
  if (!responseData) {
    return { content: "Sorry, I couldn't process that request." };
  }
  
  // Check if it's a string (simple response)
  if (typeof responseData === 'string') {
    return { content: responseData };
  }
  
  // Check if it's the format from screenshot with JSON structure
  if (responseData.content !== undefined) {
    return { content: responseData.content };
  }
  
  // Handle the format seen in your screenshot with processingId etc.
  if (typeof responseData === 'object') {
    // If there's a specific field that contains the actual response
    if (responseData.processingId && responseData.content) {
      const content = responseData.content;
      return { content };
    }
    
    // Format seen in your latest screenshot
    if (responseData.content && typeof responseData.content === 'string') {
      // Check if content contains quotes and code
      let content = responseData.content;
      
      // Extract code and explanation if content format is like: "code" This is explanation...
      const codeWithExplanation = content.match(/^["'`]{1,3}(.*?)["'`]{1,3}\s+([\s\S]*)$/);
      if (codeWithExplanation) {
        const code = codeWithExplanation[1];
        const explanation = codeWithExplanation[2];
        return { 
          content: code,
          explanation: explanation.trim()
        };
      }
      
      return { content };
    }
  }
  
  // Fallback: return stringified response data
  return { 
    content: typeof responseData === 'object' 
      ? JSON.stringify(responseData, null, 2) 
      : String(responseData) 
  };
};

// Function to detect code language
const detectCodeLanguage = (code: string): string => {
  if (code.includes('console.log') || code.includes('function') || 
      code.includes('var ') || code.includes('let ') || code.includes('const ')) {
    return 'javascript';
  } else if (code.includes('public class') || code.includes('System.out.println')) {
    return 'java';
  } else if (code.includes('def ') || code.includes('print(')) {
    return 'python';
  } else if (code.includes('#include') || code.includes('int main()')) {
    return 'cpp';
  } else if (code.includes('<?php')) {
    return 'php';
  } else if (code.includes('<html>') || code.includes('<div>')) {
    return 'html';
  }
  
  return '';
};

const MultilingualAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your programming assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleVoiceInput = async () => {
    if (isRecording) {
      voiceService.stopRecording();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    try {
      await voiceService.startRecording(
        async (audioBlob) => {
          const transcribedMessage = await voiceService.processAudio(audioBlob);
          setInputMessage(transcribedMessage.content);
          if (inputRef.current) {
            inputRef.current.focus();
          }
          setIsRecording(false);
        },
        (error) => {
          console.error('Voice recording error:', error);
          setIsRecording(false);
        }
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", "Bearer wh_m98e73pyIx3lDou60pIgq6E2u6i6bMMMo4lqEe6");
      
      const raw = JSON.stringify({
        question: inputMessage,
        model: "aicon-v4-large-160824",
        randomness: 0.5,
        stream_data: false,
        training_data: systemMessages[selectedLanguage as keyof typeof systemMessages],
        response_type: "text",
      });
      
      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow' as RequestRedirect
      };
      
      const response = await fetch("https://api.worqhat.com/api/ai/content/v4", requestOptions);
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const responseData = await response.json();
      const { content, explanation } = parseApiResponse(responseData);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: content,
        explanation: explanation,
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Function to render message content
  const renderMessageContent = (message: Message) => {
    const { content, explanation, sender } = message;
    
    if (sender === 'user') {
      return <p>{content}</p>;
    }
    
    // For assistant messages, check if it's code
    const codeLanguage = detectCodeLanguage(content);
    
    if (codeLanguage) {
      return (
        <div>
          <pre className="bg-gray-800 p-3 rounded-md overflow-x-auto">
            <code className={`language-${codeLanguage}`}>{content}</code>
          </pre>
          {explanation && <p className="mt-2">{explanation}</p>}
        </div>
      );
    }
    
    // Check if it might be already formatted markdown
    if (content.includes('```') || content.includes('#') || content.includes('- ')) {
      return <ReactMarkdown>{content}</ReactMarkdown>;
    }
    
    // Regular text
    return <p>{content}</p>;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-800">
      <Navbar
        currentSlide={4}
        totalSlides={4}
        onSlideChange={() => {}}
        title="Multilingual LLM Assistant"
      />
      
      <main className="flex-grow mt-16 container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Programming Assistant</h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Get help with programming concepts in multiple languages
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1"
          >
            <Card className="h-full bg-white/10 border-purple-300/20 text-white backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="mr-2 h-5 w-5" /> 
                  Languages
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="flex flex-col gap-2">
                  {languages.map(language => (
                    <button
                      key={language.code}
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        selectedLanguage === language.code 
                          ? 'bg-purple-700 text-white' 
                          : 'hover:bg-purple-800/50 text-purple-100'
                      }`}
                      onClick={() => setSelectedLanguage(language.code)}
                    >
                      <span className="mr-2 text-lg">{language.flag}</span>
                      <span>{language.name}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 p-3 bg-purple-800/50 rounded-md">
                  <h3 className="text-sm font-medium text-purple-300 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> Assistant Features
                  </h3>
                  <ul className="mt-2 text-sm text-purple-200 list-disc pl-4 space-y-1">
                    <li>Multilingual code help</li>
                    <li>Debug assistance</li>
                    <li>Algorithm explanations</li>
                    <li>Best practice tips</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3"
          >
            <Card className="h-full flex flex-col bg-white/10 border-purple-300/20 text-white backdrop-blur-sm">
              <CardHeader className="border-b border-purple-500/30">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-purple-400" /> 
                  Chat with Programming Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col p-0">
                <div className="flex-grow p-4 overflow-y-auto max-h-[500px] space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`rounded-lg p-3 max-w-[80%] ${
                        message.sender === 'user' 
                          ? 'bg-purple-700 text-white' 
                          : 'bg-indigo-600/40 text-white'
                      }`}>
                        <div className="flex items-center mb-1">
                          {message.sender === 'assistant' ? (
                            <Sparkles className="h-3 w-3 mr-1 text-purple-300" />
                          ) : (
                            <User className="h-3 w-3 mr-1 text-purple-300" />
                          )}
                          <span className="text-xs text-purple-300 font-medium">
                            {message.sender === 'user' ? 'You' : 'Assistant'}
                          </span>
                        </div>
                        {renderMessageContent(message)}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-indigo-600/40 rounded-lg p-3">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-purple-500/30">
                  <div className="flex gap-2">
                    <Input 
                      ref={inputRef}
                      placeholder="Ask a programming question or use voice input..." 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-grow bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300/70"
                    />
                    <Button 
                      onClick={handleVoiceInput}
                      className={`${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`}
                    >
                      {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-purple-300 mt-2">
                    Click the microphone to start speaking, or type your question
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MultilingualAssistant;