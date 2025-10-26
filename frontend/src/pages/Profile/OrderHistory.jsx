import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBox, FaEye, FaTruck, FaCheckCircle, FaClock, FaTimes, FaSearch } from 'react-icons/fa';
import Price from '../../components/Price';
import apiFetch from '../../utils/api';

const OrderHistory = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user || !user.id) return;
    (async () => {
      try {
        const data = await apiFetch(`/api/orders/user/${user.id}`);
        if (data && data.success && Array.isArray(data.orders)) {
          setOrders(data.orders);
          setFilteredOrders(data.orders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
        }
      } catch (e) {
        console.error('Error loading orders', e);
        setOrders([]);
        setFilteredOrders([]);
      }
    })();
  }, [user]);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'processing':
        return <FaClock className="text-orange-500" />;
      case 'cancelled':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF9E00] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaBox className="text-[#3B4CCA] text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-saiyan">ORDER HISTORY</h1>
                <p className="text-blue-100">Track and manage your Capsule Corp orders</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-600">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders or products..."
                  className={`w-full px-4 py-3 pl-12 rounded-lg border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500`}
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-4 py-3 rounded-lg border-2 transition-all ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FaBox className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  NO ORDERS FOUND
                </h3>
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Start shopping to see your orders here'}
                </p>
                <Link
                  to="/products"
                  className="px-6 py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-xl border-2 transition-all ${
                      isDarkMode 
                        ? 'border-slate-600 bg-slate-700 hover:border-slate-500' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-slate-600">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                          <h3 className={`text-lg font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                            {order.id}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ordered on {new Date(order.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(order.status)}
                              <span>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                            </div>
                          </span>
                          <div className="text-right">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total</p>
                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                              <Price value={order.total} />
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="flex-1">
                              <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.name}
                              </h4>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Quantity: {item.quantity} × <Price value={item.price} />
                              </p>
                            </div>
                            <div className={`text-right font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              <Price value={parseFloat(item.price) * item.quantity} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Actions */}
                      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <p><strong>Shipping:</strong> {order.shipping.address}</p>
                          <p><strong>Method:</strong> {order.shipping.method}</p>
                          {order.shipping.tracking && (
                            <p><strong>Tracking:</strong> {order.shipping.tracking}</p>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan text-sm"
                          >
                            <FaEye />
                            <span>VIEW DETAILS</span>
                          </button>
                          {order.status === 'shipped' && (
                            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-saiyan text-sm">
                              <FaTruck />
                              <span>TRACK ORDER</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'
          }`}>
            <div className="p-6 border-b border-gray-200 dark:border-slate-600">
              <div className="flex justify-between items-center">
                <h2 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                  ORDER DETAILS
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className={`font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ORDER INFORMATION
                  </h3>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {selectedOrder.status}</p>
                    <p><strong>Total:</strong> <Price value={selectedOrder.total} /></p>
                  </div>
                </div>
                
                <div>
                  <h3 className={`font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    ITEMS ORDERED
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.name}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <Price value={parseFloat(item.price)} /> × {item.quantity}
                          </p>
                        </div>
                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          <Price value={parseFloat(item.price) * item.quantity} />
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className={`font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    SHIPPING INFORMATION
                  </h3>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p><strong>Address:</strong> {selectedOrder.shipping.address}</p>
                    <p><strong>Method:</strong> {selectedOrder.shipping.method}</p>
                    {selectedOrder.shipping.tracking && (
                      <p><strong>Tracking Number:</strong> {selectedOrder.shipping.tracking}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;