import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import './AuthPage.css';

function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Update tab when URL param changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup' || tab === 'login') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForgotPassword(false);
    navigate(`/auth?tab=${tab}`, { replace: true });
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  return (
    <div className={`auth-page-container ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Theme-aware background */}
      <div className="auth-background">
        <div className="background-pattern"></div>
        <div className="dbz-bg-element dbz-bg-1"></div>
        <div className="dbz-bg-element dbz-bg-2"></div>
        <div className="dbz-bg-element dbz-bg-3"></div>
      </div>
      
      <div className="auth-content-wrapper">
        <div className="auth-card-container">
          {/* Header Logo */}
          <div className="auth-header-logo">
            <div className="logo-main">
              <span className="logo-icon">🐉</span>
              <span className="logo-text">Capsule Corporation</span>
            </div>
            <div className="theme-indicator">
              <span className={`theme-badge ${isDarkMode ? 'frieza' : 'goku'}`}>
                {isDarkMode ? '🌙 Frieza Mode' : '☀️ Goku Mode'}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tab-navigation-container">
            <div className="tab-navigation">
              <button
                onClick={() => handleTabChange('login')}
                className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              >
                <span className="tab-icon">🔐</span>
                <span className="tab-text">SCOUTER LOGIN</span>
              </button>
              <button
                onClick={() => handleTabChange('signup')}
                className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              >
                <span className="tab-icon">🐉</span>
                <span className="tab-text">JOIN Z-FIGHTERS</span>
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="tab-content-container">
            <div className="tab-content">
              {showForgotPassword ? (
                <ForgotPassword onBack={handleBackToLogin} />
              ) : activeTab === 'login' ? (
                <Login 
                  onSwitchTab={() => handleTabChange('signup')} 
                  onForgotPassword={handleForgotPassword}
                />
              ) : (
                <Signup onSwitchTab={() => handleTabChange('login')} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p className="footer-text">
              © {new Date().getFullYear()} Capsule Corporation. All rights reserved.
            </p>
            <p className="footer-subtext">
              Protecting Earth since Age 737
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;