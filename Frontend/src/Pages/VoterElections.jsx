import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import Layout from '../components/Layout';
import ElectionCard from '../components/ElectionCard';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { Vote, Search } from 'lucide-react';

export default function VoterElections() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

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
    if (filter === 'ALL') return elections;
    return elections.filter(e => e.status === filter);
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

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading elections..." />
      </Layout>
    );
  }

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
          <div className="flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-md text-xs font-bold tracking-wider uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                  filter === f.key
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Elections grid */}
        {getFilteredElections().length === 0 ? (
          <EmptyState
            icon={Search}
            title="No elections found"
            description={filter === 'ALL'
              ? "There are no elections available right now. Check back later!"
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
