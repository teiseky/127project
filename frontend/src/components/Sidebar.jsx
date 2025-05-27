import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
 
import {
  Users,
  Building2,
  DollarSign,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  PhilippinePeso
} from 'lucide-react';

const menuItems = [
  { text: 'Students', icon: <Users className="w-5 h-5" />, path: '/members' },
  { text: 'Organization List', icon: <Building2 className="w-5 h-5" />, path: '/organizations' },
  { text: 'Manage Organizations', icon: <Settings className="w-5 h-5" />, path: '/organization-members' },
  { text: 'Fees', icon: <PhilippinePeso className="w-5 h-5" />, path: '/fees' },
  { text: 'Reports', icon: <FileBarChart className="w-5 h-5" />, path: '/reports' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className={`fixed top-20 left-0 h-[calc(100vh-5rem)] ${isCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl transition-all duration-300 ease-in-out z-10 border-r border-gray-200`}>
    
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-gray-800">
                <div className="text-sm font-bold">Organization System</div>
                <div className="text-xs text-gray-600">Management</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location?.pathname === item.path;
            return (
              <li key={item.text}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'} py-3 rounded-xl transition-all duration-200 group relative ${
                    isActive
                      ? 'bg-red-800 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-800'
                  }`}
                  title={isCollapsed ? item.text : ''}
                >
                  <div className={`${isActive ? 'text-white' : 'text-gray-500 group-hover:text-red-800'} transition-colors`}>
                    {item.icon}
                  </div>
                  {!isCollapsed && (
                    <span className="font-medium text-sm">{item.text}</span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.text}
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-600 text-center">
              © 2025 ElbiNex
            </div>
            <div className="text-xs text-red-800 text-center font-semibold">
              Student Management System
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;