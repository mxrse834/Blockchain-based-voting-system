import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './VoterElections.css';

const VoterElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        const response = await api.get('/elections');
        setElections(response.data.data || []);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load elections',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'UPCOMING':
        return 'status-upcoming';
      case 'CLOSED':
        return 'status-closed';
      default:
        return '';
    }
  };

  const filteredElections = elections.filter((election) => {
    if (filter === 'all') return true;
    return election.status.toLowerCase() === filter;
  });

  if (loading) {
    return <LoadingSpinner message="Loading elections..." />;
  }

  return (
    <div className="elections-container">
      <div className="elections-header">
        <h1>🗳️ Available Elections</h1>
        <p>Vote in ongoing elections or view upcoming ones</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Elections
        </button>
        <button
          className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-btn ${filter === 'closed' ? 'active' : ''}`}
          onClick={() => setFilter('closed')}
        >
          Closed
        </button>
      </div>

      {filteredElections.length === 0 ? (
        <div className="no-elections">
          <p>No elections found</p>
        </div>
      ) : (
        <div className="elections-grid">
          {filteredElections.map((election) => {
            const startTime = new Date(election.start_time);
            const endTime = new Date(election.end_time);
            const now = new Date();
            const canVote = now >= startTime && now <= endTime;

            return (
              <div key={election.election_id} className="election-card">
                <div className="card-header">
                  <h2>{election.title}</h2>
                  <span className={`status-badge ${getStatusColor(election.status)}`}>
                    {election.status}
                  </span>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <span className="detail-label">Starts:</span>
                    <span className="detail-value">{startTime.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Ends:</span>
                    <span className="detail-value">{endTime.toLocaleString()}</span>
                  </div>
                </div>

                <div className="card-actions">
                  {canVote && (
                    <button
                      className="action-btn vote-btn"
                      onClick={() => navigate(`/voter/elections/${election.election_id}/vote`)}
                    >
                      Vote Now
                    </button>
                  )}
                  {election.status === 'CLOSED' && (
                    <button
                      className="action-btn results-btn"
                      onClick={() => navigate(`/voter/elections/${election.election_id}/results`)}
                    >
                      View Results
                    </button>
                  )}
                  {(election.status === 'ACTIVE' || election.status === 'CLOSED') && (
                    <button
                      className="action-btn info-btn"
                      onClick={() => navigate(`/voter/elections/${election.election_id}/results`)}
                    >
                      Results
                    </button>
                  )}
                  {election.status === 'UPCOMING' && (
                    <div className="upcoming-label">Coming Soon</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VoterElections;
