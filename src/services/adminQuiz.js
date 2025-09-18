import api from './api';

const handleResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.statusText || 'Request failed');
};

const handleError = (error, context = '') => {
  console.error(`API Error in ${context}:`, error);
  
  if (error.response?.data) {
    const errorMessage = error.response.data.message || 
                         error.response.data.error || 
                         error.response.data;
    throw new Error(errorMessage);
  }
  
  if (error.message) {
    throw new Error(error.message);
  }
  
  throw new Error('Network error occurred');
};

// Safe parser to handle circular references
const safeParseQuizData = (data) => {
  if (!data) return [];
  
  try {
    // Stringify and parse to break circular references
    const jsonString = JSON.stringify(data, (key, value) => {
      // Remove circular references
      if (key === 'quiz' && value && typeof value === 'object') {
        return { id: value.id, name: value.name };
      }
      return value;
    });
    
    const parsed = JSON.parse(jsonString);
    
    // Extract quizzes from various response formats
    let quizzes = [];
    
    if (Array.isArray(parsed)) {
      quizzes = parsed;
    } else if (parsed.quizzes && Array.isArray(parsed.quizzes)) {
      quizzes = parsed.quizzes;
    } else if (parsed.data && Array.isArray(parsed.data)) {
      quizzes = parsed.data;
    } else if (parsed) {
      quizzes = [parsed];
    }
    
    // Clean up each quiz
    return quizzes.map(quiz => ({
      id: quiz.id,
      name: quiz.name,
      category: quiz.category,
      difficulty: quiz.difficulty,
      startDate: quiz.startDate,
      endDate: quiz.endDate,
      minPassingPercentage: quiz.minPassingPercentage,
      // Remove nested circular references
      questions: Array.isArray(quiz.questions) ? quiz.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        correctAnswer: q.correctAnswer,
        isBoolean: q.isBoolean,
        choices: q.choices
      })) : []
    }));
    
  } catch (error) {
    console.error('Error in safeParseQuizData:', error);
    return [];
  }
};

export const adminQuizService = {
  // Get all quizzes with circular reference handling
  getAllQuizzes: async () => {
    try {
      const response = await api.get('/quiz/all');
      const data = handleResponse(response);
      return safeParseQuizData(data);
    } catch (error) {
      return handleError(error, 'getAllQuizzes');
    }
  },
  
  // Get quiz by ID
  getQuiz: async (id) => {
    try {
      const response = await api.get(`/quiz/${id}`);
      const data = handleResponse(response);
      return safeParseQuizData(data)[0]; // Return first quiz
    } catch (error) {
      return handleError(error, 'getQuiz');
    }
  },
  
  // Other admin-specific methods...
  createQuiz: async (quizData) => {
    try {
      const response = await api.post('/admin/quiz', quizData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'createQuiz');
    }
  },
  
  updateQuiz: async (id, quizData) => {
    try {
      const response = await api.put(`/admin/quiz/${id}`, quizData);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'updateQuiz');
    }
  },
  
  deleteQuiz: async (id) => {
    try {
      const response = await api.delete(`/admin/quiz/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'deleteQuiz');
    }
  }
};