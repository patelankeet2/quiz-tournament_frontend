import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuiz } from '../../context/QuizContext';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './PlayerLayout.css';

const PlayerLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout, currentUser } = useAuth();
  const { error, clearError } = useQuiz();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/dashboard/ongoing', label: 'Ongoing Quizzes', icon: '🎯' },
    { path: '/dashboard/upcoming', label: 'Upcoming Quizzes', icon: '📅' },
    { path: '/dashboard/history', label: 'My History', icon: '📊' },
    { path: '/dashboard/recommendations', label: 'Recommendations', icon: '⭐' },
    { path: '/dashboard/bookmarks', label: 'Bookmarks', icon: '🔖' }
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
    <div className="player-layout">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Quiz Tournament</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            ✕
          </button>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            {currentUser?.firstName?.charAt(0)}{currentUser?.lastName?.charAt(0)}
          </div>
          <div className="user-details">
            <h4>{currentUser?.firstName} {currentUser?.lastName}</h4>
            <p>@{currentUser?.username}</p>
          </div>
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
          <Link to="/profile" className="nav-item">
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="player-content">
        {/* Header */}
        <header className="player-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            ☰
          </button>
          <h1>Player Dashboard</h1>
          <div className="header-actions">
            <Link to="/profile" className="profile-link">
              👤 {currentUser?.firstName}
            </Link>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} onRetry={clearError} />
        )}

        {/* Page Content */}
        <main className="player-main">
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

export default PlayerLayout;