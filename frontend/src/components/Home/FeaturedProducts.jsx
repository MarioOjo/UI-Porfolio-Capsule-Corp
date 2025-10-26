import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Price from '../Price';
import './FeaturedProducts.css';

function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFetch('/api/products?featured=true&limit=3');
        // Ensure we only display exactly 3 featured products in frontend
        setFeaturedProducts((response.products || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleToggleWishlist = (product) => {
    addToWishlist(product);
  };

  if (loading) {
    return (
      <section className="feature-products-container" id="products">
        <div className="max-w-6xl mx-auto px-4">
          <div className="feature-products-header">
            <h3 className="feature-products-title">Featured Battle Gear</h3>
            <p className="feature-products-subtitle">Equipment tested by the strongest warriors in the universe</p>
          </div>
          <div className="feature-products-loading">
            <div className="loading-orb"></div>
            <div className="feature-products-empty">Loading Featured Products...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="feature-products-container" id="products">
        <div className="max-w-6xl mx-auto px-4">
          <div className="feature-products-header">
            <h3 className="feature-products-title">Featured Battle Gear</h3>
            <p className="feature-products-subtitle">Equipment tested by the strongest warriors in the universe</p>
          </div>
          <div className="feature-products-empty">
            <div className="empty-icon">⚠️</div>
            <div>{error}</div>
          </div>
        </div>
      </section>
    );
  }

    return (
      <section className="feature-products-container" id="products">
        <div className="max-w-6xl mx-auto px-4">
          <div className="feature-products-header">
            <h3 className="feature-products-title">Featured Battle Gear</h3>
            <p className="feature-products-subtitle">Equipment tested by the strongest warriors in the universe</p>
          </div>

        {featuredProducts.length > 0 ? (
          <div className="feature-products-grid">
            {featuredProducts.map(product => (
              <div key={product.id} className="feature-product-card">
                <div className="feature-product-image">
                  <Link to={`/products/${product.slug}`}>
                    <img src={product.image} alt={product.name} />
                  </Link>

                  {user && (
                    <div className={`feature-product-badge badge-legendary`}>
                      ♥
                    </div>
                  )}

                  {parseFloat(product.original_price || 0) > parseFloat(product.price || 0) && (
                    <div className="feature-product-badge">SALE</div>
                  )}
                </div>

                <div className="feature-product-info">
                  <div className="feature-product-name">{product.name}</div>
                  <div className="feature-product-power">
                    <span className="power-icon">★</span>
                    <span className="power-text">Power:</span>
                    <span className="power-value">{product.power || '—'}</span>
                  </div>
                  <div className="feature-product-tags">
                    <div className="feature-product-tag">{product.category || 'Gear'}</div>
                  </div>

                  <div className="feature-product-price">
                    <div className="price-container">
                      <div className="current-price"><Price value={parseFloat(product.price || 0)} /></div>
                      {parseFloat(product.original_price || 0) > parseFloat(product.price || 0) && (
                        <div className="original-price"><Price value={parseFloat(product.original_price || 0)} /></div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!(product.stock > 0)}
                    className="feature-product-action"
                  >
                    <FaShoppingCart />
                    {(product.stock > 0) ? 'Add to Capsule' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="feature-products-empty">
            <div className="empty-icon">💤</div>
            <div>No featured products available</div>
          </div>
        )}

        <div className="legendary-badge">
          <div className="legendary-title">Explore the Capsule Collection</div>
          <div className="legendary-description">Gear forged by Capsule Corp engineers.</div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;