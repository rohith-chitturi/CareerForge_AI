import { motion } from 'framer-motion';
import { 
  LineChart, Line, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Tooltip as RechartsTooltip
} from 'recharts';
import { FileText, Target, Zap, Activity, BrainCircuit } from 'lucide-react';
import React from 'react';

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

        {/* Small Metric 1 */}
        <BentoBox className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary-800/20 rounded-2xl text-primary-300">
              <FileText strokeWidth={1.5} className="h-6 w-6" />
            </div>
            <span className="text-sage-400 text-sm font-medium bg-sage-900/30 px-3 py-1 rounded-full border border-sage-800/30">+5%</span>
          </div>
          <div>
            <p className="text-primary-400 text-sm font-medium uppercase tracking-widest">ATS Resonance</p>
            <h4 className="text-5xl font-light text-primary-50 mt-2">85%</h4>
          </div>
        </BentoBox>

        {/* Small Metric 2 */}
        <BentoBox className="flex flex-col justify-between bg-primary-900/10 border-primary-800/20">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-sage-800/20 rounded-2xl text-sage-300">
              <Target strokeWidth={1.5} className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-primary-400 text-sm font-medium uppercase tracking-widest">Interview Readiness</p>
            <h4 className="text-5xl font-light text-sage-100 mt-2">B+</h4>
          </div>
        </BentoBox>

        {/* Radar Chart Box (Col Span 1, Row Span 2) - Moves to next row in grid */}
        <BentoBox className="md:col-span-1 md:row-span-2 relative flex flex-col items-center justify-center overflow-hidden">
          <h3 className="absolute top-8 left-8 text-xl font-medium text-primary-100 tracking-tight z-20">Skill Radar</h3>
          <div className="absolute inset-0 pt-16 pb-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={mockSkillData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d2bab0', fontSize: 11, fontWeight: 300 }} />
                <Radar name="Proficiency" dataKey="A" stroke="#869d7a" strokeWidth={3} fill="#869d7a" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
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

        {/* Standard Metric (Col Span 1, Row Span 1) */}
        <BentoBox className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-4 bg-primary-800/20 rounded-2xl text-primary-300">
              <Activity strokeWidth={1.5} className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-primary-400 text-sm font-medium uppercase tracking-widest">Study Hours</p>
            <h4 className="text-5xl font-light text-primary-50 mt-2">85h</h4>
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
