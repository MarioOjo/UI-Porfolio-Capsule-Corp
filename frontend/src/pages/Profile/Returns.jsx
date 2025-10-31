import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import apiFetch from '../../utils/api';
import { FaUndoAlt, FaBox } from 'react-icons/fa';

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
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [user]);

  return (
    <div className="min-h-0 py-8 bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 rounded-2xl p-8 mb-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaUndoAlt className="text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-saiyan mb-2">RETURN REQUESTS</h1>
              <p className="text-blue-100">Manage your return and refund requests</p>
            </div>
          </div>
        </div>

  <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-blue-100 p-6 dark:bg-slate-800 dark:border-slate-700">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : returns.length === 0 ? (
            <div className="text-center py-12">
              <FaBox className="text-6xl mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold mb-2 font-saiyan">No Return Requests</h3>
              <p className="text-gray-600">You don't have any return requests right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returns.map((r) => (
                <div key={r.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">Request #{r.id}</div>
                      <div className="text-sm text-gray-600">Order: {r.order_number}</div>
                    </div>
                    <div className="text-sm font-semibold">{r.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Returns;
