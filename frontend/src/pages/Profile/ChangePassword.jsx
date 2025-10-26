import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from 'react-icons/fa';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { text: 'Too Weak', color: 'text-red-600' };
    if (passwordStrength <= 2) return { text: 'Weak', color: 'text-orange-600' };
    if (passwordStrength <= 3) return { text: 'Fair', color: 'text-yellow-600' };
    if (passwordStrength <= 4) return { text: 'Good', color: 'text-blue-600' };
    return { text: 'Strong', color: 'text-green-600' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      showError('❌ Please fill in all fields');
      return;
    }

    if (formData.newPassword.length < 8) {
      showError('❌ New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      showError('❌ New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      showError('❌ New password must be different from current password');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await changePassword(formData.currentPassword, formData.newPassword);
      // Backend returns message on success; apiFetch will throw on non-2xx
      showSuccess('✅ Password changed successfully! Your power level just increased!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordStrength(0);
    } catch (error) {
      // apiFetch throws Error with message from backend when available
      const msg = error?.message || 'Failed to change password. Please check your current password.';
      showError(`❌ ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const strengthLabel = getStrengthLabel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaLock className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-saiyan mb-2">CHANGE PASSWORD</h1>
              <p className="text-blue-100">Secure your Capsule Corp account</p>
            </div>
          </div>
        </div>

        {/* Password Change Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">
                CURRENT PASSWORD *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B4CCA] transition-colors"
                >
                  {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">
                NEW PASSWORD *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B4CCA] transition-colors"
                >
                  {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.newPassword && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Password Strength:</span>
                    <span className={`text-sm font-bold ${strengthLabel.color}`}>
                      {strengthLabel.text}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className={`h-2 flex-1 rounded-full transition-all ${
                          index < passwordStrength
                            ? passwordStrength <= 2
                              ? 'bg-red-500'
                              : passwordStrength <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-600 flex items-center space-x-2">
                      {formData.newPassword.length >= 8 ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>At least 8 characters</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center space-x-2">
                      {/[a-z]/.test(formData.newPassword) && /[A-Z]/.test(formData.newPassword) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>Uppercase & lowercase letters</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center space-x-2">
                      {/\d/.test(formData.newPassword) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>At least one number</span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center space-x-2">
                      {/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <FaTimes className="text-red-500" />
                      )}
                      <span>Special character (!@#$%...)</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-saiyan text-gray-700 mb-2">
                CONFIRM NEW PASSWORD *
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3B4CCA] transition-colors"
                >
                  {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.newPassword === formData.confirmPassword ? (
                    <p className="text-sm text-green-600 flex items-center space-x-2">
                      <FaCheck />
                      <span>Passwords match</span>
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 flex items-center space-x-2">
                      <FaTimes />
                      <span>Passwords do not match</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white py-4 px-6 rounded-lg font-saiyan font-bold text-lg hover:shadow-xl transition-all hover:scale-105 ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="font-saiyan text-[#3B4CCA] font-bold mb-3">🛡️ SECURITY TIPS</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Use a unique password you don't use anywhere else</li>
              <li>• Avoid common words or personal information</li>
              <li>• Change your password regularly (every 3-6 months)</li>
              <li>• Never share your password with anyone</li>
              <li>• Use a password manager to keep track of passwords</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
