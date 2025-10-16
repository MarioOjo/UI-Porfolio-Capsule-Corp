import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import Price from "../components/Price";

function Wishlist() {
  const { user, loading: authLoading } = useAuth();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-saiyan">Powering up...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-800 mb-4 font-saiyan">
              SAIYAN WISHLIST
            </h1>
            <p className="text-gray-600 mb-8">
              Sign in to save your favorite Capsule Corp. gear for later!
            </p>
            <Link
              to="/auth"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
            >
              POWER UP (SIGN IN)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show loading while wishlist is being fetched
  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-saiyan">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8 p-4">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl xs:text-base sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 font-saiyan flex items-center">
            <FaHeart className="text-red-500 mr-2 sm:mr-4 text-xl sm:text-3xl" />
            <span className="hidden sm:inline">SAIYAN WISHLIST</span>
            <span className="sm:hidden">WISHLIST</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Your saved Capsule Corp. gear ({wishlistItems.length} items)
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <FaHeart className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 px-4">
              Start adding items you love to build your ultimate collection!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 sm:px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl text-sm sm:text-base"
            >
              EXPLORE GEAR
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name || 'Product'}
                    className="w-full sm:h-48 h-32 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  {item.inStock === false && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                
                <div className="p-4 sm:p-6">
                  {item.category && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  )}
                  
                  <Link to={`/product/${item.slug || item.id}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 font-saiyan hover:text-orange-600 transition-colors line-clamp-2">
                      {item.name || 'Unnamed Product'}
                    </h3>
                  </Link>
                  
                  {item.powerLevel && (
                    <div className="flex items-center mb-3">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-xs sm:text-sm text-gray-600">
                        Power Level: {item.powerLevel.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl sm:text-2xl font-bold text-orange-600 font-saiyan">
                      <Price value={item.price || 0} />
                    </span>
                  </div>
                  
                  <div className="sm:flex-row flex flex-col space-y-2 sm:space-y-0 sm:space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.inStock === false}
                      className={`flex-1 flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-saiyan font-bold text-xs sm:text-sm transition-all ${
                        item.inStock !== false
                          ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaShoppingCart className="mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">{item.inStock !== false ? "ADD TO CAPSULE" : "OUT OF STOCK"}</span>
                      <span className="sm:hidden">{item.inStock !== false ? "ADD" : "OUT"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;