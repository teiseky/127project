import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserRoundPen, PhilippinePeso } from 'lucide-react';

const UserSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get student number from localStorage 
  const studentNumber = localStorage.getItem('studentNumber');

  const menuItems = [
    { text: 'Dashboard', icon: <UserRoundPen className="w-5 h-5" />, path: `/userDashboard/${studentNumber}` },
    { text: 'My Fees', icon: <PhilippinePeso className="w-5 h-5" />, path: `/userFees/${studentNumber}` }
  ];

  return (
    <aside className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 bg-white shadow-md hidden sm:block">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.text}>
              <button
                onClick={() => {
                  if (studentNumber) {
                    navigate(item.path);
                  } else {
                    alert('Student number not found. Please enter your student number.');
                    navigate('/userPage');
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-up-maroon text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserSidebar;
