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
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <h3>Remote Jobs</h3>
            <p>Access curated remote positions for frontend, backend, and fullstack developers</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3>For Employers</h3>
            <p>Post your remote positions and connect with talented developers worldwide</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
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
