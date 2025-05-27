import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user?.firstName || user?.username || 'User'}!
      </h1>
      <p>This is the user dashboard page.</p>
    </div>
  );
};

export default UserPage;
