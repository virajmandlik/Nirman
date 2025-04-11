import { useState, useRef } from 'react';
import { MessageSquare, Send, Mic, MicOff, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { voiceService } from '@/lib/voiceService';
import Draggable from 'react-draggable';

type Message = {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  explanation?: string;
};

interface ChatWidgetProps {
  onClose: () => void;
}

const ChatWidget = ({ onClose }: ChatWidgetProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your programming assistant. How can I help you with your code?",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
        training_data: "You are a helpful programming assistant. Provide clear, concise, and accurate programming help.",
        response_type: "text",
      });
      
      const response = await fetch("https://api.worqhat.com/api/ai/content/v4", {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      const responseData = await response.json();
      const content = responseData.content || responseData;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: content,
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
      scrollToBottom();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <Draggable handle=".drag-handle" bounds="parent">
      <div className="fixed bottom-4 right-4 w-80 bg-gray-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-indigo-300/20 z-50">
        <div className="drag-handle flex items-center justify-between p-3 bg-indigo-600/20 rounded-t-lg cursor-move">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-300" />
            <h3 className="text-white font-medium">AI Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-indigo-300 hover:text-white"
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-indigo-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div>
            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-800 text-indigo-100'
                    }`}
                  >
                    <ReactMarkdown className="prose prose-invert max-w-none">
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-gray-700">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 border-gray-700 text-white"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceInput}
                  className={isRecording ? 'text-red-500' : 'text-indigo-300'}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="text-indigo-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default ChatWidget; 