import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCheckCircle, FaBox, FaEnvelope, FaTruck } from 'react-icons/fa';
import { apiFetch } from '../utils/api';
import Price from '../components/Price';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderNumber = searchParams.get('order');

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const customerInfo = getCustomerInfo(order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for your purchase</p>
        </div>

        {/* Order Number Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Your Order Number</p>
            <p className="text-3xl font-bold text-orange-500 font-mono">{order.order_number}</p>
            <p className="text-sm text-gray-500 mt-2">Save this number to track your order</p>
          </div>

          {/* Quick Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 pt-6">
            <div className="text-center">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-2">
                <FaEnvelope className="text-2xl text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">Confirmation Email</p>
              <p className="font-semibold text-sm">{customerInfo.email || 'Sent'}</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-2">
                <FaBox className="text-2xl text-purple-500" />
              </div>
              <p className="text-sm text-gray-600">Order Status</p>
              <p className="font-semibold capitalize">{order.status}</p>
            </div>
            <div className="text-center">
              <div className="inline-block p-3 bg-orange-100 rounded-full mb-2">
                <FaTruck className="text-2xl text-orange-500" />
              </div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold text-sm">3-5 Business Days</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Order Details</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-6">
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

          {/* Total */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span><Price value={Number(order.subtotal)} /></span>
            </div>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Shipping</span>
              <span><Price value={Number(order.shipping || 0)} /></span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Tax</span>
              <span><Price value={Number(order.tax || 0)} /></span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 pt-4 border-t-2 border-gray-300">
              <span>Total</span>
              <span><Price value={Number(order.total)} /></span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-orange-500 to-blue-500 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 flex-shrink-0" />
              <span>You'll receive a confirmation email with your order details</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 flex-shrink-0" />
              <span>We'll send you tracking information when your order ships</span>
            </li>
            <li className="flex items-start gap-3">
              <FaCheckCircle className="mt-1 flex-shrink-0" />
              <span>Track your order anytime using your order number</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/track-order')}
            className="flex-1 py-3 bg-white border-2 border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 transition-colors font-semibold"
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
