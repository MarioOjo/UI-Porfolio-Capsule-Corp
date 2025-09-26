import { Link } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../../AuthContext";

function Navbar({ cartCount, wishlistCount = 0 }) {
  const [search, setSearch] = useState("");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
            <FaCapsules className="text-white text-lg" />
          </div>
          <h1 className="text-2xl font-bold text-[#3B4CCA] font-saiyan">CAPSULE CORP.</h1>
        </Link>
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Scan item..."
              className="w-full px-4 py-2 border rounded-lg pr-10"
              aria-label="Search"
            />
            <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          {/* Profile Icon */}
          <Link to={user ? "/profile" : "/auth"} aria-label={user ? "Profile" : "Login or Signup"}>
            <FaUser className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
          </Link>
          
          {/* Auth Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                  aria-label="Logout"
                >
                  LOGOUT
                </button>
                <div className="relative">
                  <Link 
                    to="/wishlist" 
                    aria-label="Wishlist"
                    className="flex items-center"
                  >
                    <FaHeart className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                  aria-label="Sign In"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="text-sm font-medium text-[#3B4CCA] hover:text-[#FFD700] transition-colors font-saiyan tracking-wide"
                  aria-label="Register"
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Cart */}
          <div className="relative">
            <Link to="/cart" aria-label="View Cart">
              <FaShoppingCart className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;