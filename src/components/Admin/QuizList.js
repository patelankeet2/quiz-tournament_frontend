import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import EditQuizModal from './EditQuizModal';
import QuizQuestions from './QuizQuestions';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import { adminQuizService } from '../../services/adminQuiz';
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [viewingQuestions, setViewingQuestions] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Function to safely parse quiz data and break circular references
  const parseQuizData = (quizData) => {
    if (!quizData) return [];
    
    try {
      // Handle array response
      if (Array.isArray(quizData)) {
        return quizData.map(quiz => ({
          id: quiz.id,
          name: quiz.name,
          category: quiz.category,
          difficulty: quiz.difficulty,
          startDate: quiz.startDate,
          endDate: quiz.endDate,
          minPassingPercentage: quiz.minPassingPercentage,
          // Remove circular references from questions
          questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
            id: q.id,
            questionText: q.questionText,
            correctAnswer: q.correctAnswer,
            isBoolean: q.isBoolean,
            choices: q.choices
          })) : []
        }));
      }
      
      // Handle object response with quizzes array
      if (quizData.quizzes && Array.isArray(quizData.quizzes)) {
        return quizData.quizzes.map(quiz => ({
          id: quiz.id,
          name: quiz.name,
          category: quiz.category,
          difficulty: quiz.difficulty,
          startDate: quiz.startDate,
          endDate: quiz.endDate,
          minPassingPercentage: quiz.minPassingPercentage,
          questions: []
        }));
      }
      
      // Handle single quiz object
      if (quizData.id) {
        return [{
          id: quizData.id,
          name: quizData.name,
          category: quizData.category,
          difficulty: quizData.difficulty,
          startDate: quizData.startDate,
          endDate: quizData.endDate,
          minPassingPercentage: quizData.minPassingPercentage,
          questions: []
        }];
      }
      
      return [];
    } catch (error) {
      console.error('Error parsing quiz data:', error);
      return [];
    }
  };

  const loadQuizzes = async () => {
  try {
    setLoading(true);
    setError('');
    console.log('Loading quizzes for admin...');
    
    const quizzesData = await adminQuizService.getAllQuizzes();
    console.log('Safe parsed quizzes:', quizzesData);
    
    setQuizzes(quizzesData);
    
  } catch (error) {
    console.error('Error loading quizzes:', error);
    setError(error.message || 'Failed to load quizzes. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      setDeleteConfirm(null);
      alert('Quiz deleted successfully');
    } catch (error) {
      alert(error.message || 'Failed to delete quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
  };

  const handleViewQuestions = (quiz) => {
    setViewingQuestions(quiz);
  };

  const handleQuizUpdated = () => {
    loadQuizzes();
    setEditingQuiz(null);
  };

  if (loading) return <LoadingSpinner text="Loading quizzes..." />;
  if (error) return <ErrorMessage message={error} onRetry={loadQuizzes} />;

  return (
    <div className="quiz-list-container">
      <h2>Quiz Tournaments ({quizzes.length})</h2>
      
      {quizzes.length === 0 && !loading && (
        <div className="empty-state">
          <p>No quizzes found. Create your first quiz tournament!</p>
        </div>
      )}
      
      {quizzes.length > 0 && (
        <div className="table-responsive">
          <table className="quiz-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Passing %</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map(quiz => (
                <tr key={quiz.id}>
                  <td>
                    <button 
                      className="quiz-name-btn"
                      onClick={() => handleViewQuestions(quiz)}
                    >
                      {quiz.name}
                    </button>
                  </td>
                  <td>{quiz.category}</td>
                  <td>{quiz.difficulty || 'N/A'}</td>
                  <td>{quiz.startDate ? new Date(quiz.startDate).toLocaleString() : 'N/A'}</td>
                  <td>{quiz.endDate ? new Date(quiz.endDate).toLocaleString() : 'N/A'}</td>
                  <td>{quiz.minPassingPercentage || 60}%</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(quiz)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => setDeleteConfirm(quiz.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingQuiz && (
        <EditQuizModal
          quiz={editingQuiz}
          onClose={() => setEditingQuiz(null)}
          onQuizUpdated={handleQuizUpdated}
        />
      )}

      {viewingQuestions && (
        <QuizQuestions
          quiz={viewingQuestions}
          onClose={() => setViewingQuestions(null)}
        />
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this quiz? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizList;