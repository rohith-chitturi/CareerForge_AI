import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { FileText, Target, Zap, Activity } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Welcome back, Engineer</h1>
          <p className="text-slate-400 mt-1">Here's your career progress at a glance.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="ATS Score" value="85%" icon={<FileText />} trend="+5%" trendUp={true} />
        <MetricCard title="Interview Readiness" value="B+" icon={<Target />} trend="Improving" trendUp={true} />
        <MetricCard title="Problems Solved" value="120" icon={<Zap />} trend="+15 this week" trendUp={true} />
        <MetricCard title="Study Hours" value="85h" icon={<Activity />} trend="On track" trendUp={true} />
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Learning Progress */}
        <motion.div 
          className="bg-surface/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Learning Activity</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="problems" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Skill Radar */}
        <motion.div 
          className="bg-surface/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-6 text-slate-200">Skill Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockSkillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.4} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-surface/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md shadow-lg"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h4 className="text-3xl font-bold text-slate-100 mt-2">{value}</h4>
        </div>
        <div className="p-3 bg-primary-500/10 rounded-lg text-primary-400">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center space-x-2">
        <span className={`text-sm font-medium ${trendUp ? 'text-emerald-400' : 'text-rose-400'}`}>
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
