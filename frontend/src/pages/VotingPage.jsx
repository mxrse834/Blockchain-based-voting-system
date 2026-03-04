import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './VotingPage.css';

const VotingPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [electionRes, candidatesRes, myVoteRes] = await Promise.all([
          api.get(`/elections/${electionId}`),
          api.get(`/elections/${electionId}/candidates`),
          api.get(`/votes/${electionId}/my-vote`),
        ]);

        setElection(electionRes.data.data);
        setCandidates(candidatesRes.data.data);
        if (myVoteRes.data.data) {
          setMyVote(myVoteRes.data.data);
          setSelectedCandidate(myVoteRes.data.data.candidate_id);
        }
      } catch (error) {
        setAlert({
          type: 'error',
          message: error.response?.data?.message || 'Failed to load election',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [electionId]);

  const handleVote = async () => {
    if (!selectedCandidate) {
      setAlert({
        type: 'warning',
        message: 'Please select a candidate',
      });
      return;
    }

    setSubmitting(true);
    setAlert(null);

    try {
      const response = await api.post(`/votes/${electionId}`, {
        candidateId: selectedCandidate,
      });

      setAlert({
        type: 'success',
        message: response.data.message,
      });

      setTimeout(() => {
        navigate('/voter/elections');
      }, 2000);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to cast vote',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading election..." />;
  }

  if (!election) {
    return (
      <div className="voting-container">
        <Alert type="error" message="Election not found" />
      </div>
    );
  }

  const isVotingClosed = new Date() > new Date(election.end_time);
  const isVotingNotStarted = new Date() < new Date(election.start_time);
  const canVote = !isVotingClosed && !isVotingNotStarted && !myVote;

  return (
    <div className="voting-container">
      <button className="back-button" onClick={() => navigate('/voter/elections')}>
        ← Back
      </button>

      <div className="voting-card">
        <h1>{election.title}</h1>
        <div className="election-status">
          <span className={`status-badge status-${election.status.toLowerCase()}`}>
            {election.status}
          </span>
          <span className="election-time">
            {new Date(election.start_time).toLocaleString()} -{' '}
            {new Date(election.end_time).toLocaleString()}
          </span>
        </div>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {myVote && (
          <Alert
            type="info"
            message={`You have already voted for ${myVote.name}`}
          />
        )}

        {isVotingNotStarted && (
          <Alert
            type="warning"
            message="Voting has not started yet"
          />
        )}

        {isVotingClosed && (
          <Alert
            type="info"
            message="Voting has ended"
          />
        )}

        <div className="candidates-section">
          <h2>Candidates</h2>
          <div className="candidates-grid">
            {candidates.map((candidate) => (
              <div
                key={candidate.candidate_id}
                className={`candidate-card ${
                  selectedCandidate === candidate.candidate_id ? 'selected' : ''
                } ${!canVote ? 'disabled' : ''}`}
                onClick={() => canVote && setSelectedCandidate(candidate.candidate_id)}
              >
                <div className="candidate-number">
                  {candidates.indexOf(candidate) + 1}
                </div>
                <h3>{candidate.name}</h3>
                {selectedCandidate === candidate.candidate_id && (
                  <div className="selected-check">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {canVote && (
          <div className="voting-actions">
            <button
              className="vote-button"
              onClick={handleVote}
              disabled={submitting || !selectedCandidate}
            >
              {submitting ? 'Casting Vote...' : 'Cast Vote'}
            </button>
          </div>
        )}

        {myVote && (
          <button
            className="results-button"
            onClick={() => navigate(`/voter/elections/${electionId}/results`)}
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
};

export default VotingPage;
