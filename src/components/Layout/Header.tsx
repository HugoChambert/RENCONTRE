import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>RENCONTRE</h1>
        </Link>

        <nav className="nav">
          <Link to="/jobs">Jobs</Link>
          <Link to="/community">Community</Link>

          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <button onClick={signOut} className="btn-signout">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" className="btn-signin">
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
