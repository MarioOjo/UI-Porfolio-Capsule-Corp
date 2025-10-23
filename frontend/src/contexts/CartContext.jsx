import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotifications } from './NotificationContext';
import { useAuth } from '../AuthContext';
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
          setCartItems(res.cart || []);
        } catch (e) {
          console.error('Error loading cart from backend:', e);
        }
      } else {
        const savedCart = localStorage.getItem('capsule-cart');
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart));
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
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
      localStorage.setItem('capsule-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = async (product, quantity = 1) => {
    if (user && user.id) {
      try {
        await apiFetch('/api/cart', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity })
        });
        showSuccess(`💫 ${product.name} added to cart!`);
        // Refresh cart from backend
        const res = await apiFetch('/api/cart');
        setCartItems(res.cart || []);
      } catch (e) {
        console.error('Error adding to cart:', e);
      }
    } else {
      setCartItems(currentItems => {
        const existingItem = currentItems.find(item => item.id === product.id);
        if (existingItem) {
          showInfo(`🔄 Updated ${product.name} quantity in cart!`);
          return currentItems.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          showSuccess(`💫 ${product.name} added to cart!`);
          return [...currentItems, { ...product, quantity }];
        }
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (user && user.id) {
      try {
        await apiFetch(`/api/cart/${productId}`, { method: 'DELETE' });
        showInfo('🗑️ Item removed from cart');
        const res = await apiFetch('/api/cart');
        setCartItems(res.cart || []);
      } catch (e) {
        console.error('Error removing from cart:', e);
      }
    } else {
      setCartItems(currentItems => {
        const item = currentItems.find(item => item.id === productId);
        if (item) {
          showInfo(`🗑️ ${item.name} removed from cart`);
        }
        return currentItems.filter(item => item.id !== productId);
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (user && user.id) {
      try {
        await apiFetch(`/api/cart/${productId}`, {
          method: 'PUT',
          body: JSON.stringify({ quantity })
        });
        const res = await apiFetch('/api/cart');
        setCartItems(res.cart || []);
      } catch (e) {
        console.error('Error updating cart quantity:', e);
      }
    } else {
      setCartItems(currentItems =>
        currentItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
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
    return cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
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