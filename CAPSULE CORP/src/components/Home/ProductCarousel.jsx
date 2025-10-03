import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaStar } from "react-icons/fa";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { apiFetch } from "../../utils/api";

function ProductCarousel() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  // Auto-advance carousel every 5 seconds (continuous autoplay)
  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products.length, currentSlide]);

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
      <div className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-50 to-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-96 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null;
  }

  const currentProduct = products[currentSlide];

  return (
    <section className={`py-16 relative ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-50 to-orange-50'}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-red-400 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-black font-saiyan mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            🐉 LEGENDARY EQUIPMENT SHOWCASE
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Collect all 7 Dragon Balls and discover our most powerful gear! Experience the might of legendary equipment used by the universe's strongest warriors.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="relative h-96 md:h-[500px]">
            {/* Background with Dragon Ball aesthetic */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-red-500 to-purple-600">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-yellow-400/10 to-transparent"></div>
            </div>

            {/* Slides - Each positioned absolutely with fade transition */}
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {/* Product Content */}
                <div className="relative h-full flex items-center px-6 md:px-12 py-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-6xl mx-auto">
                    {/* Product Image */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-1 kamehameha-glow">
                          <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                            <img
                              src={product.image || `https://via.placeholder.com/300x300/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-full"
                              onError={(e) => {
                                e.target.src = `https://via.placeholder.com/300x300/FF9E00/FFFFFF?text=${encodeURIComponent(product.name)}`;
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Power Level Indicator */}
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 md:px-3 md:py-2 rounded-full font-bold text-xs md:text-sm kamehameha-glow">
                          {Number(product.powerLevel || product.power_level || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center text-white space-y-3 md:space-y-4">
                      <div>
                        <span className="inline-block bg-yellow-400 text-black px-3 py-1 rounded-full text-xs md:text-sm font-bold mb-2 md:mb-3">
                          {product.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black font-saiyan mb-2 md:mb-3 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-sm md:text-base lg:text-lg text-white/90 leading-relaxed line-clamp-2 md:line-clamp-3">
                          {product.description}
                        </p>
                      </div>

                      {/* Power Level Display */}
                      <div className="flex items-center space-x-2">
                        <FaStar className="text-yellow-400 text-lg md:text-xl" />
                        <span className="text-sm md:text-base lg:text-lg font-bold">
                          Power Level: {Number(product.powerLevel || product.power_level || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-3 md:space-x-4">
                        {(product.originalPrice || product.original_price) && (
                          <span className="text-lg md:text-xl text-white/60 line-through">
                            ${parseFloat(product.originalPrice || product.original_price).toFixed(2)}
                          </span>
                        )}
                        <span className="text-2xl md:text-3xl font-bold text-yellow-400 font-saiyan">
                          ${parseFloat(product.price).toFixed(2)}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 md:gap-3">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={!(product.inStock || product.in_stock || product.stock > 0)}
                          className={`flex items-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-saiyan font-bold text-xs md:text-sm transition-all ${
                            (product.inStock || product.in_stock || product.stock > 0)
                              ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                              : "bg-gray-500 text-gray-300 cursor-not-allowed"
                          }`}
                        >
                          <FaShoppingCart className="mr-1.5 md:mr-2 text-xs md:text-sm" />
                          ADD TO CAPSULE
                        </button>

                        <Link
                          to={`/product/${product.slug}`}
                          className="flex items-center px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl font-saiyan font-bold text-xs md:text-sm bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all"
                        >
                          VIEW DETAILS
                        </Link>

                        {user && (
                          <button
                            onClick={(e) => handleWishlistToggle(e, product)}
                            className={`p-2 md:p-3 rounded-full transition-all ${
                              isInWishlist(product.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-white/20 text-white hover:bg-red-500'
                            }`}
                          >
                            <FaHeart className="text-xs md:text-sm" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Slide Indicators - Pill-shaped like Evetech */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-yellow-400'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional Carousel Items Preview */}
        <div className="mt-8 hidden md:block">
          <div className="max-w-max mx-auto">
            <div className="flex justify-center space-x-4">
              {products.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => goToSlide(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentSlide
                      ? 'border-yellow-400 scale-110'
                      : 'border-gray-300 hover:border-yellow-400'
                  }`}
                >
                  <img
                    src={product.image || `https://via.placeholder.com/80x80/FF9E00/FFFFFF?text=${encodeURIComponent(product.name.slice(0, 2))}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
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
  );
}

export default ProductCarousel;