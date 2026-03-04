import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import './AdminElections.css';

const AdminElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      setLoading(true);
      const response = await api.get('/elections');
      setElections(response.data.data || []);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to load elections',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (electionId) => {
    if (!window.confirm('Are you sure you want to delete this election?')) {
      return;
    }

    try {
      await api.delete(`/elections/${electionId}`);
      setAlert({
        type: 'success',
        message: 'Election deleted successfully',
      });
      fetchElections();
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete election',
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'status-active';
      case 'UPCOMING':
        return 'status-upcoming';
      case 'CLOSED':
        return 'status-closed';
      default:
        return '';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading elections..." />;
  }

  return (
    <div className="admin-elections-container">
      <div className="admin-header">
        <h1>📊 Election Management</h1>
        <button
          className="create-btn"
          onClick={() => navigate('/admin/create-election')}
        >
          + Create Election
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {elections.length === 0 ? (
        <div className="no-elections">
          <p>No elections yet. Create one to get started!</p>
          <button
            className="create-btn"
            onClick={() => navigate('/admin/create-election')}
          >
            Create Election
          </button>
        </div>
      ) : (
        <div className="elections-table-wrapper">
          <table className="elections-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((election) => (
                <tr key={election.election_id}>
                  <td className="title-col">{election.title}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(election.status)}`}>
                      {election.status}
                    </span>
                  </td>
                  <td className="time-col">
                    {new Date(election.start_time).toLocaleString()}
                  </td>
                  <td className="time-col">
                    {new Date(election.end_time).toLocaleString()}
                  </td>
                  <td className="actions-col">
                    <button
                      className="action-link view-btn"
                      onClick={() =>
                        navigate(`/admin/elections/${election.election_id}`)
                      }
                    >
                      Manage
                    </button>
                    <button
                      className="action-link results-btn"
                      onClick={() =>
                        navigate(`/admin/elections/${election.election_id}/results`)
                      }
                    >
                      Results
                    </button>
                    <button
                      className="action-link delete-btn"
                      onClick={() => handleDelete(election.election_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminElections;
