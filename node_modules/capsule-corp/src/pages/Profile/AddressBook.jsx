import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash, FaHome, FaBuilding } from 'react-icons/fa';

const AddressBook = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'South Africa',
    phone: '',
    isDefault: false
  });

  useEffect(() => {
    // Load addresses from localStorage or API
    const savedAddresses = localStorage.getItem(`addresses_${user?.id}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, [user]);

  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(newAddresses));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAddress = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now()
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    // If this is set as default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    saveAddresses(updatedAddresses);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'South Africa',
      phone: '',
      isDefault: false
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (addressId) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    saveAddresses(updatedAddresses);
  };

  const setDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    saveAddresses(updatedAddresses);
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <FaMapMarkerAlt className="text-[#3B4CCA] text-2xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white font-saiyan">ADDRESS BOOK</h1>
                  <p className="text-blue-100">Manage your shipping and billing addresses</p>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#FFD700] to-[#FF9E00] text-[#3B4CCA] rounded-lg hover:from-[#E6C200] hover:to-[#E88900] transition-all font-saiyan font-bold shadow-lg"
              >
                <FaPlus />
                <span>ADD ADDRESS</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Address Form */}
            {showForm && (
              <div className={`mb-8 p-6 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-blue-300 bg-blue-50'}`}>
                <h3 className={`text-xl font-bold mb-6 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                  {editingAddress ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Address Type */}
                  <div>
                    <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ADDRESS TYPE
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="home"
                          checked={formData.type === 'home'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <FaHome className="mr-1" />
                        Home
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="work"
                          checked={formData.type === 'work'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <FaBuilding className="mr-1" />
                        Work
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="First Name"
                      required
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Last Name"
                      required
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {formData.type === 'work' && (
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  )}

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    required
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                  />

                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, etc. (optional)"
                    className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      required
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Province/State"
                      required
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="Postal Code"
                      required
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="South Africa">South Africa</option>
                      <option value="Namibia">Namibia</option>
                      <option value="Botswana">Botswana</option>
                      <option value="Zimbabwe">Zimbabwe</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className={`px-4 py-3 rounded-lg border-2 transition-all ${
                        isDarkMode 
                          ? 'bg-slate-600 border-slate-500 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                      Set as default address
                    </span>
                  </label>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold"
                    >
                      {editingAddress ? 'UPDATE ADDRESS' : 'SAVE ADDRESS'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-saiyan font-bold"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    address.isDefault
                      ? `${isDarkMode ? 'border-[#FFD700] bg-slate-700' : 'border-[#FFD700] bg-gradient-to-br from-yellow-50 to-orange-50'}`
                      : `${isDarkMode ? 'border-slate-600 bg-slate-700 hover:border-slate-500' : 'border-gray-200 bg-white hover:border-gray-300'}`
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-2">
                      {address.type === 'home' ? <FaHome className="text-[#3B4CCA]" /> : <FaBuilding className="text-[#3B4CCA]" />}
                      <span className={`font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                        {address.type.toUpperCase()}
                      </span>
                      {address.isDefault && (
                        <span className="bg-[#FFD700] text-[#3B4CCA] px-2 py-1 rounded-full text-xs font-bold">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <p className="font-semibold">{address.firstName} {address.lastName}</p>
                    {address.company && <p>{address.company}</p>}
                    <p>{address.address}</p>
                    {address.apartment && <p>{address.apartment}</p>}
                    <p>{address.city}, {address.state} {address.zipCode}</p>
                    <p>{address.country}</p>
                    {address.phone && <p>{address.phone}</p>}
                  </div>

                  {!address.isDefault && (
                    <button
                      onClick={() => setDefault(address.id)}
                      className="mt-4 text-sm text-[#3B4CCA] hover:text-blue-700 font-semibold transition-colors"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              ))}
            </div>

            {addresses.length === 0 && !showForm && (
              <div className="text-center py-12">
                <FaMapMarkerAlt className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  NO ADDRESSES FOUND
                </h3>
                <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mb-6`}>
                  Add your first address to get started with faster checkout
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#3B4CCA] to-blue-600 text-white rounded-lg hover:from-[#2A3B9A] hover:to-blue-700 transition-all font-saiyan font-bold"
                >
                  ADD YOUR FIRST ADDRESS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;