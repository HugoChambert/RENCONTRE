import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SignUp = ({ onToggle }: { onToggle: () => void }) => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [userType, setUserType] = useState<'employer' | 'applicant'>('applicant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName, userType);
      navigate('/jobs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>Join RENCONTRE</h2>
      <p className="auth-subtitle">Create your account to get started</p>

      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="••••••••"
          />
        </div>

        <div className="form-group">
          <label>I am a:</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="applicant"
                checked={userType === 'applicant'}
                onChange={(e) => setUserType(e.target.value as 'applicant')}
              />
              Job Seeker
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="employer"
                checked={userType === 'employer'}
                onChange={(e) => setUserType(e.target.value as 'employer')}
              />
              Employer
            </label>
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-toggle">
        Already have an account? <button onClick={onToggle}>Sign in</button>
      </p>
    </div>
  );
};
