import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './ElectionResults.css';

export default function ElectionResults() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { logout } = useAuth();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    try {
      const [electionRes, resultsRes, myVoteRes] = await Promise.all([
        api.get(`/elections/${electionId}`),
        api.get(`/votes/${electionId}/results`),
        api.get(`/votes/${electionId}/my-vote`)
      ]);
      setElection(electionRes.data.data);
      setResults(resultsRes.data.data || []);
      setMyVote(myVoteRes.data.data);
    } catch (err) {
      setError('Failed to load results');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div>Loading results...</div>;
  if (!election) return <div>Election not found</div>;

  const totalVotes = results.reduce((sum, r) => sum + r.vote_count, 0);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>📊 Election Results</h1>
        <div className="nav-actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="results-content">
        <div className="election-info">
          <h2>{election.title}</h2>
          <p>Status: {election.status}</p>
          <p>Total Votes: {totalVotes}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {myVote && (
          <div className="my-vote-info">
            <p>✓ You voted for: <strong>{myVote.name}</strong></p>
          </div>
        )}

        <div className="results-list">
          <h3>Results:</h3>
          {results.length === 0 ? (
            <p>No votes cast yet</p>
          ) : (
            results.map((result, index) => {
              const percentage = totalVotes > 0 ? (result.vote_count / totalVotes * 100).toFixed(1) : 0;
              return (
                <div key={result.candidate_id} className="result-item">
                  <div className="result-header">
                    <span className="rank">{index + 1}.</span>
                    <span className="name">{result.name}</span>
                    <span className="votes">{result.vote_count} votes</span>
                  </div>
                  <div className="result-bar">
                    <div className="bar-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="percentage">{percentage}%</span>
                </div>
              );
            })
          )}
        </div>

        <div className="results-actions">
          <button onClick={() => navigate('/voter-elections')} className="primary">
            Back to Elections
          </button>
        </div>
      </main>
    </div>
  );
}
