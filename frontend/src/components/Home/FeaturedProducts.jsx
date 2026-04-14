import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useFeaturedProducts } from "../../hooks/useProducts";
import { FaBolt, FaDragon, FaStar, FaShieldAlt, FaFire } from "react-icons/fa";
import './FeaturedProducts.css';
import ProductCard from "../Product/ProductCard";

function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: apiFeaturedProducts = [], isLoading: loading, error } = useFeaturedProducts();

  const { isDarkMode } = useTheme();

  const getRarityLevel = (price) => {
    const priceValue = parseFloat(price) || 0;
    if (priceValue > 1000) return { level: 'ULTRA RARE', color: '#FF6B00', icon: <FaFire /> };
    if (priceValue > 500) return { level: 'EPIC', color: '#9C27B0', icon: <FaBolt /> };
    if (priceValue > 200) return { level: 'RARE', color: '#2196F3', icon: <FaStar /> };
    return { level: 'COMMON', color: '#4CAF50', icon: <FaShieldAlt /> };
  };

  const getProductFeatures = (category) => {
    const features = {
      'battle-gear': ['Energy Resistance', 'Super Attack Boost', 'Durability+'],
      'capsules': ['Portable Storage', 'Quick Deploy', 'Weather Proof'],
      'training': ['Strength Boost', 'Speed Enhancement', 'Endurance+'],
      'weapons': ['Ki Amplification', 'Critical Hit', 'Special Ability'],
      'armor': ['Auto-Defense', 'Damage Reduction', 'Regeneration']
    };
    return features[category?.toLowerCase()] || ['Power Boost', 'Enhanced Performance', 'Unique Ability'];
  };

  const featuredProducts = useMemo(() => {
    return (apiFeaturedProducts || []).slice(0, 6).map((product) => {
      const validPrice = parseFloat(product.price) || parseFloat(product.originalPrice) || 99.99;
      return {
        ...product,
        id: product.id || product._id,
        price: validPrice,
        powerLevel: product.powerLevel || Math.floor(Math.random() * 9000) + 1000,
        category: product.category || 'Battle Gear',
        rarity: getRarityLevel(validPrice),
        features: getProductFeatures(product.category)
      };
    });
  }, [apiFeaturedProducts]);

  const normalizeCategoryKey = (value) => String(value || '').toLowerCase().replace(/\s+/g, '-');

  const filteredProducts = featuredProducts.filter(product => {
    if (activeFilter === 'all') return true;
    return normalizeCategoryKey(product.category) === activeFilter;
  });

  const categoryCounts = featuredProducts.reduce((acc, product) => {
    const key = normalizeCategoryKey(product.category) || 'other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const categories = [
    { key: 'all', name: 'ALL GEAR', count: featuredProducts.length },
    ...Object.entries(categoryCounts).map(([key, count]) => ({
      key,
      name: key.replace(/-/g, ' ').toUpperCase(),
      count
    }))
  ];

  if (loading) {
    return (
      <section className={`featured-products-section ${isDarkMode ? 'dark' : 'light'}`} id="products">
        <div className="featured-container">
          {/* Section Header */}
          <div className="featured-header">
            <div className="header-badge saiyan-title-sm saiyan-glow">
              <FaBolt className="badge-icon" />
              <span>LEGENDARY SELECTION</span>
              <FaBolt className="badge-icon" />
            </div>
            <h3 className="saiyan-title-3xl saiyan-energy">FEATURED BATTLE GEAR</h3>
            <p className="saiyan-subtitle-lg">Equipment tested by the strongest warriors across the universe</p>
          </div>

          {/* Loading State */}
          <div className="featured-loading">
            <div className="loading-energy">
              <div className="energy-orb"></div>
              <div className="energy-pulse"></div>
            </div>
            <div className="loading-text saiyan-subtitle-base">
              SCANNING FOR LEGENDARY GEAR...
            </div>
            <div className="loading-stats saiyan-body-sm">
              <span>Powering up capsules...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`featured-products-section ${isDarkMode ? 'dark' : 'light'}`} id="products">
        <div className="featured-container">
          <div className="featured-header">
            <div className="header-badge saiyan-title-sm saiyan-glow">
              <FaBolt className="badge-icon" />
              <span>LEGENDARY SELECTION</span>
              <FaBolt className="badge-icon" />
            </div>
            <h3 className="saiyan-title-3xl saiyan-energy">FEATURED BATTLE GEAR</h3>
            <p className="saiyan-subtitle-lg">Equipment tested by the strongest warriors across the universe</p>
          </div>

          <div className="featured-error">
            <div className="error-icon">🐉</div>
            <h4 className="saiyan-title-xl error-title">ENERGY SIGNATURE NOT FOUND</h4>
            <p className="saiyan-body-base error-message">
              Our scouter cannot detect any legendary gear. The capsules might be recharging or undergoing maintenance.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="retry-button saiyan-body-base"
            >
              <FaBolt className="button-icon" />
              RETRY SCAN
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`featured-products-section ${isDarkMode ? 'dark' : 'light'}`} id="products">
      {/* Background Elements */}
      <div className="featured-background">
        <div className="energy-grid"></div>
        <div className="floating-dragon-balls">
          {[1, 2, 3, 4, 5, 6, 7].map(num => (
            <div key={num} className="dragon-ball-mini" style={{ animationDelay: `${num * 0.5}s` }}>
              ⭐
            </div>
          ))}
        </div>
      </div>

      <div className="featured-container">
        {/* Section Header */}
        <div className="featured-header">
          <div className="header-badge saiyan-title-sm saiyan-glow">
            <FaBolt className="badge-icon" />
            <span>LEGENDARY SELECTION</span>
            <FaBolt className="badge-icon" />
          </div>
          
          <h3 className="saiyan-title-3xl saiyan-energy">FEATURED BATTLE GEAR</h3>
          
          <p className="saiyan-subtitle-lg">
            Discover equipment worthy of gods and mortals alike. Each piece forged with Capsule Corp's cutting-edge technology.
          </p>
        </div>

        {/* Category Filters */}
        <div className="featured-filters">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setActiveFilter(category.key)}
              className={`filter-button ${activeFilter === category.key ? 'active' : ''} saiyan-body-sm`}
            >
              <span className="filter-name">{category.name}</span>
              <span className="filter-count">{category.count}</span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="featured-grid">
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id || product.slug || `${product.name}-${index}`} 
                className="featured-product-card"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Product Card with Enhanced Features */}
                <div className="product-card-wrapper">
                  {/* Rarity Badge */}
                  <div 
                    className="rarity-badge"
                    style={{ borderColor: product.rarity.color }}
                  >
                    <span style={{ color: product.rarity.color }} className="saiyan-body-xs">
                      {product.rarity.icon}
                      {product.rarity.level}
                    </span>
                  </div>

                  {/* Power Level Indicator */}
                  <div className="power-level-display">
                    <div className="power-bar">
                      <div 
                        className="power-fill"
                        style={{ 
                          width: `${Math.min(100, (product.powerLevel / 10000) * 100)}%`,
                          background: `linear-gradient(90deg, ${product.rarity.color}, #FFD700)`
                        }}
                      ></div>
                    </div>
                    <span className="power-text saiyan-body-xs">
                      PL: {product.powerLevel.toLocaleString()}
                    </span>
                  </div>

                  {/* Use ProductCard Component */}
                  <ProductCard 
                    product={product} 
                    size="large"
                    showFeatures={true}
                    showPowerLevel={true}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="featured-empty">
            <div className="empty-icon">💤</div>
            <h4 className="saiyan-title-xl">NO GEAR DETECTED</h4>
            <p className="saiyan-body-base">
              No products found in the {activeFilter !== 'all' ? activeFilter : ''} category. 
              Try another filter or check back later.
            </p>
          </div>
        )}

        {/* Legendary Call-to-Action */}
        <div className="legendary-cta">
          <div className="cta-content">
            <FaDragon className="cta-icon" />
            <div className="cta-text">
              <h4 className="saiyan-title-2xl cta-title">READY FOR MORE POWER?</h4>
              <p className="saiyan-body-lg cta-description">
                Explore our complete collection of legendary gear, capsules, and training equipment.
              </p>
            </div>
            <Link to="/products" className="cta-button saiyan-title-base">
              <FaBolt className="button-icon" />
              EXPLORE ALL GEAR
              <div className="button-energy"></div>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="cta-stats">
            <div className="stat-item">
              <div className="stat-number saiyan-title-lg">500+</div>
              <div className="stat-label saiyan-body-sm">LEGENDARY ITEMS</div>
            </div>
            <div className="stat-item">
              <div className="stat-number saiyan-title-lg">10K+</div>
              <div className="stat-label saiyan-body-sm">WARRIORS SERVED</div>
            </div>
            <div className="stat-item">
              <div className="stat-number saiyan-title-lg">99%</div>
              <div className="stat-label saiyan-body-sm">BATTLE READY</div>
            </div>
            <div className="stat-item">
              <div className="stat-number saiyan-title-lg">24/7</div>
              <div className="stat-label saiyan-body-sm">CAPSULE SUPPORT</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;