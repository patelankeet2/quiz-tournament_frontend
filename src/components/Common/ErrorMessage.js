import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry, retryText = 'Try Again' }) => {
  return (
    <div className="error-message">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          {retryText}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;