import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

const QuizQuestions = ({ quiz, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions();
  }, [quiz.id]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const data = await quizService.getQuizQuestions(quiz.id);
      setQuestions(data);
    } catch (error) {
      setError('Failed to load questions');
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAnswerList = (question) => {
    if (question.isBoolean) {
      return ['True', 'False'];
    }
    return question.choices || [];
  };

  if (loading) return <LoadingSpinner text="Loading questions..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadQuestions} />;

  return (
    <div className="modal-overlay questions-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Questions for: {quiz.name}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="questions-list">
          {questions.length === 0 ? (
            <p>No questions found for this quiz.</p>
          ) : (
            questions.map((question, index) => (
              <div key={question.id} className="question-item">
                <h3 className="question-text">
                  {index + 1}. {question.questionText}
                </h3>
                
                <ul className="answer-list">
                  {formatAnswerList(question).map((answer, ansIndex) => (
                    <li 
                      key={ansIndex}
                      className={answer === question.correctAnswer ? 'correct-answer' : ''}
                    >
                      {answer}
                      {answer === question.correctAnswer && ' ✓'}
                    </li>
                  ))}
                </ul>
                
                {question.isBoolean && (
                  <p className="question-type">Boolean Question</p>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;