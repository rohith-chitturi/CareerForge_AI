import { Link } from 'react-router-dom';
import { Briefcase, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-surface/50 border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-primary-500 hover:text-primary-400 transition-colors">
          <Briefcase className="h-6 w-6" />
          <span className="font-bold text-xl tracking-tight">CareerForgeAI</span>
        </Link>
        <div className="flex space-x-6">
          <Link to="/dashboard" className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link to="/mentor" className="flex items-center space-x-1 text-slate-300 hover:text-white transition-colors">
            <MessageSquare className="h-4 w-4" />
            <span>AI Mentor</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
