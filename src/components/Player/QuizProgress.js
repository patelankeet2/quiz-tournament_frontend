import React from 'react';

const QuizProgress = ({ history }) => {
  const totalQuizzes = history.length;
  const passedQuizzes = history.filter(quiz => quiz.passed).length;
  const averageScore = totalQuizzes > 0 
    ? history.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes 
    : 0;
  
  const completionPercentage = totalQuizzes > 0 
    ? Math.round((passedQuizzes / totalQuizzes) * 100) 
    : 0;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Your Progress</h2>
      </div>
      
      <div className="progress-stats">
        <div className="stat-item">
          <div className="stat-value">{totalQuizzes}</div>
          <div className="stat-label">Total Quizzes</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{passedQuizzes}</div>
          <div className="stat-label">Passed</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{Math.round(averageScore)}/10</div>
          <div className="stat-label">Avg Score</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{completionPercentage}%</div>
          <div className="stat-label">Completion</div>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>Progress</span>
          <span>{completionPercentage}%</span>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;