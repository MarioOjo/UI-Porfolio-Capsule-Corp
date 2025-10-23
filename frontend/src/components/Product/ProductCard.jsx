import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Price from "../../components/Price";
import ImageCover from "../ImageCover";

import React from "react";

const ProductCard = React.memo(function ProductCard({ product, size = "medium" }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const inStock = product.stock > 0 || product.inStock || product.in_stock;
    if (inStock) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const cardSizes = {
    small: "h-32",
    medium: "h-48",
    large: "h-64"
  };

  const textSizes = {
    small: "text-sm",
    medium: "text-lg",
    large: "text-xl"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:scale-105 border-2 border-transparent hover:border-orange-200 w-full max-w-sm mx-auto sm:max-w-none p-2 sm:p-0">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative">
          {/* Product Image */}
          <div className={`w-full ${cardSizes[size]} flex items-center justify-center relative overflow-hidden`}>
            <ImageCover
              src={product.image}
              alt={product.name}
              className={`w-full ${cardSizes[size]}`}
              overlayText={product.name}
            />
          </div>
            
          {/* Status Badges */}
          {(product.stock <= 0 || (!product.inStock && !product.in_stock)) && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              OUT OF STOCK
            </div>
          )}
          {(product.featured || product.is_featured) && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold kamehameha-glow">
              LEGENDARY
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
              (product.featured || product.is_featured) ? 'top-12' : ''
            } ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            } ${!user ? 'opacity-50' : 'hover:scale-110'}`}
            aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart className="text-sm" />
          </button>

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 text-[#3B4CCA] px-4 py-2 rounded-lg font-saiyan font-bold flex items-center space-x-2">
              <FaEye />
              <span>VIEW DETAILS</span>
            </div>
          </div>
          </div>
          
          {/* Product Info */}
          <div className="p-3 sm:p-4">
            <div className="mb-2">
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h3 className={`${size === 'small' ? 'text-sm' : 'text-base sm:text-lg'} font-bold text-gray-800 mb-2 font-saiyan line-clamp-2`}>
              {product.name}
            </h3>
            
            <div className="flex items-center mb-3">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-xs sm:text-sm text-gray-600">
                Power Level: {Number(product.powerLevel || product.power_level || 0).toLocaleString()}
              </span>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center justify-between mb-4">
              <div>
                {(product.originalPrice || product.original_price) && (
                  <span className="text-xs sm:text-sm text-gray-400 line-through mr-2">
                    <Price value={product.originalPrice || product.original_price} />
                  </span>
                )}
                <span className={`${size === 'small' ? 'text-base' : 'text-lg sm:text-xl'} font-bold text-orange-600 font-saiyan`}>
                  <Price value={product.price} />
                </span>
              </div>
              {product.stock <= 5 && (product.inStock || product.in_stock || product.stock > 0) && (
                <span className="text-xs text-red-500 font-medium hidden sm:inline">
                  Only {product.stock} left!
                </span>
              )}
            </div>
          </div>
      </Link>
      
      {/* Action Button - hidden on mobile, visible on desktop */}
      <div className="hidden sm:block px-3 sm:px-4 pb-3 sm:pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!(product.inStock || product.in_stock || product.stock > 0)}
          className={`w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-saiyan font-bold text-xs sm:text-sm transition-all touch-target ${
            (product.inStock || product.in_stock || product.stock > 0)
              ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white kamehameha-glow hover:scale-105 hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FaShoppingCart className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{(product.inStock || product.in_stock || product.stock > 0) ? "ADD TO CAPSULE" : "OUT OF STOCK"}</span>
          <span className="sm:hidden">{(product.inStock || product.in_stock || product.stock > 0) ? "ADD" : "OUT"}</span>
        </button>
      </div>
    </div>
  );
});

export default ProductCard;