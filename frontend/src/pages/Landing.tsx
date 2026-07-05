import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Brain, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';

function KnowledgeGraph() {
  const groupRef = useRef<THREE.Group>(null!);
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  
  // Generate stable nodes for the career network
  const [positions, linePositions] = React.useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const numNodes = 150;
    const radius = 2.5;

    for (let i = 0; i < numNodes; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      const r = radius * Math.cbrt(Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      nodes.push(new THREE.Vector3(x, y, z));
    }

    const linePoints: number[] = [];
    // Connect nodes that are close to represent skill relationships
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.8) {
          linePoints.push(
            nodes[i].x, nodes[i].y, nodes[i].z,
            nodes[j].x, nodes[j].y, nodes[j].z
          );
        }
      }
    }

    const posArray = new Float32Array(nodes.length * 3);
    for(let i=0; i<nodes.length; i++) {
      posArray[i*3] = nodes[i].x;
      posArray[i*3+1] = nodes[i].y;
      posArray[i*3+2] = nodes[i].z;
    }

    return [posArray, new Float32Array(linePoints)];
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#b38270" transparent opacity={0.8} />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#869d7a" transparent opacity={0.2} linewidth={1} />
      </lineSegments>
    </group>
  );
}

export default function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[90vh] text-center space-y-12 overflow-hidden bg-background text-primary-100">
      
      {/* 3D Knowledge Graph Background */}
      <div className="absolute inset-0 z-0 opacity-80 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <KnowledgeGraph />
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
