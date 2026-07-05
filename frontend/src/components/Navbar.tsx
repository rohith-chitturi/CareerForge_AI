import { Link } from 'react-router-dom';
import { Briefcase, LayoutDashboard, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-background/70 border-b border-primary-900/50 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-primary-300 hover:text-primary-100 transition-colors">
          <Briefcase className="h-7 w-7 text-sage-500" />
          <span className="font-serif italic text-2xl tracking-wide">CareerForgeAI</span>
        </Link>
        <div className="flex space-x-8">
          <Link to="/dashboard" className="flex items-center space-x-2 text-primary-400 hover:text-primary-100 transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/mentor" className="flex items-center space-x-2 text-primary-400 hover:text-primary-100 transition-colors font-medium">
            <MessageSquare className="h-5 w-5" />
            <span>AI Mentor</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
