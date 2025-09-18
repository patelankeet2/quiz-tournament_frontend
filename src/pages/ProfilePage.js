import React, { useState, useEffect } from 'react';
import { userService } from '../services/user';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    country: '',
    occupation: '',
    educationLevel: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        age: currentUser.age || '',
        city: currentUser.city || '',
        country: currentUser.country || '',
        occupation: currentUser.occupation || '',
        educationLevel: currentUser.educationLevel || ''
      });
    }
  }, [currentUser]);

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
    
    if (successMessage) {
      setSuccessMessage('');
    }
    
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.age && (formData.age < 13 || formData.age > 120)) {
      newErrors.age = 'Age must be between 13 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await userService.updateProfile(formData);
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner text="Loading profile..." />;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>
      
      <div className="profile-content">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        
        {error && (
          <ErrorMessage message={error} />
        )}
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'error' : ''}
                min="13"
                max="120"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="occupation">Occupation</label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="educationLevel">Education Level</label>
            <select
              id="educationLevel"
              name="educationLevel"
              value={formData.educationLevel}
              onChange={handleChange}
            >
              <option value="">Select education level</option>
              <option value="High School">High School</option>
              <option value="Bachelor's Degree">Bachelor's Degree</option>
              <option value="Master's Degree">Master's Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
        
        <div className="profile-info">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Role:</span>
              <span className="info-value">{currentUser.role}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Member since:</span>
              <span className="info-value">
                {new Date(currentUser.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;