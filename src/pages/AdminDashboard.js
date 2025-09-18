import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quiz';
import CreateQuizModal from '../components/Admin/CreateQuizModal';
import QuizList from '../components/Admin/QuizList';
import UserManagement from '../components/Admin/UserManagement';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('quizzes');
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await quizService.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleQuizCreated = () => {
    loadStats();
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Quizzes</h3>
              <p className="stat-number">{stats.totalQuizzes}</p>
            </div>
            <div className="stat-card">
              <h3>Active Quizzes</h3>
              <p className="stat-number">{stats.activeQuizzes}</p>
            </div>
            <div className="stat-card">
              <h3>Total Players</h3>
              <p className="stat-number">{stats.totalPlayers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Attempts</h3>
              <p className="stat-number">{stats.totalAttempts}</p>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'quizzes' ? 'active' : ''}
          onClick={() => setActiveTab('quizzes')}
        >
          Quizzes
        </button>
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'quizzes' && (
          <div className="quizzes-section">
            <div className="section-header">
              <h2>Quiz Management</h2>
              <button 
                className="create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                Create New Quiz
              </button>
            </div>
            <QuizList />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            <UserManagement />
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateQuizModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onQuizCreated={handleQuizCreated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;