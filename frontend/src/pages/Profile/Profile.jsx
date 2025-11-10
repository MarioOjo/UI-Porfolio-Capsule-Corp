import React, { useState, useEffect } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from '../../contexts/ThemeContext';
import { FaUser, FaEdit, FaSave, FaTimes, FaEnvelope, FaPhone, FaCalendarAlt, FaShoppingBag, FaDollarSign, FaUserCircle } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';
import apiFetch from '../../utils/api';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { isDarkMode } = useTheme();
  const { formatPrice } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    loading: true
  });
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  // Avatar emoji mapping
  const avatarMap = {
    'goku': '🐉',
    'vegeta': '👑',
    'gohan': '📚',
    'piccolo': '👽',
    'bulma': '🔬',
    'krillin': '💪',
    'frieza': '😈',
    'trunks': '⚔️'
  };

  const avatarEmoji = user?.avatar ? avatarMap[user.avatar] || '🐉' : (user?.photoURL || '👤');

  // Fetch user stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiFetch('/api/orders/my-orders');
        const orders = res.orders || [];
        const total = orders.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
        setStats({
          totalOrders: orders.length,
          totalSpent: total,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    if (user) {
      fetchStats();
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile(formData);
      showSuccess('✅ Profile updated');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('❌ Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
    });
    setIsEditing(false);
  };

  return (
    <div className={`rounded-xl shadow-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
      {/* Profile Header with Avatar */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Avatar Display */}
            <div className="relative">
              {avatarEmoji && avatarEmoji.length <= 2 ? (
                // Display emoji avatar
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-4xl shadow-lg ring-4 ring-white dark:ring-slate-600">
                  {avatarEmoji}
                </div>
              ) : (
                // Display image avatar or default
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-blue-500 flex items-center justify-center text-4xl shadow-lg ring-4 ring-white dark:ring-slate-600">
                  <FaUserCircle className="text-white" />
                </div>
              )}
              {user?.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                  ADMIN
                </div>
              )}
            </div>
            
            <div>
              <h2 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.displayName || user?.username || 'User'}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'recently'}
              </p>
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan shadow-lg"
            >
              <FaEdit />
              <span>EDIT</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg transition-all font-saiyan shadow-lg ${
                  isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:from-green-600 hover:to-green-700'
                }`}
              >
                <FaSave />
                <span>{isSaving ? 'SAVING...' : 'SAVE'}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className={`flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg transition-all font-saiyan shadow-lg ${
                  isSaving ? 'opacity-60 cursor-not-allowed' : 'hover:from-gray-600 hover:to-gray-700'
                }`}
              >
                <FaTimes />
                <span>CANCEL</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-6 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
          PERSONAL INFORMATION
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaUser className="inline mr-2" />
              FIRST NAME
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              disabled={!isEditing || isSaving}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                isEditing 
                  ? `${isDarkMode ? 'bg-slate-600 border-blue-500 text-white focus:ring-2 focus:ring-blue-500' : 'bg-white border-blue-500 text-gray-900 focus:ring-2 focus:ring-blue-500'}` 
                  : `${isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
              } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaUser className="inline mr-2" />
              LAST NAME
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              disabled={!isEditing || isSaving}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                isEditing 
                  ? `${isDarkMode ? 'bg-slate-600 border-blue-500 text-white focus:ring-2 focus:ring-blue-500' : 'bg-white border-blue-500 text-gray-900 focus:ring-2 focus:ring-blue-500'}` 
                  : `${isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
              } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaEnvelope className="inline mr-2" />
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={true}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'
              } opacity-60 cursor-not-allowed`}
              title="Email cannot be changed"
            />
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Email cannot be modified
            </p>
          </div>

          <div>
            <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaPhone className="inline mr-2" />
              PHONE NUMBER
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing || isSaving}
              placeholder="(123) 456-7890"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                isEditing 
                  ? `${isDarkMode ? 'bg-slate-600 border-blue-500 text-white focus:ring-2 focus:ring-blue-500' : 'bg-white border-blue-500 text-gray-900 focus:ring-2 focus:ring-blue-500'}` 
                  : `${isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
              } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FaCalendarAlt className="inline mr-2" />
              DATE OF BIRTH
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing || isSaving}
              className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                isEditing 
                  ? `${isDarkMode ? 'bg-slate-600 border-blue-500 text-white focus:ring-2 focus:ring-blue-500' : 'bg-white border-blue-500 text-gray-900 focus:ring-2 focus:ring-blue-500'}` 
                  : `${isDarkMode ? 'bg-slate-600 border-slate-500 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
              } ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
          </div>
        </div>
      </div>

      {/* Account Statistics */}
      <div className={`p-6 border-t ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
        <h3 className={`text-xl font-bold mb-6 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
          ACCOUNT STATISTICS
        </h3>
        {stats.loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B4CCA] mx-auto"></div>
            <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading stats...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-slate-600 to-slate-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-[#3B4CCA] rounded-full flex items-center justify-center text-white shadow-lg">
                  <FaShoppingBag className="text-2xl" />
                </div>
                <div>
                  <div className={`text-3xl font-bold text-[#3B4CCA] font-saiyan ${isDarkMode ? 'text-blue-400' : ''}`}>
                    {stats.totalOrders}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</div>
                </div>
              </div>
            </div>
            
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gradient-to-br from-slate-600 to-slate-700' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-[#FF9E00] rounded-full flex items-center justify-center text-white shadow-lg">
                  <FaDollarSign className="text-2xl" />
                </div>
                <div>
                  <div className={`text-3xl font-bold text-[#FF9E00] font-saiyan ${isDarkMode ? 'text-orange-400' : ''}`}>
                    {formatPrice(stats.totalSpent)}
                  </div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Spent</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;