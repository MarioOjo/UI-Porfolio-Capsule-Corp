import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaUser, FaList, FaMapMarkerAlt, FaBox, FaHeart, FaLock } from 'react-icons/fa';

const SidebarLink = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center space-x-3 py-3 px-4 rounded-l-lg hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-100 font-semibold' : ''}`
    }
  >
    <Icon className="text-xl" />
    <span>{children}</span>
  </NavLink>
);

const ProfileLayout = () => {
  return (
  <div className="min-h-0 py-8 bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-white border border-blue-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <aside className="md:col-span-1 bg-white">
              <div className="rounded-xl border border-gray-200 p-4">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FaUser />
                  </div>
                  <h2 className="text-lg font-bold">My Account</h2>
                </div>
                <nav className="flex flex-col">
                  <SidebarLink to="/profile" icon={FaList}>Overview</SidebarLink>
                  <SidebarLink to="/profile/account" icon={FaUser}>Account Info</SidebarLink>
                  <SidebarLink to="/profile/address-book" icon={FaMapMarkerAlt}>Address Book</SidebarLink>
                  <SidebarLink to="/profile/order-history" icon={FaBox}>Order History</SidebarLink>
                  <SidebarLink to="/profile/wishlist" icon={FaHeart}>My Wishlist</SidebarLink>
                  <SidebarLink to="/profile/change-password" icon={FaLock}>Change Password</SidebarLink>
                </nav>
              </div>
            </aside>

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
