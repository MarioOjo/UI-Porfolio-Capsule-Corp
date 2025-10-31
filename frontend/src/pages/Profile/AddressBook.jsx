import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import apiFetch from '../../utils/api';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase } from 'react-icons/fa';
import ConfirmDialog from '../../components/ConfirmDialog';

const AddressBook = () => {
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
        const res = await apiFetch(`/api/addresses/${editingAddress.id}`, { method: 'PUT', body: JSON.stringify(formData) });
        setAddresses(prev => prev.map(a => a.id === editingAddress.id ? res.address : a));
        setShowAddModal(false);
        setEditingAddress(null);
        setFormData({ type: 'home', name: '', fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
        showSuccess('✅ Address updated!');
      } catch (e) {
        showError('❌ Could not update address');
      }
    })();
  };
  const { user } = useAuth();
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
    phone: ''
  });

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
        const res = await apiFetch('/api/addresses', { method: 'POST', body: JSON.stringify(formData) });
        setAddresses(prev => [res.address, ...prev]);
        setShowAddModal(false);
        setFormData({ type: 'home', name: '', fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
        showSuccess('✅ Address added successfully!');
      } catch (e) {
        showError('❌ Could not add address');
      }
    })();
  };

  const handleDeleteAddress = (id) => {
    // replaced by modal confirmation flow
    setConfirmTargetId(id);
    setConfirmOpen(true);
  };

  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTargetId, setConfirmTargetId] = useState(null);

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

  const handleSetDefault = (id) => {
    (async () => {
      try {
        // Backend doesn't have explicit default flag; we'll emulate by updating labels or client-side preference.
        // For now, mark client-side default by reordering
        setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
        showSuccess('✅ Default address updated');
      } catch (e) {
        showError('❌ Could not set default');
      }
    })();
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
    return () => { mounted = false };
  }, []);

  return (
  <div className="min-h-0 bg-gradient-to-br from-blue-50 via-white to-orange-50 py-8 overflow-x-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
  <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
    <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-saiyan mb-2">ADDRESS BOOK</h1>
              <p className="text-blue-100">Manage your delivery addresses</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-[#3B4CCA] px-6 py-3 rounded-lg font-saiyan font-bold hover:bg-gray-100 transition-all flex items-center space-x-2 dark:bg-slate-700 dark:text-white"
            >
              <FaPlus />
              <span>ADD ADDRESS</span>
            </button>
          </div>
        </div>

        {/* Address List */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl shadow-lg p-6 border-2 transition-all hover:shadow-xl ${address.isDefault ? 'border-[#3B4CCA]' : 'border-gray-200'} dark:bg-slate-800 dark:border-slate-700`}
            >
              {/* Address Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {address.type === 'home' ? (
                    <FaHome className="text-[#3B4CCA] dark:text-white" />
                  ) : (
                    <FaBriefcase className="text-[#3B4CCA] dark:text-white" />
                  )}
                    <span className="font-saiyan text-[#3B4CCA] dark:text-white font-bold">
                    {address.name || (address.type || '').toUpperCase()}
                  </span>
                </div>
                {address.isDefault && (
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                    DEFAULT
                  </span>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-2 mb-4">
                <p className="font-bold text-gray-800 dark:text-white">{address.fullName}</p>
                <p className="text-gray-600 dark:text-gray-300">{address.street}</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {address.city}, {address.state} {address.zip}
                </p>
                <p className="text-gray-600 dark:text-gray-300">{address.phone}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditClick(address)}
                  className="bg-yellow-50 text-yellow-700 py-2 px-4 rounded-lg hover:bg-yellow-100 transition-all flex items-center"
                >
                  <FaEdit className="mr-1" /> EDIT
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 bg-blue-50 text-[#3B4CCA] py-2 px-4 rounded-lg hover:bg-blue-100 transition-all font-saiyan text-sm dark:bg-slate-700 dark:text-white"
                  >
                    SET DEFAULT
                  </button>
                )}
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-all"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center dark:bg-slate-800">
            <FaMapMarkerAlt className="text-6xl text-gray-300 mx-auto mb-4 dark:text-gray-600" />
            <h3 className="text-xl font-bold text-gray-800 mb-2 font-saiyan dark:text-white">No Addresses Yet</h3>
            <p className="text-gray-600 mb-6 dark:text-gray-300">Add your first delivery address to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white px-6 py-3 rounded-lg font-saiyan font-bold hover:shadow-lg transition-all"
            >
              ADD YOUR FIRST ADDRESS
            </button>
          </div>
        )}

        {/* Add Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 sm:p-2">
            <div className="bg-white rounded-2xl p-8 sm:p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-slate-800">
              <h3 className="text-2xl sm:text-xl font-bold text-gray-800 font-saiyan mb-6 dark:text-white">
                {editingAddress ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
              </h3>

              <div className="space-y-4">
                {/* Address Type */}
                <div>
                  <label className="block text-sm font-saiyan text-gray-700 mb-2">ADDRESS TYPE</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                  >
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-saiyan text-gray-700 mb-2">FULL NAME *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                    required
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-sm font-saiyan text-gray-700 mb-2">STREET ADDRESS *</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                    required
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-saiyan text-gray-700 mb-2">CITY *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-saiyan text-gray-700 mb-2">STATE</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-saiyan text-gray-700 mb-2">ZIP CODE</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-saiyan text-gray-700 mb-2">PHONE</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#3B4CCA] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 sm:flex-col sm:space-y-2 sm:space-x-0">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingAddress(null);
                      setFormData({ type: 'home', name: '', fullName: '', street: '', city: '', state: '', zip: '', phone: '' });
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-saiyan font-bold hover:bg-gray-400 transition-colors"
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
          onCancel={() => { setConfirmOpen(false); setConfirmTargetId(null); }}
        />
      </div>
    </div>
  );
};

export default AddressBook;
