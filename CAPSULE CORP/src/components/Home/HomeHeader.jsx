import { Link } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useState } from "react";

function HomeHeader({ cartCount }) {
  const [search, setSearch] = useState("");
  return (
    <header className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <FaCapsules className="text-[#3B4CCA] text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wider font-sans">CAPSULE CORP.</h1>
          </Link>
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Find Dragon Balls..."
                className="w-full px-4 py-3 bg-white/90 backdrop-blur border-2 border-white/20 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-[#FFD700] transition-all"
                aria-label="Search"
              />
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3B4CCA] text-lg" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {/* Profile icon links to /auth for login/signup */}
            <Link to="/auth" aria-label="Login or Signup">
              <FaUser className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
            </Link>
            <div className="relative">
              <Link to="/cart" aria-label="View Cart">
                <FaShoppingCart className="text-white text-xl hover:text-[#FFD700] transition-colors cursor-pointer" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;