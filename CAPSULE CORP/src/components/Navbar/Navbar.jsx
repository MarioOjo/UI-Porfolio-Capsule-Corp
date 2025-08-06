import { FaCapsules, FaUser, FaShoppingCart } from "react-icons/fa";

function Navbar() {
  return (
    <header className="max-w-6xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
            <FaCapsules className="text-white text-lg" />
          </div>
          <h1 className="text-2xl">CAPSULE CORP.</h1>
        </div>
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Scan item..."
              className="w-full px-4 py-2 border rounded-lg pr-10"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              <i className="fa-solid fa-search"></i>
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <FaUser className="text-xl" />
          <div className="relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;