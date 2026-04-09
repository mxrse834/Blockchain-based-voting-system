import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import WalletConnect from '../components/WalletConnect';
import ElectionCountdown from '../components/ElectionCountdown';
import StatusBadge from '../components/StatusBadge';
import VotingABI from '../contracts/Voting.json';
import { Vote, ArrowLeft, CheckCircle2, ExternalLink, Wallet, Timer, AlertCircle } from 'lucide-react';

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
      const candidateIndex = candidates.findIndex(c => c.candidate_id === selectedCandidate);
      if (candidateIndex === -1) {
        throw new Error('Candidate not found');
      }

      await api.post(`/votes/${electionId}`, {
        candidateId: selectedCandidate
      });

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

  if (loading) return <Layout><LoadingSpinner message="Loading ballot..." /></Layout>;
  if (!election) return <Layout><div className="text-center py-20 text-surface-500">Election not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => navigate('/voter-elections')}
          className="btn-ghost mb-6 -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </button>

        {/* Election info header */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 mb-6">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
              {election.title}
            </h1>
            <StatusBadge status={election.status} />
          </div>
          {election.end_time && (
            <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
              <Timer className="w-4 h-4" />
              <ElectionCountdown targetTime={election.end_time} label="Election ends in" />
            </div>
          )}
        </div>

        {/* Wallet connect */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Wallet Connection</h2>
          </div>
          <WalletConnect onConnected={handleWalletConnected} />
          {walletAddress && (
            <p className="mt-3 text-xs text-surface-500 dark:text-surface-400 font-mono bg-surface-50 dark:bg-surface-700/50 px-3 py-2 rounded-lg">
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm animate-slide-down">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Candidate selection */}
        {!voteCast && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">
              Select a candidate
            </h2>
            {candidates.length === 0 ? (
              <p className="text-surface-500 dark:text-surface-400 text-sm">No candidates available</p>
            ) : (
              <div className="space-y-3">
                {candidates.map(candidate => (
                  <button
                    key={candidate.candidate_id}
                    onClick={() => {
                      setSelectedCandidate(candidate.candidate_id);
                      setSelectedCandidateName(candidate.name);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedCandidate === candidate.candidate_id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                        : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-surface-50 dark:bg-surface-800/50'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      selectedCandidate === candidate.candidate_id
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-surface-300 dark:border-surface-600'
                    }`}>
                      {selectedCandidate === candidate.candidate_id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <span className={`font-medium ${
                      selectedCandidate === candidate.candidate_id
                        ? 'text-brand-700 dark:text-brand-300'
                        : 'text-surface-700 dark:text-surface-300'
                    }`}>
                      {candidate.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!voteCast && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!selectedCandidate || !provider || txPending}
              className="btn-primary flex-1 py-3.5"
            >
              {txPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Vote className="w-5 h-5" />
                  Cast Vote
                </>
              )}
            </button>
          </div>
        )}

        {/* Confirm modal */}
        {showConfirm && (
          <ConfirmModal
            title="Confirm your vote"
            message={<>You are voting for <strong>{selectedCandidateName}</strong>. This action cannot be undone. Your vote will be recorded on the blockchain permanently.</>}
            confirmLabel="Yes, cast my vote"
            cancelLabel="Cancel"
            onConfirm={handleVote}
            onCancel={() => setShowConfirm(false)}
            icon={Vote}
          />
        )}

        {/* Success state */}
        {voteCast && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 shadow-card p-8 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">
              Vote Cast Successfully!
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Your vote has been recorded both on-chain and in the database.
            </p>

            {txHash && (
              <div className="mb-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Transaction Hash</p>
                <a
                  href={`http://localhost:8545/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-mono text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {txHash.slice(0, 16)}…{txHash.slice(-8)}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            <button
              onClick={() => navigate('/voter-elections')}
              className="btn-primary"
            >
              Return to Elections
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
