import { useState } from 'react';
import { FaSearch, FaBox, FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { apiFetch } from '../utils/api';
import Price from '../components/Price';
import { useNotifications } from '../contexts/NotificationContext';

const OrderTracking = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { addNotification } = useNotifications();

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
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to check the status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="Enter order number (e.g., ORD-1234567890)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Order Header */}
                <div className="bg-gradient-to-r from-orange-500 to-blue-500 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Order #{order.order_number}</h2>
                      <p className="opacity-90">Placed on {formatDate(order.placed_at)}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border-2 flex items-center gap-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-semibold capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                <div className="p-6 bg-gray-50">
                  <div className="flex justify-between items-center relative">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
                    <div 
                      className="absolute top-5 left-0 h-1 bg-gradient-to-r from-orange-500 to-blue-500 transition-all duration-500 -z-10"
                      style={{
                        width: order.status === 'pending' ? '0%' :
                               order.status === 'processing' ? '33%' :
                               order.status === 'shipped' ? '66%' :
                               order.status === 'delivered' ? '100%' : '0%'
                      }}
                    ></div>
                    
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => (
                      <div key={status} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          order.status === status || 
                          (status === 'pending' && order.status) ||
                          (status === 'processing' && ['shipped', 'delivered'].includes(order.status)) ||
                          (status === 'shipped' && order.status === 'delivered')
                            ? 'bg-gradient-to-r from-orange-500 to-blue-500 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-400'
                        }`}>
                          {getStatusIcon(status)}
                        </div>
                        <span className="mt-2 text-sm font-medium capitalize">{status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Info */}
                {getTrackingInfo(order).tracking_number && (
                  <div className="p-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <FaTruck className="text-purple-500" />
                      Shipping Information
                    </h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Tracking Number</p>
                          <p className="font-mono font-semibold">{getTrackingInfo(order).tracking_number}</p>
                        </div>
                        {getTrackingInfo(order).carrier && (
                          <div>
                            <p className="text-sm text-gray-600">Carrier</p>
                            <p className="font-semibold">{getTrackingInfo(order).carrier}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="p-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold"><Price value={Number(item.total)} /></p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="max-w-sm ml-auto space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span><Price value={Number(order.subtotal)} /></span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span><Price value={Number(order.shipping || 0)} /></span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax</span>
                      <span><Price value={Number(order.tax || 0)} /></span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t-2 border-gray-300">
                      <span>Total</span>
                      <span><Price value={Number(order.total)} /></span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h3>
                <p className="text-gray-600">
                  We couldn't find an order with that number. Please check your order number and try again.
                </p>
              </div>
            )}
          </>
        )}

        {/* Help Text */}
        {!searched && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <p className="text-blue-800">
              💡 <strong>Tip:</strong> You can find your order number in the confirmation email we sent you after purchase.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
