import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-up-maroon shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-semibold text-white">
          Organization Membership App
        </h1>
        <button
          onClick={handleLogout}
          className="p-2 text-white hover:bg-up-maroon-light rounded-full transition-colors"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 