import { Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import { useTheme } from "../../contexts/ThemeContext";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const featuredProducts = [
  {
    id: 1,
    name: "Saiyan Battle Armor",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2395797406-0b1495743d04eddc3fd5.png",
    desc: "Elite Saiyan combat gear with energy absorption technology",
    price: 299,
    originalPrice: 399,
    pl: "PL: 9000+",
    link: "/products",
    category: "Battle Gear",
    rating: 4.8,
    inStock: true
  },
  {
    id: 2,
    name: "Gravity Chamber",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/43e28df86d-b72d92b389d88e498710.png",
    desc: "Train under extreme gravity conditions up to 500x Earth gravity",
    price: 15999,
    originalPrice: 19999,
    pl: "PL: 50000+",
    link: "/training",
    category: "Training",
    rating: 5.0,
    inStock: true
  },
  {
    id: 3,
    name: "Elite Scouter",
    img: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2d967b598f-8cc6444dbec152dabcfa.png",
    desc: "Advanced power level detection with combat analysis",
    price: 1299,
    originalPrice: 1599,
    pl: "PL: 1M+",
    link: "/capsules",
    category: "Tech",
    rating: 4.6,
    inStock: true
  },
];

function FeaturedProducts() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isDarkMode } = useTheme();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleToggleWishlist = (product) => {
    addToWishlist(product);
  };

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
                <Link to={product.link}>
                  <img className="h-64 w-full object-cover" src={product.img} alt={product.name} />
                </Link>
                
                {/* Wishlist Button */}
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

                {/* Sale Badge */}
                {product.originalPrice > product.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                    SALE
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <Link to={product.link}>
                    <h4 className={`text-xl font-bold transition-colors ${
                      isDarkMode 
                        ? 'text-orange-400 hover:text-orange-300' 
                        : 'text-[#3B4CCA] hover:text-[#FF9E00]'
                    }`}>
                      {product.name}
                    </h4>
                  </Link>
                  <span className="bg-[#00FF00] text-black px-3 py-1 text-sm font-bold rounded-full">
                    {product.pl}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ⭐
                    </span>
                  ))}
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({product.rating})
                  </span>
                </div>

                <p className={`mb-6 leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {product.desc}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold ${isDarkMode ? 'text-orange-400' : 'text-[#3B4CCA]'}`}>
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-lg text-gray-500 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <FaShoppingCart />
                    Add to Capsule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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