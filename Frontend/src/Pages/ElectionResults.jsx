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
  if (!election) return <Layout><div className="text-center py-20 text-slate-500 font-medium">Election not found</div></Layout>;

  const totalVotes = results.reduce((sum, r) => sum + r.vote_count, 0);
  const maxVotes = Math.max(...results.map(r => r.vote_count), 1);
  const winnerIndex = results.length > 0 ? results.findIndex(r => r.vote_count === maxVotes) : -1;
  const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto animate-fade-in w-full pb-12">
        <button onClick={() => navigate('/voter-elections')} className="group flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Elections
        </button>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-3 block">
                {election.title}
              </h1>
              <StatusBadge status={election.status} />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-start justice-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <Users className="w-4 h-4 text-indigo-500" /> Total Votes
              </div>
              <p className="text-3xl font-extrabold text-indigo-950 dark:text-slate-100">{totalVotes}</p>
            </div>
            <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-start justice-center">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" /> Candidates
              </div>
              <p className="text-3xl font-extrabold text-indigo-950 dark:text-slate-100">{results.length}</p>
            </div>
            {results.length > 0 && totalVotes > 0 && (
              <div className="p-5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 col-span-2 sm:col-span-1 flex flex-col items-start justice-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 text-indigo-100 dark:text-indigo-950/30">
                  <Trophy className="w-20 h-20" />
                </div>
                <div className="relative z-10 w-full hover:z-20">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
                    <Trophy className="w-4 h-4" /> Leading
                  </div>
                  <p className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300 truncate w-full" title={results[winnerIndex]?.name}>
                    {results[winnerIndex]?.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {myVote && (
          <div className="mb-8 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                   <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                     Vote Recorded successfully
                   </p>
                   <p className="text-xs text-emerald-700 dark:text-emerald-400">
                     You voted for: <strong>{myVote.name}</strong>
                   </p>
                </div>
             </div>
          </div>
        )}
        {error && <div className="mb-8"><Toast type="error" message={error} /></div>}

        {/* Chart */}
        {results.length > 0 && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 mb-8">
            <h2 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-slate-100 mb-6">Vote Distribution</h2>
            <ResultsChart results={results.map(r => ({ name: r.name, vote_count: r.vote_count }))} />
          </div>
        )}

        {/* Results list */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold tracking-tight text-indigo-950 dark:text-slate-100 mb-6">Detailed Results</h2>
          {results.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
               <BarChart3 className="w-8 h-8 text-slate-400 mb-3" />
               <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No votes cast yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => {
                const pct = totalVotes > 0 ? (result.vote_count / totalVotes * 100).toFixed(1) : 0;
                const isWinner = index === winnerIndex && totalVotes > 0;
                return (
                  <div key={result.candidate_id} className={`p-5 rounded-lg border ${isWinner ? 'border-orange-200 dark:border-orange-900/50 bg-orange-50/50 dark:bg-orange-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30'} relative`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold text-white shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                          {index + 1}
                        </span>
                        <span className="font-bold text-indigo-950 dark:text-slate-100">{result.name}</span>
                        {isWinner && <Trophy className="w-5 h-5 text-orange-500 ml-2" />}
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="text-lg font-extrabold text-indigo-950 dark:text-slate-100">{pct}%</span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{result.vote_count} votes</span>
                      </div>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      {/* Animated Fill */}
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${pct}%`, 
                          backgroundColor: COLORS[index % COLORS.length] 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
