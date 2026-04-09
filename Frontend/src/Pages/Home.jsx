import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Shield, Zap, BarChart3, ArrowRight, Hexagon, Sun, Moon, Vote } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) return null;

  if (user) {
    if (user.role === 'ADMIN') {
      navigate('/admin-elections');
    } else {
      navigate('/voter-elections');
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 transition-colors duration-300">
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-surface-200/60 dark:border-surface-800/60 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Hexagon className="w-8 h-8 text-brand-600 dark:text-brand-400" strokeWidth={2} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400" />
                </div>
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">
                Vota
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-ghost text-sm"
              >
                Voter Login
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-sm"
              >
                Admin Portal
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500/10 dark:bg-brand-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8">
              <Shield className="w-4 h-4" />
              Blockchain-powered security
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-surface-900 dark:text-white leading-[1.1] mb-6">
              Voting that's{' '}
              <span className="text-gradient">transparent</span>
            </h1>

            <p className="text-lg sm:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto mb-10 text-balance leading-relaxed">
              Vota brings trustless, verifiable elections to organizations of any size.
              Every vote is recorded on-chain — immutable, auditable, and fair.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-base px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-brand-500/20 transition-all duration-300"
              >
                <Vote className="w-5 h-5" />
                Cast your vote
              </button>
              <button
                onClick={() => navigate('/login')}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-surface-700 dark:text-surface-200 bg-white/60 dark:bg-surface-800/60 backdrop-blur-xl border border-surface-200 dark:border-surface-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-lg transition-all duration-300"
              >
                Admin portal
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative py-24 sm:py-32 bg-surface-50 dark:bg-surface-900 border-t border-surface-200/60 dark:border-surface-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
              Why Choose Vota?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Built on the most battle-tested technology for elections that truly matter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Secure */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700/60 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-7 h-7 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">
                Secure
              </h3>
              <p className="text-surface-500 dark:text-surface-400 leading-relaxed">
                Blockchain-powered voting ensures every ballot is cryptographically sealed, tamper-proof, and verifiable by anyone.
              </p>
            </div>

            {/* Fast */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700/60 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">
                Fast
              </h3>
              <p className="text-surface-500 dark:text-surface-400 leading-relaxed">
                Vote instantly with our distributed ledger technology. Results are tallied in real-time as votes are cast on-chain.
              </p>
            </div>

            {/* Transparent */}
            <div className="group p-8 rounded-2xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700/60 shadow-card hover:shadow-card-hover transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-3">
                Transparent
              </h3>
              <p className="text-surface-500 dark:text-surface-400 leading-relaxed">
                Real-time results that everyone can independently verify. Open data, open process, open trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-surface-200/60 dark:border-surface-800/60 bg-white dark:bg-surface-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-surface-400 dark:text-surface-500">
            © {new Date().getFullYear()} Vota. Decentralized voting for a transparent future.
          </p>
        </div>
      </footer>
    </div>
  );
}