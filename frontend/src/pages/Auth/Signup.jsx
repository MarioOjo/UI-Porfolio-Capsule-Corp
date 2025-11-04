import { useState, useRef } from "react";
import { FaUser, FaGlasses, FaEye, FaEyeSlash, FaDragon, FaCheck } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "../../contexts/NotificationContext";
import { useTheme } from "../../contexts/ThemeContext";
import GoogleSignInButton from "../../components/GoogleSignInButton";
import "./AuthPage.css";

function Signup({ onSwitchTab }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [promo, setPromo] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('goku');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const { isDarkMode } = useTheme();
  const formRef = useRef(null);

  // DBZ Avatars Collection
  const dbzAvatars = [
    { id: 'goku', name: 'Goku', icon: '🐉', color: 'avatar-goku' },
    { id: 'vegeta', name: 'Vegeta', icon: '👑', color: 'avatar-vegeta' },
    { id: 'gohan', name: 'Gohan', icon: '📚', color: 'avatar-gohan' },
    { id: 'piccolo', name: 'Piccolo', icon: '👽', color: 'avatar-piccolo' },
    { id: 'bulma', name: 'Bulma', icon: '🔬', color: 'avatar-bulma' },
    { id: 'krillin', name: 'Krillin', icon: '💪', color: 'avatar-krillin' },
    { id: 'frieza', name: 'Frieza', icon: '😈', color: 'avatar-frieza' },
    { id: 'trunks', name: 'Trunks', icon: '⚔️', color: 'avatar-trunks' }
  ];

  function validateEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  function passwordStrength(pw) {
    if (pw.length < 4) return { level: "Weak", pl: "PL<2000", color: "weak" };
    if (pw.length < 8) return { level: "Medium", pl: "PL<5000", color: "medium" };
    if (pw.length < 12) return { level: "Strong", pl: "PL>9000", color: "strong" };
    return { level: "OVER 9000!", pl: "PL>9000!!!", color: "over9000" };
  }

  const strengthInfo = passwordStrength(password);
  const strength = Math.min(Math.floor(password.length / 3), 5);

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields must be filled to join the Z-Fighters!");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Scouter cannot read this email format!");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Battle passwords must match!");
      return;
    }
    
    if (strengthInfo.level === "Weak") {
      setError(`Power level too low! ${strengthInfo.pl} - Train harder!`);
      return;
    }

    setLoading(true);
    
    if (formRef.current) {
      formRef.current.classList.add('submitting');
    }

    try {
      const userData = {
        email,
        password,
        firstName,
        lastName,
        avatar: selectedAvatar,
        promoEmails: promo
      };

      await signup(userData);
      
      showSuccess("🎉 Welcome to Capsule Corp, Warrior!", {
        title: "SCOUTER ACTIVATED",
        duration: 4000,
        action: {
          label: "Start Shopping",
          onClick: () => navigate("/products")
        }
      });
      
      setTimeout(() => {
        navigate("/");
      }, 2000);
      
    } catch (err) {
      const errorMessage = err?.message || "Failed to activate Scouter";
      setError(errorMessage);
      showError(`⚡ ${errorMessage}`, {
        title: "SCOUTER ERROR",
        duration: 5000
      });
    } finally {
      setLoading(false);
      if (formRef.current) {
        formRef.current.classList.remove('submitting');
      }
    }
  }

  const selectedAvatarData = dbzAvatars.find(avatar => avatar.id === selectedAvatar);

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
              <h1 className="auth-title">JOIN THE Z-FIGHTERS</h1>
              <p className="auth-subtitle">Create your Capsule Corp account and start your training journey!</p>
            </div>

            <GoogleSignInButton variant="secondary" />
            
            {/* Divider */}
            <div className="auth-divider">
              <span>OR POWER UP MANUALLY</span>
            </div>

            {/* Signup Form */}
            <form className="auth-form" onSubmit={handleSignup}>
              {/* Avatar Selection */}
              <div className="form-group">
                <label className="form-label">
                  🎭 SELECT YOUR WARRIOR AVATAR
                </label>
                <div className="avatar-grid">
                  {dbzAvatars.map(avatar => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`avatar-option ${avatar.color} ${
                        selectedAvatar === avatar.id ? 'selected' : ''
                      }`}
                    >
                      {selectedAvatar === avatar.id && (
                        <div className="avatar-check">
                          <FaCheck className="check-icon" />
                        </div>
                      )}
                      <div className="avatar-icon">{avatar.icon}</div>
                      <div className="avatar-name">{avatar.name}</div>
                    </button>
                  ))}
                </div>
                
                {/* Selected Avatar Display */}
                {selectedAvatarData && (
                  <div className="selected-avatar">
                    <div className="selected-avatar-content">
                      <div className={`selected-avatar-icon ${selectedAvatarData.color}`}>
                        {selectedAvatarData.icon}
                      </div>
                      <div className="selected-avatar-info">
                        <div className="selected-avatar-name">{selectedAvatarData.name}</div>
                        <div className="selected-avatar-desc">Ready for battle!</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Name Fields */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    🌍 EARTHLING NAME
                  </label>
                  <div className="input-container">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="Goku"
                      className="auth-input"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    👥 CLAN NAME
                  </label>
                  <div className="input-container">
                    <FaUser className="input-icon" />
                    <input
                      type="text"
                      placeholder="Son"
                      className="auth-input"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
              <div className="form-group">
                <label className="form-label">
                  💪 BATTLE PASSWORD
                </label>
                <div className="input-container">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Channel your ki energy..."
                    className="auth-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    minLength={4}
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
                
                {/* Power Level Indicator */}
                <div className="power-level-indicator">
                  <div className="power-level-header">
                    <span>POWER LEVEL: <strong className={strengthInfo.color}>{strengthInfo.pl}</strong></span>
                    <span className={`power-level-text ${strengthInfo.color}`}>
                      {strengthInfo.level}
                    </span>
                  </div>
                  <div className="power-bars">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`power-bar ${i < strength ? strengthInfo.color : ''}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label">
                  🔄 CONFIRM KI CHANNEL
                </label>
                <div className="input-container">
                  <input
                    type="password"
                    placeholder="Re-channel your ki energy"
                    className="auth-input"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span className="password-mismatch">
                    ⚡ Ki energy mismatch! Passwords don't match.
                  </span>
                )}
              </div>

              {/* Promo Checkbox */}
              <div className="promo-section">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={promo}
                  onChange={e => setPromo(e.target.checked)}
                  id="promo"
                />
                <label htmlFor="promo" className="checkbox-label promo-label">
                  <span className="promo-highlight">🍃 Senzu Bean Delivery:</span>{" "}
                  Send me exclusive deals, training tips, and Capsule Corp updates!
                </label>
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
                className={`submit-btn ${loading ? 'loading' : ''} ${strengthInfo.color}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading">
                    <FaDragon className="loading-icon" />
                    <span>ACTIVATING SCOUTER...</span>
                  </span>
                ) : (
                  <span className="btn-content">
                    <span className="btn-avatar">{selectedAvatarData?.icon}</span>
                    <span>POWER UP! {strengthInfo.level === "OVER 9000!" ? "🚀" : "💥"}</span>
                  </span>
                )}
              </button>

              {/* Footer */}
              <div className="auth-footer">
                <div className="footer-divider">
                  <span>Already trained with us?</span>
                </div>
                <button
                  type="button"
                  className="footer-link login-link"
                  onClick={onSwitchTab}
                >
                  LOGIN TO YOUR SCOUTER
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;