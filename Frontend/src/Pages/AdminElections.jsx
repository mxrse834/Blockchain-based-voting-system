import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import EmptyState from '../components/EmptyState';
import { Plus, Settings, Trash2, Calendar, Clock, Vote } from 'lucide-react';

export default function AdminElections() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  if (loading) return <Layout><LoadingSpinner message="Loading elections..." /></Layout>;

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
          <button
            onClick={() => navigate('/create-election')}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Election
          </button>
        </div>

        {elections.length === 0 ? (
          <EmptyState
            icon={Vote}
            title="No elections yet"
            description="Create your first election to get started."
            action={() => navigate('/create-election')}
            actionLabel="Create Election"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {elections.map(election => (
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
