import { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBan, FaUserShield, FaEye, FaEdit, FaArrowLeft, FaSync } from 'react-icons/fa';
import Price from '../../components/Price';
import { CLOUDINARY_BASE } from '../../utils/images';
import { apiFetch } from '../../utils/api';
import { useNotifications } from '../../contexts/NotificationContext';

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotifications();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real users from API
  const fetchUsers = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);
      
      const response = await apiFetch('/api/admin/users');
      setUsers(response.data || response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      customer: 'bg-blue-100 text-blue-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));
      
      showSuccess(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      showError('Failed to update user status');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });
      
      // Update local state
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
      ));
      
      showSuccess(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      showError('Failed to update user role');
    }
  };

  const handleRefresh = () => {
    fetchUsers(false);
    showSuccess('Users refreshed');
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  if (!user) {
    return <div>Loading...</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <FaUserShield className="text-6xl text-blue-600 animate-pulse mx-auto mb-4" />
          <p className="text-xl font-saiyan text-gray-700">Loading Users...</p>
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
                className="text-white hover:text-capsule-accent transition-colors"
              >
                <FaArrowLeft className="text-xl" />
              </button>
              <h1 className="text-2xl font-bold text-white font-saiyan">USER MANAGEMENT</h1>
              {refreshing && (
                <FaSync className="text-white animate-spin" />
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                <FaSync className={refreshing ? 'animate-spin' : ''} />
                <span>REFRESH</span>
              </button>
              
              <button
                onClick={() => {/* TODO: Implement export users */}}
                className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2"
              >
                <FaUserShield />
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
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 font-saiyan">{totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaUserShield className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-green-600 font-saiyan">{activeUsers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-green-600 text-xl">✓</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-3xl font-bold text-red-600 font-saiyan">{adminUsers}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-red-600 text-xl">⭐</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-3xl font-bold text-red-600 font-saiyan">{suspendedUsers}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaBan className="text-red-600 text-xl" />
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
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img 
                            className="h-12 w-12 rounded-full object-cover" 
                            src={user.avatar} 
                            alt={user.name}
                            onError={(e) => {
                              e.target.src = `${CLOUDINARY_BASE}/c_fill,w_48,h_48,g_center/v1759096291/c1_a9za6g.jpg`;
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-saiyan">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)} border-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        disabled={user.email === 'mario@capsulecorp.com'} // Prevent changing main admin
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusUpdate(user.id, e.target.value)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)} border-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        disabled={user.email === 'mario@capsulecorp.com'} // Prevent changing main admin
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.orders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-saiyan">
                      <Price value={user.totalSpent} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {/* TODO: Implement view profile */}}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Profile"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => {/* TODO: Implement edit user */}}
                          className="text-orange-600 hover:text-orange-900"
                          title="Edit User"
                        >
                          <FaEdit />
                        </button>
                        {user.email !== 'mario@capsulecorp.com' && (
                          <button 
                            onClick={() => handleStatusUpdate(user.id, user.status === 'suspended' ? 'active' : 'suspended')}
                            className={`${user.status === 'suspended' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                            title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                          >
                            <FaBan />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FaUserShield className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 font-saiyan mb-2">No users found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsers;