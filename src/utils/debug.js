export const debugAPI = {
  log: (endpoint, response, error = null) => {
    console.group(`API Call: ${endpoint}`);
    console.log('Response:', response);
    if (error) {
      console.error('Error:', error);
      console.log('Error Response:', error.response);
    }
    console.groupEnd();
  },
  
  parseResponse: (response, endpoint) => {
    console.log(`Parsing response from: ${endpoint}`, response);
    
    if (!response) {
      console.error('No response received');
      return null;
    }
    
    // Handle different response formats
    if (Array.isArray(response)) {
      return response;
    }
    
    if (response.data) {
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (response.data.quizzes && Array.isArray(response.data.quizzes)) {
        return response.data.quizzes;
      }
      if (response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return response.data;
    }
    
    if (response.quizzes && Array.isArray(response.quizzes)) {
      return response.quizzes;
    }
    
    console.warn('Unexpected response format:', response);
    return response;
  }
};