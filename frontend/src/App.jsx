import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import MemberList from './pages/MemberList';
import OrganizationList from './pages/OrganizationList';
import FeeManagement from './pages/FeeManagement';
import Reports from './pages/Reports';
import OrganizationMembers from './pages/OrganizationMembers';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="flex-1 p-6 mt-16 ml-0 sm:ml-60 transition-all duration-300">
        <Routes>
          <Route path="/members" element={<MemberList />} />
          <Route path="/organizations" element={<OrganizationList />} />
          <Route path="/organization-members" element={<OrganizationMembers />} />
          <Route path="/fees" element={<FeeManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/members" />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App; 