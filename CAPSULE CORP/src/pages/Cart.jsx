import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Cart({ cartCount, setCartCount }) {
  // Example cart state (replace with context or global state as needed)
  const [cartItems, setCartItems] = useState([]);

  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Remove item from cart
  const removeFromCart = (name) => {
    setCartItems(items => {
      const newItems = items.filter(item => item.name !== name);
      // Decrement cartCount by the quantity of the removed item
      const removed = items.find(item => item.name === name);
      if (removed && setCartCount) setCartCount(count => Math.max(0, count - removed.qty));
      return newItems;
    });
  };

  // Update quantity
  const updateQty = (name, qty) => {
    setCartItems(items =>
      items.map(item =>
        item.name === name ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  // Proceed to checkout (placeholder)
  const handleCheckout = () => {
    alert("Checkout not implemented yet!");
  };

  // Demo: Sync cartCount with cartItems on mount (optional)
  useEffect(() => {
    if (setCartCount) {
      const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalQty);
    }
  }, [cartItems, setCartCount]);

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <h1 className="text-4xl font-saiyan text-[#3B4CCA] mb-8">Your Capsule Cart</h1>
      {cartItems.length === 0 ? (
        <div className="bg-[#F3F4F6] border-2 border-dashed border-[#3B4CCA] rounded-lg p-10 text-center">
          <p className="text-lg text-[#3B4CCA] mb-4">Your cart is currently empty.</p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-2 border-[#3B4CCA] rounded-lg shadow">
              <thead>
                <tr className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white">
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-6">Quantity</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.name} className="border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-bold text-[#3B4CCA]">{item.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          className="px-2 py-1 bg-[#3B4CCA] text-white rounded hover:bg-[#FF9E00] transition"
                          onClick={() => updateQty(item.name, item.qty - 1)}
                          disabled={item.qty <= 1}
                        >-</button>
                        <span className="px-3">{item.qty}</span>
                        <button
                          className="px-2 py-1 bg-[#3B4CCA] text-white rounded hover:bg-[#FF9E00] transition"
                          onClick={() => updateQty(item.name, item.qty + 1)}
                        >+</button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#FF9E00] font-bold">${(item.price * item.qty).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <button
                        className="text-red-500 hover:text-red-700 font-bold"
                        onClick={() => removeFromCart(item.name)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between mt-8">
            <div className="text-xl font-bold text-[#3B4CCA] mb-4 md:mb-0">
              Total: <span className="text-[#FF9E00]">${total.toFixed(2)}</span>
            </div>
            <button
              className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;