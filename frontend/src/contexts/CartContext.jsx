import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from "./AuthContext";
import apiFetch from '../utils/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { showSuccess, showInfo } = useNotifications();
  const { user } = useAuth();

  // Load cart from backend or localStorage on mount/login
  useEffect(() => {
    async function loadCart() {
      if (user && user.id) {
        try {
          const res = await apiFetch('/api/cart');
          setCartItems(Array.isArray(res.cart) ? res.cart : []);
        } catch (e) {
          console.error('Error loading cart from backend:', e);
          // Fallback to empty cart on error
          setCartItems([]);
        }
      } else {
        const savedCart = localStorage.getItem('capsule-cart');
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            setCartItems(Array.isArray(parsed) ? parsed : []);
          } catch (error) {
            console.error('Error parsing cart from localStorage:', error);
            setCartItems([]);
            localStorage.removeItem('capsule-cart'); // Clear corrupted data
          }
        } else {
          setCartItems([]);
        }
      }
    }
    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes (guests only)
  useEffect(() => {
    if (!user || !user.id) {
      try {
        localStorage.setItem('capsule-cart', JSON.stringify(Array.isArray(cartItems) ? cartItems : []));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        // Silently fail - localStorage might be full or disabled
      }
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    // Defensive: ensure product exists and has required fields
    if (!product || !product.id || !product.name) {
      console.error('Invalid product passed to addToCart:', product);
      return;
    }

    // Defensive: ensure quantity is positive
    const safeQuantity = Math.max(1, parseInt(quantity) || 1);

    if (user && user.id) {
      try {
        await apiFetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity: safeQuantity })
        });
        showSuccess(`💫 ${product.name} added to cart!`);
        // Refresh cart from backend
        const res = await apiFetch('/api/cart');
        setCartItems(Array.isArray(res.cart) ? res.cart : []);
      } catch (e) {
        console.error('Error adding to cart:', e);
        showInfo('⚠️ Could not add to cart. Please try again.');
      }
    } else {
      setCartItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        if (existingItem) {
          showInfo(`🔄 Updated ${product.name} quantity in cart!`);
          return currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + safeQuantity }
              : item
          );
        } else {
          showSuccess(`💫 ${product.name} added to cart!`);
          return [...currentItems, { ...product, quantity: safeQuantity }];
        }
      });
    }
  };

  const removeFromCart = async (productId) => {
    // Defensive: validate productId
    if (!productId) {
      console.error('Invalid productId in removeFromCart');
      return;
    }

    if (user && user.id) {
      try {
        await apiFetch(`/api/cart/${productId}`, { method: 'DELETE' });
        showInfo('🗑️ Item removed from cart');
        const res = await apiFetch('/api/cart');
        setCartItems(Array.isArray(res.cart) ? res.cart : []);
      } catch (e) {
        console.error('Error removing from cart:', e);
        showInfo('⚠️ Could not remove item. Please try again.');
      }
    } else {
      setCartItems(currentItems => {
        const item = currentItems.find(item => item?.id === productId);
        if (item && item.name) {
          showInfo(`🗑️ ${item.name} removed from cart`);
        }
        return currentItems.filter(item => item?.id !== productId);
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    // Defensive: validate inputs
    if (!productId) {
      console.error('Invalid productId in updateQuantity');
      return;
    }

    const safeQuantity = parseInt(quantity) || 0;
    
    if (safeQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (user && user.id) {
      try {
        await apiFetch(`/api/cart/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity: safeQuantity })
        });
        const res = await apiFetch('/api/cart');
        setCartItems(Array.isArray(res.cart) ? res.cart : []);
      } catch (e) {
        console.error('Error updating cart quantity:', e);
        showInfo('⚠️ Could not update quantity. Please try again.');
      }
    } else {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === productId ? { ...item, quantity: safeQuantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (user && user.id) {
      try {
        // Remove all items one by one
        for (const item of cartItems) {
          await apiFetch(`/api/cart/${item.id}`, { method: 'DELETE' });
        }
        setCartItems([]);
        showInfo('🧹 Cart cleared');
      } catch (e) {
        console.error('Error clearing cart:', e);
      }
    } else {
      setCartItems([]);
      showInfo('🧹 Cart cleared');
    }
  };

  const getCartTotal = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item?.price) || 0;
      const qty = parseInt(item?.quantity) || 0;
      return total + (price * qty);
    }, 0);
  };

  const getCartCount = () => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((total, item) => {
      const qty = parseInt(item?.quantity) || 0;
      return total + qty;
    }, 0);
  };

  const getItemQuantity = (productId) => {
    if (!Array.isArray(cartItems)) return 0;
    const item = cartItems.find(item => item?.id === productId);
    return item ? parseInt(item.quantity) || 0 : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      getItemQuantity,
    }}>
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