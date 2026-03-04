import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './ElectionResults.css';

const ElectionResults = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        const [resultsRes, electionRes] = await Promise.all([
          api.get(`/votes/${electionId}/results`),
          api.get(`/elections/${electionId}`),
        ]);

        setResults(resultsRes.data.data);
        setElection(electionRes.data.data);
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load results',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [electionId]);

  if (loading) {
    return <LoadingSpinner message="Loading results..." />;
  }

  const totalVotes = results.reduce((sum, result) => sum + (result.vote_count || 0), 0);
  const winner = results && results.length > 0 ? results[0] : null;

  return (
    <div className="results-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="results-card">
        <h1>Election Results: {election?.title}</h1>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <div className="results-summary">
          <div className="summary-item">
            <span className="summary-label">Total Votes</span>
            <span className="summary-value">{totalVotes}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Candidates</span>
            <span className="summary-value">{results.length}</span>
          </div>
          {winner && (
            <div className="summary-item winner">
              <span className="summary-label">Leading: {winner.name}</span>
              <span className="summary-value">
                {winner.vote_count} votes ({winner.vote_percent?.toFixed(1) || 0}%)
              </span>
            </div>
          )}
        </div>

        <div className="results-list">
          <h2>Candidate Rankings</h2>
          {results.length === 0 ? (
            <p className="no-votes">No votes recorded yet</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="result-item">
                <div className="result-rank">{index + 1}</div>
                <div className="result-info">
                  <h3>{result.name}</h3>
                  <div className="result-bar-container">
                    <div
                      className="result-bar"
                      style={{
                        width: totalVotes > 0
                          ? `${(result.vote_count / totalVotes) * 100}%`
                          : '0%',
                      }}
                    ></div>
                  </div>
                </div>
                <div className="result-stats">
                  <span className="result-count">{result.vote_count} votes</span>
                  <span className="result-percent">
                    {result.vote_percent?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="results-footer">
          <small>
            Last updated: {new Date().toLocaleTimeString()}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ElectionResults;
