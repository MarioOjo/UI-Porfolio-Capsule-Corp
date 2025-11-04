import { Link } from "react-router-dom";
import './ProductCard.css';
import { FaHeart, FaShoppingCart, FaStar, FaEye } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Price from "../../components/Price";
import ImageCover from "../ImageCover";
import { resolveImageSrc } from "../../utils/images";
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

  const imageSizes = {
    small: "product-image-small",
    medium: "product-image-medium",
    large: "product-image-large"
  };

  const nameSizes = {
    small: "product-name product-name-small",
    medium: "product-name product-name-medium",
    large: "product-name product-name-large"
  };

  const priceSizes = {
    small: "current-price current-price-small",
    medium: "current-price current-price-medium",
    large: "current-price current-price-large"
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card-link">
        <div className="relative">
          {/* Product Image */}
          <div className={`product-image-container ${imageSizes[size]}`}>
            <ImageCover
              src={resolveImageSrc(product, size === 'small' ? 80 : 300)}
              alt={product.name}
              className={`w-full ${imageSizes[size]}`}
              overlayText={product.name}
            />
            
            {/* Status Badges */}
            {(product.stock <= 0 || (!product.inStock && !product.in_stock)) && (
              <div className="status-badge status-badge-out-of-stock">
                OUT OF STOCK
              </div>
            )}
            {(product.featured || product.is_featured) && (
              <div className="status-badge status-badge-featured kamehameha-glow">
                LEGENDARY
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={`wishlist-button ${
                (product.featured || product.is_featured) ? 'wishlist-button-featured' : ''
              } ${
                isInWishlist(product.id)
                  ? 'wishlist-button-active'
                  : 'wishlist-button-inactive'
              } ${!user ? 'wishlist-button-disabled' : ''}`}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart className="text-sm" />
            </button>

            {/* Quick View Button */}
            <div className="quick-view-overlay">
              <div className="quick-view-button">
                <FaEye />
                <span>VIEW DETAILS</span>
              </div>
            </div>
          </div>
          
          {/* Product Info */}
          <div className="product-info">
            <div className="mb-2">
              <span className="category-badge">
                {product.category}
              </span>
            </div>
            
            <h3 className={`${nameSizes[size]} line-clamp-2`}>
              {product.name}
            </h3>
            
            <div className="power-level">
              <FaStar className="power-level-icon" />
              <span className="power-level-text">
                Power Level: {Number(product.powerLevel || product.power_level || 0).toLocaleString()}
              </span>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="product-tags">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="product-tag"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Price */}
            <div className="price-section">
              <div className="price-container">
                {(product.originalPrice || product.original_price) && (
                  <span className="original-price">
                    <Price value={product.originalPrice || product.original_price} />
                  </span>
                )}
                <span className={priceSizes[size]}>
                  <Price value={product.price} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Action Button - hidden on mobile, visible on desktop */}
      <div className="action-button-container">
        <button
          onClick={handleAddToCart}
          disabled={!(product.inStock || product.in_stock || product.stock > 0)}
          className={`action-button touch-target ${
            (product.inStock || product.in_stock || product.stock > 0)
              ? "action-button-enabled"
              : "action-button-disabled"
          }`}
        >
          <FaShoppingCart className="action-button-icon" />
          <span className="action-button-text-desktop">
            {(product.inStock || product.in_stock || product.stock > 0) ? "ADD TO CAPSULE" : "OUT OF STOCK"}
          </span>
          <span className="action-button-text-mobile">
            {(product.inStock || product.in_stock || product.stock > 0) ? "ADD" : "OUT"}
          </span>
        </button>
      </div>
    </div>
  );
});

export default ProductCard;