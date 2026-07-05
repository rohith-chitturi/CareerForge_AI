import { motion } from 'framer-motion';
import { 
  LineChart, Line, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip as RechartsTooltip
} from 'recharts';
import { FileText, Target, Zap, Activity, BrainCircuit, Upload, Loader2, CheckCircle2, Compass } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const mockProgressData = [
  { name: 'W1', problems: 10, hours: 15 },
  { name: 'W2', problems: 20, hours: 18 },
  { name: 'W3', problems: 22, hours: 16 },
  { name: 'W4', problems: 45, hours: 35 },
  { name: 'W5', problems: 50, hours: 32 },
  { name: 'W6', problems: 75, hours: 45 },
];

const mockSkillData = [
  { subject: 'Algo', A: 140 },
  { subject: 'SysDes', A: 90 },
  { subject: 'React', A: 110 },
  { subject: 'Python', A: 130 },
  { subject: 'DB', A: 80 },
];

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/v1/recommendations?user_id=1');
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("Failed to fetch recommendations", err);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', uploadedFile);
    formData.append('job_description', 'Looking for a Senior Software Engineer with Python and React experience.');

    try {
      const res = await axios.post('http://localhost:8000/api/v1/analyze-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAtsScore(res.data.ats_score);
      setAiMessage(res.data.message);
      
      // Refresh recommendations based on the new resume's missing skills
      fetchRecommendations();
    } catch (err) {
      console.error(err);
      setAiMessage("Failed to connect to LangGraph Resume Agent.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 relative z-10 text-primary-100 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-10"
      >
        <div className="p-4 bg-primary-800/30 rounded-3xl shadow-inner border border-primary-800/50">
          <BrainCircuit className="h-8 w-8 text-sage-400" />
        </div>
        <div>
          <h1 className="text-4xl font-light text-primary-50 tracking-tight">
            Intelligence Center
          </h1>
          <p className="text-primary-400 mt-1 text-lg font-light">Organic Bento Grid</p>
        </div>
      </motion.div>

      {/* Asymmetric Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[220px]">
        
        {/* Large Trajectory Box (Col Span 3, Row Span 2) */}
        <BentoBox className="md:col-span-3 md:row-span-2 relative overflow-hidden group">
          <div className="absolute top-8 left-8 z-20">
            <h3 className="text-2xl font-medium text-primary-100 tracking-tight">Learning Trajectory</h3>
            <p className="text-primary-400 font-light mt-1">Accelerating growth pattern detected</p>
          </div>
          <div className="absolute inset-0 z-10 pt-24 px-4 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#945d49" />
                    <stop offset="100%" stopColor="#c5a396" />
                  </linearGradient>
                </defs>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f1b18', border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#eaddd7', fontWeight: 600 }}
                  cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 40 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="problems" 
                  stroke="url(#lineGrad)" 
                  strokeWidth={8} 
                  dot={false} 
                  activeDot={{ r: 8, fill: '#fdf8f6', strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-700/10 blur-[100px] rounded-full group-hover:bg-primary-600/20 transition-colors duration-1000" />
        </BentoBox>

        {/* Dynamic Resume AI Uploader Box */}
        <BentoBox className="md:col-span-1 md:row-span-2 flex flex-col justify-center items-center text-center relative overflow-hidden">
           <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
            {isUploading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-10 w-10 text-sage-400 animate-spin" />
                <p className="text-primary-300 text-sm font-medium">Extracting vectors...</p>
              </div>
            ) : atsScore !== null ? (
              <div className="flex flex-col items-center space-y-2 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-10 w-10 text-sage-400 mb-2" />
                <h4 className="text-5xl font-light text-primary-50">{atsScore}%</h4>
                <p className="text-primary-400 text-xs font-semibold uppercase tracking-widest mt-2">ATS Resonance</p>
                <p className="text-xs text-primary-300 mt-4 leading-relaxed px-2 line-clamp-3">{aiMessage}</p>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="p-5 bg-primary-800/20 rounded-3xl text-primary-300 mb-4 shadow-inner">
                  <Upload strokeWidth={1.5} className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-primary-100">AI Resume Parse</h3>
                <p className="text-xs text-primary-400 mt-2 px-4">Upload PDF to engage LangGraph Agents</p>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
              </label>
            )}
           </div>
        </BentoBox>

        {/* Wide Metric (Col Span 2, Row Span 1) */}
        <BentoBox className="md:col-span-2 flex items-center justify-between px-10">
          <div className="flex items-center space-x-6">
            <div className="p-6 bg-primary-800/20 rounded-[2rem] text-primary-300 shadow-inner">
              <Zap strokeWidth={1.5} className="h-8 w-8" />
            </div>
            <div>
              <p className="text-primary-400 text-sm font-medium uppercase tracking-widest">Total Problems Solved</p>
              <h4 className="text-5xl font-light text-primary-50 mt-2">120</h4>
            </div>
          </div>
          <div className="text-right">
             <span className="text-primary-300 text-sm font-medium bg-background/50 px-4 py-2 rounded-full border border-primary-800/30">
               +15 this week
             </span>
          </div>
        </BentoBox>

        {/* Dynamic RAG Recommendations (Col Span 2, Row Span 1) */}
        <BentoBox className="md:col-span-2 flex flex-col justify-center px-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
            <Compass className="h-24 w-24 text-sage-400" />
          </div>
          <h3 className="text-lg font-medium text-primary-100 mb-4 relative z-10">AI Directed Path</h3>
          <div className="space-y-3 relative z-10">
            {recommendations.length > 0 ? recommendations.map((rec, idx) => (
              <div key={idx} className="flex justify-between items-center bg-surface/60 p-3 rounded-2xl border border-primary-900/50 backdrop-blur-md">
                <div>
                  <p className="text-sm text-primary-200">{rec.title}</p>
                  <p className="text-xs text-primary-400 mt-1 uppercase tracking-wider">{rec.type}</p>
                </div>
                <div className="flex space-x-1">
                   {rec.skills?.slice(0,2).map((s: string, i: number) => (
                      <span key={i} className="text-[10px] bg-primary-800/30 text-sage-300 px-2 py-1 rounded-md">{s}</span>
                   ))}
                </div>
              </div>
            )) : (
              <p className="text-sm text-primary-400 italic">Upload a resume to generate FAISS recommendations.</p>
            )}
          </div>
        </BentoBox>

      </div>
    </div>
  );
}

function BentoBox({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.015, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`bg-surface/50 border border-primary-900/30 rounded-[2.5rem] p-8 backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_50px_rgba(0,0,0,0.4)] hover:border-primary-800/50 transition-all duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}
