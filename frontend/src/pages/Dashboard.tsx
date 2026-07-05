import { motion, useMotionValue, useTransform } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { FileText, Target, Zap, Activity } from 'lucide-react';
import React from 'react';

const mockProgressData = [
  { name: 'Week 1', problems: 10, hours: 15 },
  { name: 'Week 2', problems: 15, hours: 18 },
  { name: 'Week 3', problems: 25, hours: 22 },
  { name: 'Week 4', problems: 40, hours: 30 },
];

const mockSkillData = [
  { subject: 'Algorithms', A: 120, fullMark: 150 },
  { subject: 'System Design', A: 98, fullMark: 150 },
  { subject: 'React', A: 86, fullMark: 150 },
  { subject: 'Python', A: 130, fullMark: 150 },
  { subject: 'SQL', A: 110, fullMark: 150 },
  { subject: 'DevOps', A: 65, fullMark: 150 },
];

export default function Dashboard() {
  return (
    <div className="space-y-12 pb-16 relative z-10 text-primary-100">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end border-b border-primary-900/50 pb-6"
      >
        <div>
          <h1 className="text-4xl font-light text-primary-50 tracking-tight">
            Overview
          </h1>
          <p className="text-primary-300 mt-2 text-lg font-light">Your organic career growth matrix.</p>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
        <TiltCard title="ATS Resonance" value="85%" icon={<FileText strokeWidth={1.5} />} trend="+5%" trendUp={true} color="primary" />
        <TiltCard title="Interview Readiness" value="B+" icon={<Target strokeWidth={1.5} />} trend="Improving" trendUp={true} color="sage" />
        <TiltCard title="Problems Solved" value="120" icon={<Zap strokeWidth={1.5} />} trend="+15 this week" trendUp={true} color="primary" />
        <TiltCard title="Study Hours" value="85h" icon={<Activity strokeWidth={1.5} />} trend="Consistent" trendUp={true} color="sage" />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Learning Progress */}
        <motion.div 
          className="relative bg-surface/60 border border-primary-900/30 p-10 rounded-[2rem] backdrop-blur-3xl shadow-xl group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-primary-800/10 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-2xl font-medium mb-10 text-primary-100 relative z-10 tracking-tight">Learning Trajectory</h3>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#4a3b32" vertical={false} />
                <XAxis dataKey="name" stroke="#945d49" axisLine={false} tickLine={false} tick={{ fill: '#d2bab0' }} />
                <YAxis stroke="#945d49" axisLine={false} tickLine={false} tick={{ fill: '#d2bab0' }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f1b18', border: '1px solid rgba(148,93,73,0.2)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#eaddd7' }}
                />
                <Line type="monotone" dataKey="problems" stroke="#b38270" strokeWidth={4} dot={{ r: 6, fill: '#b38270', strokeWidth: 2, stroke: '#1f1b18' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                <Line type="monotone" dataKey="hours" stroke="#869d7a" strokeWidth={4} dot={{ r: 6, fill: '#869d7a', strokeWidth: 2, stroke: '#1f1b18' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Radar */}
        <motion.div 
          className="relative bg-surface/60 border border-primary-900/30 p-10 rounded-[2rem] backdrop-blur-3xl shadow-xl group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-sage-600/5 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-2xl font-medium mb-10 text-primary-100 relative z-10 tracking-tight">Skill Topography</h3>
          <div className="h-80 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockSkillData}>
                <PolarGrid stroke="#4a3b32" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#d2bab0', fontSize: 13, fontWeight: 400 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Proficiency" dataKey="A" stroke="#b38270" strokeWidth={2} fill="url(#colorUv)" fillOpacity={0.4} />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b38270" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#869d7a" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1f1b18', border: '1px solid rgba(148,93,73,0.2)', borderRadius: '16px' }} 
                  itemStyle={{ color: '#eaddd7' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function TiltCard({ title, value, icon, trend, trendUp, color }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [8, -8]);
  const rotateY = useTransform(x, [-100, 100], [-8, 8]);

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div 
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className={`relative bg-surface/40 p-8 rounded-[2rem] border border-primary-900/40 backdrop-blur-2xl shadow-lg cursor-pointer group hover:border-${color}-700/50 transition-colors duration-700`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br from-${color}-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2rem]`} />
      
      <div className="relative z-10 flex justify-between items-start" style={{ transform: "translateZ(30px)" }}>
        <div>
          <p className="text-primary-400 text-xs font-semibold uppercase tracking-widest">{title}</p>
          <h4 className="text-4xl font-light text-primary-50 mt-4 tracking-tight">{value}</h4>
        </div>
        <div className={`p-4 bg-${color}-900/30 rounded-[1.5rem] text-${color}-400 ring-1 ring-${color}-800/30 shadow-inner`}>
          {icon}
        </div>
      </div>
      <div className="relative z-10 mt-8 flex items-center space-x-2" style={{ transform: "translateZ(15px)" }}>
        <span className={`text-sm font-medium ${trendUp ? 'text-sage-400' : 'text-primary-500'} px-3 py-1.5 rounded-lg bg-background/50 border border-primary-900/50`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
