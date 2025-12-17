import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaDragon, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { apiFetch } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';
import './ForgotPassword.css'; // Reuse styles

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      showSuccess('Password reset successfully! Please login with your new password.');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/auth?tab=login');
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to reset password');
      showError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-card">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>Invalid or missing reset token. Please request a new password reset link.</span>
          </div>
          <button onClick={() => navigate('/auth?tab=login')} className="back-btn">
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
          <h2>Set New Password</h2>
          <p>Enter your new battle password below</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-form">
          <div className="form-field">
            <label>New Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPass(!showPass)}
                tabIndex={-1}
                style={{ right: '10px', position: 'absolute', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-field">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
