import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const res = await axios.post('http://localhost:8000/api/v1/auth/login', formData);
      localStorage.setItem('token', res.data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative z-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-surface/50 border border-primary-900/40 rounded-[2.5rem] p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Briefcase className="h-48 w-48 text-sage-400 -mr-16 -mt-16 transform rotate-12" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 text-primary-300 mb-8">
              <Briefcase className="h-8 w-8 text-sage-500" />
              <span className="font-serif italic text-2xl tracking-wide">CareerForgeAI</span>
            </div>
            
            <h2 className="text-3xl font-light text-primary-50 mb-2">Welcome Back</h2>
            <p className="text-primary-400 font-light mb-8">Authenticate to access your intelligence dashboard.</p>
            
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-2xl mb-6 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-primary-800/50 rounded-2xl px-5 py-4 text-primary-100 focus:outline-none focus:border-sage-500/50 transition-colors shadow-inner"
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-primary-300 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-primary-800/50 rounded-2xl px-5 py-4 text-primary-100 focus:outline-none focus:border-sage-500/50 transition-colors shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-primary-700 hover:bg-primary-600 text-primary-50 rounded-2xl px-5 py-4 transition-all duration-300 shadow-lg disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Sign In</span>}
                {!isLoading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>
            
            <p className="text-center mt-8 text-primary-400 text-sm">
              Don't have an account? <Link to="/register" className="text-sage-400 hover:text-sage-300 transition-colors">Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
