import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-6"
      >
        <div className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-400 px-4 py-2 rounded-full border border-primary-500/20 mb-4">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Enterprise AI Career Mentor</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-primary-500">
          Forge Your Future with AI Intelligence
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
          Upload your resume, analyze your skill gaps, and get a personalized roadmap engineered by LangGraph-powered AI agents.
        </p>
        <div className="pt-8">
          <Link to="/dashboard" className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg shadow-primary-500/25">
            <span>Get Started Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl pt-16">
        <FeatureCard 
          icon={<Brain className="h-8 w-8 text-purple-400" />}
          title="Multi-Agent AI"
          description="Coordinated agents analyze your resume, calculate ATS scores, and generate interview scenarios."
        />
        <FeatureCard 
          icon={<Code2 className="h-8 w-8 text-blue-400" />}
          title="Performance Analytics"
          description="Track your coding progress and see AI-driven recommendations tailored to your goals."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-surface/40 border border-white/5 backdrop-blur-md shadow-xl text-left space-y-4"
    >
      <div className="bg-white/5 p-3 rounded-lg inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}
