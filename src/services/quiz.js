import api from './api';

export const quizService = {
  // Quiz operations
  getAllQuizzes: async () => {
    const response = await api.get('/quiz/all');
    return response.data;
  },
  
  getQuiz: async (id) => {
    const response = await api.get(`/quiz/${id}`);
    return response.data;
  },
  
  createQuiz: async (quizData) => {
    const response = await api.post('/admin/quiz', quizData);
    return response.data;
  },
  
  updateQuiz: async (id, quizData) => {
    const response = await api.put(`/admin/quiz/${id}`, quizData);
    return response.data;
  },
  
  deleteQuiz: async (id) => {
    const response = await api.delete(`/admin/quiz/${id}`);
    return response.data;
  },
  
  // Question operations
  getQuizQuestions: async (id) => {
    const response = await api.get(`/quiz/${id}/questions`);
    return response.data;
  },
  
  // Attempt operations
  startAttempt: async (id) => {
    const response = await api.post(`/quiz/${id}/start`);
    return response.data;
  },
  
  getAttemptQuestion: async (attemptId) => {
    const response = await api.get(`/quiz/attempt/${attemptId}/question`);
    return response.data;
  },
  
  submitAnswer: async (attemptId, answer) => {
    const response = await api.post(`/quiz/attempt/${attemptId}/answer`, {
      answer
    });
    return response.data;
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