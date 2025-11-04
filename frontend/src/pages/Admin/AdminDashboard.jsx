import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBox, FaShoppingCart, FaChartLine, FaCog, FaSignOutAlt } from 'react-icons/fa';

function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    totalProducts: 32,
    totalOrders: 893,
    totalRevenue: 2847932.50,
    monthlyGrowth: 12.5,
    topProducts: ['Saiyan Battle Armor', 'Elite Scouter Mk III', 'Gravity Chamber']
  });

  // Check if user is admin (you can implement proper admin role checking)
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // For demo purposes, check if user email contains 'admin' or has admin role
    const isAdmin = user.email?.includes('admin') || user.role === 'admin' || user.email === 'mario@capsulecorp.com';
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-capsule-accent to-capsule-orange rounded-full flex items-center justify-center">
                <FaCog className="text-[#3B4CCA] text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white font-saiyan">CAPSULE CORP ADMIN</h1>
                <p className="text-blue-100 text-sm">Management Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-right">
                <p className="font-saiyan text-sm">Welcome back,</p>
                <p className="text-capsule-accent font-bold">{user.displayName || user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-saiyan text-sm transition-colors flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>LOGOUT</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-800 font-saiyan">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <FaUsers className="text-blue-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Products</p>
                <p className="text-3xl font-bold text-gray-800 font-saiyan">{stats.totalProducts}</p>
              </div>
              <FaBox className="text-orange-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800 font-saiyan">{stats.totalOrders.toLocaleString()}</p>
              </div>
              <FaShoppingCart className="text-green-500 text-3xl" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800 font-saiyan">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <FaChartLine className="text-purple-500 text-3xl" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/admin/products')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
              >
                MANAGE PRODUCTS
              </button>
              <button 
                onClick={() => navigate('/admin/orders')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
              >
                VIEW ORDERS
              </button>
              <button 
                onClick={() => navigate('/admin/users')}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:scale-105 transition-all"
              >
                MANAGE USERS
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-4">Monthly Growth</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-500 font-saiyan mb-2">
                +{stats.monthlyGrowth}%
              </div>
              <p className="text-gray-600">Revenue increase this month</p>
              <div className="mt-4 bg-green-100 rounded-lg p-3">
                <p className="text-green-700 font-medium">📈 Excellent performance!</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-4">Top Products</h3>
            <div className="space-y-3">
              {stats.topProducts.map((product, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 font-medium text-sm">{product}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">New order #1247 - Saiyan Battle Armor</span>
              <span className="text-gray-500 text-sm ml-auto">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">User registration: goku@dbz.com</span>
              <span className="text-gray-500 text-sm ml-auto">5 minutes ago</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700">Low stock alert: Dragon Radar (3 left)</span>
              <span className="text-gray-500 text-sm ml-auto">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;