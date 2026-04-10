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
  const [txStep, setTxStep] = useState(0);
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
    setTxStep(1); // Signing
    try {
      const candidateIndex = candidates.findIndex(c => c.candidate_id === selectedCandidate);
      if (candidateIndex === -1) {
        throw new Error('Candidate not found');
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_CONTRACT_ADDRESS,
        VotingABI.abi,
        signer
      );
      
      const tx = await contract.castVote(candidateIndex);
      
      setTxStep(2); // Broadcasting / Transacting
      
      // we can do the DB call now concurrently or wait
      await api.post(`/votes/${electionId}`, {
        candidateId: selectedCandidate
      });
      
      setTxStep(3); // Confirming
      
      await tx.wait();
      setTxHash(tx.hash);
      setVoteCast(true);
    } catch (err) {
      setError(err.reason || err.message || 'Vote failed.');
    } finally {
      setTxPending(false);
      setTxStep(0);
    }
  };

  if (loading) return <Layout><LoadingSpinner message="Loading ballot..." /></Layout>;
  if (!election) return <Layout><div className="text-center py-20 text-slate-500 font-medium">Election not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in w-full pb-12">
        {/* Back button */}
        <button
          onClick={() => navigate('/voter-elections')}
          className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Elections
        </button>

        {/* Election info header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-3 block">
                {election.title}
              </h1>
              <StatusBadge status={election.status} />
            </div>
            {election.end_time && (
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700/50">
                <Timer className="w-4 h-4 text-indigo-500" />
                <ElectionCountdown targetTime={election.end_time} label="Ends in" />
              </div>
            )}
          </div>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-6">
             Please carefully review the candidates below. Your vote is recorded directly to the blockchain to ensure absolute security and neutrality. This action is immutable and cannot be reversed.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-5 py-4 mb-8 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-sm font-semibold animate-slide-down shadow-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 dark:text-red-500" />
            {error}
          </div>
        )}

        {!voteCast && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">

            {/* Main Voting Column */}
            <div className="md:col-span-8">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                  <h2 className="text-lg font-extrabold tracking-tight text-indigo-950 dark:text-slate-100">
                    Official Ballot
                  </h2>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {candidates.length} Candidates
                  </span>
                </div>
                {candidates.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <Vote className="w-8 h-8 text-slate-400 mb-3" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No candidates available on this ballot</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {candidates.map(candidate => (
                      <button
                        key={candidate.candidate_id}
                        onClick={() => {
                          setSelectedCandidate(candidate.candidate_id);
                          setSelectedCandidateName(candidate.name);
                        }}
                        className={`w-full flex items-center justify-between p-5 rounded-lg border-2 transition-all duration-200 text-left group ${
                          selectedCandidate === candidate.candidate_id
                            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              selectedCandidate === candidate.candidate_id
                                ? 'border-indigo-600 bg-indigo-600'
                                : 'border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                            }`}>
                              {selectedCandidate === candidate.candidate_id && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className={`font-bold text-lg ${
                              selectedCandidate === candidate.candidate_id
                                ? 'text-indigo-950 dark:text-slate-100'
                                : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                            }`}>
                              {candidate.name}
                            </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="md:col-span-4 space-y-6">
              
              {/* Wallet Block */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <Wallet className="w-4 h-4 text-indigo-500" />
                  <h2 className="text-sm font-bold tracking-tight text-indigo-950 dark:text-slate-100 uppercase">Wallet</h2>
                </div>
                
                <WalletConnect onConnected={handleWalletConnected} />
                
                {walletAddress ? (
                  <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-lg flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <p className="text-xs text-emerald-800 dark:text-emerald-300 font-mono font-medium">
                       {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                     </p>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
                      Connect your web3 wallet to authorize transaction.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Block */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                  {txPending ? (
                     <div className="flex flex-col items-center justify-center py-4">
                        <div className="w-8 h-8 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-indigo-600 dark:border-t-indigo-500 animate-spin mb-4" />
                        <p className="text-sm font-bold text-indigo-950 dark:text-slate-100 mb-1">
                          {txStep === 1 && "Awaiting Signature..."}
                          {txStep === 2 && "Broadcasting to Network..."}
                          {txStep === 3 && "Confirming Transaction..."}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-2 px-2">
                           Please do not close this window or refresh your browser.
                        </p>
                     </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowConfirm(true)}
                        disabled={!selectedCandidate || !provider}
                        className={`w-full py-3.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                          !selectedCandidate || !provider
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]'
                        }`}
                      >
                        <Vote className="w-4 h-4" />
                        Authorize & Cast Vote
                      </button>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-center text-slate-400 mt-4">
                        Powered by Ethereum
                      </p>
                    </>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm modal */}
        {showConfirm && (
          <ConfirmModal
            title="Cast Official Ballot"
            message={<div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">You are about to cryptographically sign and broadcast your vote for:</p>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg text-center">
                    <span className="text-lg font-extrabold text-indigo-950 dark:text-indigo-300">{selectedCandidateName}</span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">⚠ This action is permanent and cannot be modified.</p>
            </div>}
            confirmLabel="Sign & Broadcast"
            cancelLabel="Cancel"
            onConfirm={handleVote}
            onCancel={() => setShowConfirm(false)}
            icon={null}
          />
        )}

        {/* Success state */}
        {voteCast && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-900/50 shadow-sm p-12 text-center animate-scale-in max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-3">
              Ballot Successfully Recorded
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 mx-auto max-w-md leading-relaxed">
              Your vote has been cryptographically secured on the blockchain ledger. Thank you for participating.
            </p>

            {txHash && (
              <div className="mb-10 p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 inline-block text-left w-full">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Blockchain Receipt</p>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-slate-700 dark:text-slate-300 break-all">{txHash}</span>
                  <a
                    href={`http://localhost:8545/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-4 p-2 bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    title="View on Block Explorer"
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </a>
                </div>
              </div>
            )}

            <button
              onClick={() => navigate('/voter-elections')}
              className="px-6 py-3 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 my-2"
            >
              Return to Active Elections
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}
