import { Link } from "react-router-dom";
import { FaCapsules, FaUser, FaShoppingCart, FaSearch } from "react-icons/fa";
import { useState } from "react";

function Navbar({ cartCount }) {
  const [search, setSearch] = useState("");
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
        <div className="flex items-center space-x-4">
          <Link to="/auth" aria-label="Login or Signup">
            <FaUser className="text-xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors" />
          </Link>
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