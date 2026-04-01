import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './AdminElectionDetail.css';

export default function AdminElectionDetail() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { logout } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
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
      setError('Failed to load election data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      setError('Candidate name cannot be empty');
      return;
    }

    try {
      const response = await api.post(`/elections/${electionId}/candidates`, {
        name: newCandidateName
      });
      setCandidates([...candidates, response.data.data]);
      setNewCandidateName('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!confirm('Delete this candidate?')) return;
    try {
      await api.delete(`/elections/${electionId}/candidates/${candidateId}`);
      setCandidates(candidates.filter(c => c.candidate_id !== candidateId));
    } catch (err) {
      setError('Failed to delete candidate');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div>Loading election details...</div>;
  if (!election) return <div>Election not found</div>;

  return (
    <div className="container">
      <nav className="navbar">
        <h1>👥 Manage Candidates</h1>
        <div className="nav-actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="detail-content">
        <div className="election-info">
          <h2>{election.title}</h2>
          <p>Status: {election.status}</p>
          <button onClick={() => navigate('/admin-elections')} className="secondary">
            ← Back to Elections
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="add-candidate-section">
          <h3>Add New Candidate</h3>
          <form onSubmit={handleAddCandidate}>
            <input
              type="text"
              placeholder="Candidate name"
              value={newCandidateName}
              onChange={(e) => setNewCandidateName(e.target.value)}
              required
            />
            <button type="submit">Add Candidate</button>
          </form>
        </div>

        <div className="candidates-section">
          <h3>Candidates List</h3>
          {candidates.length === 0 ? (
            <p>No candidates added yet</p>
          ) : (
            <ul className="candidates-list">
              {candidates.map(candidate => (
                <li key={candidate.candidate_id} className="candidate-item">
                  <span>{candidate.name}</span>
                  <button 
                    onClick={() => handleDeleteCandidate(candidate.candidate_id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
