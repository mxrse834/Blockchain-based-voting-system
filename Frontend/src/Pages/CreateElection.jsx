import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Layout from '../components/Layout';
import Toast from '../components/Toast';
import { Calendar, Clock, Edit3, ArrowLeft, Loader2, Save } from 'lucide-react';

export default function CreateElection() {
  const navigate = useNavigate();
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

      // Simple navigation back, success message can be handled by parent or context if needed
      // but for now, redirecting to admin dashboard is fine.
      navigate('/admin-elections');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <button
          onClick={() => navigate('/admin-elections')}
          className="btn-ghost mb-6 -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Elections
        </button>

        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700/60 shadow-card p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-surface-900 dark:text-white">
                Create Election
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Set up a new voting event
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6">
              <Toast type="error" message={error} dismissible={true} onDismiss={() => setError('')} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                Election Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Board of Directors Election 2024"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Date/Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    className="input-field pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 dark:text-surface-500" />
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    className="input-field pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t border-surface-100 dark:border-surface-700/60">
              <button
                type="button"
                onClick={() => navigate('/admin-elections')}
                className="btn-secondary flex-1 sm:flex-none"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 sm:flex-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Create Election
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
