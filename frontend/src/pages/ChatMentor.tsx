import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

export default function ChatMentor() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Hello! I'm your AI Career Mentor. I've analyzed your resume and skills. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: "That's a great question! Based on your profile, I recommend focusing on System Design. I've updated your roadmap accordingly.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-4xl mx-auto bg-surface/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center space-x-3 px-6 py-4 border-b border-white/10 bg-surface/50">
        <div className="p-2 bg-primary-500/20 rounded-full">
          <Sparkles className="h-5 w-5 text-primary-400" />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-slate-100">AI Career Mentor</h2>
          <p className="text-xs text-slate-400">Powered by LangGraph</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.sender === 'user' ? 'bg-primary-600' : 'bg-slate-700'}`}>
                {msg.sender === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-primary-300" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface/50 border-t border-white/10">
        <div className="flex items-center space-x-2 bg-slate-900/50 p-2 rounded-2xl border border-white/5 focus-within:border-primary-500/50 transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about your career, resume, or mock interviews..."
            className="flex-1 bg-transparent border-none focus:outline-none text-slate-200 px-4"
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-primary-600 hover:bg-primary-500 rounded-xl transition-colors text-white"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
