import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Common/Header';
import Footer from './components/Common/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import PlayerDashboard from './pages/PlayerDashboard';
import ProfilePage from './pages/ProfilePage';
import './styles/App.css';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAdmin, isPlayer } = useAuth();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole === 'ADMIN' && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  if (requiredRole === 'PLAYER' && !isPlayer) {
    return <Navigate to="/admin" />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { currentUser, isAdmin } = useAuth();
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={!currentUser ? <LoginPage /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} 
      />
      <Route 
        path="/register" 
        element={!currentUser ? <RegisterPage /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} />} 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requiredRole="PLAYER">
            <PlayerDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={currentUser ? (isAdmin ? "/admin" : "/dashboard") : "/login"} />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;