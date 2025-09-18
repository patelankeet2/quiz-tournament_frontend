import React, { useState } from 'react';
import { quizService } from '../../services/quiz';

const CreateQuizModal = ({ isOpen, onClose, onQuizCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    difficulty: 'EASY',
    startDate: '',
    endDate: '',
    minPassingPercentage: 60
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'General Knowledge', 'Entertainment: Books', 'Entertainment: Film',
    'Entertainment: Music', 'Entertainment: Musicals & Theatres',
    'Entertainment: Television', 'Entertainment: Video Games',
    'Entertainment: Board Games', 'Science & Nature', 'Science: Computers',
    'Science: Mathematics', 'Mythology', 'Sports', 'Geography', 'History',
    'Politics', 'Art', 'Celebrities', 'Animals', 'Vehicles',
    'Entertainment: Comics', 'Science: Gadgets',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations'
  ];

  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Quiz name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (formData.minPassingPercentage < 0 || formData.minPassingPercentage > 100) {
      newErrors.minPassingPercentage = 'Passing percentage must be between 0 and 100';
    }
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end <= start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await quizService.createQuiz(formData);
      onQuizCreated();
      onClose();
      setFormData({
        name: '',
        category: '',
        difficulty: 'EASY',
        startDate: '',
        endDate: '',
        minPassingPercentage: 60
      });
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create New Quiz Tournament</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-group">
            <label htmlFor="name">Quiz Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              {difficulties.map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? 'error' : ''}
            />
            {errors.startDate && <span className="error-text">{errors.startDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">End Date *</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={errors.endDate ? 'error' : ''}
            />
            {errors.endDate && <span className="error-text">{errors.endDate}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="minPassingPercentage">Minimum Passing Percentage *</label>
            <input
              type="number"
              id="minPassingPercentage"
              name="minPassingPercentage"
              min="0"
              max="100"
              value={formData.minPassingPercentage}
              onChange={handleChange}
              className={errors.minPassingPercentage ? 'error' : ''}
            />
            {errors.minPassingPercentage && (
              <span className="error-text">{errors.minPassingPercentage}</span>
            )}
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;