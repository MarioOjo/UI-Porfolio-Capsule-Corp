import { FaShieldAlt, FaHeart, FaFistRaised, FaDragon, FaBolt, FaCapsules, FaRegCopyright } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import './AuthFooter.css';

function AuthFooter({ className = "" }) {
  const { isDarkMode } = useTheme();
  const themeClass = isDarkMode ? 'dark' : 'light';

  const currentYear = new Date().getFullYear();
  const dragonBallYear = 762 + (currentYear - 2024); // DB timeline progression

  const quickLinks = [
    { 
      name: "PRIVACY SHIELD", 
      path: "/privacy", 
      icon: FaShieldAlt,
      description: "Data Protection"
    },
    { 
      name: "TERMS OF SERVICE", 
      path: "/terms", 
      icon: FaFistRaised,
      description: "Warrior Agreement"
    },
    { 
      name: "SUPPORT", 
      path: "/support", 
      icon: FaHeart,
      description: "Capsule Corp Help"
    },
    { 
      name: "ABOUT US", 
      path: "/about", 
      icon: FaCapsules,
      description: "Our Legacy"
    }
  ];

  const socialLinks = [
    { name: "Scouter Network", icon: "📡", url: "#" },
    { name: "Z-Fighter Comms", icon: "⚡", url: "#" },
    { name: "Dragon Radar", icon: "🐉", url: "#" },
    { name: "Capsule Tech", icon: "💊", url: "#" }
  ];

  return (
    <footer className={`auth-footer ${themeClass} ${className}`}>
      {/* Background Elements */}
      <div className="footer-background">
        <div className="energy-wave"></div>
        <div className="floating-capsules">
          <div className="capsule"></div>
          <div className="capsule"></div>
          <div className="capsule"></div>
        </div>
      </div>

      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-logo">
              <div className="logo-orb">
                <FaDragon className="logo-icon" />
                <div className="logo-glow"></div>
              </div>
              <div className="brand-text">
                <h3 className="saiyan-title-lg brand-title">CAPSULE CORP</h3>
                <p className="saiyan-body-sm brand-tagline">
                  Innovating for a Better Tomorrow
                </p>
              </div>
            </div>
            
            <div className="brand-mission">
              <p className="saiyan-body-base mission-text">
                Protecting Earth's technology and empowering warriors across the universe since Age 712. 
                From portable capsules to battle gear, we fuel your journey to greatness.
              </p>
            </div>

            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="social-link"
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name saiyan-body-xs">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="links-section">
            <h4 className="saiyan-title-sm section-title">QUICK LINKS</h4>
            <div className="links-grid">
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="footer-link"
                  >
                    <div className="link-content">
                      <IconComponent className="link-icon" />
                      <div className="link-text">
                        <span className="link-name saiyan-body-base">{link.name}</span>
                        <span className="link-desc saiyan-body-xs">{link.description}</span>
                      </div>
                      <div className="link-arrow">⚡</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Warrior Status */}
          <div className="status-section">
            <h4 className="saiyan-title-sm section-title">WARRIOR STATUS</h4>
            <div className="status-card">
              <div className="status-header">
                <FaBolt className="status-icon" />
                <span className="saiyan-body-base status-title">SYSTEM SECURE</span>
              </div>
              <div className="status-indicators">
                <div className="status-item">
                  <div className="status-dot active"></div>
                  <span className="saiyan-body-sm">Authentication</span>
                </div>
                <div className="status-item">
                  <div className="status-dot active"></div>
                  <span className="saiyan-body-sm">Data Encryption</span>
                </div>
                <div className="status-item">
                  <div className="status-dot active"></div>
                  <span className="saiyan-body-sm">Capsule Security</span>
                </div>
              </div>
              <div className="power-level">
                <div className="power-bar">
                  <div 
                    className="power-fill"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <span className="saiyan-body-xs power-text">SECURITY LEVEL: MAXIMUM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="footer-divider">
          <div className="divider-line"></div>
          <FaDragon className="divider-icon" />
          <div className="divider-line"></div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="copyright">
            <FaRegCopyright className="copyright-icon" />
            <span className="saiyan-body-sm copyright-text">
              AGE {dragonBallYear} CAPSULE CORPORATION. SECURED BY SAIYAN TECHNOLOGY.
            </span>
          </div>
          
          <div className="legal-links">
            <Link to="/privacy" className="legal-link saiyan-body-xs">
              ENERGY SHIELD PRIVACY
            </Link>
            <span className="separator">•</span>
            <Link to="/terms" className="legal-link saiyan-body-xs">
              WARRIOR ACCORD
            </Link>
            <span className="separator">•</span>
            <Link to="/cookies" className="legal-link saiyan-body-xs">
              SCOUTER COOKIES
            </Link>
          </div>

          <div className="tech-badge">
            <span className="saiyan-body-xs badge-text">
              🚀 POWERED BY CAPSULE TECH
            </span>
          </div>
        </div>

        {/* Dragon Ball Easter Egg */}
        <div className="dragon-ball-hint">
          <span className="saiyan-body-xs hint-text">
            Collect all 7 Dragon Balls for a wish! 🐉
          </span>
        </div>
      </div>
    </footer>
  );
}

export default AuthFooter;