import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import UserSidebar from './components/UserSidebar';
import Login from './pages/Login'; 
import MemberList from './pages/MemberList';
import OrganizationList from './pages/OrganizationList';
import FeeManagement from './pages/FeeManagement';
import Reports from './pages/Reports';
import UserPage from './pages/UserPage';         
import UserDashboard from './pages/UserDashboard'; 
import UserFees from './pages/UserFees';
import ErrorPage from './pages/ErrorPage';
import OrganizationMembers from './pages/OrganizationMembers';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route
        path="/error"
        element={
          <div className="min-h-screen bg-white">
            <Navbar />
            <main className="p-6 mt-16">
              <ErrorPage />
            </main>
          </div>
        }
      />

      {/* Authenticated user routes */}
      {isAuthenticated && user?.role === 'user' && (
        <>
          <Route
            path="/userPage"
            element={
              <ProtectedRoute role="user">
                <div className="min-h-screen bg-white">
                  <Navbar />
                  <main className="p-6 mt-16">
                    <UserPage />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/userDashboard/:studentNumber"
            element={
              <ProtectedRoute role="user">
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <UserSidebar />
                  <main className="p-6 mt-16">
                    <UserDashboard />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/userFees/:studentNumber"
            element={
              <ProtectedRoute role="user">
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <UserSidebar />
                  <main className="p-6 mt-16">
                    <UserFees />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Admin routes */}
      {isAuthenticated && user?.role === 'admin' && (
        <>
          <Route
            path="/members"
            element={
              <ProtectedRoute role="admin">
                <div className="flex min-h-screen bg-white">
                  <Navbar />
                  <Sidebar />
                  <main className="flex-1 p-6 mt-16 ml-64">
                    <MemberList />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizations"
            element={
              <ProtectedRoute role="admin">
                <div className="flex min-h-screen bg-white">
                  <Navbar />
                  <Sidebar />
                  <main className="flex-1 p-6 mt-16 ml-64">
                    <OrganizationList />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization-members"
            element={
              <ProtectedRoute role="admin">
                <div className="flex min-h-screen bg-white">
                  <Navbar />
                  <Sidebar />
                  <main className="flex-1 p-6 mt-16 ml-64">
                    <OrganizationMembers />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <ProtectedRoute role="admin">
                <div className="flex min-h-screen bg-white">
                  <Navbar />
                  <Sidebar />
                  <main className="flex-1 p-6 mt-16 ml-64">
                    <FeeManagement />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute role="admin">
                <div className="flex min-h-screen bg-white">
                  <Navbar />
                  <Sidebar />
                  <main className="flex-1 p-6 mt-16 ml-64">
                    <Reports />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
        </>
      )}

      {/* Fallback route */}
      <Route
        path="*"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : user?.role === 'admin' ? (
            <Navigate to="/members" />
          ) : (
            <Navigate to="/userPage" />
          )
        }
      />
    </Routes>
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