import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import WalletConnect from '../components/WalletConnect';
import ElectionCountdown from '../components/ElectionCountdown';
import VotingABI from '../contracts/Voting.json';
import './VotingPage.css';

export default function VotingPage() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const { logout } = useAuth();
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedCandidateName, setSelectedCandidateName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [txPending, setTxPending] = useState(false);
  const [voteCast, setVoteCast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  const handleWalletConnected = (prov, addr) => {
    setProvider(prov);
    setWalletAddress(addr);
  };

  const handleVote = async () => {
    if (!selectedCandidate) {
      setError('Please select a candidate');
      return;
    }

    if (!provider) {
      setError('Please connect your wallet first.');
      return;
    }

    setShowConfirm(false);
    setTxPending(true);
    try {
      // 1. Find the onchain index of the candidate
      const candidateIndex = candidates.findIndex(c => c.candidate_id === selectedCandidate);
      if (candidateIndex === -1) {
        throw new Error('Candidate not found');
      }

      // 2. Record in backend (for off-chain query speed)
      await api.post(`/votes/${electionId}`, {
        candidateId: selectedCandidate
      });

      // 3. Also write to blockchain
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        VotingABI.abi,
        signer
      );
      const tx = await contract.castVote(candidateIndex);
      await tx.wait();
      setTxHash(tx.hash);
      setVoteCast(true);
    } catch (err) {
      setError(err.reason || err.message || 'Vote failed.');
    } finally {
      setTxPending(false);
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
          {election.end_time && (
            <ElectionCountdown targetTime={election.end_time} label="Election ends in" />
          )}
        </div>

        <div className="wallet-section">
          <WalletConnect onConnected={handleWalletConnected} />
        </div>

        {error && <div className="error-message">{error}</div>}

        {!voteCast && (
          <div className="candidates-list">
            <h3>Select a Candidate:</h3>
            {candidates.length === 0 ? (
              <p>No candidates available</p>
            ) : (
              candidates.map(candidate => (
                <div 
                  key={candidate.candidate_id} 
                  className={`candidate-option ${selectedCandidate === candidate.candidate_id ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedCandidate(candidate.candidate_id);
                    setSelectedCandidateName(candidate.name);
                  }}
                >
                  <input 
                    type="radio" 
                    checked={selectedCandidate === candidate.candidate_id}
                    onChange={() => {
                      setSelectedCandidate(candidate.candidate_id);
                      setSelectedCandidateName(candidate.name);
                    }}
                  />
                  <label>{candidate.name}</label>
                </div>
              ))
            )}
          </div>
        )}

        {!voteCast && (
          <div className="voting-actions">
            <button 
              onClick={() => setShowConfirm(true)} 
              disabled={!selectedCandidate || !provider || txPending}
            >
              {txPending ? 'Processing...' : 'Cast Vote'}
            </button>
            <button onClick={() => navigate('/voter-elections')} className="secondary">
              Back to Elections
            </button>
          </div>
        )}

        {showConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Confirm your vote</h3>
              <p>You are voting for <strong>{selectedCandidateName}</strong>. This cannot be undone.</p>
              <div className="modal-actions">
                <button onClick={handleVote}>Yes, cast my vote</button>
                <button onClick={() => setShowConfirm(false)} className="secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {txHash && (
          <div className="tx-receipt">
            <p>Vote recorded on-chain!</p>
            <a href={`http://localhost:8545/tx/${txHash}`} target="_blank" rel="noreferrer">
              View transaction: {txHash.slice(0, 10)}…
            </a>
          </div>
        )}

        {voteCast && (
          <div className="vote-success">
            <h3>✓ Vote Cast Successfully!</h3>
            <p>Your vote has been recorded both on-chain and in the database.</p>
            <button onClick={() => navigate('/voter-elections')}>Return to Elections</button>
          </div>
        )}
      </main>
    </div>
  );
}
