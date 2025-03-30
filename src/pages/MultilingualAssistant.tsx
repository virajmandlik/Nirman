
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Globe, Sparkles, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
};

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const MultilingualAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your programming assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages([...messages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const responses: {[key: string]: string} = {
        'en': "I can help with that programming question! In JavaScript, you can use the `map()` function to transform array elements. Would you like to see an example?",
        'es': "¡Puedo ayudarte con esa pregunta de programación! En JavaScript, puedes usar la función `map()` para transformar elementos de un array. ¿Te gustaría ver un ejemplo?",
        'fr': "Je peux vous aider avec cette question de programmation ! En JavaScript, vous pouvez utiliser la fonction `map()` pour transformer les éléments d'un tableau. Voulez-vous voir un exemple ?",
        'de': "Ich kann bei dieser Programmierungsfrage helfen! In JavaScript können Sie die Funktion `map()` verwenden, um Array-Elemente zu transformieren. Möchten Sie ein Beispiel sehen?",
        'zh': "我可以帮助解决这个编程问题！在JavaScript中，您可以使用`map()`函数来转换数组元素。您想看一个例子吗？",
        'hi': "मैं उस प्रोग्रामिंग प्रश्न में मदद कर सकता हूँ! JavaScript में, आप array के elements को transform करने के लिए `map()` function का उपयोग कर सकते हैं। क्या आप एक उदाहरण देखना चाहेंगे?",
      };
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[selectedLanguage] || responses['en'],
        sender: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, response]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
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
                        <p>{message.content}</p>
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
                      placeholder="Ask a programming question..." 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-grow bg-white/10 border-purple-400/30 text-white placeholder:text-purple-300/70"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-purple-300 mt-2">
                    Try: "How does array sorting work in JavaScript?" or "Explain recursion with an example"
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
