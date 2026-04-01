import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './VotingPage.css';

export default function VotingPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { logout } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    try {
      const [electionRes, candidatesRes] = await Promise.all([
        api.get(`/elections/${electionId}`),
        api.get(`/elections/${electionId}/candidates`)
      ]);
      setElection(electionRes.data.data);
      setCandidates(candidatesRes.data.data || []);
    } catch (err) {
      setError('Failed to load voting data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    try {
      await api.post(`/votes/${electionId}`, {
        candidateId: selectedCandidate
      });
      alert('Vote cast successfully!');
      navigate('/voter-elections');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cast vote');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div>Loading voting page...</div>;
  if (!election) return <div>Election not found</div>;

  return (
    <div className="container">
      <nav className="navbar">
        <h1>🗳️ Cast Your Vote</h1>
        <div className="nav-actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="voting-content">
        <div className="election-info">
          <h2>{election.title}</h2>
          <p>Status: {election.status}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="candidates-list">
          <h3>Select a Candidate:</h3>
          {candidates.length === 0 ? (
            <p>No candidates available</p>
          ) : (
            candidates.map(candidate => (
              <div 
                key={candidate.candidate_id} 
                className={`candidate-option ${selectedCandidate === candidate.candidate_id ? 'selected' : ''}`}
                onClick={() => setSelectedCandidate(candidate.candidate_id)}
              >
                <input 
                  type="radio" 
                  checked={selectedCandidate === candidate.candidate_id}
                  onChange={() => setSelectedCandidate(candidate.candidate_id)}
                />
                <label>{candidate.name}</label>
              </div>
            ))
          )}
        </div>

        <div className="voting-actions">
          <button onClick={handleVote} disabled={!selectedCandidate}>
            Cast Vote
          </button>
          <button onClick={() => navigate('/voter-elections')} className="secondary">
            Back to Elections
          </button>
        </div>
      </main>
    </div>
  );
}
