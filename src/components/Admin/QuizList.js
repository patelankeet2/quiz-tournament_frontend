import React, { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz';
import EditQuizModal from './EditQuizModal';
import QuizQuestions from './QuizQuestions';

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

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (error) {
      setError('Failed to load quizzes');
      console.error('Error loading quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await quizService.deleteQuiz(id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      alert('Failed to delete quiz');
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

  if (loading) return <div className="loading">Loading quizzes...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="quiz-list-container">
      <h2>Quiz Tournaments</h2>
      
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
                <td>{new Date(quiz.startDate).toLocaleString()}</td>
                <td>{new Date(quiz.endDate).toLocaleString()}</td>
                <td>{quiz.minPassingPercentage}%</td>
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