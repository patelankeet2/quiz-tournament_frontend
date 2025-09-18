// Validation utilities
export const validation = {
  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Validate password strength
  isStrongPassword: (password) => {
    return password.length >= 6;
  },
  
  // Validate username format
  isValidUsername: (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  },
  
  // Validate phone number format
  isValidPhone: (phone) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  
  // Validate age range
  isValidAge: (age) => {
    if (!age) return true; // Optional field
    const ageNum = parseInt(age, 10);
    return !isNaN(ageNum) && ageNum >= 13 && ageNum <= 120;
  },
  
  // Validate required field
  isRequired: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },
  
  // Get validation errors for a form
  getFormErrors: (formData, rules) => {
    const errors = {};
    
    Object.keys(rules).forEach(field => {
      const value = formData[field];
      const fieldRules = rules[field];
      
      for (const rule of fieldRules) {
        if (rule.required && !validation.isRequired(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.type === 'email' && !validation.isValidEmail(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.type === 'password' && !validation.isStrongPassword(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.type === 'username' && !validation.isValidUsername(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.type === 'phone' && !validation.isValidPhone(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.type === 'age' && !validation.isValidAge(value)) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.minLength && value && value.length < rule.minLength) {
          errors[field] = rule.message;
          break;
        }
        
        if (rule.maxLength && value && value.length > rule.maxLength) {
          errors[field] = rule.message;
          break;
        }
      }
    });
    
    return errors;
  }
};

// Common validation rules
export const validationRules = {
  username: [
    { required: true, message: 'Username is required' },
    { type: 'username', message: 'Username must be 3-20 characters (letters, numbers, underscores)' }
  ],
  password: [
    { required: true, message: 'Password is required' },
    { type: 'password', message: 'Password must be at least 6 characters' }
  ],
  email: [
    { required: true, message: 'Email is required' },
    { type: 'email', message: 'Email is invalid' }
  ],
  firstName: [
    { required: true, message: 'First name is required' },
    { minLength: 2, message: 'First name must be at least 2 characters' },
    { maxLength: 50, message: 'First name must be less than 50 characters' }
  ],
  lastName: [
    { required: true, message: 'Last name is required' },
    { minLength: 2, message: 'Last name must be at least 2 characters' },
    { maxLength: 50, message: 'Last name must be less than 50 characters' }
  ],
  phone: [
    { type: 'phone', message: 'Phone number is invalid' }
  ],
  age: [
    { type: 'age', message: 'Age must be between 13 and 120' }
  ]
};