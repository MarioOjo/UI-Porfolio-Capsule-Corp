import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await changePassword(formData.currentPassword, formData.newPassword);
      setMessage('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <FaLock className="text-[#3B4CCA] text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-saiyan">CHANGE PASSWORD</h1>
                <p className="text-blue-100">Update your account security</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  CURRENT PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your new password (min 6 characters)"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  CONFIRM NEW PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('successfully') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <FaShieldAlt />
                <span>{loading ? 'CHANGING PASSWORD...' : 'CHANGE PASSWORD'}</span>
              </button>
            </form>

            {/* Security Tips */}
            <div className={`mt-8 p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}>
              <h3 className={`text-lg font-bold mb-4 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                PASSWORD SECURITY TIPS
              </h3>
              <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>• Use at least 8 characters with a mix of letters, numbers, and symbols</li>
                <li>• Avoid using personal information like names or birthdates</li>
                <li>• Don't reuse passwords from other accounts</li>
                <li>• Consider using a unique password for your Capsule Corp account</li>
                <li>• Change your password regularly for better security</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;