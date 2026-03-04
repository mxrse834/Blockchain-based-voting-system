import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Alert from '../components/Alert';
import './CreateElection.css';

const CreateElection = () => {
  const [formData, setFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setAlert({ type: 'error', message: 'Title is required' });
      return false;
    }
    if (!formData.startTime) {
      setAlert({ type: 'error', message: 'Start time is required' });
      return false;
    }
    if (!formData.endTime) {
      setAlert({ type: 'error', message: 'End time is required' });
      return false;
    }

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    if (endTime <= startTime) {
      setAlert({
        type: 'error',
        message: 'End time must be after start time',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/elections', {
        title: formData.title,
        startTime: formData.startTime,
        endTime: formData.endTime,
      });

      setAlert({
        type: 'success',
        message: 'Election created successfully!',
      });

      setTimeout(() => {
        navigate(`/admin/elections/${response.data.data.election_id}`);
      }, 1500);
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create election',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-election-container">
      <div className="create-form-wrapper">
        <h1>Create New Election</h1>
        <p>Set up a new election with candidates and voting period</p>

        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label htmlFor="title">Election Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              placeholder="e.g., Presidential Elections 2024"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                id="startTime"
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                id="endTime"
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-note">
            <p>⚠️ Note: You can add candidates after creating the election.</p>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/admin/elections')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Election'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateElection;
