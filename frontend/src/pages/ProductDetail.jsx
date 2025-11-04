import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaMinus, FaPlus, FaCheckCircle, FaBolt } from "react-icons/fa";
import { apiFetch } from "../utils/api";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import ProductCard from "../components/Product/ProductCard";
import ImageCover from "../components/ImageCover";
import resolveImageSrc, { CLOUDINARY_BASE } from '../utils/images';
import Price from "../components/Price";
import Breadcrumb from "../components/Breadcrumb";
import { useTheme } from "../contexts/ThemeContext";
import ReviewDisplay from "../components/ReviewSystem";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDarkMode } = useTheme();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-blue-50 to-orange-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-blue-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-800',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: isDarkMode 
        ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white' 
        : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
      secondary: isDarkMode 
        ? 'bg-slate-700 text-white border-slate-600' 
        : 'bg-white text-gray-700 border-gray-300'
    }
  };

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch product by slug
        const productResponse = await apiFetch(`/api/products/slug/${slug}`);
        
        if (productResponse.product) {
          setProduct(productResponse.product);
          
          // Fetch related products from same category
          const relatedResponse = await apiFetch(`/api/products?category=${encodeURIComponent(productResponse.product.category)}&limit=5`);
          const related = (relatedResponse.products || [])
            .filter(p => p.id !== productResponse.product.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          navigate('/products');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [slug, navigate]);

  // Preload selected image and update imageLoaded when ready
  useEffect(() => {
    if (!product) return;
    const raw = product.gallery?.[selectedImage] ?? product.image;
    const url = resolveImageSrc(raw, 800);
    setImageLoaded(false);
    const img = new Image();
    img.src = url;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(false);
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [product, selectedImage]);

  const handleAddToCart = () => {
    if (product && (product.inStock || product.in_stock || product.stock > 0)) {
      addToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleQuantityChange = (change) => {
    const maxStock = product?.stock || 0;
    setQuantity(prev => Math.max(1, Math.min(maxStock, prev + change)));
  };

  if (loading) {
    return (
      <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
          <Breadcrumb />
          <div className="text-center mt-8 sm:mt-12">
            <div className="animate-spin rounded-full h-16 sm:h-24 w-16 sm:w-24 border-b-4 border-orange-500 mx-auto mb-4 sm:mb-6"></div>
            <p className={`font-saiyan text-lg sm:text-xl ${themeClasses.text.secondary}`}>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-16">
          <Breadcrumb />
          <div className="text-center mt-8 sm:mt-12">
            <h1 className={`text-2xl sm:text-4xl font-bold mb-4 font-saiyan ${themeClasses.text.primary}`}>
              PRODUCT NOT FOUND
            </h1>
            <p className={`${themeClasses.text.secondary} mb-6 sm:mb-8`}>
              The product you're looking for doesn't exist in our capsule inventory.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 text-sm sm:text-base"
            >
              BACK TO PRODUCTS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isInStock = product.inStock || product.in_stock || product.stock > 0;
  const stockCount = product.stock || 0;

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        <Breadcrumb />
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 transition-colors mb-4 sm:mb-6 font-saiyan text-sm sm:text-base ${
            isDarkMode ? 'text-blue-400 hover:text-orange-400' : 'text-blue-600 hover:text-orange-600'
          }`}
          aria-label="Back to products"
        >
          <FaArrowLeft />
          <span>BACK TO PRODUCTS</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              {product && (
                <ImageCover
                  src={resolveImageSrc(product.gallery?.[selectedImage] ?? product.image, 800)}
                  alt={product.name}
                  className="aspect-square shadow-xl"
                  overlayText={product.name}
                />
              )}
              
              {/* Status Badges */}
              {!isInStock && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold shadow-lg text-xs sm:text-sm">
                  OUT OF STOCK
                </div>
              )}
              {(product.featured || product.is_featured) && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold kamehameha-glow text-xs sm:text-sm">
                  LEGENDARY ITEM
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2" aria-label="Product gallery thumbnails">
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-orange-500 scale-105'
                        : `border-gray-200 ${isDarkMode ? 'hover:border-blue-400' : 'hover:border-blue-400'}`
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={resolveImageSrc(image, 80)}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = `${CLOUDINARY_BASE}/c_fill,w_80,h_80,g_center/v1759096629/d3_xdolmn.jpg`;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            {/* Category */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
              }`}>
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan ${themeClasses.text.primary}`}>
              {product.name}
            </h1>

            {/* Power Level */}
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400 text-lg sm:text-xl" />
              <span className={`text-base sm:text-lg ${themeClasses.text.secondary}`}>
                Power Level: <span className="font-bold text-orange-600 dark:text-orange-400">
                  {Number(product.powerLevel || product.power_level || 0).toLocaleString()}
                </span>
              </span>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {(product.originalPrice || product.original_price) && (
                <span className={`text-xl sm:text-2xl line-through ${themeClasses.text.muted}`}>
                  <Price value={product.originalPrice || product.original_price} />
                </span>
              )}
              <span className={`text-3xl sm:text-4xl font-bold font-saiyan text-orange-600 dark:text-orange-400`}>
                <Price value={product.price} />
              </span>
              {(product.originalPrice || product.original_price) && (
                <span className="bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                  SAVE <Price value={(parseFloat(product.originalPrice || product.original_price) - parseFloat(product.price))} />
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${
                isInStock 
                  ? (stockCount <= 9 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400')
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {isInStock ? 
                  (stockCount <= 9 ? `Only ${stockCount} left in stock!` : 'In Stock') 
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="flex items-center space-x-3 sm:space-x-4">
                <span className={`text-base sm:text-lg font-medium ${themeClasses.text.secondary}`}>Quantity:</span>
                <div className={`flex items-center border-2 rounded-lg ${
                  isDarkMode ? 'border-slate-600' : 'border-gray-300'
                }`}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    }`}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                  </button>
                  <span 
                    className={`px-3 sm:px-4 py-2 min-w-[2.5rem] sm:min-w-[3rem] text-center font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`} 
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= stockCount}
                    className={`p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'
                    }`}
                    aria-label="Increase quantity"
                  >
                    <FaPlus className={isDarkMode ? 'text-white' : 'text-gray-700'} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 flex items-center justify-center px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-saiyan font-bold text-base sm:text-lg transition-all ${
                  isInStock
                    ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                aria-label={isInStock ? "Add to cart" : "Out of stock"}
              >
                <FaShoppingCart className="mr-2 sm:mr-3" />
                {isInStock ? "ADD TO CAPSULE" : "OUT OF STOCK"}
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`px-4 sm:px-6 py-3 sm:py-4 rounded-xl border-2 transition-all flex items-center justify-center ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : `${
                        isDarkMode 
                          ? 'bg-slate-700 text-white border-slate-600 hover:border-red-500 hover:text-red-500' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'
                      }`
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!user}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <FaHeart className="text-lg sm:text-xl" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <FaCheckCircle />
                <span className="text-sm">Battle Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <FaBolt />
                <span className="text-sm">Energy Efficient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className={`rounded-2xl shadow-lg overflow-hidden mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <nav className="flex overflow-x-auto" aria-label="Product details tabs">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-4 sm:px-8 py-3 sm:py-4 font-saiyan font-bold transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                      : `${
                          isDarkMode 
                            ? 'text-gray-300 hover:text-orange-400' 
                            : 'text-gray-600 hover:text-orange-600'
                        }`
                  }`}
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tab-panel-${tab.id}`}
                  role="tab"
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none" id="tab-panel-description" role="tabpanel">
                <p className={`text-base sm:text-lg leading-relaxed ${themeClasses.text.secondary}`}>
                  {product.description}
                </p>
              </div>
            )}
            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6" id="tab-panel-specifications" role="tabpanel">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div 
                    key={key} 
                    className={`flex justify-between items-center py-3 border-b ${
                      isDarkMode ? 'border-slate-700' : 'border-gray-200'
                    }`}
                  >
                    <span className={`font-medium ${themeClasses.text.secondary}`}>{key}:</span>
                    <span className="font-bold text-orange-600 dark:text-orange-400">{value}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div id="tab-panel-reviews" role="tabpanel">
                <ReviewDisplay productId={product?.id} />
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-saiyan ${themeClasses.text.primary}`}>
              RELATED CAPSULES
            </h2>
            <div className="mobile-grid gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  size="medium"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;