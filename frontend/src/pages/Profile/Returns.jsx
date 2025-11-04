import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import apiFetch from '../../utils/api';
import { FaUndoAlt, FaBox, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Returns = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Try a user-scoped endpoint first, then a general one.
        const path = user && user.id ? `/api/returns/user/${user.id}` : '/api/returns';
        const res = await apiFetch(path);
        if (mounted && res && Array.isArray(res.returns)) setReturns(res.returns);
      } catch (e) {
        // If backend doesn't provide a returns API, silently show an empty state
        console.debug('No returns API or error loading returns', e);
        if (mounted) setReturns([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <FaCheckCircle className="text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'processing':
      case 'pending':
        return <FaClock className="text-orange-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processing':
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaUndoAlt className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-saiyan">RETURN REQUESTS</h1>
                <p className="text-blue-100">Manage your return and refund requests</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">
                  <div className={`h-4 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} mb-4 mx-auto w-32`}></div>
                  <div className={`h-8 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} mb-2 mx-auto w-48`}></div>
                  <div className={`h-4 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} mx-auto w-64`}></div>
                </div>
              </div>
            ) : returns.length === 0 ? (
              <div className="text-center py-12">
                <FaBox className={`text-6xl mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-xl font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  NO RETURN REQUESTS
                </h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  You haven't submitted any return requests yet.
                </p>
                <div className={`p-6 rounded-lg max-w-md mx-auto ${isDarkMode ? 'bg-slate-700' : 'bg-blue-50'}`}>
                  <h4 className={`font-bold mb-2 font-saiyan ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                    HOW TO RETURN AN ITEM
                  </h4>
                  <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>• Go to your Order History</li>
                    <li>• Select the order containing the item</li>
                    <li>• Click "Request Return"</li>
                    <li>• Follow the return instructions</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {returns.map((returnItem) => (
                  <div
                    key={returnItem.id}
                    className={`rounded-xl border-2 p-6 transition-all ${
                      isDarkMode 
                        ? 'border-slate-600 bg-slate-700 hover:border-slate-500' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold font-saiyan mb-2 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                          Return #{returnItem.id}
                        </h3>
                        <div className={`space-y-1 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <p><strong>Order:</strong> {returnItem.order_number || 'N/A'}</p>
                          <p><strong>Item:</strong> {returnItem.product_name || 'Unknown Product'}</p>
                          <p><strong>Reason:</strong> {returnItem.reason || 'Not specified'}</p>
                          {returnItem.requested_date && (
                            <p><strong>Requested:</strong> {new Date(returnItem.requested_date).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center space-x-2 ${getStatusColor(returnItem.status)}`}>
                          {getStatusIcon(returnItem.status)}
                          <span>{(returnItem.status || 'Pending').toUpperCase()}</span>
                        </span>
                        {returnItem.refund_amount && (
                          <div className="text-right">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Refund Amount</p>
                            <p className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
                              ${parseFloat(returnItem.refund_amount || 0).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Return Notes */}
                    {returnItem.notes && (
                      <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                          <strong>Notes:</strong> {returnItem.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;