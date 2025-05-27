import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-v-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 max-w-md w-full mx-auto">
          <div className="p-12 flex flex-col justify-center">
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-8">
                <svg
                  className="mx-auto h-16 w-16 text-red-800 mb-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.662 1.732-3L13.732 4c-.77-1.338-2.694-1.338-3.464 0L3.34 16c-.77 1.338.192 3 1.732 3z"
                  />
                </svg>
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Oops! Something went wrong.
                </h3>
                <p className="text-gray-600">
                    We couldn't find a match for the student number you entered. Please contact your organization to be added as a registered member.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-semibold py-4 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl text-lg"
              >
                Back to Login
              </button>

              <div className="mt-8 text-center">
                <p className="text-gray-600 text-sm">
                  Still having issues?{' '}
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
            © 2025 University of CMSC 127. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
