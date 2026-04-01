import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './AdminElections.css';

export default function AdminElections() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (electionId) => {
    if (!confirm('Are you sure you want to delete this election?')) return;
    try {
      await api.delete(`/elections/${electionId}`);
      setElections(elections.filter(e => e.election_id !== electionId));
      alert('Election deleted successfully');
    } catch (error) {
      alert('Failed to delete election');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) return <div>Loading elections...</div>;

  return (
    <div className="container">
      <nav className="navbar">
        <h1>⚙️ Admin Dashboard</h1>
        <div className="nav-actions">
          <button onClick={() => navigate('/create-election')} className="primary">
            + Create Election
          </button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="admin-content">
        <h2>Elections Management</h2>

        <div className="elections-table">
          {elections.length === 0 ? (
            <p>No elections yet</p>
          ) : (
            <table>
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
                {elections.map(election => (
                  <tr key={election.election_id}>
                    <td>{election.title}</td>
                    <td><span className={`status ${election.status}`}>{election.status}</span></td>
                    <td>{new Date(election.start_time).toLocaleString()}</td>
                    <td>{new Date(election.end_time).toLocaleString()}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/admin-election-detail/${election.election_id}`)}
                        className="edit-btn"
                      >
                        Manage
                      </button>
                      <button 
                        onClick={() => handleDelete(election.election_id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
