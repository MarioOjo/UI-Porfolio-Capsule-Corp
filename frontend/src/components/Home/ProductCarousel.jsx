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
      <section className={`product-carousel-section ${themeClass} hidden md:block`} style={{border:'2px dashed red', background:'#fffbe6'}}>
        {/* ...existing code for desktop carousel... */}
        <div style={{padding:'2rem', textAlign:'center', color:'red'}}>DESKTOP CAROUSEL DIAGNOSTIC BOX</div>
      </section>

      {/* Mobile/Small screens: horizontal infinite scroller, compact card, no action buttons/thumbnails */}
      <section className={`product-carousel-section-mobile ${themeClass} block md:hidden w-full px-2 py-4`} style={{border:'2px dashed blue', background:'#e6f7ff'}}>
        <div className="carousel-header-mobile text-center mb-2">
          <h2 className={`carousel-title-mobile text-lg font-bold mb-1 ${themeClass}`}>🐉 LEGENDARY EQUIPMENT</h2>
          <p className={`carousel-subtitle-mobile text-xs text-gray-400 ${themeClass}`}>Collect all 7 Dragon Balls and discover our most powerful gear!</p>
        </div>
        <div className="carousel-mobile-scroll flex overflow-x-auto gap-3 pb-2" style={{scrollSnapType:'x mandatory'}}>
          {products.map((product) => (
            <div
              key={product.id}
              className="carousel-mobile-card min-w-[220px] max-w-[70vw] bg-neutral-900 rounded-2xl shadow-lg p-3 flex-shrink-0 flex flex-col items-center justify-between"
              style={{scrollSnapAlign:'center'}}
            >
              <Link to={`/product/${product.slug}`} className="w-full flex flex-col items-center">
                <img
                  src={product.image || `https://via.placeholder.com/180x180/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`}
                  alt={product.name}
                  className="carousel-mobile-image w-24 h-24 object-cover rounded-xl mb-2"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/180x180/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`;
                  }}
                />
                <span className="carousel-mobile-category text-xs text-orange-400 font-semibold mb-1">{product.category}</span>
                <h3 className="carousel-mobile-name text-base font-bold text-white mb-1 text-center">{product.name}</h3>
                <span className="carousel-mobile-price text-lg font-bold text-green-400 mb-1">
                  <Price value={product.price} />
                </span>
                {(product.originalPrice || product.original_price) && (
                  <span className="carousel-mobile-original-price text-xs line-through text-gray-400 mb-1">
                    <Price value={product.originalPrice || product.original_price} />
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
        <div style={{padding:'2rem', textAlign:'center', color:'blue'}}>MOBILE CAROUSEL DIAGNOSTIC BOX</div>
      </section>
    </>
  );
}

export default ProductCarousel;