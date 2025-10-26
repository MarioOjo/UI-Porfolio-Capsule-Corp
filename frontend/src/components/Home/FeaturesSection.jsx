import { FaRocket, FaShieldAlt, FaStar, FaUsers, FaClock, FaPhoneAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import './FeaturesSection.css';

function FeaturesSection() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const features = [
    {
      icon: FaRocket,
      title: "Instant Transmission Shipping",
      description: "Get your gear delivered faster than Goku's teleportation",
      gradient: "gradient-blue",
      stats: "2-day delivery",
      link: "/products"
    },
    {
      icon: FaShieldAlt,
      title: "Battle-Tested Quality", 
      description: "Every product survives planet-destroying explosions",
      gradient: "gradient-orange",
      stats: "99.9% survival rate",
      link: "/products?category=Battle Gear"
    },
    {
      icon: FaStar,
      title: "Legendary Support",
      description: "24/7 customer service by Z-Fighter experts",
      gradient: "gradient-yellow",
      stats: "4.9/5 rating",
      link: "/contact"
    }
  ];

  const userFeatures = [
    {
      icon: FaUsers,
      title: "Saiyan Community",
      description: "Connect with fellow warriors and share training tips",
      gradient: "gradient-purple",
      stats: "50K+ members",
      link: "/profile"
    },
    {
      icon: FaClock,
      title: "Order Tracking",
      description: "Real-time updates on your capsule deliveries",
      gradient: "gradient-green", 
      stats: "Live updates",
      link: "/profile/orders"
    },
    {
      icon: FaPhoneAlt,
      title: "Priority Support",
      description: "VIP customer service for registered warriors",
      gradient: "gradient-red",
      stats: "< 1min response",
      link: "/contact"
    }
  ];

  const displayFeatures = user ? [...features, ...userFeatures] : features;
  const themeClass = isDarkMode ? 'dark' : 'light';
  const gridClass = user ? 'user-grid' : 'guest-grid';

  return (
    <section className={`features-section ${themeClass}`} id="features">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="features-header">
          <h3 className={`features-title ${themeClass}`}>
            {user ? 'Your Saiyan Benefits' : 'Why Choose Capsule Corp?'}
          </h3>
          <p className={`features-subtitle ${themeClass}`}>
            {user 
              ? 'As a registered warrior, you get access to exclusive benefits and premium features'
              : 'Join the ranks of legendary warriors who trust Capsule Corp technology'
            }
          </p>
        </div>
  <div className={`features-grid ${gridClass}`}>
          {displayFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link 
                key={feature.title} 
                to={feature.link}
                className="feature-card"
              >
                <div className={`feature-icon-container ${feature.gradient}`}>
                  <IconComponent className="feature-icon" />
                  <div className="feature-stats-badge">
                    {feature.stats}
                  </div>
                </div>
                
                <h4 className={`feature-title ${themeClass}`}>
                  {feature.title}
                </h4>
                
                <p className={`feature-description ${themeClass}`}>
                  {feature.description}
                </p>

                <div className={`feature-hover-link ${themeClass}`}>
                  Learn More →
                </div>
              </Link>
            );
          })}
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="features-cta">
            <div className={`cta-container ${themeClass}`}>
              <h4 className={`cta-title ${themeClass}`}>
                Ready to Join the Elite?
              </h4>
              <p className={`cta-description ${themeClass}`}>
                Create an account to unlock exclusive benefits and premium features
              </p>
              <div className="cta-buttons">
                <a
                  href="/auth?tab=signup"
                  className="cta-primary-button"
                >
                  Create Account
                </a>
                <a
                  href="/auth"
                  className={`cta-secondary-button ${themeClass}`}
                >
                  Login
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturesSection;