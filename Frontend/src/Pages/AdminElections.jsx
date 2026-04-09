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
      <div className="animate-fade-in">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-1">
              Elections Management
            </h1>
            <p className="text-surface-500 dark:text-surface-400">
              {elections.length} election{elections.length !== 1 ? 's' : ''} in total
            </p>
          </div>
          <button
            onClick={() => navigate('/create-election')}
            className="btn-primary self-start sm:self-auto"
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
          <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card overflow-hidden">
            {/* Table header */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-surface-100 dark:border-surface-700/60 bg-surface-50 dark:bg-surface-800/80">
              <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Title</span>
              <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Status</span>
              <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Start</span>
              <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">End</span>
              <span className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Actions</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-surface-100 dark:divide-surface-700/60">
              {elections.map(election => (
                <div
                  key={election.election_id}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 md:gap-4 px-6 py-5 hover:bg-surface-50 dark:hover:bg-surface-700/20 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="font-semibold text-surface-900 dark:text-white">
                      {election.title}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <StatusBadge status={election.status} />
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    {new Date(election.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {new Date(election.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/admin-election-detail/${election.election_id}`)}
                      className="p-2 rounded-lg text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                      title="Manage"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(election.election_id)}
                      className="p-2 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
