import { useState } from 'react';
import { FaSearch, FaBox, FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { apiFetch } from '../utils/api';
import Price from '../components/Price';
import { useNotifications } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addNotification } = useNotifications();
  const { isDarkMode } = useTheme();

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-orange-50 via-white to-blue-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-gray-200',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    input: isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-orange-500 focus:border-orange-500'
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      addNotification('Please enter an order number', 'error');
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const response = await apiFetch(`/api/orders/number/${orderNumber.trim()}`);
      
      if (response.success) {
        setOrder(response.order);
      } else {
        setOrder(null);
        addNotification('Order not found', 'error');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrder(null);
      addNotification('Order not found. Please check your order number.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'processing':
        return <FaBox className="text-blue-500" />;
      case 'shipped':
        return <FaTruck className="text-purple-500" />;
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return isDarkMode 
          ? 'bg-yellow-900/30 text-yellow-300 border-yellow-700' 
          : 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return isDarkMode 
          ? 'bg-blue-900/30 text-blue-300 border-blue-700' 
          : 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return isDarkMode 
          ? 'bg-purple-900/30 text-purple-300 border-purple-700' 
          : 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return isDarkMode 
          ? 'bg-green-900/30 text-green-300 border-green-700' 
          : 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return isDarkMode 
          ? 'bg-red-900/30 text-red-300 border-red-700' 
          : 'bg-red-100 text-red-800 border-red-300';
      default:
        return isDarkMode 
          ? 'bg-gray-900/30 text-gray-300 border-gray-700' 
          : 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrackingInfo = (order) => {
    if (order.metadata) {
      try {
        const metadata = JSON.parse(order.metadata);
        return {
          tracking_number: metadata.tracking_number,
          carrier: metadata.carrier
        };
      } catch (e) {
        return {};
      }
    }
    return {};
  };

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden py-8 sm:py-12 px-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 font-saiyan ${themeClasses.text.primary}`}>
            Track Your Order
          </h1>
          <p className={themeClasses.text.secondary}>
            Enter your order number to check the status
          </p>
        </div>

        {/* Search Form */}
        <div className={`rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 ${themeClasses.card}`}>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., ORD-1234567890)"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:ring-2 focus:border-transparent text-sm sm:text-base ${themeClasses.input}`}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-saiyan font-bold text-sm sm:text-base kamehameha-glow"
            >
              <FaSearch />
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Order Details */}
        {searched && !loading && (
          <>
            {order ? (
              <div className={`rounded-lg shadow-lg overflow-hidden ${themeClasses.card}`}>
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl sm:text-2xl font-bold mb-2 font-saiyan">Order #{order.order_number}</h2>
                      <p className="opacity-90 text-sm sm:text-base">Placed on {formatDate(order.placed_at)}</p>
                    </div>
                    <div className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize text-sm sm:text-base">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className={`p-4 sm:p-6 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center relative">
                    <div className={`absolute top-4 sm:top-5 left-0 right-0 h-1 -z-10 ${
                      isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                    }`}></div>
                    <div 
                      className="absolute top-4 sm:top-5 left-0 h-1 bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500 -z-10"
                      style={{
                        width: order.status === 'pending' ? '0%' :
                               order.status === 'processing' ? '33%' :
                               order.status === 'shipped' ? '66%' :
                               order.status === 'delivered' ? '100%' : '0%'
                      }}
                    ></div>
                    
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl ${
                          order.status === status || 
                          (status === 'pending' && order.status) ||
                          (status === 'processing' && ['shipped', 'delivered'].includes(order.status)) ||
                          (status === 'shipped' && order.status === 'delivered')
                            ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white'
                            : `${
                                isDarkMode 
                                  ? 'bg-slate-600 border-2 border-slate-500 text-gray-400' 
                                  : 'bg-white border-2 border-gray-300 text-gray-400'
                              }`
                        }`}>
                          {getStatusIcon(status)}
                        </div>
                        <span className={`mt-2 text-xs sm:text-sm font-medium capitalize ${themeClasses.text.secondary}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Info */}
                {getTrackingInfo(order).tracking_number && (
                  <div className={`p-4 sm:p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${themeClasses.text.primary}`}>
                      <FaTruck className="text-purple-500" />
                      Shipping Information
                    </h3>
                    <div className={`border rounded-lg p-3 sm:p-4 ${
                      isDarkMode ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200'
                    }`}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className={`text-sm ${themeClasses.text.muted}`}>Tracking Number</p>
                          <p className="font-mono font-semibold text-sm sm:text-base">{getTrackingInfo(order).tracking_number}</p>
                        </div>
                        {getTrackingInfo(order).carrier && (
                          <div>
                            <p className={`text-sm ${themeClasses.text.muted}`}>Carrier</p>
                            <p className="font-semibold text-sm sm:text-base">{getTrackingInfo(order).carrier}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className={`p-4 sm:p-6 border-t ${isDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                  <h3 className={`text-lg font-semibold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>Order Items</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 sm:p-4 rounded-lg ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className="mb-2 sm:mb-0">
                          <p className={`font-medium text-sm sm:text-base ${themeClasses.text.primary}`}>{item.product_name}</p>
                          <p className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>Quantity: {item.quantity}</p>
                        </div>
                        <p className={`font-semibold text-sm sm:text-base ${themeClasses.text.primary}`}>
                          <Price value={Number(item.total)} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className={`p-4 sm:p-6 border-t ${isDarkMode ? 'border-slate-700 bg-slate-700' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="max-w-sm ml-auto space-y-2">
                    <div className="flex justify-between">
                      <span className={themeClasses.text.secondary}>Subtotal</span>
                      <span className={themeClasses.text.primary}><Price value={Number(order.subtotal)} /></span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.text.secondary}>Shipping</span>
                      <span className={themeClasses.text.primary}><Price value={Number(order.shipping || 0)} /></span>
                    </div>
                    <div className="flex justify-between">
                      <span className={themeClasses.text.secondary}>Tax</span>
                      <span className={themeClasses.text.primary}><Price value={Number(order.tax || 0)} /></span>
                    </div>
                    <div className={`flex justify-between text-lg sm:text-xl font-bold pt-2 border-t-2 ${
                      isDarkMode ? 'border-slate-600' : 'border-gray-300'
                    }`}>
                      <span className={themeClasses.text.primary}>Total</span>
                      <span className={themeClasses.text.primary}><Price value={Number(order.total)} /></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`rounded-lg shadow-lg p-6 sm:p-8 lg:p-12 text-center ${themeClasses.card}`}>
                <FaTimesCircle className="text-4xl sm:text-6xl text-red-500 mx-auto mb-3 sm:mb-4" />
                <h3 className={`text-xl sm:text-2xl font-bold mb-2 font-saiyan ${themeClasses.text.primary}`}>
                  Order Not Found
                </h3>
                <p className={themeClasses.text.secondary}>
                  We couldn't find an order with that number. Please check your order number and try again.
                </p>
              </div>
            )}
          </>
        )}

        {/* Help Text */}
        {!searched && (
          <div className={`border rounded-lg p-4 sm:p-6 text-center ${
            isDarkMode ? 'bg-blue-900/20 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <p className="text-sm sm:text-base">
              💡 <strong>Tip:</strong> You can find your order number in the confirmation email we sent you after purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;