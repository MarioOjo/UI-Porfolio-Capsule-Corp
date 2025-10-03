import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNotifications } from './NotificationContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showInfo } = useNotifications();

  // Load wishlist from localStorage on mount (if user is logged in)
  useEffect(() => {
    if (user) {
      setLoading(true);
      // Use proper user identifier - try uid first (Firebase), then id (backend)
      const userId = user.uid || user.id;
      const savedWishlist = localStorage.getItem(`capsule-wishlist-${userId}`);
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist);
          setWishlistItems(parsedWishlist);
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
          setWishlistItems([]);
        }
      } else {
        setWishlistItems([]);
      }
      setLoading(false);
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (user && wishlistItems.length >= 0) {
      // Use proper user identifier - try uid first (Firebase), then id (backend)
      const userId = user.uid || user.id;
      localStorage.setItem(`capsule-wishlist-${userId}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  const addToWishlist = (product) => {
    if (!user) {
      showInfo('🔐 Please sign in to save items to your wishlist!');
      return false;
    }

    setWishlistItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        showInfo(`💖 ${product.name} is already in your wishlist!`);
        return currentItems;
      } else {
        showSuccess(`💖 ${product.name} added to wishlist!`);
        return [...currentItems, product];
      }
    });
    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(currentItems => {
      const item = currentItems.find(item => item.id === productId);
      if (item) {
        showInfo(`💔 ${item.name} removed from wishlist`);
      }
      return currentItems.filter(item => item.id !== productId);
    });
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    showInfo('🧹 Wishlist cleared');
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getWishlistCount,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;