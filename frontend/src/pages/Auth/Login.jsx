import { useState, useRef } from "react";
import { FaGlasses, FaEye, FaEyeSlash, FaDragon, FaFistRaised } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import { useTheme } from "../../contexts/ThemeContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import "./AuthPage.css";

function Login({ onSwitchTab }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const { isDarkMode } = useTheme();
  const formRef = useRef(null);

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Scouter ID and Battle Password required for authentication!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Scouter cannot read this email frequency!");
      return;
    }

    setLoading(true);
    
    if (formRef.current) {
      formRef.current.classList.add('powering-up');
    }

    try {
      await login(email, password, rememberMe);
      showSuccess("🚀 Power level rising! Welcome back, Warrior!", {
        title: "SCOUTER ACTIVATED",
        duration: 4000,
        action: {
          label: "Continue Training",
          onClick: () => navigate("/dashboard")
        }
      });
      
      setTimeout(() => {
        navigate("/");
      }, 1500);
      
    } catch (err) {
      const errorMessage = err?.message || "Authentication failed";
      setError(errorMessage);
      showError(`⚡ ${errorMessage}`, {
        title: "SCOUTER ERROR",
        duration: 5000
      });
    } finally {
      setLoading(false);
      if (formRef.current) {
        formRef.current.classList.remove('powering-up');
      }
    }
  }

  const demoAccounts = [
    { email: "goku@capsulecorp.com", password: "kamehameha", character: "Goku" },
    { email: "vegeta@capsulecorp.com", password: "prince123", character: "Vegeta" },
    { email: "bulma@capsulecorp.com", password: "science!", character: "Bulma" }
  ];

  const fillDemoAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className={`auth-page ${isDarkMode ? 'dark' : 'light'}`} ref={formRef}>
      <div className="auth-container">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <span className="logo-icon">🐉</span>
            <span className="logo-text">Capsule Corp</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="auth-content">
          <div className="auth-card">
            <div className="auth-title-section">
              <h1 className="auth-title">WELCOME BACK, WARRIOR</h1>
              <p className="auth-subtitle">Access your Capsule Corp account and continue your journey!</p>
            </div>

            {/* Demo Accounts */}
            <div className="demo-accounts-section">
              <h3 className="demo-title">🎮 QUICK TRAINING ACCESS</h3>
              <div className="demo-grid">
                {demoAccounts.map((account, index) => (
                  <button
                    key={account.character}
                    type="button"
                    onClick={() => fillDemoAccount(account)}
                    className="demo-account-btn"
                  >
                    <div className="demo-character">{account.character}</div>
                    <div className="demo-hint">Click to fill</div>
                  </button>
                ))}
              </div>
            </div>

            <GoogleSignInButton variant="primary" />
            
            {/* Divider */}
            <div className="auth-divider">
              <span>OR USE SCOUTER AUTHENTICATION</span>
            </div>

            {/* Login Form */}
            <form className="auth-form" onSubmit={handleLogin}>
              {/* Email Field */}
              <div className="form-group">
                <label className="form-label">
                  📡 SCOUTER FREQUENCY
                </label>
                <div className="input-container">
                  <FaGlasses className="input-icon" />
                  <input
                    type="email"
                    placeholder="goku@capsulecorp.com"
                    className="auth-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <div className="password-header">
                  <label className="form-label">
                    💪 BATTLE PASSWORD
                  </label>
                  <button
                    type="button"
                    className="forgot-password-btn"
                  >
                    🐉 Forgot Ki Energy?
                  </button>
                </div>
                <div className="input-container">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Channel your ki energy..."
                    className="auth-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPass(s => !s)}
                    tabIndex={-1}
                  >
                    {showPass ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    id="remember"
                  />
                  <label htmlFor="remember" className="checkbox-label">
                    Remember this Scouter
                  </label>
                </div>
                
                <div className="security-status">
                  <div className="status-indicator"></div>
                  <span>Capsule Corp Secure</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚡</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`submit-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <FaDragon className="loading-icon" />
                    <span>POWERING UP SCOUTER...</span>
                  </span>
                ) : (
                  <span className="btn-content">
                    <FaFistRaised className="btn-icon" />
                    <span>ACTIVATE SCOUTER</span>
                  </span>
                )}
              </button>

              {/* Security Features */}
              <div className="security-features">
                <div className="security-item">
                  <div className="security-dot ssl"></div>
                  <span>SSL Encrypted</span>
                </div>
                <div className="security-item">
                  <div className="security-dot power"></div>
                  <span>Power Level Secure</span>
                </div>
                <div className="security-item">
                  <div className="security-dot verified"></div>
                  <span>Z-Fighter Verified</span>
                </div>
              </div>

              {/* Footer Links */}
              <div className="auth-footer">
                <button
                  type="button"
                  className="footer-link forgot-link"
                >
                  <span>🔮 Use the Dragon Balls</span>
                  <span className="link-badge">Forgot Password?</span>
                </button>
                
                <div className="footer-divider">
                  <span>New Warrior?</span>
                </div>
                
                <button
                  type="button"
                  className="footer-link signup-link"
                  onClick={onSwitchTab}
                >
                  🐉 JOIN THE Z-FIGHTERS
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;