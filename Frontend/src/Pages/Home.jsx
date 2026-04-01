import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (user) {
    // Redirect logged-in users to appropriate dashboard
    if (user.role === 'ADMIN') {
      navigate('/admin-elections');
    } else {
      navigate('/voter-elections');
    }
  }

  return (
    <>
      <div className="wrap">
        {/* NAV */}
        <nav>
          <div className="nav-logo">
            <div className="nav-logo-mark">⬢</div>
            <span className="nav-logo-name">Vota</span>
          </div>

          <div className="nav-links">
            <button className="nav-link" onClick={() => navigate('/login')}>
              Voter login
            </button>
            <button className="nav-btn" onClick={() => navigate('/login')}>
              Admin portal →
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <h1>
            Voting that's <span>transparent</span>
          </h1>

          <div className="hero-actions">
            <button
              className="btn-hero-primary"
              onClick={() => navigate('/login')}
            >
              🗳️ Cast your vote
            </button>

            <button
              className="btn-hero-secondary"
              onClick={() => navigate('/login')}
            >
              ⚙️ Admin portal
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>Why Choose Vota?</h2>
          <div className="features-grid">
            <div className="feature">
              <h3>🔐 Secure</h3>
              <p>Blockchain-powered voting ensures transparency and security</p>
            </div>
            <div className="feature">
              <h3>⚡ Fast</h3>
              <p>Vote instantly with our distributed ledger technology</p>
            </div>
            <div className="feature">
              <h3>📊 Transparent</h3>
              <p>Real-time results everyone can verify independently</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}