import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Welcome to Blockchain Voting System</h1>
          <p>
            Secure, transparent, and tamper-proof voting on the blockchain.
            Every vote counts, and every vote is verifiable.
          </p>

          {!isAuthenticated ? (
            <div className="hero-buttons">
              <button
                className="btn-primary-large"
                onClick={() => navigate('/login')}
              >
                Login to Vote
              </button>
              <button
                className="btn-secondary-large"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="hero-buttons">
              <button
                className="btn-primary-large"
                onClick={() => navigate(isAdmin ? '/admin/elections' : '/voter/elections')}
              >
                {isAdmin ? 'Manage Elections' : 'Vote Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <h2>Why Choose Blockchain Voting?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure</h3>
            <p>End-to-end encrypted voting with blockchain immutability</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👁️</div>
            <h3>Transparent</h3>
            <p>Publicly verifiable votes with complete audit trails</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast</h3>
            <p>Instant vote registration and real-time result counting</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Trust-less</h3>
            <p>No central authority needed - verify everything yourself</p>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <h3>For Voters</h3>
          <ul>
            <li>Join elections with one click</li>
            <li>Vote securely and anonymously</li>
            <li>View real-time election results</li>
            <li>Verify your vote on the blockchain</li>
          </ul>
        </div>
        <div className="info-card">
          <h3>For Administrators</h3>
          <ul>
            <li>Create and manage elections easily</li>
            <li>Define election timeframes</li>
            <li>Manage candidates</li>
            <li>Monitor live election progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
