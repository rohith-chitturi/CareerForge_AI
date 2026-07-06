import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, LayoutDashboard, MessageSquare, History as HistoryIcon, LogOut } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-background/70 border-b border-primary-900/50 shadow-sm">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-primary-300 hover:text-primary-100 transition-colors">
          <Briefcase className="h-7 w-7 text-sage-500" />
          <span className="font-serif italic text-2xl tracking-wide">CareerForgeAI</span>
        </Link>
        <div className="flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="flex items-center space-x-2 text-primary-400 hover:text-primary-100 transition-colors font-medium">
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link to="/mentor" className="flex items-center space-x-2 text-primary-400 hover:text-primary-100 transition-colors font-medium">
                <MessageSquare className="h-5 w-5" />
                <span>AI Mentor</span>
              </Link>
              <Link to="/history" className="flex items-center space-x-2 text-primary-400 hover:text-primary-100 transition-colors font-medium">
                <HistoryIcon className="h-5 w-5" />
                <span>History</span>
              </Link>
              <button onClick={handleLogout} className="flex items-center space-x-2 text-sage-400 hover:text-red-400 transition-colors font-medium ml-4">
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="px-6 py-2 bg-primary-800/30 text-primary-100 rounded-full hover:bg-primary-700/50 transition-colors font-medium border border-primary-800/50">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
