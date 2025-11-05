import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from "./AuthContext";
import apiFetch from '../utils/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { showSuccess, showInfo, showError } = useNotifications();
  const { user, authInitialized } = useAuth();

  // Enhanced cart storage key
  const CART_STORAGE_KEY = 'capsule-cart-v2';

  // Load cart from backend or localStorage on mount/login
  useEffect(() => {
    async function loadCart() {
      setLoading(true);
      try {
        if (user && user.id) {
          // Load from backend for authenticated users
          const res = await apiFetch('/api/cart');
          const backendCart = Array.isArray(res.cart) ? res.cart : [];
          setCartItems(backendCart);
          
          // Sync localStorage with backend data
          try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(backendCart));
          } catch (storageError) {
            console.warn('Failed to sync cart to localStorage:', storageError);
          }
        } else {
          // Load from localStorage for guests
          const savedCart = localStorage.getItem(CART_STORAGE_KEY);
          if (savedCart) {
            try {
              const parsed = JSON.parse(savedCart);
              setCartItems(Array.isArray(parsed) ? parsed : []);
            } catch (error) {
              console.error('Error parsing cart from localStorage:', error);
              setCartItems([]);
              localStorage.removeItem(CART_STORAGE_KEY);
            }
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        showError('Failed to load your cart. Please refresh the page.');
        setCartItems([]);
      } finally {
        setLoading(false);
        setLastUpdated(new Date());
      }
    }

    if (authInitialized) {
      loadCart();
    }
  }, [user, authInitialized, showError]);

  // Enhanced save cart function
  const saveCartToStorage = useCallback(async (items) => {
    const cartToSave = Array.isArray(items) ? items : [];
    
    try {
      if (user && user.id) {
        // Sync to backend for authenticated users
        try {
          await apiFetch('/api/cart/sync', {
            method: 'POST',
            body: JSON.stringify({ items: cartToSave })
          });
        } catch (apiError) {
          console.error('Failed to sync cart to backend:', apiError);
          // Continue with localStorage as fallback
        }
      }
      
      // Always save to localStorage as backup
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartToSave));
    } catch (storageError) {
      console.error('Failed to save cart to storage:', storageError);
      // Silently fail - localStorage might be full or disabled
    }
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0 || lastUpdated) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, lastUpdated, saveCartToStorage]);

  // Enhanced add to cart with better validation and options
  const addToCart = useCallback(async (product, quantity = 1, options = {}) => {
    // Enhanced validation
    if (!product || !product.id || !product.name) {
      console.error('Invalid product passed to addToCart:', product);
      showError('Invalid product. Please try again.');
      return false;
    }

    // Enhanced quantity validation
    const safeQuantity = Math.max(1, Math.min(999, parseInt(quantity) || 1));
    const finalProduct = {
      ...product,
      cartAddedAt: new Date().toISOString(),
      cartOptions: options
    };

    try {
      if (user && user.id) {
        // Backend operation for authenticated users
        await apiFetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ 
            productId: product.id, 
            quantity: safeQuantity,
            options 
          })
        });
        
        // Refresh cart from backend
        const res = await apiFetch('/api/cart');
        const updatedCart = Array.isArray(res.cart) ? res.cart : [];
        setCartItems(updatedCart);
      } else {
        // Local operation for guests
        setCartItems(currentItems => {
          const existingItemIndex = currentItems.findIndex(item => item.id === product.id);
          
          if (existingItemIndex >= 0) {
            // Update existing item
            const updatedItems = [...currentItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + safeQuantity,
              cartAddedAt: new Date().toISOString()
            };
            showInfo(`🔄 Updated ${product.name} quantity in cart!`);
            return updatedItems;
          } else {
            // Add new item
            showSuccess(`💫 ${product.name} added to cart!`);
            return [...currentItems, { ...finalProduct, quantity: safeQuantity }];
          }
        });
      }
      
      setLastUpdated(new Date());
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('⚠️ Could not add to cart. Please try again.');
      return false;
    }
  }, [user, showSuccess, showInfo, showError]);

  // Enhanced remove from cart
  const removeFromCart = useCallback(async (productId) => {
    if (!productId) {
      console.error('Invalid productId in removeFromCart');
      return false;
    }

    const itemToRemove = cartItems.find(item => item?.id === productId);
    
    try {
      if (user && user.id) {
        await apiFetch(`/api/cart/${productId}`, { method: 'DELETE' });
        const res = await apiFetch('/api/cart');
        setCartItems(Array.isArray(res.cart) ? res.cart : []);
      } else {
        setCartItems(currentItems => {
          const filteredItems = currentItems.filter(item => item?.id !== productId);
          if (itemToRemove && itemToRemove.name) {
            showInfo(`🗑️ ${itemToRemove.name} removed from cart`);
          }
          return filteredItems;
        });
      }
      
      setLastUpdated(new Date());
      return true;
    } catch (error) {
      console.error('Error removing from cart:', error);
      showError('⚠️ Could not remove item. Please try again.');
      return false;
    }
  }, [user, cartItems, showInfo, showError]);

  // Enhanced update quantity with bounds checking
  const updateQuantity = useCallback(async (productId, quantity) => {
    if (!productId) {
      console.error('Invalid productId in updateQuantity');
      return false;
    }

    const safeQuantity = Math.max(0, Math.min(999, parseInt(quantity) || 0));
    
    if (safeQuantity <= 0) {
      return await removeFromCart(productId);
    }

    try {
      if (user && user.id) {
        await apiFetch(`/api/cart/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity: safeQuantity })
        });
        const res = await apiFetch('/api/cart');
        setCartItems(Array.isArray(res.cart) ? res.cart : []);
      } else {
        setCartItems(currentItems =>
          currentItems.map(item =>
            item.id === productId ? { ...item, quantity: safeQuantity } : item
          )
        );
      }
      
      setLastUpdated(new Date());
      return true;
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      showError('⚠️ Could not update quantity. Please try again.');
      return false;
    }
  }, [user, removeFromCart, showError]);

  // Enhanced clear cart with confirmation
  const clearCart = useCallback(async () => {
    try {
      if (user && user.id) {
        // Clear all items from backend
        await apiFetch('/api/cart/clear', { method: 'POST' });
      }
      
      setCartItems([]);
      setLastUpdated(new Date());
      showInfo('🧹 Cart cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing cart:', error);
      showError('⚠️ Could not clear cart. Please try again.');
      return false;
    }
  }, [user, showInfo, showError]);

  // Enhanced cart total calculation
  const getCartTotal = useCallback(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return 0;
    
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item?.price) || 0;
      const qty = parseInt(item?.quantity) || 0;
      return total + (price * qty);
    }, 0);
  }, [cartItems]);

  // Enhanced cart count calculation
  const getCartCount = useCallback(() => {
    if (!Array.isArray(cartItems)) return 0;
    
    return cartItems.reduce((total, item) => {
      const qty = parseInt(item?.quantity) || 0;
      return total + qty;
    }, 0);
  }, [cartItems]);

  // Enhanced item quantity getter
  const getItemQuantity = useCallback((productId) => {
    if (!Array.isArray(cartItems)) return 0;
    
    const item = cartItems.find(item => item?.id === productId);
    return item ? parseInt(item.quantity) || 0 : 0;
  }, [cartItems]);

  // Check if product is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item?.id === productId);
  }, [cartItems]);

  // Get cart item by ID
  const getCartItem = useCallback((productId) => {
    return cartItems.find(item => item?.id === productId) || null;
  }, [cartItems]);

  // Merge guest cart with user cart on login
  const mergeCarts = useCallback(async (guestCart) => {
    if (!user || !user.id) return false;

    try {
      const mergedItems = [...cartItems];
      const guestItems = Array.isArray(guestCart) ? guestCart : [];

      for (const guestItem of guestItems) {
        const existingItemIndex = mergedItems.findIndex(item => item.id === guestItem.id);
        
        if (existingItemIndex >= 0) {
          // Merge quantities
          mergedItems[existingItemIndex].quantity += guestItem.quantity;
        } else {
          // Add new item
          mergedItems.push(guestItem);
        }
      }

      // Update backend with merged cart
      await apiFetch('/api/cart/merge', {
        method: 'POST',
        body: JSON.stringify({ items: mergedItems })
      });

      // Refresh from backend
      const res = await apiFetch('/api/cart');
      setCartItems(Array.isArray(res.cart) ? res.cart : []);
      setLastUpdated(new Date());

      // Clear guest cart
      localStorage.removeItem(CART_STORAGE_KEY);
      
      return true;
    } catch (error) {
      console.error('Error merging carts:', error);
      return false;
    }
  }, [user, cartItems]);

  // Calculate cart statistics
  const getCartStats = useCallback(() => {
    const total = getCartTotal();
    const count = getCartCount();
    const itemCount = cartItems.length;
    const hasFreeShipping = total > 500;
    const freeShippingRemaining = Math.max(0, 500 - total);

    return {
      total,
      count,
      itemCount,
      hasFreeShipping,
      freeShippingRemaining,
      freeShippingProgress: Math.min((total / 500) * 100, 100)
    };
  }, [cartItems, getCartTotal, getCartCount]);

  // Export cart data (for sharing/backup)
  const exportCart = useCallback(() => {
    return {
      items: cartItems,
      totals: getCartStats(),
      exportedAt: new Date().toISOString(),
      version: '2.0'
    };
  }, [cartItems, getCartStats]);

  // Import cart data
  const importCart = useCallback(async (cartData) => {
    if (!cartData || !Array.isArray(cartData.items)) {
      showError('Invalid cart data format');
      return false;
    }

    try {
      setCartItems(cartData.items);
      setLastUpdated(new Date());
      showSuccess('Cart imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing cart:', error);
      showError('Failed to import cart');
      return false;
    }
  }, [showSuccess, showError]);

  // Validate cart items (remove invalid items)
  const validateCart = useCallback(() => {
    setCartItems(currentItems => {
      const validItems = currentItems.filter(item => 
        item && 
        item.id && 
        item.name && 
        item.price != null &&
        item.quantity > 0
      );

      if (validItems.length !== currentItems.length) {
        showInfo('Removed invalid items from cart');
      }

      return validItems;
    });
  }, [showInfo]);

  // Context value
  const contextValue = {
    // State
    cartItems,
    loading,
    lastUpdated,
    
    // Core actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Getters
    getCartTotal,
    getCartCount,
    getItemQuantity,
    isInCart,
    getCartItem,
    
    // Enhanced features
    getCartStats,
    mergeCarts,
    exportCart,
    importCart,
    validateCart,
    
    // Utility
    hasItems: cartItems.length > 0,
    isEmpty: cartItems.length === 0
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;