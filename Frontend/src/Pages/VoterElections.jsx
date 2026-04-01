import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './VoterElections.css';

export default function VoterElections() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getFilteredElections = () => {
    if (filter === 'ALL') return elections;
    return elections.filter(e => e.status === filter);
  };

  const handleVote = (electionId) => {
    navigate(`/voting/${electionId}`);
  };

  const handleViewResults = (electionId) => {
    navigate(`/results/${electionId}`);
  };

  if (loading) return <div>Loading elections...</div>;

  return (
    <div className="container">
      <nav className="navbar">
        <h1>🗳️ Voting System</h1>
        <div className="nav-actions">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main-content">
        <h2>Available Elections</h2>
        
        <div className="filters">
          <button 
            className={filter === 'ALL' ? 'active' : ''} 
            onClick={() => setFilter('ALL')}
          >
            All
          </button>
          <button 
            className={filter === 'UPCOMING' ? 'active' : ''} 
            onClick={() => setFilter('UPCOMING')}
          >
            Upcoming
          </button>
          <button 
            className={filter === 'ACTIVE' ? 'active' : ''} 
            onClick={() => setFilter('ACTIVE')}
          >
            Active
          </button>
          <button 
            className={filter === 'CLOSED' ? 'active' : ''} 
            onClick={() => setFilter('CLOSED')}
          >
            Closed
          </button>
        </div>

        <div className="elections-list">
          {getFilteredElections().length === 0 ? (
            <p>No elections found</p>
          ) : (
            getFilteredElections().map(election => (
              <div key={election.election_id} className="election-card">
                <h3>{election.title}</h3>
                <p>Status: <span className={`status ${election.status}`}>{election.status}</span></p>
                <p>Start: {new Date(election.start_time).toLocaleString()}</p>
                <p>End: {new Date(election.end_time).toLocaleString()}</p>
                <div className="actions">
                  {election.status === 'ACTIVE' && (
                    <button onClick={() => handleVote(election.election_id)}>Cast Vote</button>
                  )}
                  {election.status === 'CLOSED' && (
                    <button onClick={() => handleViewResults(election.election_id)}>View Results</button>
                  )}
                  {election.status === 'UPCOMING' && (
                    <button disabled>Coming Soon</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
