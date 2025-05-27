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
import OrganizationMembers from './pages/OrganizationMembers';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* User layout (with navbar only) */}
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
              <UserFees/>
            </main>
          </div>
        </ProtectedRoute>
      }
    />
      {/* Admin layout (with navbar + sidebar) */}
      <Route
        path="*"
        element={
          user?.role === "admin" ? (
            <div className="flex min-h-screen bg-white">
              <Navbar />
              <Sidebar />
              <main className="flex-1 p-6 mt-16 ml-64 transition-all duration-300">
                <Routes>
                  <Route
                    path="/members"
                    element={
                      <ProtectedRoute role="admin">
                        <MemberList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organizations"
                    element={
                      <ProtectedRoute role="admin">
                        <OrganizationList />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/organization-members"
                    element={
                      <ProtectedRoute role="admin">
                        <OrganizationMembers />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/fees"
                    element={
                      <ProtectedRoute role="admin">
                        <FeeManagement />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reports"
                    element={
                      <ProtectedRoute role="admin">
                        <Reports />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/members" />} />
                </Routes>
              </main>
            </div>
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
