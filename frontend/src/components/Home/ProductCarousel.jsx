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
  // Autoplay for desktop carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => products.length > 0 ? (prev + 1) % products.length : 0);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(interval);
  }, [products]);
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
        setProducts((response.products || []).slice(0, 5));
      } catch (err) {
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCarouselProducts();
  }, []);

  // ...existing code for carousel logic...

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
          <h3 className={`carousel-error-title ${themeClass}`}>No legendary gear available right now</h3>
          <p className={`carousel-error-message ${themeClass}`}>We're recharging our capsule inventory — check back soon or try refreshing.</p>
          <div className="carousel-error-actions">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
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
            >Try again</button>
            <Link to="/capsules" className="carousel-browse-link">Browse Capsules</Link>
          </div>
        </div>
      </div>
    );
  }

  // Desktop/Large screens: original carousel
  // ...existing code for desktop carousel...
  // For brevity, use a comment here. You can restore the full desktop carousel code if needed.
  // <section className={`product-carousel-section ${themeClass} hidden md:block`}> ... </section>

  // Mobile/Small screens: horizontal infinite scroller, compact card, no action buttons/thumbnails
  return (
    <>
      {/* Desktop/Large screens: original carousel */}
      <section className={`product-carousel-section ${themeClass} hidden md:block`}>
        {/* Background decoration */}
        <div className="carousel-background-decoration">
          <div className="carousel-orb-1"></div>
          <div className="carousel-orb-2"></div>
          <div className="carousel-orb-3"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="carousel-header">
            <h2 className={`carousel-title ${themeClass} text-3xl md:text-5xl font-extrabold tracking-wide text-yellow-400 drop-shadow-lg mb-2`}>🐉 LEGENDARY EQUIPMENT SHOWCASE</h2>
            <p className={`carousel-subtitle ${themeClass} text-lg md:text-2xl text-orange-300 font-semibold mb-2`}>Collect all 7 Dragon Balls and discover our most powerful gear! Experience the might of legendary equipment used by the universe's strongest warriors.</p>
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
                <div key={product.id} className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}> 
                  <div className="carousel-slide-content">
                    <div className="carousel-content-grid">
                      {/* Product Image */}
                      <div className="carousel-image-container">
                        <Link to={`/product/${product.slug}`} className="carousel-image-link">
                          <div className="carousel-image-orb">
                            <div className="carousel-image-inner">
                              <img
                                src={product.image || `https://via.placeholder.com/300x300/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`}
                                alt={product.name}
                                className="carousel-image"
                                onError={(e) => {
                                  e.target.src = `https://via.placeholder.com/300x300/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`;
                                }}
                              />
                            </div>
                          </div>
                        </Link>
                      </div>
                      {/* Product Details */}
                      <div className="carousel-details">
                        <div>
                          <span className="carousel-category-badge text-base md:text-lg text-orange-400 font-bold mb-1">{product.category}</span>
                          <h3 className="carousel-product-name text-xl md:text-3xl font-extrabold text-white mb-1 drop-shadow-lg">{product.name}</h3>
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
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (product.inStock || product.in_stock || product.stock > 0) {
                                addToCart(product);
                              }
                            }}
                            disabled={!(product.inStock || product.in_stock || product.stock > 0)}
                            className={`carousel-add-to-cart ${(product.inStock || product.in_stock || product.stock > 0) ? 'enabled' : 'disabled'}`}
                          >
                            <FaShoppingCart className="mr-2" />
                            ADD TO CAPSULE
                          </button>
                          <Link to={`/product/${product.slug}`} className="carousel-details-link">VIEW DETAILS</Link>
                          {user && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isInWishlist(product.id)) {
                                  removeFromWishlist(product.id);
                                } else {
                                  addToWishlist(product);
                                }
                              }}
                              className={`carousel-wishlist-button ${isInWishlist(product.id) ? 'active' : 'inactive'}`}
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
                    onClick={() => setCurrentSlide(index)}
                    className={`carousel-indicator ${index === currentSlide ? 'active' : 'inactive'}`}
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
                    onClick={() => setCurrentSlide(index)}
                    className={`carousel-thumbnail ${index === currentSlide ? 'active' : 'inactive'}`}
                  >
                    <img
                      src={product.image || `https://via.placeholder.com/80x80/FF9E00/FFFFFF?text=${encodeURIComponent(product.name.slice(0, 2))}`}
                      alt={product.name}
                      className="carousel-thumbnail-image"
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/80x80/FF9E00/FFFFFF?text=${encodeURIComponent(product.name.slice(0, 2))}`;
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/Small screens: legendary equipment carousel, no infinite slider, no action buttons */}
      <section className={`product-carousel-section-mobile ${themeClass} block md:hidden w-full px-2 py-4`}>
        <div className="carousel-header-mobile text-center mb-2">
          <h2 className={`carousel-title-mobile text-lg font-bold mb-1 ${themeClass}`}>🐉 LEGENDARY EQUIPMENT</h2>
          <p className={`carousel-subtitle-mobile text-xs text-gray-400 ${themeClass}`}>Collect all 7 Dragon Balls and discover our most powerful gear!</p>
        </div>
        <div className="carousel-mobile-single-slide flex flex-col items-center justify-center gap-3 pb-2">
          {products.length > 0 && (
            <div className="w-full flex flex-col items-center">
              <img
                src={products[currentSlide].image || `https://via.placeholder.com/180x180/FF9E00/FFFFFF?text=${encodeURIComponent(products[currentSlide].name)}`}
                alt={products[currentSlide].name}
                className="carousel-mobile-image w-24 h-24 object-cover rounded-xl mb-2"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/180x180/FF9E00/FFFFFF?text=${encodeURIComponent(products[currentSlide].name)}`;
                }}
              />
              <span className="carousel-mobile-category text-xs text-orange-400 font-semibold mb-1">{products[currentSlide].category}</span>
              <h3 className="carousel-mobile-name text-base font-bold text-white mb-1 text-center">{products[currentSlide].name}</h3>
              <span className="carousel-mobile-price text-lg font-bold text-green-400 mb-1">
                <Price value={products[currentSlide].price} />
              </span>
              {(products[currentSlide].originalPrice || products[currentSlide].original_price) && (
                <span className="carousel-mobile-original-price text-xs line-through text-gray-400 mb-1">
                  <Price value={products[currentSlide].originalPrice || products[currentSlide].original_price} />
                </span>
              )}
            </div>
          )}
          {/* Slide Indicators for mobile */}
          <div className="carousel-indicators-mobile flex justify-center gap-2 mt-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`carousel-indicator-mobile w-4 h-1 rounded-full ${index === currentSlide ? 'bg-orange-400' : 'bg-gray-400'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ProductCarousel;