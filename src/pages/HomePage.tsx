import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Next Remote Dev Job</h1>
          <p className="hero-subtitle">
            RENCONTRE connects talented developers with remote opportunities worldwide.
            Filter by frontend, backend, or fullstack positions.
          </p>
          <div className="hero-buttons">
            <Link to="/jobs" className="btn-primary btn-large">
              Browse Jobs
            </Link>
            {!user && (
              <Link to="/auth" className="btn-secondary btn-large">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💼</div>
            <h3>Remote Jobs</h3>
            <p>Access curated remote positions for frontend, backend, and fullstack developers</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>For Employers</h3>
            <p>Post your remote positions and connect with talented developers worldwide</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Community</h3>
            <p>Share projects, find co-founders, and collaborate on exciting new ventures</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join RENCONTRE today and take the next step in your remote career</p>
        <Link to={user ? '/jobs' : '/auth'} className="btn-primary btn-large">
          {user ? 'Explore Opportunities' : 'Sign Up Now'}
        </Link>
      </section>
    </div>
  );
};
