import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './CreateElection.css';

export default function CreateElection() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.title || !formData.startTime || !formData.endTime) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (endTime <= startTime) {
        setError('End time must be after start time');
        setLoading(false);
        return;
      }

      await api.post('/elections', {
        title: formData.title,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });

      alert('Election created successfully!');
      navigate('/admin-elections');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>📝 Create Election</h1>
        <div className="nav-actions">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="form-content">
        <div className="form-card">
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Election Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter election title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Election'}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/admin-elections')}
                className="secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
