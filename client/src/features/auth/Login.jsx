import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Already authenticated — redirect to role dashboard
  React.useEffect(() => {
    if (isAuthenticated && currentUser) {
      redirectByRole(currentUser.role);
    }
  }, [isAuthenticated, currentUser]);

  const redirectByRole = (role) => {
    switch (role) {
      case 'admin':    navigate('/admin/dashboard',    { replace: true }); break;
      case 'staff':    navigate('/staff/dashboard',    { replace: true }); break;
      case 'volunteer':navigate('/volunteer/dashboard',{ replace: true }); break;
      case 'student':  navigate('/student/dashboard',  { replace: true }); break;
      default:         navigate('/',                   { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      redirectByRole(user.role);
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="28" height="28" rx="8" fill="#16a34a"/>
              <path d="M7 8h14M7 14h10M7 20h7" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="login-brand-text">
            <h1 className="login-brand-name">RecordHub</h1>
            <p className="login-brand-sub">NGO Digital Record System</p>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to access your workspace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="login-email" className="field-label">Email address</label>
            <div className="field-input-wrap">
              <Mail size={16} className="field-icon" aria-hidden="true" />
              <input
                id="login-email"
                type="email"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organisation.org"
                required
                autoComplete="email"
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="login-password" className="field-label">Password</label>
            <div className="field-input-wrap">
              <Lock size={16} className="field-icon" aria-hidden="true" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="field-input field-input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="field-toggle-btn"
                onClick={() => setShowPassword((p) => !p)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin" aria-hidden="true" />
                <span>Signing in…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="login-footer">
          Secure digital records for NGO operations
        </p>
      </div>
    </div>
  );
}
