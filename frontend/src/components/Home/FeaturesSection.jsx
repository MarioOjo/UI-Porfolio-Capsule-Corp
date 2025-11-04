import { FaRocket, FaShieldAlt, FaStar, FaUsers, FaClock, FaPhoneAlt, FaBolt, FaDragon, FaMedal, FaCrown, FaFire } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import './FeaturesSection.css';

function FeaturesSection() {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();

  const features = [
    {
      icon: FaRocket,
      title: "INSTANT TRANSMISSION SHIPPING",
      description: "Get your gear delivered faster than Goku's teleportation across the universe",
      gradient: "gradient-blue",
      stats: "2-DAY DELIVERY",
      link: "/products",
      badge: "FAST",
      powerLevel: "9000+"
    },
    {
      icon: FaShieldAlt,
      title: "BATTLE-TESTED QUALITY", 
      description: "Every product survives planet-destroying explosions and ultimate attacks",
      gradient: "gradient-orange",
      stats: "99.9% SURVIVAL RATE",
      link: "/products?category=Battle Gear",
      badge: "TOUGH",
      powerLevel: "OVER 9000"
    },
    {
      icon: FaStar,
      title: "LEGENDARY SUPPORT",
      description: "24/7 customer service by Z-Fighter experts and Capsule Corp technicians",
      gradient: "gradient-yellow",
      stats: "4.9/5 RATING",
      link: "/contact",
      badge: "24/7",
      powerLevel: "MAX"
    }
  ];

  const userFeatures = [
    {
      icon: FaUsers,
      title: "SAIYAN COMMUNITY",
      description: "Connect with fellow warriors, share training tips and battle strategies",
      gradient: "gradient-purple",
      stats: "50K+ MEMBERS",
      link: "/community",
      badge: "SOCIAL",
      powerLevel: "GROWING"
    },
    {
      icon: FaClock,
      title: "REAL-TIME TRACKING",
      description: "Live updates on your capsule deliveries with scouter technology",
      gradient: "gradient-green", 
      stats: "LIVE UPDATES",
      link: "/profile/orders",
      badge: "SMART",
      powerLevel: "ACTIVE"
    },
    {
      icon: FaMedal,
      title: "WARRIOR REWARDS",
      description: "Earn Zeni points and unlock special achievements with every purchase",
      gradient: "gradient-red",
      stats: "REWARD SYSTEM",
      link: "/rewards",
      badge: "BONUS",
      powerLevel: "EVOLVING"
    }
  ];

  const displayFeatures = isAuthenticated ? [...features, ...userFeatures] : features;
  const themeClass = isDarkMode ? 'dark' : 'light';
  const userStatus = isAuthenticated ? 'member' : 'guest';

  return (
    <section className={`features-section ${themeClass} ${userStatus}`} id="features">
      {/* Background Elements */}
      <div className="features-background">
        <div className="energy-grid"></div>
        <div className="floating-capsules">
          <div className="capsule capsule-1"></div>
          <div className="capsule capsule-2"></div>
          <div className="capsule capsule-3"></div>
        </div>
      </div>

      <div className="features-container">
        {/* Section Header */}
        <div className="features-header">
          <div className="header-badge saiyan-title-sm saiyan-glow">
            <FaBolt className="badge-icon" />
            <span>CAPSULE CORP BENEFITS</span>
            <FaBolt className="badge-icon" />
          </div>
          
          <h3 className="saiyan-title-3xl saiyan-energy">
            {!isAuthenticated 
              ? 'WHY CHOOSE CAPSULE CORP?' 
              : 'YOUR SAIYAN BENEFITS'
            }
          </h3>
          
          <p className="saiyan-subtitle-lg">
            {!isAuthenticated 
              ? 'Join the ranks of legendary warriors who trust Capsule Corp technology across the universe'
              : 'Level up your experience with exclusive features and warrior benefits'
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className={`features-grid ${userStatus}-grid`}>
          {displayFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link 
                key={feature.title} 
                to={feature.link}
                className={`feature-card ${feature.gradient}`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Card Background Effects */}
                <div className="card-glow"></div>
                <div className="card-energy"></div>
                
                {/* Icon Container */}
                <div className="feature-icon-container">
                  <div className="icon-orb">
                    <IconComponent className="feature-icon" />
                  </div>
                  <div className="feature-stats-badge saiyan-body-xs">
                    {feature.stats}
                  </div>
                  {feature.badge && (
                    <div className="feature-type-badge saiyan-body-xs">
                      {feature.badge}
                    </div>
                  )}
                </div>
                
                {/* Power Level Indicator */}
                <div className="power-level-indicator">
                  <div className="power-bar">
                    <div 
                      className="power-fill"
                      style={{ 
                        width: feature.powerLevel === 'MAX' ? '100%' :
                               feature.powerLevel === 'OVER 9000' ? '90%' :
                               feature.powerLevel === 'GROWING' ? '70%' :
                               feature.powerLevel === 'ACTIVE' ? '80%' : '60%'
                      }}
                    ></div>
                  </div>
                  <span className="power-level-text saiyan-body-xs">
                    POWER: {feature.powerLevel}
                  </span>
                </div>

                {/* Content */}
                <h4 className="saiyan-title-lg feature-title">
                  {feature.title}
                </h4>
                
                <p className="saiyan-body-base feature-description">
                  {feature.description}
                </p>

                {/* Hover Action */}
                <div className="feature-action">
                  <span className="action-text saiyan-body-sm">
                    ACTIVATE FEATURE
                  </span>
                  <div className="action-arrow">⚡</div>
                </div>

                {/* Pulse Effect */}
                <div className="pulse-ring"></div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        {!isAuthenticated && (
          <div className="features-cta" data-aos="fade-up">
            <div className="cta-container">
              <div className="cta-badge saiyan-title-sm">
                ⚡ LIMITED TIME OFFER
              </div>
              
              <h4 className="saiyan-title-2xl cta-title">
                READY TO JOIN THE WARRIORS?
              </h4>
              
              <p className="saiyan-body-lg cta-description">
                Create your account today and receive <strong>500 bonus Zeni</strong> plus early access to legendary gear!
              </p>
              
              <div className="cta-buttons">
                <Link
                  to="/auth?tab=signup"
                  className="cta-primary-button saiyan-title-base"
                >
                  <FaDragon className="button-icon" />
                  CREATE WARRIOR ACCOUNT
                  <div className="button-glow"></div>
                </Link>
                
                <Link
                  to="/auth"
                  className="cta-secondary-button saiyan-body-base"
                >
                  <FaBolt className="button-icon" />
                  EXISTING WARRIOR LOGIN
                </Link>
              </div>

              <div className="cta-benefits">
                <div className="benefit-item saiyan-body-sm">
                  <FaStar className="benefit-icon" />
                  <span>Instant 500 Zeni Bonus</span>
                </div>
                <div className="benefit-item saiyan-body-sm">
                  <FaShieldAlt className="benefit-icon" />
                  <span>Early Access to Gear</span>
                </div>
                <div className="benefit-item saiyan-body-sm">
                  <FaUsers className="benefit-icon" />
                  <span>Join Warrior Community</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesSection;