import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Add axios to call backend

const UserPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${studentNumber.trim()}`);

      if (response.data) {
        localStorage.setItem('studentNumber', studentNumber.trim());
        navigate(`/userDashboard/${studentNumber.trim()}`);
      } else {
        navigate('/error');
      }
    } catch (error) {
      navigate('/error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-v-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-w-md w-full mx-auto">
          <div className="p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Welcome, student!
                </h3>
                <p className="text-gray-600">Please enter your student number.</p>
              </div>

              <form onSubmit={handleContinue} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="studentNumber" className="block text-sm font-semibold text-gray-700">
                    Student Number
                  </label>
                  <input
                    id="studentNumber"
                    type="text"
                    required
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="e.g., 2023000001"
                    className="w-full pl-4 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-800 focus:border-red-800 transition-colors duration-200 bg-gray-50 focus:bg-white text-lg"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg"
                >
                  {loading ? 'Checking...' : 'Continue'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Trouble logging in?{' '}
                  <button className="text-red-800 hover:text-red-700 font-semibold">
                    Contact your Administrator.
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            © 2025 EibiNex. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
