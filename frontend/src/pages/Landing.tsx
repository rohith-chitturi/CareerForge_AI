import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

function OrganicBlobs() {
  const blob1 = useRef<THREE.Mesh>(null!);
  const blob2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (blob1.current) {
      blob1.current.rotation.x = Math.cos(t / 4) / 2;
      blob1.current.rotation.y = Math.sin(t / 4) / 2;
    }
    if (blob2.current) {
      blob2.current.rotation.x = Math.sin(t / 4) / 2;
      blob2.current.rotation.y = Math.cos(t / 4) / 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#eaddd7" />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#869d7a" />
      
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <Sphere ref={blob1} args={[1, 64, 64]} position={[-1.5, 0, -2]} scale={1.5}>
          <MeshDistortMaterial
            color="#945d49" // Terracotta
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.4}
            metalness={0.1}
          />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1.5}>
        <Sphere ref={blob2} args={[1, 64, 64]} position={[1.5, 1, -3]} scale={1.2}>
          <MeshDistortMaterial
            color="#869d7a" // Sage
            attach="material"
            distort={0.5}
            speed={1.5}
            roughness={0.5}
            metalness={0.1}
          />
        </Sphere>
      </Float>
      
      <Environment preset="city" />
    </>
  );
}

export default function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12 overflow-hidden bg-background text-primary-100">
      
      {/* 3D Organic Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <OrganicBlobs />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-4xl space-y-8 mt-12"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="inline-flex items-center space-x-2 bg-surface/80 text-primary-300 px-6 py-2.5 rounded-full border border-primary-800/50 backdrop-blur-xl shadow-lg mb-4"
        >
          <Sparkles className="h-4 w-4 text-sage-400" />
          <span className="text-sm font-medium tracking-widest uppercase">Enterprise AI Mentor</span>
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-primary-50 drop-shadow-sm leading-tight pb-2">
          Cultivate Your Career<br />
          <span className="font-serif italic text-primary-500">Naturally.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-primary-200 max-w-2xl mx-auto font-light leading-relaxed">
          Upload your resume, discover your organic skill gaps, and follow a personalized growth path guided by <span className="font-medium text-sage-400">intelligent LangGraph agents</span>.
        </p>
        
        <div className="pt-10">
          <Link to="/dashboard" className="group relative inline-flex items-center justify-center space-x-3 px-10 py-4 font-medium text-background transition-all duration-300 bg-primary-400 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-600 hover:bg-primary-300 hover:scale-105 shadow-xl">
            <span className="text-lg tracking-wide">Begin Journey</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
          </Link>
        </div>
      </motion.div>

      <div className="relative z-10 grid md:grid-cols-2 gap-8 w-full max-w-5xl pt-24 pb-12">
        <FeatureCard 
          icon={<Brain className="h-8 w-8 text-primary-600" />}
          title="Intuitive Reasoning"
          description="Coordinated AI agents analyze your profile, interpret ATS semantics, and dynamically generate deeply personalized interview scenarios."
        />
        <FeatureCard 
          icon={<Code2 className="h-8 w-8 text-sage-500" />}
          title="Holistic Analytics"
          description="Track your coding mastery through soft, diffused visualizations. See recommendations that align with your natural career progression."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
      className="relative p-10 rounded-[2rem] bg-surface/60 border border-primary-900/50 backdrop-blur-2xl text-left space-y-5 overflow-hidden group shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="relative z-10 bg-background/50 p-4 rounded-2xl inline-block border border-primary-800/50 shadow-inner">
        {icon}
      </div>
      <h3 className="relative z-10 text-2xl font-medium text-primary-100 tracking-tight">{title}</h3>
      <p className="relative z-10 text-primary-300 leading-relaxed text-lg font-light">{description}</p>
    </motion.div>
  );
}
