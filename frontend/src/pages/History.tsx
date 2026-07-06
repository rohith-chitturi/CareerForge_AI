import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, MessageSquare, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

type Message = {
  role: 'user' | 'ai';
  content: string;
};

export default function History() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Not authenticated.");
          return;
        }

        const res = await axios.get('http://localhost:8000/api/v1/chat/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load history. Please ensure you are logged in.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 relative z-10 text-primary-100">
      <div className="flex items-center space-x-4">
        <Link to="/mentor" className="p-2 hover:bg-surface/50 rounded-full transition-colors border border-transparent hover:border-primary-900/50">
          <ArrowLeft className="h-6 w-6 text-primary-300" />
        </Link>
        <div>
          <h1 className="text-3xl font-light text-primary-50 tracking-tight">Session Archive</h1>
          <p className="text-primary-400 mt-1 font-light">Review your past LangGraph AI interactions.</p>
        </div>
      </div>

      <div className="bg-surface/50 border border-primary-900/40 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-xl min-h-[60vh]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full pt-20">
            <Loader2 className="h-8 w-8 text-sage-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-300 pt-20 font-light">{error}</div>
        ) : messages.length === 0 ? (
          <div className="text-center pt-20">
            <MessageSquare className="h-16 w-16 text-primary-800/50 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-primary-200">No History Yet</h3>
            <p className="text-primary-400 font-light mt-2">Start a conversation with the AI Mentor to begin recording your journey.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center shadow-md ${msg.role === 'user' ? 'bg-primary-700' : 'bg-surface border border-primary-800'}`}>
                    {msg.role === 'user' ? <User className="h-5 w-5 text-primary-100" /> : <Bot className="h-5 w-5 text-sage-400" />}
                  </div>
                  <div className={`px-6 py-4 rounded-[1.5rem] text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary-700/50 border border-primary-600/30 text-primary-50 rounded-tr-sm' 
                      : 'bg-background/80 border border-primary-900/50 text-primary-200 rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
