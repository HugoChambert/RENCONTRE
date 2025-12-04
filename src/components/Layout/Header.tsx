import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <h1>RENCONTRE</h1>
        </Link>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/jobs" onClick={closeMobileMenu}>Jobs</Link>
          <Link to="/community" onClick={closeMobileMenu}>Community</Link>

          {user ? (
            <>
              <Link to="/profile" onClick={closeMobileMenu}>Profile</Link>
              <button onClick={handleSignOut} className="btn-signout">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-signin" onClick={closeMobileMenu}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
