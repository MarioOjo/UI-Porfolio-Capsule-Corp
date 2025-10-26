import { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaBan, FaUserShield, FaEye, FaEdit, FaArrowLeft } from 'react-icons/fa';
import Price from '../../components/Price';

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock users data
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'Goku Son',
        email: 'goku@dragonball.com',
        role: 'customer',
        status: 'active',
        joinDate: '2023-06-15',
        lastLogin: '2024-01-15',
        orders: 12,
        totalSpent: 2450.00,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/goku-avatar_pxvhdf.jpg'
      },
      {
        id: 2,
        name: 'Vegeta Prince',
        email: 'vegeta@saiyans.com',
        role: 'premium',
        status: 'active',
        joinDate: '2023-08-20',
        lastLogin: '2024-01-14',
        orders: 8,
        totalSpent: 3200.00,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/vegeta-avatar_kmqrpd.jpg'
      },
      {
        id: 3,
        name: 'Piccolo Namekian',
        email: 'piccolo@namek.com',
        role: 'customer',
        status: 'active',
        joinDate: '2023-09-10',
        lastLogin: '2024-01-13',
        orders: 5,
        totalSpent: 1150.00,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/piccolo-avatar_hztqmn.jpg'
      },
      {
        id: 4,
        name: 'Mario Capsule',
        email: 'mario@capsulecorp.com',
        role: 'admin',
        status: 'active',
        joinDate: '2023-01-01',
        lastLogin: '2024-01-16',
        orders: 0,
        totalSpent: 0,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/admin-avatar_pqwxrf.jpg'
      },
      {
        id: 5,
        name: 'Trunks Briefs',
        email: 'trunks@capsulecorp.com',
        role: 'customer',
        status: 'inactive',
        joinDate: '2023-11-05',
        lastLogin: '2023-12-20',
        orders: 3,
        totalSpent: 850.00,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/trunks-avatar_mxbqhk.jpg'
      },
      {
        id: 6,
        name: 'Gohan Son',
        email: 'gohan@orangestar.edu',
        role: 'customer',
        status: 'suspended',
        joinDate: '2023-10-15',
        lastLogin: '2024-01-05',
        orders: 2,
        totalSpent: 450.00,
        avatar: 'https://res.cloudinary.com/dz4nqmtfp/image/upload/v1737024566/gohan-avatar_nqrmhx.jpg'
      }
    ];
    setUsers(mockUsers);
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
      premium: 'bg-purple-100 text-purple-800',
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

  const handleStatusUpdate = (userId, newStatus) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    ));
  };

  const handleRoleUpdate = (userId, newRole) => {
    setUsers(users.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const premiumUsers = users.filter(u => u.role === 'premium').length;
  const suspendedUsers = users.filter(u => u.status === 'suspended').length;

  if (!user) {
    return <div>Loading...</div>;
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
            </div>
            
            <button
              onClick={() => console.log('Export users')}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-lg font-saiyan font-bold hover:scale-105 transition-all flex items-center space-x-2"
            >
              <FaUserShield />
              <span>EXPORT USERS</span>
            </button>
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
                <p className="text-sm font-medium text-gray-600">Premium Users</p>
                <p className="text-3xl font-bold text-purple-600 font-saiyan">{premiumUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-purple-600 text-xl">⭐</span>
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
              <option value="premium">Premium</option>
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
                              e.target.src = '/api/placeholder/48/48';
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
                        <option value="premium">Premium</option>
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
                          onClick={() => console.log('View user profile:', user.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Profile"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => console.log('Edit user:', user.id)}
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