import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Leaf, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatMentor() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your AI Career Mentor. I've analyzed your organic growth matrix. How can we cultivate your skills today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/v1/chat', {
        message: input,
        session_id: 'default-session'
      });
      
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: response.data.response, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error communicating with AI mentor:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I seem to have lost my connection to the cognitive network. Please ensure the backend is running.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-surface/60 backdrop-blur-3xl border border-primary-900/40 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10">
      {/* Header */}
      <div className="flex items-center space-x-4 px-8 py-6 border-b border-primary-900/40 bg-background/50">
        <div className="p-3 bg-sage-600/20 rounded-2xl shadow-inner border border-sage-800/30">
          <Leaf className="h-6 w-6 text-sage-400" />
        </div>
        <div>
          <h2 className="font-medium text-xl text-primary-50 tracking-wide">Career Growth Mentor</h2>
          <p className="text-sm text-primary-400 font-light mt-1">Cultivated by LangGraph AI</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-lg ${msg.sender === 'user' ? 'bg-primary-700' : 'bg-surface border border-primary-800'}`}>
                {msg.sender === 'user' ? <User className="h-5 w-5 text-primary-100" /> : <Bot className="h-5 w-5 text-sage-400" />}
              </div>
              <div className={`px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary-700 text-primary-50 rounded-tr-sm' 
                  : 'bg-background/80 text-primary-200 rounded-tl-sm border border-primary-900/50 backdrop-blur-md'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex space-x-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-lg bg-surface border border-primary-800">
                <Bot className="h-5 w-5 text-sage-400" />
              </div>
              <div className="px-6 py-4 rounded-[1.5rem] bg-background/80 text-primary-200 rounded-tl-sm border border-primary-900/50 backdrop-blur-md flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin text-sage-400" />
                <span className="text-sm font-light">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-background/60 border-t border-primary-900/40 backdrop-blur-md">
        <div className="flex items-center space-x-3 bg-surface/50 p-2.5 rounded-[2rem] border border-primary-800/50 focus-within:border-sage-500/50 transition-colors shadow-inner">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your organic growth, resume, or mock interviews..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:outline-none text-primary-100 px-5 placeholder-primary-500 font-light disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-4 bg-primary-700 hover:bg-primary-600 rounded-full transition-all duration-300 text-primary-50 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
