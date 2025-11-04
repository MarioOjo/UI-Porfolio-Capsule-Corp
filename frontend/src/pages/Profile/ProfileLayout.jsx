import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser, FaList, FaMapMarkerAlt, FaBox, FaHeart, FaLock } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const SidebarLink = ({ to, icon: Icon, children, isDarkMode }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
        isActive 
          ? isDarkMode 
            ? 'bg-slate-700 text-white font-semibold border-l-4 border-[#3B4CCA]' 
            : 'bg-blue-50 text-[#3B4CCA] font-semibold border-l-4 border-[#3B4CCA]'
          : isDarkMode
            ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100'
      }`
    }
  >
    <Icon className="text-xl" />
    <span>{children}</span>
  </NavLink>
);

const ProfileLayout = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'} p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <div className={`rounded-xl border ${isDarkMode ? 'border-slate-600 bg-slate-700' : 'border-gray-200 bg-white'} p-4`}>
                <div className="mb-6 flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDarkMode ? 'bg-slate-600 text-white' : 'bg-blue-100 text-[#3B4CCA]'
                  }`}>
                    <FaUser />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      MY ACCOUNT
                    </h2>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Manage your profile
                    </p>
                  </div>
                </div>
                
                <nav className="flex flex-col space-y-2">
                  <SidebarLink to="/profile" icon={FaList} isDarkMode={isDarkMode}>
                    Overview
                  </SidebarLink>
                  <SidebarLink to="/profile/account" icon={FaUser} isDarkMode={isDarkMode}>
                    Account Info
                  </SidebarLink>
                  <SidebarLink to="/profile/address-book" icon={FaMapMarkerAlt} isDarkMode={isDarkMode}>
                    Address Book
                  </SidebarLink>
                  <SidebarLink to="/profile/order-history" icon={FaBox} isDarkMode={isDarkMode}>
                    Order History
                  </SidebarLink>
                  <SidebarLink to="/profile/wishlist" icon={FaHeart} isDarkMode={isDarkMode}>
                    My Wishlist
                  </SidebarLink>
                  <SidebarLink to="/profile/change-password" icon={FaLock} isDarkMode={isDarkMode}>
                    Change Password
                  </SidebarLink>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="md:col-span-3">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;