import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaEnvelope, FaTruck } from 'react-icons/fa';
import { apiFetch } from '../utils/api';
import Price from '../components/Price';
import { useTheme } from '../contexts/ThemeContext';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const orderNumber = searchParams.get('order');

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-green-50 via-white to-blue-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-gray-200',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    button: {
      primary: isDarkMode 
        ? 'bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800' 
        : 'bg-orange-500 text-white hover:bg-orange-600',
      secondary: isDarkMode 
        ? 'bg-transparent border-2 border-orange-500 text-orange-400 hover:bg-orange-900/30' 
        : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        navigate('/');
        return;
      }

      try {
        const response = await apiFetch(`/api/orders/number/${orderNumber}`);
        if (response.success) {
          setOrder(response.order);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber, navigate]);

  const getCustomerInfo = (order) => {
    if (order.metadata) {
      try {
        return JSON.parse(order.metadata);
      } catch (e) {
        return {};
      }
    }
    return {};
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const customerInfo = getCustomerInfo(order);

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden py-8 sm:py-12 px-4`}>
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-block p-3 sm:p-4 rounded-full mb-3 sm:mb-4 ${
            isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
          }`}>
            <FaCheckCircle className="text-4xl sm:text-6xl text-green-500" />
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 font-saiyan ${themeClasses.text.primary}`}>
            Order Confirmed!
          </h1>
          <p className={`text-lg sm:text-xl ${themeClasses.text.secondary}`}>Thank you for your purchase</p>
        </div>

        {/* Order Number Card */}
        <div className={`rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 ${themeClasses.card}`}>
          <div className={`text-center pb-4 sm:pb-6 border-b ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm ${themeClasses.text.muted} mb-2`}>Your Order Number</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-500 font-mono font-saiyan">{order.order_number}</p>
            <p className={`text-sm ${themeClasses.text.muted} mt-2`}>Save this number to track your order</p>
          </div>

          {/* Quick Info Grid */}
          <div className="mobile-grid gap-4 sm:gap-6 pt-4 sm:pt-6">
            <div className="text-center">
              <div className={`inline-block p-2 sm:p-3 rounded-full mb-2 ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
              }`}>
                <FaEnvelope className="text-xl sm:text-2xl text-blue-500" />
              </div>
              <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Confirmation Email</p>
              <p className={`font-semibold text-xs sm:text-sm ${themeClasses.text.primary}`}>
                {customerInfo.email || 'Sent'}
              </p>
            </div>
            <div className="text-center">
              <div className={`inline-block p-2 sm:p-3 rounded-full mb-2 ${
                isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'
              }`}>
                <FaBox className="text-xl sm:text-2xl text-purple-500" />
              </div>
              <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Order Status</p>
              <p className={`font-semibold capitalize text-xs sm:text-sm ${themeClasses.text.primary}`}>
                {order.status}
              </p>
            </div>
            <div className="text-center">
              <div className={`inline-block p-2 sm:p-3 rounded-full mb-2 ${
                isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100'
              }`}>
                <FaTruck className="text-xl sm:text-2xl text-orange-500" />
              </div>
              <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Estimated Delivery</p>
              <p className={`font-semibold text-xs sm:text-sm ${themeClasses.text.primary}`}>
                3-5 Business Days
              </p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className={`rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 ${themeClasses.card}`}>
          <h2 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>
            Order Details
          </h2>
          
          {/* Items */}
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            {order.items?.map((item, index) => (
              <div key={index} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 rounded-lg ${
                isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
              }`}>
                <div className="mb-2 sm:mb-0">
                  <p className={`font-medium text-sm sm:text-base ${themeClasses.text.primary}`}>
                    {item.product_name}
                  </p>
                  <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className={`font-semibold text-sm sm:text-base ${themeClasses.text.primary}`}>
                  <Price value={Number(item.total)} />
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className={`border-t pt-3 sm:pt-4 ${
            isDarkMode ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <div className="flex justify-between mb-1 sm:mb-2">
              <span className={themeClasses.text.secondary}>Subtotal</span>
              <span className={themeClasses.text.primary}><Price value={Number(order.subtotal)} /></span>
            </div>
            <div className="flex justify-between mb-1 sm:mb-2">
              <span className={themeClasses.text.secondary}>Shipping</span>
              <span className={themeClasses.text.primary}><Price value={Number(order.shipping || 0)} /></span>
            </div>
            <div className="flex justify-between mb-3 sm:mb-4">
              <span className={themeClasses.text.secondary}>Tax</span>
              <span className={themeClasses.text.primary}><Price value={Number(order.tax || 0)} /></span>
            </div>
            <div className={`flex justify-between text-lg sm:text-xl font-bold pt-3 sm:pt-4 border-t-2 ${
              isDarkMode ? 'border-slate-600' : 'border-gray-300'
            }`}>
              <span className={themeClasses.text.primary}>Total</span>
              <span className={themeClasses.text.primary}><Price value={Number(order.total)} /></span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg shadow-lg p-4 sm:p-6 text-white mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 font-saiyan">What's Next?</h3>
          <ul className="space-y-2 sm:space-y-3">
            <li className="flex items-start gap-2 sm:gap-3">
              <FaCheckCircle className="mt-0.5 sm:mt-1 flex-shrink-0" />
              <span className="text-sm sm:text-base">You'll receive a confirmation email with your order details</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <FaCheckCircle className="mt-0.5 sm:mt-1 flex-shrink-0" />
              <span className="text-sm sm:text-base">We'll send you tracking information when your order ships</span>
            </li>
            <li className="flex items-start gap-2 sm:gap-3">
              <FaCheckCircle className="mt-0.5 sm:mt-1 flex-shrink-0" />
              <span className="text-sm sm:text-base">Track your order anytime using your order number</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/track-order')}
            className={`py-2 sm:py-3 rounded-lg transition-colors font-semibold font-saiyan text-sm sm:text-base ${
              themeClasses.button.secondary
            }`}
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/products')}
            className={`py-2 sm:py-3 rounded-lg transition-colors font-semibold font-saiyan text-sm sm:text-base kamehameha-glow ${
              themeClasses.button.primary
            }`}
          >
            Continue Shopping
          </button>
        </div>

        {/* Support Note */}
        <div className={`mt-6 sm:mt-8 text-center ${themeClasses.text.muted}`}>
          <p className="text-xs sm:text-sm">
            Need help? Contact our support team at{' '}
            <a 
              href="mailto:support@capsulecorp.com" 
              className="text-orange-500 hover:text-orange-600 transition-colors"
            >
              support@capsulecorp.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;