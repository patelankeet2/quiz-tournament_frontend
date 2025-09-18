import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>Quiz Tournament</h1>
        </Link>
        
        <nav className="nav">
          {currentUser ? (
            <>
              <Link to={isAdmin ? "/admin" : "/dashboard"}>
                Dashboard
              </Link>
              <Link to="/profile">
                Profile
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
              <span className="user-greeting">
                Hello, {currentUser.firstName} ({currentUser.role})
              </span>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;