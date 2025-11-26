import { useState } from 'react';
import { Login } from '../components/Auth/Login';
import { SignUp } from '../components/Auth/SignUp';

export const AuthPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-page">
      <div className="auth-container">
        {showLogin ? (
          <Login onToggle={() => setShowLogin(false)} />
        ) : (
          <SignUp onToggle={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
};
