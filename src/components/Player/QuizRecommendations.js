import React from 'react';
import QuizCard from './QuizCard';

const QuizRecommendations = ({ recommendations, onQuizCompleted }) => {
  if (!recommendations || !recommendations.recommendedQuizzes) {
    return null;
  }

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>Recommended for You</h2>
        <p>Based on your interest in: {recommendations.favoriteCategory}</p>
      </div>
      
      <div className="quizzes-grid">
        {recommendations.recommendedQuizzes.map(quiz => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            tab="recommended"
            onQuizCompleted={onQuizCompleted}
          />
        ))}
      </div>
      
      {recommendations.recommendedQuizzes.length === 0 && (
        <div className="empty-state">
          <p>No recommendations available at this time.</p>
        </div>
      )}
    </div>
  );
};

export default QuizRecommendations;