import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import { ArrowLeft, UserPlus, Image as ImageIcon, Trash2, Save, Users, AlertCircle } from 'lucide-react';

export default function AdminElectionDetail() {
  const navigate = useNavigate();
  const { electionId } = useParams();
  
  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      setError('Failed to load election data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateName.trim()) {
      setError('Candidate name cannot be empty');
      return;
    }

    setIsAddingCandidate(true);
    setError('');

    try {
      const response = await api.post(`/elections/${electionId}/candidates`, {
        name: newCandidateName
      });
      setCandidates([...candidates, response.data.data]);
      setNewCandidateName('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add candidate');
    } finally {
      setIsAddingCandidate(false);
    }
  };

  const handleDeleteCandidate = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/elections/${electionId}/candidates/${deleteTarget}`);
      setCandidates(candidates.filter(c => c.candidate_id !== deleteTarget));
    } catch (err) {
      setError('Failed to delete candidate');
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) return <Layout><LoadingSpinner message="Loading election details..." /></Layout>;
  if (!election) return <Layout><div className="text-center py-20 text-surface-500">Election not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto animate-fade-in">
        <button
          onClick={() => navigate('/admin-elections')}
          className="btn-ghost mb-6 -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </button>

        {/* Header Section */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
                  {election.title}
                </h1>
                <StatusBadge status={election.status} />
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Manage candidates for this election
              </p>
            </div>
            
            <div className="flex items-center gap-2 bg-surface-50 dark:bg-surface-700/50 px-4 py-2 rounded-xl border border-surface-100 dark:border-surface-700">
              <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <div>
                <span className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total Candidates</span>
                <span className="block text-lg font-bold text-surface-900 dark:text-white leading-none">{candidates.length}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8">
            <Toast type="error" message={error} dismissible={true} onDismiss={() => setError('')} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Candidate Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Add New Candidate
              </h2>
              
              <form onSubmit={handleAddCandidate} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newCandidateName}
                    onChange={(e) => setNewCandidateName(e.target.value)}
                    required
                    className="input-field"
                    disabled={isAddingCandidate || election.status !== 'UPCOMING'}
                  />
                  {election.status !== 'UPCOMING' && (
                     <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Candidates can only be modified in UPCOMING elections.
                     </p>
                  )}
                </div>

                {/* Conceptual UI for photo upload (non-functional backend logic handled as placeholder) */}
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Profile Photo (Optional)
                  </label>
                  <div className="border-2 border-dashed border-surface-200 dark:border-surface-600 rounded-xl p-6 text-center hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors cursor-not-allowed opacity-70">
                    <ImageIcon className="w-8 h-8 text-surface-400 mx-auto mb-2" />
                    <span className="text-sm font-medium text-surface-600 dark:text-surface-300">
                      Click or drag to upload
                    </span>
                    <p className="text-xs text-surface-400 mt-1">SVG, PNG, JPG (max. 800x400px)</p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAddingCandidate || !newCandidateName.trim() || election.status !== 'UPCOMING'}
                  className="btn-primary w-full"
                >
                  {isAddingCandidate ? 'Adding...' : 'Add Candidate'}
                </button>
              </form>
            </div>
          </div>

          {/* Current Candidates List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-5">
              Current Candidates
            </h2>

            {candidates.length === 0 ? (
              <div className="bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-700/60 border-dashed p-10 text-center">
                <UserPlus className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">No candidates yet</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">
                  Use the form to add candidates to this election.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidates.map(candidate => (
                  <div 
                    key={candidate.candidate_id} 
                    className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* Avatar Placeholder */}
                      <div className="w-12 h-12 rounded-full bg-surface-100 dark:bg-surface-700 flex flex-shrink-0 items-center justify-center text-surface-500 font-bold uppercase overflow-hidden">
                         {candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-semibold text-surface-900 dark:text-white truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-xs text-surface-500 dark:text-surface-400">
                          ID: {candidate.candidate_id.substring(0,8)}...
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => setDeleteTarget(candidate.candidate_id)}
                      disabled={election.status !== 'UPCOMING'}
                      className="p-2 rounded-xl text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
                      aria-label="Remove Candidate"
                      title="Remove Candidate"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Remove Candidate?"
          message="Are you sure you want to remove this candidate from the election? This action cannot be undone."
          confirmLabel="Remove"
          cancelLabel="Cancel"
          onConfirm={handleDeleteCandidate}
          onCancel={() => setDeleteTarget(null)}
          danger
          icon={Trash2}
        />
      )}
    </Layout>
  );
}
