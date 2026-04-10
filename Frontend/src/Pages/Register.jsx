import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Hexagon, Mail, Lock, UserPlus, User as UserIcon, Sun, Moon, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      
      {/* Precision Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div 
            className="flex items-center justify-center mb-6 cursor-pointer transform hover:scale-105 transition-transform" 
            onClick={() => navigate('/')}
          >
            <div className="relative flex items-center justify-center">
              <Hexagon className="w-12 h-12 text-indigo-950 dark:text-slate-100" strokeWidth={2} fill="currentColor" />
              <div className="absolute w-4 h-4 bg-orange-500 rounded-full" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-indigo-950 dark:text-slate-100">
            Create account
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Join Vota and start voting securely
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-slate-900 py-8 px-8 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-none">
          {error && (
            <div className="flex items-start gap-3 p-4 mb-6 rounded-md bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor="register-name" 
                className="block text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-2"
              >
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="block w-full pl-11 py-2.5 sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="register-email" 
                className="block text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-2"
              >
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-11 py-2.5 sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label 
                htmlFor="register-password" 
                className="block text-xs font-bold tracking-wider text-slate-600 dark:text-slate-400 uppercase mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
                  required
                  className="block w-full pl-11 py-2.5 sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all duration-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 mt-2 rounded-lg text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 shadow-md"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Create account
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 mt-8">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-orange-500 hover:text-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
