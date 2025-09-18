import React, { useState, useEffect } from 'react';
import { quizService } from '../services/quiz';
import QuizCard from '../components/Player/QuizCard';
import QuizProgress from '../components/Player/QuizProgress';
import QuizRecommendations from '../components/Player/QuizRecommendations';
import '../styles/Player.css';

const PlayerDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [quizzes, setQuizzes] = useState({ ongoing: [], upcoming: [], past: [] });
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statusData, historyData, recData] = await Promise.all([
        quizService.getQuizStatus(),
        quizService.getUserHistory(),
        quizService.getRecommendations()
      ]);
      
      setQuizzes(statusData);
      setHistory(historyData);
      setRecommendations(recData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQuizzesForTab = () => {
    switch (activeTab) {
      case 'ongoing': return quizzes.ongoing;
      case 'upcoming': return quizzes.upcoming;
      case 'past': return quizzes.past;
      case 'history': return history;
      case 'recommended': return recommendations?.recommendedQuizzes || [];
      default: return [];
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="player-dashboard">
      <div className="dashboard-header">
        <h1>Player Dashboard</h1>
        <QuizProgress history={history} />
      </div>

      <div className="dashboard-tabs">
        <button
          className={activeTab === 'ongoing' ? 'active' : ''}
          onClick={() => setActiveTab('ongoing')}
        >
          Ongoing Quizzes
        </button>
        <button
          className={activeTab === 'upcoming' ? 'active' : ''}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Quizzes
        </button>
        <button
          className={activeTab === 'past' ? 'active' : ''}
          onClick={() => setActiveTab('past')}
        >
          Past Quizzes
        </button>
        <button
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          My History
        </button>
        <button
          className={activeTab === 'recommended' ? 'active' : ''}
          onClick={() => setActiveTab('recommended')}
        >
          Recommendations
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'recommended' && recommendations && (
          <div className="recommendations-header">
            <h2>Recommended for you</h2>
            <p>Based on your interest in: {recommendations.favoriteCategory}</p>
          </div>
        )}

        <div className="quizzes-grid">
          {getQuizzesForTab().map(quiz => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              tab={activeTab}
              onQuizCompleted={loadData}
            />
          ))}
        </div>

        {getQuizzesForTab().length === 0 && (
          <div className="empty-state">
            <p>No quizzes found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerDashboard;