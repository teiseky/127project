import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If role is specified, check if user has that role
  if (role && user.role !== role) {
    // Redirect unauthorized users to login 
    return <Navigate to="/login" />;
  }

  return children;
};

