import React, { useState } from 'react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { useNotifications } from '../../contexts/NotificationContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { isDarkMode } = useTheme();
  const { formatPrice } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const [isSaving, setIsSaving] = useState(false);
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
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-4xl mx-auto px-4">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaUser className="text-[#3B4CCA] text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-saiyan">PROFILE SETTINGS</h1>
                <p className="text-blue-100">Manage your Capsule Corp account</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                PERSONAL INFORMATION
              </h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan"
                >
                  <FaEdit />
                  <span>EDIT</span>
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-saiyan"
                  >
                    <FaSave />
                    <span>SAVE</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all font-saiyan"
                  >
                    <FaTimes />
                    <span>CANCEL</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  FIRST NAME
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isEditing 
                      ? `${isDarkMode ? 'bg-slate-700 border-blue-500 text-white' : 'bg-white border-blue-500 text-gray-900'} focus:ring-2 focus:ring-blue-500` 
                      : `${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  LAST NAME
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isEditing 
                      ? `${isDarkMode ? 'bg-slate-700 border-blue-500 text-white' : 'bg-white border-blue-500 text-gray-900'} focus:ring-2 focus:ring-blue-500` 
                      : `${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isEditing 
                      ? `${isDarkMode ? 'bg-slate-700 border-blue-500 text-white' : 'bg-white border-blue-500 text-gray-900'} focus:ring-2 focus:ring-blue-500` 
                      : `${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isEditing 
                      ? `${isDarkMode ? 'bg-slate-700 border-blue-500 text-white' : 'bg-white border-blue-500 text-gray-900'} focus:ring-2 focus:ring-blue-500` 
                      : `${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
                  }`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  DATE OF BIRTH
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isEditing 
                      ? `${isDarkMode ? 'bg-slate-700 border-blue-500 text-white' : 'bg-white border-blue-500 text-gray-900'} focus:ring-2 focus:ring-blue-500` 
                      : `${isDarkMode ? 'bg-slate-700 border-slate-600 text-gray-300' : 'bg-gray-100 border-gray-300 text-gray-700'}`
                  }`}
                />
              </div>
            </div>

            {/* Account Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-600">
              <h3 className={`text-xl font-bold mb-6 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                ACCOUNT STATISTICS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#3B4CCA] font-saiyan">12</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Orders</div>
                  </div>
                </div>
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-orange-50 to-orange-100'}`}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF9E00] font-saiyan">{formatPrice(2450)}</div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Spent</div>
                  </div>
                </div>
                {/* Member Status card removed per user request */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;