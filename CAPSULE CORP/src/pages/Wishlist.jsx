import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash, FaStar } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";

function Wishlist() {
  const { user } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item);
  };

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

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 font-saiyan flex items-center">
            <FaHeart className="text-red-500 mr-4" />
            SAIYAN WISHLIST
          </h1>
          <p className="text-gray-600">
            Your saved Capsule Corp. gear ({wishlistItems.length} items)
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-gray-600 mb-8">
              Start adding items you love to build your ultimate collection!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
            >
              EXPLORE GEAR
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    aria-label="Remove from wishlist"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  {!item.inStock && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  
                  <Link to={`/product/${item.slug}`}>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 font-saiyan hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center mb-3">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      Power Level: {item.powerLevel.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-orange-600 font-saiyan">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.inStock}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl font-saiyan font-bold text-sm transition-all ${
                        item.inStock
                          ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <FaShoppingCart className="mr-2" />
                      {item.inStock ? "ADD TO CAPSULE" : "OUT OF STOCK"}
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