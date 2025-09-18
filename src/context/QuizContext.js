import React, { createContext, useContext, useState, useEffect } from 'react';
import { quizService } from '../services/quiz';

const QuizContext = createContext();

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [userQuizzes, setUserQuizzes] = useState({ ongoing: [], upcoming: [], past: [] });
  const [userHistory, setUserHistory] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAllQuizzes = async () => {
  try {
    setLoading(true);
    const data = await quizService.getAllQuizzes();
    // Handle both array and object response formats
    const quizzesArray = Array.isArray(data) ? data : (data.quizzes || []);
    setQuizzes(quizzesArray);
    return quizzesArray;
  } catch (error) {
    setError('Failed to load quizzes');
    console.error('Error loading quizzes:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};


  // Load user-specific quiz data
  const loadUserQuizData = async () => {
    try {
      setLoading(true);
      const [statusData, historyData, recData, bookmarkData] = await Promise.all([
        quizService.getQuizStatus(),
        quizService.getUserHistory(),
        quizService.getRecommendations(),
        quizService.getUserBookmarks()
      ]);
      
      setUserQuizzes(statusData);
      setUserHistory(historyData);
      setRecommendations(recData);
      setBookmarks(bookmarkData);
      
      return { statusData, historyData, recData, bookmarkData };
    } catch (error) {
      setError('Failed to load user quiz data');
      console.error('Error loading user quiz data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load admin statistics
  const loadAdminStats = async () => {
    try {
      setLoading(true);
      const data = await quizService.getAdminStats();
      return data;
    } catch (error) {
      setError('Failed to load admin statistics');
      console.error('Error loading admin stats:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new quiz
  const createQuiz = async (quizData) => {
    try {
      setLoading(true);
      const newQuiz = await quizService.createQuiz(quizData);
      setQuizzes(prev => [...prev, newQuiz]);
      return newQuiz;
    } catch (error) {
      setError('Failed to create quiz');
      console.error('Error creating quiz:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a quiz
  const updateQuiz = async (id, quizData) => {
    try {
      setLoading(true);
      const updatedQuiz = await quizService.updateQuiz(id, quizData);
      setQuizzes(prev => prev.map(quiz => 
        quiz.id === id ? updatedQuiz : quiz
      ));
      return updatedQuiz;
    } catch (error) {
      setError('Failed to update quiz');
      console.error('Error updating quiz:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a quiz
  const deleteQuiz = async (id) => {
    try {
      setLoading(true);
      await quizService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    } catch (error) {
      setError('Failed to delete quiz');
      console.error('Error deleting quiz:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Bookmark a quiz
  const bookmarkQuiz = async (quizId) => {
    try {
      const response = await quizService.bookmarkQuiz(quizId);
      setBookmarks(prev => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error bookmarking quiz:', error);
      throw error;
    }
  };

  // Remove bookmark
  const removeBookmark = async (quizId) => {
    try {
      await quizService.removeBookmark(quizId);
      setBookmarks(prev => prev.filter(bookmark => bookmark.quizId !== quizId));
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  };

  // Like a quiz
  const likeQuiz = async (quizId) => {
    try {
      return await quizService.likeQuiz(quizId);
    } catch (error) {
      console.error('Error liking quiz:', error);
      throw error;
    }
  };

  // Unlike a quiz
  const unlikeQuiz = async (quizId) => {
    try {
      return await quizService.unlikeQuiz(quizId);
    } catch (error) {
      console.error('Error unliking quiz:', error);
      throw error;
    }
  };

  // Clear errors
  const clearError = () => {
    setError('');
  };

  // Check if quiz is bookmarked
  const isQuizBookmarked = (quizId) => {
    return bookmarks.some(bookmark => bookmark.quizId === quizId);
  };

  const value = {
    // State
    quizzes,
    userQuizzes,
    userHistory,
    recommendations,
    bookmarks,
    loading,
    error,
    
    // Actions
    loadAllQuizzes,
    loadUserQuizData,
    loadAdminStats,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    bookmarkQuiz,
    removeBookmark,
    likeQuiz,
    unlikeQuiz,
    clearError,
    isQuizBookmarked
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};