import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import ElectionCard from '../components/ElectionCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonCard from '../components/SkeletonCard';
import { Vote, Search, LayoutDashboard, Activity, Users } from 'lucide-react';

export default function VoterElections() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await api.get('/elections');
      setElections(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch elections:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredElections = () => {
    let filtered = elections;
    if (filter !== 'ALL') {
      filtered = filtered.filter(e => e.status === filter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return filtered;
  };

  const handleAction = (electionId) => {
    const election = elections.find(e => e.election_id === electionId);
    if (election?.status === 'ACTIVE') {
      navigate(`/voting/${electionId}`);
    } else if (election?.status === 'CLOSED') {
      navigate(`/results/${electionId}`);
    }
  };

  const getActionLabel = (election) => {
    if (election.status === 'ACTIVE') return 'Cast Vote';
    if (election.status === 'CLOSED') return 'View Results';
    return 'Coming Soon';
  };

  const filters = [
    { key: 'ALL', label: 'All' },
    { key: 'UPCOMING', label: 'Upcoming' },
    { key: 'ACTIVE', label: 'Active' },
    { key: 'CLOSED', label: 'Closed' },
  ];

  return (
    <Layout>
      <div className="animate-fade-in w-full max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-2">
              Available Elections
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Select an active election to view details or cast your vote.
            </p>
          </div>

          {/* Filter toolbar */}
          <div className="inline-flex bg-slate-100/80 dark:bg-[#1A1F36]/80 backdrop-blur-md border border-slate-200 dark:border-gray-800 p-1 rounded-xl">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                  filter === f.key
                    ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] ring-1 ring-indigo-500/50'
                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Total Elections */}
          <div className="bg-white/80 dark:bg-[#1A1F36]/50 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.15)] ring-1 ring-purple-500/20 backdrop-blur-md flex items-center justify-between transition-all">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Total Elections</p>
              <p className="text-3xl font-extrabold text-indigo-950 dark:text-slate-100">{elections.length}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
              <LayoutDashboard className="w-6 h-6 text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>
          </div>

          {/* Active Now */}
          <div className="bg-white/80 dark:bg-[#1A1F36]/50 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/20 backdrop-blur-md flex items-center justify-between transition-all">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Active Now</p>
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {elections.filter(e => e.status === 'ACTIVE').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
              <Activity className="w-6 h-6 text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          </div>

          {/* Completed Elections */}
          <div className="bg-white/80 dark:bg-[#1A1F36]/50 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/20 backdrop-blur-md flex items-center justify-between transition-all">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Completed Elections</p>
              <p className="text-3xl font-extrabold text-orange-500 dark:text-orange-400">
                {elections.filter(e => e.status === 'CLOSED').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
              <Vote className="w-6 h-6 text-orange-500 dark:text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            </div>
          </div>
        </div>

        {/* Search Bar - only show if there are any elections available */}
        {elections.length > 0 && (
          <div className="relative w-full max-w-md mb-12">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search elections by name..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>
        )}

        {/* Elections grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : elections.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections available"
            description="There are no elections available right now. Check back later!"
          />
        ) : getFilteredElections().length === 0 ? (
          <EmptyState
            icon={Search}
            title={searchQuery.trim() ? `No elections found matching "${searchQuery}"` : "No elections found"}
            description={
              searchQuery.trim() 
                ? "Try adjusting your search query or clear the selected tab filter."
                : `No ${filter.toLowerCase()} elections at the moment.`
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getFilteredElections().map(election => (
              <ElectionCard
                key={election.election_id}
                election={election}
                onAction={election.status !== 'UPCOMING' ? handleAction : undefined}
                actionLabel={getActionLabel(election)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
