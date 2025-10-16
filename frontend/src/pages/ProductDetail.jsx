import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar, FaArrowLeft, FaMinus, FaPlus, FaCheckCircle, FaBolt } from "react-icons/fa";
import { apiFetch } from "../utils/api";
import { useAuth } from "../AuthContext";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import ProductCard from "../components/Product/ProductCard";
import ImageCover from "../components/ImageCover";
import Price from "../components/Price";

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const url = product.gallery?.[selectedImage] || product.image;
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
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 overflow-x-hidden">
        <div className="max-w-6xl mx-auto px-4 py-16 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-saiyan">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 font-saiyan">
              PRODUCT NOT FOUND
            </h1>
            <p className="text-gray-600 mb-8">
              The product you're looking for doesn't exist in our capsule inventory.
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105"
            >
              BACK TO PRODUCTS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-blue-600 hover:text-orange-600 transition-colors mb-6 font-saiyan"
        >
          <FaArrowLeft />
          <span>BACK TO PRODUCTS</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              {product && (
                <ImageCover
                  src={product.gallery?.[selectedImage] || product.image}
                  alt={product.name}
                  className="aspect-square shadow-xl"
                  overlayText={product.name}
                />
              )}
              
              {/* Status Badge */}
              {!(product.inStock || product.in_stock || product.stock > 0) && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                  OUT OF STOCK
                </div>
              )}
              {(product.featured || product.is_featured) && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-4 py-2 rounded-full font-bold kamehameha-glow">
                  LEGENDARY ITEM
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-orange-500 scale-105'
                        : 'border-gray-200 hover:border-blue-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/api/placeholder/80/80';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="inline-block bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-800 font-saiyan">
              {product.name}
            </h1>

            {/* Power Level */}
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-400 text-xl" />
              <span className="text-lg text-gray-700">
                Power Level: <span className="font-bold text-orange-600">{Number(product.powerLevel || product.power_level || 0).toLocaleString()}</span>
              </span>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center space-x-4">
              {(product.originalPrice || product.original_price) && (
                <span className="text-2xl text-gray-400 line-through">
                  <Price value={product.originalPrice || product.original_price} />
                </span>
              )}
              <span className="text-4xl font-bold text-orange-600 font-saiyan">
                <Price value={product.price} />
              </span>
              {(product.originalPrice || product.original_price) && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  SAVE <Price value={(parseFloat(product.originalPrice || product.original_price) - parseFloat(product.price))} />
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${(product.inStock || product.in_stock || product.stock > 0) ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${(product.inStock || product.in_stock || product.stock > 0) ? 'text-green-600' : 'text-red-600'}`}>
                {(product.inStock || product.in_stock || product.stock > 0) ? 
                  product.stock <= 5 ? `Only ${product.stock} left in stock!` : 'In Stock' 
                  : 'Out of Stock'
                }
              </span>
            </div>

            {/* Quantity Selector */}
            {(product.inStock || product.in_stock || product.stock > 0) && (
              <div className="flex items-center space-x-4">
                <span className="text-lg font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-4 py-2 min-w-[3rem] text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!(product.inStock || product.in_stock || product.stock > 0)}
                className={`flex-1 flex items-center justify-center px-8 py-4 rounded-xl font-saiyan font-bold text-lg transition-all ${
                  (product.inStock || product.in_stock || product.stock > 0)
                    ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <FaShoppingCart className="mr-3" />
                {(product.inStock || product.in_stock || product.stock > 0) ? "ADD TO CAPSULE" : "OUT OF STOCK"}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-4 rounded-xl border-2 transition-all ${
                  isInWishlist(product.id)
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500'
                } ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!user}
              >
                <FaHeart className="text-xl" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-2 text-green-600">
                <FaCheckCircle />
                <span className="text-sm">Battle Tested</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <FaBolt />
                <span className="text-sm">Energy Efficient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="border-b">
            <nav className="flex">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-8 py-4 font-saiyan font-bold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                      : 'text-gray-600 hover:text-orange-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
            
            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="font-bold text-orange-600">{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">Reviews coming soon! Battle-test this item and share your experience.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 font-saiyan mb-8">
              RELATED CAPSULES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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