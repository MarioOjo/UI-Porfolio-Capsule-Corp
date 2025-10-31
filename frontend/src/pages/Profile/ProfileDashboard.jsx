import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import apiFetch from '../../utils/api';
import { useTheme } from '../../contexts/ThemeContext';
import { useWishlist } from '../../contexts/WishlistContext';

const StatCard = ({ title, value, dark }) => (
  <div className={`p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center ${dark ? 'bg-slate-700 text-white' : 'bg-white'}`}>
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-[#3B4CCA] dark:text-white font-saiyan mb-2">{value}</div>
      <div className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-600'}`}>{title}</div>
    </div>
  </div>
);

const ProfileDashboard = () => {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { wishlistItems } = useWishlist();
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (user?.id) {
          // Use compact stats endpoint added on the backend to avoid fetching full order lists
          const stats = await apiFetch(`/api/orders/user/${user.id}/stats`);
          if (mounted && stats) {
            setOrdersCount(parseInt(stats.total_orders || 0, 10));
            setTotalSpent(parseFloat(stats.total_spent || 0));
          }
        }
      } catch (e) {
        console.error('Failed to load orders for dashboard', e);
        if (mounted) {
          setOrdersCount(0);
          setTotalSpent(0);
        }
      }
    })();

    return () => { mounted = false; };
  }, [user]);

  // Wishlist count from context (keeps accurate client state)
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

  return (
    <div className={`p-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 font-saiyan">My Account</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value={ordersCount} dark={isDarkMode} />
        <StatCard title="Total Spent" value={`$${totalSpent.toFixed(2)}`} dark={isDarkMode} />
        <StatCard title="My Wishlist" value={wishlistCount} dark={isDarkMode} />
      </div>
    </div>
  );
};

export default ProfileDashboard;
