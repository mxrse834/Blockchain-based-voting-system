import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import { Plus, Settings, Trash2, Calendar, Clock, Vote, Search, LayoutDashboard, Activity, Users, RefreshCw } from 'lucide-react';

export default function AdminElections() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchElections(); }, []);

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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchElections();
    setIsRefreshing(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/elections/${deleteTarget}`);
      setElections(elections.filter(e => e.election_id !== deleteTarget));
    } catch (error) {
      console.error('Failed to delete election:', error);
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredElections = elections.filter(election => 
    election.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="animate-fade-in w-full max-w-7xl mx-auto">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100 mb-2">
              Elections Management
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {elections.length} election{elections.length !== 1 ? 's' : ''} in total
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-slate-100 dark:bg-[#1A1F36] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold py-2 px-4 rounded-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 border border-slate-200 dark:border-slate-700 shadow-sm"
              title="Refresh Elections"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={() => navigate('/create-election')}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Create Election
            </button>
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

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : elections.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections yet"
            description="Create your first election to get started."
            action={() => navigate('/create-election')}
            actionLabel="Create Election"
          />
        ) : filteredElections.length === 0 ? (
          <EmptyState
            icon={Search}
            title={`No elections found matching "${searchQuery}"`}
            description="Try adjusting your search query to find what you're looking for."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElections.map(election => (
              <div
                key={election.election_id}
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 group flex flex-col"
              >
                {/* Card Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-lg font-bold text-indigo-950 dark:text-slate-100 line-clamp-1 pr-4">
                      {election.title}
                    </h2>
                    {/* Muted Pill Badge (Status) in Top Right */}
                    <div className="flex-shrink-0">
                      <StatusBadge status={election.status} />
                    </div>
                  </div>
                  
                  {/* Start / End Dates List */}
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Starts</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(election.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ends</p>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {new Date(election.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer (Actions) */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-b-xl flex items-center justify-between mt-auto">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono tracking-wide">
                    ID: {election.election_id.substring(0,8)}...
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin-election-detail/${election.election_id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      title="Manage"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Manage
                    </button>
                    <button
                      onClick={() => setDeleteTarget(election.election_id)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Election"
          message="Are you sure you want to delete this election? This action cannot be undone."
          confirmLabel="Delete Election"
          cancelLabel="Cancel"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
          icon={Trash2}
        />
      )}
    </Layout>
  );
}
