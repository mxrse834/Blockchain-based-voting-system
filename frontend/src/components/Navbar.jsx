import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🗳️</span>
          Blockchain Voting System
        </Link>

        <div className="navbar-menu">
          {!isAuthenticated ? (
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link btn-primary">Register</Link>
            </div>
          ) : (
            <div className="nav-links authenticated">
              {isAdmin && (
                <>
                  <Link to="/admin/elections" className="nav-link">Elections</Link>
                  <Link to="/admin/create-election" className="nav-link">Create Election</Link>
                </>
              )}
              {!isAdmin && (
                <Link to="/voter/elections" className="nav-link">Vote</Link>
              )}
              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
