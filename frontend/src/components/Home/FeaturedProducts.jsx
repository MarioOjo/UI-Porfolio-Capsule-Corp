import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import Price from '../Price';

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
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} id="products">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className={`text-4xl font-bold mb-4 font-saiyan ${isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'}`}>
              Featured Battle Gear
            </h3>
            <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Equipment tested by the strongest warriors in the universe
            </p>
          </div>
          <div className="text-center py-12">
            <div className={`text-2xl font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading Featured Products...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} id="products">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className={`text-4xl font-bold mb-4 font-saiyan ${isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'}`}>
              Featured Battle Gear
            </h3>
            <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Equipment tested by the strongest warriors in the universe
            </p>
          </div>
          <div className="text-center py-12">
            <div className={`text-xl font-saiyan ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
              {error}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-20 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`} id="products">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h3 className={`text-4xl font-bold mb-4 font-saiyan ${isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'}`}>
            Featured Battle Gear
          </h3>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Equipment tested by the strongest warriors in the universe
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className={`border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-800 border-gray-700 hover:border-orange-400' 
                    : 'bg-white border-gray-200 hover:border-[#3B4CCA]'
                }`}
              >
                <div className="relative">
                  <Link to={`/products/${product.slug}`}>
                    <img className="h-64 w-full object-cover" src={product.image} alt={product.name} />
                  </Link>

                  {user && (
                    <button
                      onClick={() => handleToggleWishlist(product)}
                      className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
                        isInWishlist(product.id)
                          ? 'bg-red-500 text-white' 
                          : isDarkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-red-500 hover:text-white'
                            : 'bg-white text-gray-600 hover:bg-red-500 hover:text-white'
                      }`}
                    >
                      <FaHeart />
                    </button>
                  )}

                  {parseFloat(product.original_price || 0) > parseFloat(product.price || 0) && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                      SALE
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <Link to={`/products/${product.slug}`}>
                    <h4 className={`text-xl font-bold mb-2 transition-colors ${
                      isDarkMode 
                        ? 'text-orange-400 hover:text-orange-300'
                        : 'text-[#3B4CCA] hover:text-[#FF9E00]'
                    }`}>
                      {product.name}
                    </h4>
                  </Link>

                  <p className={`mb-4 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'}`}>
                        <Price value={parseFloat(product.price || 0)} />
                      </span>
                      {parseFloat(product.original_price || 0) > parseFloat(product.price || 0) && (
                        <span className="text-lg text-gray-500 line-through">
                          <Price value={parseFloat(product.original_price || 0)} />
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!(product.stock > 0)}
                    className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      (product.stock > 0)
                        ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white hover:from-orange-500 hover:to-orange-700 hover:text-white kamehameha-glow'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart />
                    {(product.stock > 0) ? 'Add to Capsule' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className={`text-xl font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No featured products available
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow-xl"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;