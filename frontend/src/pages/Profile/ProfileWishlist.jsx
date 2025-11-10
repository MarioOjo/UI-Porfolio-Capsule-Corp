import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { FaHeart, FaShoppingCart, FaTrash, FaStar, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import Price from '../../components/Price';
import { resolveImageSrc } from '../../utils/images';

const ProfileWishlist = () => {
  const { isDarkMode } = useTheme();
  const { wishlistItems, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart } = useCart();
  const { showSuccess } = useNotifications();
  const [sortBy, setSortBy] = useState('recent');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleAddToCart = (item) => {
    addToCart(item);
    showSuccess(`✅ ${item.name} added to cart!`);
  };

  const handleRemove = (item) => {
    removeFromWishlist(item.id);
    showSuccess(`💔 ${item.name} removed from wishlist`);
  };

  // Get unique categories
  const categories = ['all', ...new Set(wishlistItems.map(item => item.category).filter(Boolean))];

  // Filter and sort items
  let filteredItems = wishlistItems;
  if (filterCategory !== 'all') {
    filteredItems = wishlistItems.filter(item => item.category === filterCategory);
  }

  if (sortBy === 'price-low') {
    filteredItems = [...filteredItems].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-high') {
    filteredItems = [...filteredItems].sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === 'name') {
    filteredItems = [...filteredItems].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }

  if (wishlistLoading) {
    return (
      <div className={`rounded-xl shadow-lg p-8 text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA] mx-auto mb-4"></div>
        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
              <FaHeart className="text-red-500 mr-2" />
              MY WISHLIST
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>

          {/* Filter and Sort Controls */}
          {wishlistItems.length > 0 && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <FaFilter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border-2 font-saiyan text-sm ${
                    isDarkMode 
                      ? 'bg-slate-600 border-slate-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat === 'all' ? 'ALL' : cat.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <FaSortAmountDown className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border-2 font-saiyan text-sm ${
                    isDarkMode 
                      ? 'bg-slate-600 border-slate-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="recent">RECENT</option>
                  <option value="name">NAME</option>
                  <option value="price-low">PRICE: LOW</option>
                  <option value="price-high">PRICE: HIGH</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Content */}
      <div className="p-6">
        {filteredItems.length === 0 ? (
          <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-600' : 'bg-gray-50'}`}>
            <FaHeart className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {wishlistItems.length === 0 ? 'YOUR WISHLIST IS EMPTY' : 'NO ITEMS MATCH YOUR FILTER'}
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {wishlistItems.length === 0 
                ? 'Start adding your favorite Capsule Corp gear!' 
                : 'Try a different category or clear filters'}
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white px-6 py-3 rounded-lg font-saiyan font-bold hover:shadow-lg transition-all"
            >
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all ${
                  isDarkMode ? 'bg-slate-600' : 'bg-white'
                }`}
              >
                <div className="relative">
                  <Link to={`/product/${item.slug || item.id}`}>
                    <img
                      src={resolveImageSrc(item, 300)}
                      alt={item.name || 'Product'}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/assets/images/placeholder-300.png';
                      }}
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(item)}
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
                
                <div className="p-4">
                  {item.category && (
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  )}
                  
                  <Link to={`/product/${item.slug || item.id}`}>
                    <h3 className={`text-lg font-bold mb-2 font-saiyan hover:text-orange-600 transition-colors line-clamp-2 ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {item.name || 'Unnamed Product'}
                    </h3>
                  </Link>
                  
                  {item.powerLevel && (
                    <div className="flex items-center mb-3">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Power: {item.powerLevel.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-2xl font-bold text-orange-600 font-saiyan`}>
                      <Price value={item.price || 0} />
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={item.inStock === false}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-xl font-saiyan font-bold text-sm transition-all ${
                      item.inStock !== false
                        ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    <FaShoppingCart className="mr-2" />
                    {item.inStock !== false ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileWishlist;
