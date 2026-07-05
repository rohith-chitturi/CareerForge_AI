import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function ParticleBackground(props: any) {
  const ref = useRef<any>();
  // Generate 5000 random points in a sphere
  const sphere = random.inSphere(new Float32Array(5000), { radius: 1.5 });

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#0ea5e9"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export default function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12 overflow-hidden">
      
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <ParticleBackground />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 max-w-4xl space-y-8 mt-12"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center space-x-2 bg-primary-500/10 text-primary-400 px-5 py-2.5 rounded-full border border-primary-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.3)] mb-4"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide uppercase">Enterprise AI Career Mentor</span>
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-primary-600 drop-shadow-lg leading-tight pb-2">
          Forge Your Future<br />With Intelligence
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          Upload your resume, analyze your skill gaps, and get a personalized roadmap engineered by <span className="font-medium text-primary-400">LangGraph-powered AI agents</span>.
        </p>
        
        <div className="pt-8">
          <Link to="/dashboard" className="group relative inline-flex items-center justify-center space-x-2 px-10 py-5 font-bold text-white transition-all duration-200 bg-primary-600 font-pj rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 hover:bg-primary-500 hover:scale-105 shadow-[0_0_40px_rgba(14,165,233,0.5)]">
            <span className="text-lg">Enter Dashboard</span>
            <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full max-w-5xl pt-24 pb-12">
        <FeatureCard 
          icon={<Brain className="h-10 w-10 text-fuchsia-400" />}
          title="Multi-Agent Reasoning"
          description="Coordinated AI agents analyze your resume, calculate ATS scores, and dynamically generate interview scenarios in real-time."
          glowColor="rgba(232, 121, 249, 0.15)"
        />
        <FeatureCard 
          icon={<Code2 className="h-10 w-10 text-cyan-400" />}
          title="Predictive Analytics"
          description="Track your coding progress and see AI-driven recommendations tailored specifically to your long-term career goals."
          glowColor="rgba(34, 211, 238, 0.15)"
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, glowColor }: { icon: React.ReactNode, title: string, description: string, glowColor: string }) {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative p-10 rounded-3xl bg-surface/30 border border-white/10 backdrop-blur-xl text-left space-y-5 overflow-hidden group"
      style={{ boxShadow: `0 10px 40px -10px ${glowColor}` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 bg-black/20 p-4 rounded-2xl inline-block border border-white/5 shadow-inner">
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-bold text-white tracking-tight">{title}</h3>
      <p className="relative z-10 text-slate-300 leading-relaxed text-lg">{description}</p>
    </motion.div>
  );
}
