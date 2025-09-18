import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (authError) {
      setAuthError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setAuthError('');
    
    try {
      const response = await authService.login(formData);
      login(response, response.token);
      
      // Redirect based on role
      navigate(response.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (error) {
      setAuthError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role) => {
    const demoCredentials = {
      ADMIN: { username: 'admin', password: 'op@1234' },
      PLAYER: { username: 'demo', password: 'demo123' }
    };
    
    setFormData(demoCredentials[role]);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to your Quiz Tournament account</p>
        </div>
        
        {authError && (
          <ErrorMessage message={authError} />
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your username"
              disabled={isSubmitting}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="auth-submit-btn"
          >
            {isSubmitting ? <LoadingSpinner size="small" text="" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="demo-section">
          <p className="demo-label">Quick Demo Access:</p>
          <div className="demo-buttons">
            <button 
              type="button"
              onClick={() => handleDemoLogin('ADMIN')}
              className="demo-btn admin"
              disabled={isSubmitting}
            >
              Admin Demo
            </button>
            <button 
              type="button"
              onClick={() => handleDemoLogin('PLAYER')}
              className="demo-btn player"
              disabled={isSubmitting}
            >
              Player Demo
            </button>
          </div>
        </div>
        
        <div className="auth-footer">
          <p>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;