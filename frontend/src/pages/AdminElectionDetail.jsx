import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './AdminElectionDetail.css';

const AdminElectionDetail = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchData();
  }, [electionId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [electionRes, candidatesRes] = await Promise.all([
        api.get(`/elections/${electionId}`),
        api.get(`/elections/${electionId}/candidates`),
      ]);

      setElection(electionRes.data.data);
      setCandidates(candidatesRes.data.data || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load election details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!newCandidateName.trim()) {
      setAlert({
        type: 'warning',
        message: 'Please enter candidate name',
      });
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/elections/${electionId}/candidates`, {
        name: newCandidateName,
      });

      setAlert({
        type: 'success',
        message: 'Candidate added successfully',
      });
      setNewCandidateName('');
      fetchData();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add candidate',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    if (!window.confirm('Are you sure you want to delete this candidate?')) {
      return;
    }

    try {
      await api.delete(`/elections/${electionId}/candidates/${candidateId}`);
      setAlert({
        type: 'success',
        message: 'Candidate deleted successfully',
      });
      fetchData();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete candidate',
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading election details..." />;
  }

  if (!election) {
    return (
      <div className="detail-container">
        <Alert type="error" message="Election not found" />
      </div>
    );
  }

  return (
    <div className="detail-container">
      <button className="back-button" onClick={() => navigate('/admin/elections')}>
        ← Back to Elections
      </button>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="detail-card">
        <div className="election-info">
          <h1>{election.title}</h1>
          <div className="election-meta">
            <div className="meta-item">
              <span className="meta-label">Status:</span>
              <span className={`status-badge status-${election.status.toLowerCase()}`}>
                {election.status}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Start:</span>
              <span className="meta-value">
                {new Date(election.start_time).toLocaleString()}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">End:</span>
              <span className="meta-value">
                {new Date(election.end_time).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="candidates-section">
          <h2>Candidates</h2>

          <form onSubmit={handleAddCandidate} className="add-candidate-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Enter candidate name"
                value={newCandidateName}
                onChange={(e) => setNewCandidateName(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                className="add-btn"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : '+ Add Candidate'}
              </button>
            </div>
          </form>

          {candidates.length === 0 ? (
            <div className="no-candidates">
              <p>No candidates added yet</p>
            </div>
          ) : (
            <div className="candidates-list">
              {candidates.map((candidate, index) => (
                <div key={candidate.candidate_id} className="candidate-item">
                  <div className="candidate-number">{index + 1}</div>
                  <div className="candidate-name">{candidate.name}</div>
                  <button
                    className="delete-candidate-btn"
                    onClick={() => handleDeleteCandidate(candidate.candidate_id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="action-buttons">
          <button
            className="results-btn"
            onClick={() => navigate(`/admin/elections/${electionId}/results`)}
          >
            View Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminElectionDetail;
