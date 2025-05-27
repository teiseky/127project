import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, GraduationCap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Don't show navbar on login page
  if (location.pathname === '/login') {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-800 to-red-900 backdrop-blur-sm border-b border-red-700/30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <GraduationCap className="w-7 h-7 text-yellow-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Student Organization Management
              </h1>
              <p className="text-sm text-yellow-200/80 font-medium">
                University of the Philippines
              </p>
            </div>
          </div>

          {/* Right side - User Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-white/80">Online</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="group flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-red-700 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-red-600"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;