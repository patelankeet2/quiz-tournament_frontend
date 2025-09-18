import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import QuizPlayer from './QuizPlayer';

const QuizCard = ({ quiz, tab, onQuizCompleted }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [playingQuiz, setPlayingQuiz] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBookmarkStatus();
    loadLikeCount();
  }, [quiz.id]);

  const loadBookmarkStatus = async () => {
    try {
      const data = await quizService.getBookmarkStatus(quiz.id);
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error loading bookmark status:', error);
    }
  };

  const loadLikeCount = async () => {
    try {
      const data = await quizService.getLikeCount(quiz.id);
      setLikeCount(data.likes);
    } catch (error) {
      console.error('Error loading like count:', error);
    }
  };

  const handleBookmarkToggle = async () => {
    try {
      setLoading(true);
      if (isBookmarked) {
        await quizService.removeBookmark(quiz.id);
        setIsBookmarked(false);
      } else {
        await quizService.bookmarkQuiz(quiz.id);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayQuiz = () => {
    setPlayingQuiz(true);
  };

  const handleQuizComplete = (score, passed) => {
    setPlayingQuiz(false);
    if (onQuizCompleted) {
      onQuizCompleted();
    }
  };

  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return '';
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  if (playingQuiz) {
    return (
      <div className="quiz-card-full">
        <QuizPlayer 
          quiz={quiz} 
          onComplete={handleQuizComplete}
        />
      </div>
    );
  }

  const isUpcoming = tab === 'upcoming';
  const isPast = tab === 'past' || tab === 'history';
  const canPlay = tab === 'ongoing' || tab === 'recommended';

  return (
    <div className="quiz-card">
      <div className="quiz-card-header">
        <h3>{quiz.name}</h3>
        <div className="quiz-meta">
          <span className="quiz-category">{quiz.category}</span>
          {quiz.difficulty && (
            <span className={`quiz-difficulty ${getDifficultyClass(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
          )}
        </div>
      </div>
      
      <div className="quiz-card-body">
        <div className="quiz-dates">
          <div className="quiz-date">
            <span>Starts:</span>
            <span>{new Date(quiz.startDate).toLocaleString()}</span>
          </div>
          <div className="quiz-date">
            <span>Ends:</span>
            <span>{new Date(quiz.endDate).toLocaleString()}</span>
          </div>
        </div>
        
        <div className="quiz-stats">
          <span className="likes-count">❤️ {likeCount} likes</span>
          {quiz.participated && <span className="participated-badge">Played</span>}
        </div>
        
        <div className="quiz-actions">
          {canPlay && (
            <button className="play-btn" onClick={handlePlayQuiz}>
              Play Quiz
            </button>
          )}
          
          {isUpcoming && (
            <button className="play-btn" disabled>
              Starts Soon
            </button>
          )}
          
          {isPast && (
            <button className="play-btn" disabled>
              Ended
            </button>
          )}
          
          <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={handleBookmarkToggle}
            disabled={loading}
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;