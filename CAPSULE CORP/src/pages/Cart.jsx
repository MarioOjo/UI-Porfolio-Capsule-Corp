import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaMinus, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../AuthContext";
import Price from "../components/Price";

function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  const total = getCartTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 font-saiyan">
              CAPSULE CART
            </h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your capsule collection
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-blue-600 hover:text-orange-600 transition-colors font-saiyan"
          >
            <FaArrowLeft />
            <span>CONTINUE SHOPPING</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4 font-saiyan">
              YOUR CART IS EMPTY
            </h2>
            <p className="text-gray-600 mb-8">
              Ready to power up? Start adding some legendary gear to your collection!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-xl font-saiyan font-bold kamehameha-glow transition-all hover:scale-105 hover:shadow-xl"
            >
              EXPLORE CAPSULES
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-[#3B4CCA] to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#3B4CCA] to-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-xs text-center px-2">
                            {item.name}
                          </span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <Link
                          to={`/product/${item.slug}`}
                          className="text-xl font-bold text-gray-800 hover:text-orange-600 transition-colors font-saiyan"
                        >
                          {item.name}
                        </Link>
                        <p className="text-gray-600 mt-1">{item.category}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-600">Power Level: </span>
                          <span className="text-sm font-bold text-orange-600 ml-1">
                            {Number(item.powerLevel || item.power_level || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-orange-200 transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600 font-saiyan">
                            <Price value={parseFloat(item.price) * item.quantity} />
                          </div>
                          <div className="text-sm text-gray-600">
                            <Price value={parseFloat(item.price)} /> each
                          </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="text-center pt-4">
                <button
                  onClick={clearCart}
                  className="text-red-500 hover:text-red-700 transition-colors font-medium"
                >
                  Clear All Items
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 font-saiyan">
                  ORDER SUMMARY
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold"><Price value={total} /></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Power Level Bonus:</span>
                    <span className="font-bold text-blue-600">Applied</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold text-gray-800">Total:</span>
                    <span className="font-bold text-orange-600 font-saiyan">
                      <Price value={total} />
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-400 to-orange-600 text-white py-4 rounded-xl font-saiyan font-bold text-lg kamehameha-glow transition-all hover:scale-105 hover:shadow-xl mb-4"
                >
                  {user ? 'PROCEED TO CHECKOUT' : 'SIGN IN TO CHECKOUT'}
                </button>

                <Link
                  to="/products"
                  className="block w-full text-center bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Continue Shopping
                </Link>

                {/* Security Features */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-800 mb-3">🛡️ Secure Checkout</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>✅ Capsule Corp Encryption</div>
                    <div>✅ Saiyan-Grade Security</div>
                    <div>✅ Dragon Ball Warranty</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;