import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Lock, School } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Fake "login" user with role based on username
  let userRole = 'user';         
  if (formData.username === 'admin') {
    userRole = 'admin';
  }

  // Save user data including role
  login({ username: formData.username, role: userRole });

  if (userRole === 'admin') {
    navigate('/members');  // admin page
  } else {
    navigate('/userPage');  // user page
  }
};
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Main Card - Horizontal Layout */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* Left Side - Branding */}
          <div className="bg-gradient-to-br from-red-900 to-red-800 p-12 flex flex-col justify-center items-center text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 w-full">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <School className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Student Organization
              </h1>
              <h2 className="text-2xl font-semibold text-white/90 mb-4">
                Management System
              </h2>
              <div className="w-20 h-0.5 bg-yellow-400 mx-auto mb-4"></div>
              <div className="text-white/70 text-sm leading-relaxed">
                <p>Track members, events, and activities efficiently</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">Sign In</h3>
                <p className="text-gray-600">Access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-colors duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-colors duration-200 bg-gray-50 focus:bg-white text-lg"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2025 University of CMSC 127. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;