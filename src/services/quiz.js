import api from './api';

// Enhanced error handling
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

export const quizService = {
  // Quiz operations
  getAllQuizzes: async () => {
    try {
      const response = await api.get('/quiz/all');
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'getAllQuizzes');
    }
  },
  
  getQuiz: async (id) => {
    try {
      const response = await api.get(`/quiz/${id}`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'getQuiz');
    }
  },
  
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
  },
  
  // Question operations
  getQuizQuestions: async (id) => {
    try {
      const response = await api.get(`/quiz/${id}/questions`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'getQuizQuestions');
    }
  },
  
  // Attempt operations - ADD RETRY LOGIC FOR THE 500 ERROR
  startAttempt: async (id, retryCount = 0) => {
    try {
      const response = await api.post(`/quiz/${id}/start`);
      return handleResponse(response);
    } catch (error) {
      // If it's the "unique result" error, wait and retry
      if (error.message.includes('unique result') && retryCount < 3) {
        console.log(`Retrying startAttempt (${retryCount + 1}/3)...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return quizService.startAttempt(id, retryCount + 1);
      }
      return handleError(error, 'startAttempt');
    }
  },
  
  getAttemptQuestion: async (attemptId) => {
    try {
      const response = await api.get(`/quiz/attempt/${attemptId}/question`);
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'getAttemptQuestion');
    }
  },
  
  submitAnswer: async (attemptId, answer) => {
    try {
      const response = await api.post(`/quiz/attempt/${attemptId}/answer`, {
        answer
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error, 'submitAnswer');
    }
  },
  
  // Score operations
  getLeaderboard: async (id) => {
    const response = await api.get(`/quiz/${id}/leaderboard`);
    return response.data;
  },
  
  getQuizScores: async (id) => {
    const response = await api.get(`/quiz/${id}/scores`);
    return response.data;
  },
  
  // Status operations
  getQuizStatus: async () => {
    const response = await api.get('/quiz/status');
    return response.data;
  },
  
  // Search operations
  searchQuizzes: async (category) => {
    const response = await api.get(`/quiz/search?category=${category}`);
    return response.data;
  },
  
  // User history
  getUserHistory: async () => {
    const response = await api.get('/quiz/my-history');
    return response.data;
  },
  
  // Recommendations
  getRecommendations: async () => {
    const response = await api.get('/quiz/recommendations');
    return response.data;
  },
  
  // Admin operations
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/user/${userId}`);
    return response.data;
  },
  
  createAdmin: async (userData) => {
    const response = await api.post('/admin/create-admin', userData);
    return response.data;
  },
  
  // Like operations
  likeQuiz: async (quizId) => {
    const response = await api.post(`/like/${quizId}`);
    return response.data;
  },
  
  unlikeQuiz: async (quizId) => {
    const response = await api.delete(`/like/${quizId}`);
    return response.data;
  },
  
  getLikeCount: async (quizId) => {
    const response = await api.get(`/like/${quizId}/count`);
    return response.data;
  },
  
  // Bookmark operations
  bookmarkQuiz: async (quizId) => {
    const response = await api.post(`/bookmarks/${quizId}`);
    return response.data;
  },
  
  removeBookmark: async (quizId) => {
    const response = await api.delete(`/bookmarks/${quizId}`);
    return response.data;
  },
  
  getUserBookmarks: async () => {
    const response = await api.get('/bookmarks');
    return response.data;
  },
  
  getBookmarkStatus: async (quizId) => {
    const response = await api.get(`/bookmarks/${quizId}/status`);
    return response.data;
  }
};