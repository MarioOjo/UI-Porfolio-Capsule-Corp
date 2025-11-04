import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { FaBolt, FaShoppingCart, FaHeart, FaHistory, FaDragon, FaStar, FaShieldAlt, FaRocket } from "react-icons/fa";
import './HeroSection.css';

function HeroSection() {
  const { isDarkMode } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleWishlist = () => {
    navigate('/wishlist');
  };

  const handleOrderHistory = () => {
    navigate('/orders');
  };

  const handleBattleGear = () => {
    navigate('/battle-gear');
  };

  const handleCapsules = () => {
    navigate('/capsules');
  };

  const handleQuickShop = (category) => {
    navigate(`/products?category=${category}`);
  };

  // DBZ-themed features
  const features = [
    { icon: <FaDragon />, text: "Legendary Gear", color: "#FF6B00" },
    { icon: <FaShieldAlt />, text: "Battle Ready", color: "#3B4CCA" },
    { icon: <FaRocket />, text: "Fast Delivery", color: "#9C27B0" },
    { icon: <FaStar />, text: "Premium Quality", color: "#FFD700" }
  ];

  // Dragon Ball colors
  const dragonBalls = [
    { color: "#FF4444", star: "⭐", number: 1 },
    { color: "#FFAA00", star: "⭐", number: 2 },
    { color: "#FFFF00", star: "⭐", number: 3 },
    { color: "#44FF44", star: "⭐", number: 4 },
    { color: "#4444FF", star: "⭐", number: 5 },
    { color: "#AA00AA", star: "⭐", number: 6 },
    { color: "#FF44FF", star: "⭐", number: 7 }
  ];

  return (
    <section className={`hero-section ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Animated Background Elements */}
      <div className="hero-background">
        <div className="energy-wave-1"></div>
        <div className="energy-wave-2"></div>
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="particle-field"></div>
      </div>

      {/* Main Content */}
      <div className="hero-container">
        <div className="hero-content-grid">
          {/* Text Content */}
          <div className="hero-text-content">
            {/* Welcome Badge */}
            <div className="welcome-badge">
              <FaBolt className="badge-icon" />
              <span>{isAuthenticated ? `WELCOME BACK, WARRIOR!` : 'SUMMER SAIYAN SALE'}</span>
              <FaBolt className="badge-icon" />
            </div>

            {/* Main Title */}
            <h1 className="hero-title">
              <span className="title-line-1">POWER UP YOUR</span>
              <span className="title-line-2">
                <span className="title-accent">BATTLE</span> GEAR
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle">
              {isAuthenticated 
                ? `Ready to power up your training, ${user?.displayName || 'Saiyan'}? Discover legendary equipment and exclusive warrior offers!`
                : 'Unlock your true potential with legendary Dragon Ball Z gear! Up to 50% off battle equipment, capsules, and training gear.'
              }
            </p>

            {/* Features */}
            <div className="hero-features">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span 
                    className="feature-icon"
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </span>
                  <span className="feature-text">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hero-actions">
              <button
                onClick={handleShopNow}
                className="hero-btn primary-btn kamehameha-glow"
              >
                <FaShoppingCart className="btn-icon" />
                EXPLORE GEAR
                <div className="btn-glow"></div>
              </button>

              <button
                onClick={handleBattleGear}
                className="hero-btn secondary-btn"
              >
                <FaShieldAlt className="btn-icon" />
                BATTLE READY
              </button>

              {isAuthenticated && (
                <div className="user-quick-actions">
                  <button 
                    onClick={handleWishlist}
                    className="quick-action-btn wishlist-btn"
                  >
                    <FaHeart className="btn-icon" />
                    WISHLIST
                    {wishlistCount > 0 && (
                      <span className="quick-action-badge">{wishlistCount}</span>
                    )}
                  </button>
                  <button 
                    onClick={handleOrderHistory}
                    className="quick-action-btn history-btn"
                  >
                    <FaHistory className="btn-icon" />
                    ORDERS
                  </button>
                </div>
              )}
            </div>

            {/* Quick Shop Categories */}
            <div className="quick-shop">
              <span className="quick-shop-label">QUICK SHOP:</span>
              <div className="quick-shop-buttons">
                <button 
                  onClick={() => handleQuickShop('battle-gear')}
                  className="category-btn"
                >
                  Battle Gear
                </button>
                <button 
                  onClick={() => handleQuickShop('capsules')}
                  className="category-btn"
                >
                  Capsules
                </button>
                <button 
                  onClick={() => handleQuickShop('training')}
                  className="category-btn"
                >
                  Training
                </button>
                <button 
                  onClick={() => handleQuickShop('accessories')}
                  className="category-btn"
                >
                  Accessories
                </button>
              </div>
            </div>

            {/* Dragon Balls Collector */}
            <div className="dragon-balls-collector">
              <div className="dragon-balls-container">
                {dragonBalls.map((ball) => (
                  <div 
                    key={ball.number}
                    className="dragon-ball"
                    style={{ 
                      backgroundColor: ball.color,
                      animationDelay: `${ball.number * 0.5}s`
                    }}
                  >
                    <span className="dragon-ball-star">{ball.star}</span>
                    <span className="dragon-ball-number">{ball.number}</span>
                  </div>
                ))}
              </div>
              <span className="collect-text">Collect all 7 Dragon Balls for a wish!</span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hero-image-section">
            <div className="hero-image-container">
              {/* Main Hero Image */}
              <img
                className="hero-main-image"
                src="https://res.cloudinary.com/dx8wt3el4/image/upload/v1761211841/Firefly_-photorealistic_shot_of_the_Capsule_Corporation_headquarters_from_Dragon_Ball_Z_a_ma_554083_eoqshv.jpg"
                alt="Capsule Corp Headquarters - Dragon Ball Z"
                loading="eager"
              />
              
              {/* Floating Product Cards */}
              <div className="floating-card card-1">
                <img 
                  src="https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_150,h_150,f_auto,q_auto/v1759096578/c3_kamzog.jpg" 
                  alt="Saiyan Battle Armor" 
                  className="floating-card-image"
                />
                <div className="floating-card-badge">HOT</div>
              </div>
              
              <div className="floating-card card-2">
                <img 
                  src="https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_150,h_150,f_auto,q_auto/v1759610849/dragonrader_srs7e7.jpg" 
                  alt="Dragon Radar" 
                  className="floating-card-image"
                />
                <div className="floating-card-badge">NEW</div>
              </div>
              
              <div className="floating-card card-3">
                <img 
                  src="https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_150,h_150,f_auto,q_auto/v1759163370/earrings_uz8yak.jpg" 
                  alt="Potara Earrings" 
                  className="floating-card-image"
                />
                <div className="floating-card-badge">SALE</div>
              </div>

              {/* Energy Effects */}
              <div className="energy-aura-1"></div>
              <div className="energy-aura-2"></div>
              <div className="energy-sparks"></div>
            </div>

            {/* Stats Bar */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Warriors Served</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Legendary Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Capsule Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
          <span className="scroll-text">Scroll to Explore</span>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;