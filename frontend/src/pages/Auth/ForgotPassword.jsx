import { useState } from 'react';
import { FaDragon, FaEnvelope } from 'react-icons/fa';
import { apiFetch } from '../../lib/apiFetch';
import './ForgotPassword.css';

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiFetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="forgot-password-container">
        <div className="success-card">
          <div className="success-icon">📧</div>
          <h2 className="success-title">Check Your Email!</h2>
          <p className="success-message">
            If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <button onClick={onBack} className="back-btn">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <div className="header">
          <FaDragon className="dragon-icon" />
          <h2>Reset Password</h2>
          <p>Enter your email to receive a reset link</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-field">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚡</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="back-link"
          >
            ← Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
