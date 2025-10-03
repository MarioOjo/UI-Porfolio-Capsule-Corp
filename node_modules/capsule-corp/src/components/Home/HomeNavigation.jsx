import { NavLink } from "react-router-dom";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "Products", to: "/products" },
  { name: "Battle Gear", to: "/battle-gear" },
  { name: "Capsules", to: "/capsules" },
  { name: "Training", to: "/training" },
  { name: "Contact", to: "/contact" },
  { name: "Cart", to: "/cart" },
];

function HomeNavigation() {
  return (
    <nav className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-[#3B4CCA]/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        {/* Mobile Navigation - Horizontal scroll */}
        <div className="flex items-center space-x-4 sm:space-x-8 py-4 overflow-x-auto scrollbar-hide">
          {navLinks.map(link => (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `font-medium transition-colors border-b-2 border-transparent hover:text-[#3B4CCA] hover:border-[#3B4CCA] cursor-pointer whitespace-nowrap shrink-0 text-sm sm:text-base
                ${isActive ? "text-[#3B4CCA] border-[#3B4CCA]" : ""}`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default HomeNavigation;