import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEye, FaDownload, FaFilter, FaArrowLeft, FaSync, FaTruck, FaStickyNote } from 'react-icons/fa';
import { apiFetch } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';

function AdminOrders() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [trackingInfo, setTrackingInfo] = useState({ tracking_number: '', carrier: '' });
  const [adminNotes, setAdminNotes] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch orders from API
  const fetchOrders = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const filters = {};
      if (statusFilter !== 'all') filters.status = statusFilter;
      if (searchTerm) filters.search = searchTerm;
      
      // Date filter
      if (dateFilter !== 'all') {
        const today = new Date();
        let dateFrom;
        
        switch (dateFilter) {
          case 'today':
            dateFrom = new Date(today.setHours(0, 0, 0, 0));
            break;
          case 'week':
            dateFrom = new Date(today.setDate(today.getDate() - 7));
            break;
          case 'month':
            dateFrom = new Date(today.setMonth(today.getMonth() - 1));
            break;
          default:
            break;
        }
        
        if (dateFrom) {
          filters.date_from = dateFrom.toISOString().split('T')[0];
        }
      }

      const queryString = new URLSearchParams(filters).toString();
      const response = await apiFetch(`/api/orders?${queryString}`, {
        headers: {
          'x-user-email': user?.email
        }
      });

      if (response.orders) {
        setOrders(response.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to fetch orders');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter, searchTerm, dateFilter, user, showError]);

  // Fetch statistics
  const fetchStatistics = useCallback(async () => {
    try {
      const response = await apiFetch('/api/orders/statistics', {
        headers: {
          'x-user-email': user?.email
        }
      });

      if (response.statistics) {
        setStatistics(response.statistics);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (!user) return;
    fetchOrders();
    fetchStatistics();
  }, [user, fetchOrders, fetchStatistics]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchOrders(false);
      fetchStatistics();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders, fetchStatistics]);

  // Check admin access
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const isAdmin = user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com';
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Filter orders locally for instant feedback
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'x-user-email': user?.email,
          'x-user-id': user?.id
        },
        body: JSON.stringify({ status: newStatus })
      });

      // Update local state immediately
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      showSuccess(`Order status updated to ${newStatus}`);
      fetchStatistics(); // Refresh statistics
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update order status');
    }
  };

  const handleViewDetails = async (order) => {
    try {
      const response = await apiFetch(`/api/orders/${order.id}`, {
        headers: {
          'x-user-email': user?.email
        }
      });
      
      if (response.order) {
        setSelectedOrder(response.order);
        setTrackingInfo({
          tracking_number: response.order.tracking_number || '',
          carrier: response.order.carrier || ''
        });
        setAdminNotes(response.order.admin_notes || '');
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      showError('Failed to load order details');
    }
  };

  const handleUpdateTracking = async () => {
    if (!selectedOrder || !trackingInfo.tracking_number) {
      showError('Please enter tracking number');
      return;
    }

    try {
      await apiFetch(`/api/orders/${selectedOrder.id}/tracking`, {
        method: 'PATCH',
        headers: {
          'x-user-email': user?.email
        },
        body: JSON.stringify(trackingInfo)
      });

      showSuccess('Tracking information updated');
      fetchOrders(false);
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error updating tracking:', error);
      showError('Failed to update tracking');
    }
  };

  const handleUpdateNotes = async () => {
    if (!selectedOrder) return;

    try {
      await apiFetch(`/api/orders/${selectedOrder.id}/notes`, {
        method: 'PATCH',
        headers: {
          'x-user-email': user?.email
        },
        body: JSON.stringify({ notes: adminNotes })
      });

      showSuccess('Admin notes updated');
      fetchOrders(false);
    } catch (error) {
      console.error('Error updating notes:', error);
      showError('Failed to update notes');
    }
  };

  const handleManualRefresh = () => {
    fetchOrders(false);
    fetchStatistics();
    showSuccess('Orders refreshed');
  };

  const stats = statistics || {
    total_orders: orders.length,
    total_revenue: orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0),
    pending_orders: orders.filter(o => o.status === 'pending').length,
    delivered_orders: orders.filter(o => o.status === 'delivered').length
  };

  const totalOrders = Number(stats.total_orders) || 0;
  const totalRevenue = Number(stats.total_revenue) || 0;
  const pendingOrders = Number(stats.pending_orders) || 0;
  const deliveredOrders = Number(stats.delivered_orders) || 0;

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-saiyan">LOADING ORDERS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/admin')}
                className="text-white hover:text-[#FFD700] transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-white font-saiyan">ORDER MANAGEMENT</h1>
              {refreshing && (
                <FaSync className="text-white animate-spin" />
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-white text-sm">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <span>Auto-refresh (30s)</span>
              </label>
              
              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
                <span>REFRESH</span>
              </button>
              
              <button
                onClick={() => console.log('Export orders')}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2"
              >
                <FaDownload />
                <span>EXPORT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-blue-600 font-saiyan">{totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaEye className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600 font-saiyan">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-xl">$</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600 font-saiyan">{pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-yellow-600 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered Orders</p>
                <p className="text-3xl font-bold text-green-600 font-saiyan">{deliveredOrders}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by order ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 font-saiyan">
                        {order.order_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleDateString()}
                      <div className="text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)} border-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.item_count || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-saiyan">
                      ${parseFloat(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleViewDetails(order)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedOrder(order);
                            setTrackingInfo({ tracking_number: order.tracking_number || '', carrier: order.carrier || '' });
                            setShowDetailsModal(true);
                          }}
                          className="text-purple-600 hover:text-purple-900"
                          title="Add Tracking"
                        >
                          <FaTruck />
                        </button>
                        <button 
                          onClick={() => console.log('Download invoice:', order.order_number)}
                          className="text-green-600 hover:text-green-900"
                          title="Download Invoice"
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FaFilter className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white font-saiyan">ORDER DETAILS</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-white hover:text-[#FFD700] transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              <p className="text-white mt-2">{selectedOrder.order_number}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-3">Customer Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="font-semibold">Name:</span> {selectedOrder.customer_name}</p>
                  <p><span className="font-semibold">Email:</span> {selectedOrder.customer_email}</p>
                  <p><span className="font-semibold">Phone:</span> {selectedOrder.customer_phone || 'N/A'}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-3">Shipping Address</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>{selectedOrder.shipping_address_line1}</p>
                  {selectedOrder.shipping_address_line2 && <p>{selectedOrder.shipping_address_line2}</p>}
                  <p>{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}</p>
                  <p>{selectedOrder.shipping_country}</p>
                </div>
              </div>

              {/* Tracking Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-3">Tracking Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      value={trackingInfo.tracking_number}
                      onChange={(e) => setTrackingInfo({ ...trackingInfo, tracking_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carrier</label>
                    <input
                      type="text"
                      value={trackingInfo.carrier}
                      onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., UPS, FedEx, DHL"
                    />
                  </div>
                  <button
                    onClick={handleUpdateTracking}
                    className="w-full bg-gradient-to-r from-purple-400 to-purple-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center justify-center space-x-2"
                  >
                    <FaTruck />
                    <span>UPDATE TRACKING</span>
                  </button>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-3">Admin Notes</h3>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Add internal notes about this order..."
                />
                <button
                  onClick={handleUpdateNotes}
                  className="mt-2 w-full bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center justify-center space-x-2"
                >
                  <FaStickyNote />
                  <span>SAVE NOTES</span>
                </button>
              </div>

              {/* Order Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-800 font-saiyan mb-3">Order Items</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-2">
                        <div className="flex items-center space-x-3">
                          {item.product_image && (
                            <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-semibold">{item.product_name}</p>
                            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-bold">${parseFloat(item.subtotal).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Total */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold font-saiyan">TOTAL:</span>
                  <span className="text-2xl font-bold text-orange-600 font-saiyan">${parseFloat(selectedOrder.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;