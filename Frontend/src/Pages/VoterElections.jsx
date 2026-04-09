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
      <div className="animate-fade-in">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-2">
            Elections
          </h1>
          <p className="text-surface-500 dark:text-surface-400">
            Browse and participate in active elections
          </p>
        </div>

        {/* Filter toolbar */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1.5 bg-surface-100 dark:bg-surface-800 rounded-2xl w-fit">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-white dark:bg-surface-700 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
              }`}
            >
              {f.label}
            </button>
          ))}
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
