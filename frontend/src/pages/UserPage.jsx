import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [studentNumber, setStudentNumber] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (studentNumber.trim()) {
      localStorage.setItem('studentNumber', studentNumber); 
      navigate(`/userDashboard/${studentNumber}`);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Enter Your Student Number</h1>
      <input
        type="text"
        placeholder="e.g., 2023-00001"
        value={studentNumber}
        onChange={(e) => setStudentNumber(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Continue
      </button>
    </div>
  );
};

export default UserPage;
