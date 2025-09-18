import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { error, clearError } = useQuiz();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/quizzes', label: 'Quizzes', icon: '📝' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/stats', label: 'Statistics', icon: '📈' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Quiz Tournament</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Header */}
        <header className="admin-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <Link to="/profile" className="profile-link">
              👤 Profile
            </Link>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} onRetry={clearError} />
        )}

        {/* Page Content */}
        <main className="admin-main">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default AdminLayout;