import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const QuizPlayer = ({ quiz, onComplete }) => {
  const [attempt, setAttempt] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(10);

  useEffect(() => {
    startQuiz();
  }, [quiz.id]);

  const startQuiz = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Starting quiz with ID:', quiz.id);
      
      const attemptData = await quizService.startAttempt(quiz.id);
      console.log('Attempt started:', attemptData);
      
      setAttempt(attemptData);
      
      // Handle different response formats
      const attemptId = attemptData.attemptId || attemptData.id || attemptData;
      if (attemptId) {
        await loadQuestion(attemptId);
      } else {
        throw new Error('No attempt ID received from server');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error.message || 'Failed to start quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = async (attemptId) => {
    try {
      console.log('Loading question for attempt:', attemptId);
      const questionData = await quizService.getAttemptQuestion(attemptId);
      console.log('Question data received:', questionData);
      
      // Handle different response formats
      const question = questionData.question || questionData;
      const currentIndex = questionData.questionIndex || questionIndex;
      const total = questionData.totalQuestions || totalQuestions;
      
      if (!question || !question.questionText) {
        throw new Error('Invalid question data received');
      }
      
      setCurrentQuestion(question);
      setQuestionIndex(currentIndex);
      setTotalQuestions(total);
      setSelectedAnswer('');
      setFeedback(null);
    } catch (error) {
      console.error('Error loading question:', error);
      setError(error.message || 'Failed to load question. Please try again.');
    }
  };

  const handleAnswerSubmit = async () => {
    if (!selectedAnswer) {
      alert('Please select an answer');
      return;
    }

    try {
      const attemptId = attempt.attemptId || attempt.id || attempt;
      const result = await quizService.submitAnswer(attemptId, selectedAnswer);
      
      setFeedback(result);
      
      // Check if quiz is completed
      const isCompleted = result.completed || result.finished || 
                         (questionIndex + 1 >= totalQuestions);
      
      if (isCompleted) {
        setTimeout(() => {
          const score = result.finalScore || result.score || 0;
          const passed = result.passed || score >= (quiz.minPassingPercentage || 60);
          onComplete(score, passed);
        }, 2000);
      } else {
        setTimeout(() => {
          const nextAttemptId = attempt.attemptId || attempt.id || attempt;
          loadQuestion(nextAttemptId);
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert(error.message || 'Failed to submit answer. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner text="Loading quiz..." />;
  if (error) return <ErrorMessage message={error} onRetry={startQuiz} />;
  if (!currentQuestion) return <LoadingSpinner text="Loading question..." />;

  // Format answer choices
  const answerChoices = currentQuestion.choices || 
                       (currentQuestion.isBoolean ? ['True', 'False'] : []) ||
                       [];

  return (
    <div className="quiz-player">
      <div className="quiz-header">
        <h2>{quiz.name}</h2>
        <div className="quiz-progress">
          Question {questionIndex + 1} of {totalQuestions}
        </div>
      </div>

      <div className="question-container">
        <h3 className="question-text">{currentQuestion.questionText}</h3>
        
        {feedback && (
          <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
            {feedback.correct ? '✓ Correct!' : '✗ Incorrect!'}
            {!feedback.correct && feedback.correctAnswer && (
              <p>The correct answer is: {feedback.correctAnswer}</p>
            )}
          </div>
        )}

        {!feedback && (
          <div className="answer-options">
            {answerChoices.map((choice, index) => (
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
              className="primary"
            >
              Submit Answer
            </button>
          ) : (feedback.completed || feedback.finished || (questionIndex + 1 >= totalQuestions)) ? (
            <div className="quiz-completed">
              <h3>Quiz Completed!</h3>
              <p>Your final score: {feedback.finalScore || feedback.score || 0}/{totalQuestions}</p>
              <p>Status: {feedback.passed ? 'Passed ✓' : 'Failed ✗'}</p>
            </div>
          ) : (
            <button onClick={() => loadQuestion(attempt.attemptId || attempt.id || attempt)} className="primary">
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPlayer;