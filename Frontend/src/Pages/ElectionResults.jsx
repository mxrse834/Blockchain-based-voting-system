import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import Toast from '../components/Toast';
import ResultsChart from '../components/ResultsChart';
import { ArrowLeft, Users, Trophy, BarChart3 } from 'lucide-react';

export default function ElectionResults() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [results, setResults] = useState([]);
  const [myVote, setMyVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchData(); }, [electionId]);

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
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><LoadingSpinner message="Loading results..." /></Layout>;
  if (!election) return <Layout><div className="text-center py-20 text-surface-500">Election not found</div></Layout>;

  const totalVotes = results.reduce((sum, r) => sum + r.vote_count, 0);
  const maxVotes = Math.max(...results.map(r => r.vote_count), 1);
  const winnerIndex = results.length > 0 ? results.findIndex(r => r.vote_count === maxVotes) : -1;
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in">
        <button onClick={() => navigate('/voter-elections')} className="btn-ghost mb-6 -ml-3">
          <ArrowLeft className="w-4 h-4" /> Back to Elections
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">{election.title}</h1>
              <StatusBadge status={election.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/30 border border-surface-100 dark:border-surface-700">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <Users className="w-4 h-4" /> Total Votes
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{totalVotes}</p>
            </div>
            <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-700/30 border border-surface-100 dark:border-surface-700">
              <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400 mb-1">
                <BarChart3 className="w-4 h-4" /> Candidates
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{results.length}</p>
            </div>
            {results.length > 0 && totalVotes > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-1">
                  <Trophy className="w-4 h-4" /> Leading
                </div>
                <p className="text-lg font-bold text-amber-700 dark:text-amber-300 truncate">
                  {results[winnerIndex]?.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {myVote && (
          <div className="mb-6">
            <Toast type="success" message={<>You voted for: <strong>{myVote.name}</strong></>} dismissible={false} />
          </div>
        )}
        {error && <div className="mb-6"><Toast type="error" message={error} /></div>}

        {/* Chart */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Vote Distribution</h2>
            <ResultsChart results={results.map(r => ({ name: r.name, vote_count: r.vote_count }))} />
          </div>
        )}

        {/* Results list */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">Detailed Results</h2>
          {results.length === 0 ? (
            <p className="text-surface-500 dark:text-surface-400 text-sm">No votes cast yet</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => {
                const pct = totalVotes > 0 ? (result.vote_count / totalVotes * 100).toFixed(1) : 0;
                const isWinner = index === winnerIndex && totalVotes > 0;
                return (
                  <div key={result.candidate_id} className={`p-4 rounded-xl border ${isWinner ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20' : 'border-surface-100 dark:border-surface-700/60 bg-surface-50/50 dark:bg-surface-800/30'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: COLORS[index % COLORS.length] }}>{index + 1}</span>
                        <span className="font-semibold text-surface-900 dark:text-white">{result.name}</span>
                        {isWinner && <Trophy className="w-5 h-5 text-amber-500" />}
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-surface-900 dark:text-white">{pct}%</span>
                        <span className="text-xs text-surface-500 dark:text-surface-400 ml-2">({result.vote_count} votes)</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: COLORS[index % COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button onClick={() => navigate('/voter-elections')} className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Elections
          </button>
        </div>
      </div>
    </Layout>
  );
}
