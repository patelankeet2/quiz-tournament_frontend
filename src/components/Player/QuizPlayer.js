import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';

const QuizPlayer = ({ quiz, onComplete }) => {
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    startQuiz();
  }, [quiz.id]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      const attemptData = await quizService.startAttempt(quiz.id);
      setAttempt(attemptData);
      loadQuestion(attemptData.attemptId);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to start quiz');
      console.error('Error starting quiz:', error);
    }
  };

  const loadQuestion = async (attemptId) => {
    try {
      const questionData = await quizService.getAttemptQuestion(attemptId);
      setCurrentQuestion(questionData);
      setSelectedAnswer('');
      setFeedback(null);
    } catch (error) {
      setError('Failed to load question');
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    try {
      const result = await quizService.submitAnswer(
        attempt.attemptId, 
        selectedAnswer
      );
      
      setFeedback(result);
      
      if (result.completed) {
        setTimeout(() => {
          onComplete(result.finalScore, result.passed);
        }, 2000);
      } else {
        setTimeout(() => {
          loadQuestion(attempt.attemptId);
        }, 1500);
      }
    } catch (error) {
      alert('Failed to submit answer');
      console.error('Error submitting answer:', error);
    }
  };

  if (loading) return <div className="loading">Loading quiz...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentQuestion) return <div className="loading">Loading question...</div>;

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h2>{quiz.name}</h2>
        <div className="quiz-progress">
          Question {currentQuestion.questionIndex + 1} of 10
        </div>
      </div>

      <div className="question-container">
        <h3 className="question-text">{currentQuestion.questionText}</h3>
        
        {feedback && (
          <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
            {feedback.correct ? '✓ Correct!' : '✗ Incorrect!'}
            {!feedback.correct && (
              <p>The correct answer is: {feedback.correctAnswer}</p>
            )}
          </div>
        )}

        {!feedback && (
          <div className="answer-options">
            {currentQuestion.choices.map((choice, index) => (
              <div key={index} className="answer-option">
                <input
                  type="radio"
                  id={`choice-${index}`}
                  name="answer"
                  value={choice}
                  checked={selectedAnswer === choice}
                  onChange={() => setSelectedAnswer(choice)}
                />
                <label htmlFor={`choice-${index}`}>{choice}</label>
              </div>
            ))}
          </div>
        )}

        <div className="quiz-actions">
          {!feedback ? (
            <button 
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          ) : feedback.completed ? (
            <div className="quiz-completed">
              <h3>Quiz Completed!</h3>
              <p>Your final score: {feedback.finalScore}/10</p>
              <p>Status: {feedback.passed ? 'Passed ✓' : 'Failed ✗'}</p>
            </div>
          ) : (
            <button onClick={() => loadQuestion(attempt.attemptId)}>
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;