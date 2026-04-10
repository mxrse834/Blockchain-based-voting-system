import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut, User, Hexagon } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate(user ? (user.role === 'ADMIN' ? '/admin-elections' : '/voter-elections') : '/')}
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md p-1 -ml-1 transition-all"
          >
            <div className="relative flex items-center justify-center">
              <Hexagon className="w-8 h-8 text-indigo-950 dark:text-slate-100 transition-transform duration-300 group-hover:scale-105" strokeWidth={2} fill="currentColor" />
              <div className="absolute w-3 h-3 bg-orange-500 rounded-full" />
            </div>
            <span className="text-xl font-bold text-indigo-950 dark:text-slate-100 tracking-tight">
              Vota
            </span>
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 transition-transform duration-200 active:scale-95" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-200 active:scale-95" />
              )}
            </button>

            {/* User Profile & Actions */}
            {user && (
              <div className="flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 py-1">
                
                {/* User Info Badge */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 flex-shrink-0">
                    <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-950 dark:text-slate-100 leading-none">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
