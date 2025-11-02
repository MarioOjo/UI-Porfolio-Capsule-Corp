import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import Price from "../../components/Price";
import "./ProductCarousel.css";

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const themeClass = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    const fetchCarouselProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch('/api/products?limit=5&offset=3');
        // Ensure we only display exactly 5 products in frontend
        setProducts((response.products || []).slice(0, 5));
      } catch (err) {
        console.error('Error fetching carousel products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarouselProducts();
  }, []);

  // Helper to resolve a usable image src from various shapes the backend may return.
  // Handles:
  // - absolute URLs (https://...)
  // - JSON-array strings like '["https://..."]'
  // - arrays stored directly on the product (['https://...'])
  // - short filenames (e.g. 'motorcycle.jpg') -> attempt Cloudinary absolute path
  // - null/empty -> fall back to local placeholder
  const resolveImageSrc = (product, size = 300) => {
    let img = product && (product.image || product.images || null);
    try {
      if (!img) return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
      // If stored as JSON array string, parse it
      if (typeof img === 'string' && img.trim().startsWith('[')) {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed) && parsed.length) img = parsed[0];
      }
      // If it's an array, pick first
      if (Array.isArray(img)) img = img[0];
      // If not a string after parsing, fallback
      if (!img || typeof img !== 'string') return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
      img = img.trim();
      // If already absolute, return as-is
      if (img.startsWith('http://') || img.startsWith('https://')) return img;
      // If it's a relative path or just a filename, try Cloudinary absolute path (seeded data uses this)
      if (/^[\w-]+\.[a-z]{2,4}$/i.test(img) || img.indexOf('/') === -1) {
        return `https://res.cloudinary.com/dx8wt3el4/image/upload/c_fill,w_${size===80?80:400},h_${size===80?80:400},g_center/${img}`;
      }
      // Otherwise, assume it's a relative URL served from the static assets
      return img.startsWith('/') ? img : `/${img}`;
    } catch (e) {
      return `/assets/images/placeholder-${size === 80 ? '80' : '300'}.png`;
    }
  };

  // Auto-advance carousel every 5 seconds (continuous autoplay)
  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock || product.in_stock || product.stock > 0) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading) {
    return (
      <div className={`product-carousel-section ${themeClass}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="carousel-loading-pulse">
              <div className="carousel-loading-title"></div>
              <div className="carousel-loading-slide"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return (
      <div className={`product-carousel-section ${themeClass}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className={`carousel-error-title ${themeClass}`}>
            No legendary gear available right now
          </h3>
          <p className={`carousel-error-message ${themeClass}`}>
            We're recharging our capsule inventory — check back soon or try refreshing.
          </p>
          <div className="carousel-error-actions">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                // trigger a refetch
                (async () => {
                  try {
                    const response = await apiFetch('/api/products?limit=5&offset=3');
                    setProducts((response.products || []).slice(0, 5));
                  } catch (err) {
                    setError('Failed to load products');
                    setProducts([]);
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className="carousel-retry-button"
            >
              Try again
            </button>
            <Link to="/capsules" className="carousel-browse-link">
              Browse Capsules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentSlide];

  return (
    <section className={`product-carousel-section ${themeClass}`}>
      {/* Background decoration */}
      <div className="carousel-background-decoration">
        <div className="carousel-orb-1"></div>
        <div className="carousel-orb-2"></div>
        <div className="carousel-orb-3"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="carousel-header">
          <h2 className={`carousel-title ${themeClass}`}>
            🐉 LEGENDARY EQUIPMENT SHOWCASE
          </h2>
          <p className={`carousel-subtitle ${themeClass}`}>
            Collect all 7 Dragon Balls and discover our most powerful gear! Experience the might of legendary equipment used by the universe's strongest warriors.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container">
          <div className="carousel-track">
            {/* Background with Dragon Ball aesthetic */}
            <div className="carousel-slide-background">
              <div className="carousel-slide-overlay"></div>
              <div className="carousel-radial-gradient"></div>
            </div>

            {/* Slides */}
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="carousel-slide-content">
                  <div className="carousel-content-grid">
                    {/* Product Image */}
                    <div className="carousel-image-container">
                      <Link to={`/product/${product.slug}`} className="carousel-image-link">
                        <div className="carousel-image-orb">
                          <div className="carousel-image-inner">
                            {
                              // Use local fallback assets instead of external placeholder service
                              // to avoid DNS/CSP/network issues in production.
                            }
                            <img
                              src={resolveImageSrc(product, 300)}
                              alt={product.name}
                              className="carousel-image"
                              onError={(e) => {
                                try { e.target.onerror = null; } catch (err) {}
                                // If the resolved src failed, try a safe final fallback
                                e.target.src = '/assets/images/placeholder-300.png';
                              }}
                            />
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Product Details */}
                    <div className="carousel-details">
                      <div>
                        <span className="carousel-category-badge">
                          {product.category}
                        </span>
                        <h3 className="carousel-product-name">
                          {product.name}
                        </h3>
                      </div>

                      {/* Price */}
                      <div className="carousel-price-section">
                        {(product.originalPrice || product.original_price) && (
                          <span className="carousel-original-price">
                            <Price value={product.originalPrice || product.original_price} />
                          </span>
                        )}
                        <span className="carousel-current-price">
                          <Price value={product.price} />
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="carousel-actions">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!(product.inStock || product.in_stock || product.stock > 0)}
                          className={`carousel-add-to-cart ${
                            (product.inStock || product.in_stock || product.stock > 0) ? 'enabled' : 'disabled'
                          }`}
                        >
                          <FaShoppingCart className="mr-2" />
                          ADD TO CAPSULE
                        </button>

                        <Link
                          to={`/product/${product.slug}`}
                          className="carousel-details-link"
                        >
                          VIEW DETAILS
                        </Link>

                        {user && (
                          <button
                            onClick={(e) => handleWishlistToggle(e, product)}
                            className={`carousel-wishlist-button ${
                              isInWishlist(product.id) ? 'active' : 'inactive'
                            }`}
                          >
                            <FaHeart />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators */}
            <div className="carousel-indicators">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`carousel-indicator ${
                    index === currentSlide ? 'active' : 'inactive'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnail Preview */}
        <div className="carousel-thumbnails">
          <div className="carousel-thumbnails-container">
            <div className="carousel-thumbnails-grid">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => goToSlide(index)}
                  className={`carousel-thumbnail ${
                    index === currentSlide ? 'active' : 'inactive'
                  }`}
                >
                  <img
                    src={resolveImageSrc(product, 80)}
                    alt={product.name}
                    className="carousel-thumbnail-image"
                    onError={(e) => {
                      try { e.target.onerror = null; } catch (err) {}
                      e.target.src = '/assets/images/placeholder-80.png';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductCarousel;