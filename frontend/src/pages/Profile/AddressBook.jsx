import React, { useState, useEffect } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiFetch from '../../utils/api';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase, FaStar, FaGlobe } from 'react-icons/fa';
import ConfirmDialog from '../../components/ConfirmDialog';

const AddressBook = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useNotifications();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    fullName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    phone: ''
  });

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = () => {
    if (!formData.fullName || !formData.street || !formData.city) {
      showError('❌ Please fill in all required fields');
      return;
    }
    (async () => {
      try {
        const res = await apiFetch('/api/addresses', { 
          method: 'POST', 
          body: JSON.stringify(formData) 
        });
        setAddresses(prev => [res.address, ...prev]);
        setShowAddModal(false);
        setFormData({ 
          type: 'home', 
          name: '', 
          fullName: '', 
          street: '', 
          city: '', 
          state: '', 
          zip: '',
          country: 'USA',
          phone: '' 
        });
        showSuccess('✅ Address added successfully!');
      } catch (e) {
        showError('❌ Could not add address');
      }
    })();
  };

  // Edit address logic
  const handleEditClick = (address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type || 'home',
      name: address.name || '',
      fullName: address.fullName || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      zip: address.zip || '',
      country: address.country || 'USA',
      phone: address.phone || ''
    });
    setShowAddModal(true);
  };

  const handleEditAddress = () => {
    if (!formData.fullName || !formData.street || !formData.city) {
      showError('❌ Please fill in all required fields');
      return;
    }
    (async () => {
      try {
        const res = await apiFetch(`/api/addresses/${editingAddress.id}`, { 
          method: 'PUT', 
          body: JSON.stringify(formData) 
        });
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? res.address : a));
        setShowAddModal(false);
        setEditingAddress(null);
        setFormData({ 
          type: 'home', 
          name: '', 
          fullName: '', 
          street: '', 
          city: '', 
          state: '', 
          zip: '',
          country: 'USA',
          phone: '' 
        });
        showSuccess('✅ Address updated!');
      } catch (e) {
        showError('❌ Could not update address');
      }
    })();
  };

  const handleDeleteAddress = (id) => {
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmTargetId) return;
    try {
      await apiFetch(`/api/addresses/${confirmTargetId}`, { method: 'DELETE' });
      setAddresses(prev => prev.filter(a => a.id !== confirmTargetId));
      showSuccess('🗑️ Address deleted');
    } catch (e) {
      showError('❌ Could not delete address');
    } finally {
      setConfirmOpen(false);
      setConfirmTargetId(null);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      // Update backend to set default address
      await apiFetch(`/api/addresses/${id}/set-default`, { method: 'PUT' });
      // Update local state
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
      showSuccess('✅ Default address updated');
    } catch (e) {
      showError('❌ Could not set default');
    }
  };

  // Load addresses from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await apiFetch('/api/addresses');
        if (mounted) setAddresses(res.addresses || []);
      } catch (e) {
        // ignore - user might be unauthenticated
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Reset form when modal closes
  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingAddress(null);
    setFormData({ 
      type: 'home', 
      name: '', 
      fullName: '', 
      street: '', 
      city: '', 
      state: '', 
      zip: '',
      country: 'USA',
      phone: '' 
    });
  };

  if (loading) {
    return (
      <div className={`rounded-xl shadow-lg p-8 text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
        <div className="animate-pulse">
          <div className={`h-8 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded w-1/3 mx-auto mb-4`}></div>
          <div className={`h-4 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-200'} rounded w-1/2 mx-auto`}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl shadow-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-2xl font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ADDRESS BOOK
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your delivery addresses ({addresses.length} saved)
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan shadow-lg"
          >
            <FaPlus />
            <span>ADD</span>
          </button>
        </div>
      </div>

      {/* Address List */}
      <div className="p-6">
        {addresses.length === 0 ? (
          <div className={`rounded-xl p-12 text-center ${isDarkMode ? 'bg-slate-600' : 'bg-gray-50'}`}>
            <FaMapMarkerAlt className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>No Addresses Yet</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add your first delivery address to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white px-6 py-3 rounded-lg font-saiyan font-bold hover:shadow-lg transition-all"
            >
              ADD YOUR FIRST ADDRESS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${
                  isDarkMode
                    ? address.isDefault 
                      ? 'bg-slate-600 border-blue-500' 
                      : 'bg-slate-600 border-slate-500'
                    : address.isDefault
                      ? 'bg-white border-[#3B4CCA]'
                      : 'bg-white border-gray-200'
                }`}
              >
                {/* Address Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {address.type === 'home' ? (
                      <FaHome className={isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'} />
                    ) : address.type === 'work' ? (
                      <FaBriefcase className={isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'} />
                    ) : (
                      <FaGlobe className={isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'} />
                    )}
                    <span className={`font-saiyan font-bold ${isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'}`}>
                      {address.name || (address.type || '').toUpperCase()}
                    </span>
                  </div>
                  {address.isDefault && (
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center">
                      <FaStar className="mr-1" />
                      DEFAULT
                    </span>
                  )}
                </div>

                {/* Address Details */}
                <div className="space-y-2 mb-4">
                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{address.fullName}</p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{address.street}</p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  {address.country && (
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                      <FaGlobe className="inline mr-1" />
                      {address.country}
                    </p>
                  )}
                  {address.phone && (
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{address.phone}</p>
                  )}
                </div>

                {/* Actions */}
                <div className={`flex flex-wrap gap-2 pt-4 border-t ${isDarkMode ? 'border-slate-500' : 'border-gray-200'}`}>
                  <button
                    onClick={() => handleEditClick(address)}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all flex items-center font-saiyan text-sm"
                  >
                    <FaEdit className="mr-1" /> EDIT
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all font-saiyan text-sm"
                    >
                      SET DEFAULT
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="address-modal-title"
        >
          <div className={`rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
            <h3 id="address-modal-title" className={`text-2xl font-bold font-saiyan mb-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {editingAddress ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
            </h3>

            <div className="space-y-4">
              {/* Address Type */}
              <div>
                <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ADDRESS TYPE</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Address Name */}
              <div>
                <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ADDRESS NAME (Optional)</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., My House, Office"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Full Name */}
              <div>
                <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>FULL NAME *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              {/* Street Address */}
              <div>
                <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>STREET ADDRESS *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                    isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  required
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>CITY *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>STATE</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>ZIP CODE</label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>COUNTRY</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="USA"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-saiyan mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>PHONE</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:border-[#3B4CCA] focus:outline-none ${
                      isDarkMode ? 'bg-slate-600 border-slate-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleModalClose}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:bg-gray-600 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={editingAddress ? handleEditAddress : handleAddAddress}
                  className="flex-1 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white py-3 px-4 rounded-lg font-saiyan font-bold hover:shadow-lg transition-all"
                >
                  {editingAddress ? 'SAVE CHANGES' : 'ADD ADDRESS'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        message="Are you sure you want to delete this address?"
        onConfirm={confirmDelete}
        onCancel={() => { 
          setConfirmOpen(false); 
          setConfirmTargetId(null); 
        }}
      />
    </div>
  );
};

export default AddressBook;