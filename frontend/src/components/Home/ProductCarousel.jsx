import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaStar, FaChevronLeft, FaChevronRight, FaBolt, FaShieldAlt, FaFire } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useFeaturedProducts } from "../../hooks/useProducts";
import Price from "../../components/Price";
import "./ProductCarousel.css";

function ProductCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: apiFeaturedProducts = [], isLoading: loading, error } = useFeaturedProducts();

  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { addToCart, getItemQuantity } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const themeClass = isDarkMode ? 'dark' : 'light';

  // Enhanced image resolver with Cloudinary optimizations
  const resolveImageSrc = useCallback((product, size = 300) => {
    let img = product && (product.image || product.images || null);
    try {
      if (!img) return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
      
      // Handle JSON array strings
      if (typeof img === 'string' && img.trim().startsWith('[')) {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed) && parsed.length) img = parsed[0];
      }
      
      // Handle arrays
      if (Array.isArray(img)) img = img[0];
      if (!img || typeof img !== 'string') return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
      
      img = img.trim();
      
      // Already absolute URL
      if (img.startsWith('http://') || img.startsWith('https://')) {
        // Optimize external images with Cloudinary if needed
        if (img.includes('cloudinary.com')) {
          // Check if URL already has transformations (contains parameters after /upload/)
          if (img.match(/\/upload\/[^/]+\//)) {
            // Already has transformations, return as-is to avoid duplicates
            return img;
          }
          // No transformations yet, add them
          return img.replace('/upload/', `/upload/c_fill,w_${size},h_${size},f_auto,q_auto/`);
        }
        return img;
      }
      
      // Filename-based images - use Cloudinary with DBZ-themed transformations
      if (/^[\w-]+\.[a-z]{2,4}$/i.test(img) || img.indexOf('/') === -1) {
        const transformation = `c_fill,w_${size},h_${size},f_auto,q_auto,e_improve:50,e_sharpen:50`;
        return `https://res.cloudinary.com/dx8wt3el4/image/upload/${transformation}/${img}`;
      }
      
      // Relative URLs
      return img.startsWith('/') ? img : `/${img}`;
    } catch (e) {
      return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
    }
  }, []);

  // DBZ-themed product enhancements
  const getRarityLevel = (price) => {
    if (price > 1000) return { level: 'ULTRA RARE', color: '#FF6B00', icon: <FaFire /> };
    if (price > 500) return { level: 'EPIC', color: '#9C27B0', icon: <FaBolt /> };
    if (price > 200) return { level: 'RARE', color: '#2196F3', icon: <FaShieldAlt /> };
    return { level: 'COMMON', color: '#4CAF50', icon: <FaStar /> };
  };

  const getDBZFeatures = (category) => {
    const features = {
      armor: ['Energy Resistance', 'Ultra Instinct', 'Auto-Defense'],
      weapons: ['Ki Amplification', 'Super Attack Boost', 'Limit Break'],
      accessories: ['Power Level Scan', 'Instant Transmission', 'Zen Kai Boost'],
      capsules: ['Portable Storage', 'Quick Deploy', 'Weather Proof']
    };
    
    return features[category?.toLowerCase()] || ['Power Boost', 'Enhanced Durability', 'Special Ability'];
  };

  const featuredProducts = useMemo(() => {
    return (apiFeaturedProducts || []).slice(0, 6).map((product) => {
      const validPrice = parseFloat(product.price) || parseFloat(product.originalPrice) || 99.99;
      return {
        ...product,
        id: product.id || product._id,
        price: validPrice,
        powerLevel: product.powerLevel || Math.floor(Math.random() * 9000) + 1000,
        rarity: getRarityLevel(validPrice),
        features: getDBZFeatures(product.category)
      };
    });
  }, [apiFeaturedProducts]);

  // Enhanced carousel navigation with animations
  const navigateSlide = useCallback((direction) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentSlide(prev => {
      const newSlide = direction === 'next' 
        ? (prev + 1) % featuredProducts.length
        : (prev - 1 + featuredProducts.length) % featuredProducts.length;
      return newSlide;
    });
    
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, featuredProducts.length]);

  // Auto-advance with pause on hover
  useEffect(() => {
    if (featuredProducts.length <= 1) return;
    
    const timer = setInterval(() => {
      if (!isAnimating) {
        navigateSlide('next');
      }
    }, 6000);
    
    return () => clearInterval(timer);
  }, [featuredProducts.length, isAnimating, navigateSlide]);

  useEffect(() => {
    if (currentSlide >= featuredProducts.length) {
      setCurrentSlide(0);
    }
  }, [featuredProducts.length, currentSlide]);

  const nextSlide = () => navigateSlide('next');
  const prevSlide = () => navigateSlide('prev');

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock || product.in_stock || product.stock > 0) {
      const success = await addToCart(product, 1, {
        rarity: product.rarity.level,
        powerLevel: product.powerLevel
      });
      
      if (success) {
        // Visual feedback
        const button = e.target.closest('.carousel-add-to-cart');
        if (button) {
          button.classList.add('pulse-effect');
          setTimeout(() => button.classList.remove('pulse-effect'), 600);
        }
      }
    }
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      // Visual feedback
      const button = e.target.closest('.carousel-wishlist-button');
      if (button) {
        button.classList.add('heart-pulse');
        setTimeout(() => button.classList.remove('heart-pulse'), 600);
      }
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`product-carousel-section ${themeClass}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="carousel-skeleton">
            <div className="skeleton-header">
              <div className="skeleton-title"></div>
              <div className="skeleton-subtitle"></div>
            </div>
            <div className="skeleton-slide">
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-badge"></div>
                <div className="skeleton-name"></div>
                <div className="skeleton-price"></div>
                <div className="skeleton-buttons"></div>
              </div>
            </div>
            <div className="skeleton-thumbnails">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton-thumbnail"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state with retry functionality
  if (error || featuredProducts.length === 0) {
    return (
      <div className={`product-carousel-section ${themeClass}`}>
        <div className="carousel-error-state">
          <div className="error-dragon-ball">🐉</div>
          <h3 className={`carousel-error-title ${themeClass}`}>
            Energy Signature Not Found
          </h3>
          <p className={`carousel-error-message ${themeClass}`}>
            Our scouter can't detect any legendary gear right now. The capsules might be recharging!
          </p>
          <div className="carousel-error-actions">
            <button
              onClick={() => window.location.reload()}
              className="carousel-retry-button"
            >
              <FaBolt className="mr-2" />
              Recharge Scanner
            </button>
            <Link to="/products" className="carousel-browse-link">
              Browse All Gear
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = featuredProducts[currentSlide];
  const cartQuantity = getItemQuantity(currentProduct.id);

  return (
    <section className={`product-carousel-section ${themeClass}`}>
      {/* Animated Background Elements */}
      <div className="carousel-background-decoration">
        <div className="carousel-orb-1"></div>
        <div className="carousel-orb-2"></div>
        <div className="carousel-orb-3"></div>
        <div className="carousel-energy-wave"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="carousel-header">
          <div className="carousel-title-container">
            <span className="carousel-title-badge">LIMITED TIME</span>
            <h2 className={`carousel-title ${themeClass}`}>
              ⚡ LEGENDARY GEAR SHOWCASE
            </h2>
          </div>
          <p className={`carousel-subtitle ${themeClass}`}>
            Discover equipment worthy of the Gods of Destruction! Each piece is imbued with incredible power and unique abilities.
          </p>
        </div>

        {/* Main Carousel */}
        <div className="carousel-container">
          {/* Navigation Arrows */}
          {featuredProducts.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="carousel-nav carousel-nav-prev"
                disabled={isAnimating}
              >
                <FaChevronLeft />
              </button>
              <button 
                onClick={nextSlide}
                className="carousel-nav carousel-nav-next"
                disabled={isAnimating}
              >
                <FaChevronRight />
              </button>
            </>
          )}

          <div className="carousel-track">
            {/* Animated Background */}
            <div className="carousel-slide-background">
              <div className="carousel-slide-overlay"></div>
              <div className="carousel-radial-gradient"></div>
              <div className="carousel-energy-particles"></div>
            </div>

            {/* Current Slide */}
            <div className={`carousel-slide active ${isAnimating ? 'animating' : ''}`}>
              <div className="carousel-slide-content">
                <div className="carousel-content-grid">
                  {/* Product Image with Enhanced Effects */}
                  <div className="carousel-image-section">
                    <Link to={`/product/${currentProduct.slug}`} className="carousel-image-link">
                      <div className="carousel-image-orb">
                        <div className="carousel-image-glow"></div>
                        <div className="carousel-image-inner">
                          <img
                            src={resolveImageSrc(currentProduct, 400)}
                            alt={currentProduct.name}
                            className="carousel-image"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/assets/images/placeholder-300.png';
                            }}
                          />
                        </div>
                        {/* Rarity Badge */}
                        <div 
                          className="carousel-rarity-badge"
                          style={{ borderColor: currentProduct.rarity.color }}
                        >
                          <span style={{ color: currentProduct.rarity.color }}>
                            {currentProduct.rarity.icon}
                            {currentProduct.rarity.level}
                          </span>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Power Level Indicator */}
                    <div className="carousel-power-level">
                      <div className="power-level-bar">
                        <div 
                          className="power-level-fill"
                          style={{ 
                            width: `${Math.min(100, (currentProduct.powerLevel / 10000) * 100)}%`,
                            background: `linear-gradient(90deg, ${currentProduct.rarity.color}, #FFD700)`
                          }}
                        ></div>
                      </div>
                      <span className="power-level-text">
                        POWER LEVEL: {currentProduct.powerLevel.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="carousel-details">
                    <div className="carousel-details-content">
                      <span className="carousel-category-badge">
                        {currentProduct.category?.toUpperCase() || 'LEGENDARY GEAR'}
                      </span>
                      
                      <h3 className="carousel-product-name">
                        {currentProduct.name}
                      </h3>
                      
                      <p className="carousel-product-description">
                        {currentProduct.description || 'A legendary piece of equipment with unimaginable power and unique abilities.'}
                      </p>

                      {/* Features */}
                      <div className="carousel-features">
                        {currentProduct.features.slice(0, 3).map((feature, index) => (
                          <span key={index} className="carousel-feature-badge">
                            ⚡ {feature}
                          </span>
                        ))}
                      </div>

                      {/* Price Section */}
                      <div className="carousel-price-section">
                        {(currentProduct.originalPrice || currentProduct.original_price) && (
                          <span className="carousel-original-price">
                            <Price value={currentProduct.originalPrice || currentProduct.original_price} />
                          </span>
                        )}
                        <div className="carousel-price-container">
                          <span className="carousel-current-price">
                            <Price value={currentProduct.price} />
                          </span>
                          {cartQuantity > 0 && (
                            <span className="carousel-cart-quantity">
                              In Capsule: {cartQuantity}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="carousel-actions">
                        <button
                          onClick={(e) => handleAddToCart(e, currentProduct)}
                          disabled={!(currentProduct.inStock || currentProduct.in_stock || currentProduct.stock > 0)}
                          className={`carousel-add-to-cart ${
                            (currentProduct.inStock || currentProduct.in_stock || currentProduct.stock > 0) 
                              ? 'enabled' 
                              : 'disabled'
                          }`}
                        >
                          <FaShoppingCart className="mr-2" />
                          {currentProduct.inStock || currentProduct.in_stock || currentProduct.stock > 0
                            ? 'ADD TO CAPSULE'
                            : 'OUT OF ENERGY'
                          }
                        </button>

                        <Link
                          to={`/product/${currentProduct.slug}`}
                          className="carousel-details-link"
                        >
                          VIEW FULL SPECS
                        </Link>

                        {user && (
                          <button
                            onClick={(e) => handleWishlistToggle(e, currentProduct)}
                            className={`carousel-wishlist-button ${
                              isInWishlist(currentProduct.id) ? 'active' : 'inactive'
                            }`}
                            title={isInWishlist(currentProduct.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                          >
                            <FaHeart />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide Indicators */}
          {featuredProducts.length > 1 && (
            <div className="carousel-indicators">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`carousel-indicator ${
                    index === currentSlide ? 'active' : 'inactive'
                  }`}
                  disabled={isAnimating}
                >
                  <div className="indicator-progress"></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {featuredProducts.length > 1 && (
          <div className="carousel-thumbnails">
            <div className="carousel-thumbnails-container">
              {featuredProducts.map((product, index) => (
                <button
                  key={product.id || product.slug || `${product.name}-${index}`}
                  onClick={() => goToSlide(index)}
                  className={`carousel-thumbnail ${
                    index === currentSlide ? 'active' : 'inactive'
                  }`}
                  disabled={isAnimating}
                >
                  <div className="thumbnail-image-container">
                    <img
                      src={resolveImageSrc(product, 60)}
                      alt={product.name}
                      className="carousel-thumbnail-image"
                    />
                    <div className="thumbnail-overlay">
                      <span className="thumbnail-index">{index + 1}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCarousel;