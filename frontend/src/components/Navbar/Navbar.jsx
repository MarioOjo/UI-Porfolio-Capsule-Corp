import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaShoppingCart,
  FaSearch,
  FaHeart,
  FaTimes,
  FaBars,
  FaCaretDown
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../contexts/CartContext";
import { useWishlist } from "../../contexts/WishlistContext";
import Price from "../../components/Price";
import CapsuleCorpLogo from "../../components/CapsuleLogo";
import CurrencySelector from "../../components/CurrencySelector";
import './Navbar.css';
import { resolveImageSrc } from '../../utils/images';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const { user, logout } = useAuth();
  const { cartItems, removeFromCart, getCartCount } = useCart();
  const { wishlistItems, removeFromWishlist, getWishlistCount } = useWishlist();
  const navigate = useNavigate();

  const searchRef = useRef(null);
  const cartRef = useRef(null);
  const wishlistRef = useRef(null);
  const profileRef = useRef(null);
  const navRef = useRef(null);

  const desktopProductsSubmenu = [
    { label: 'All Products', to: '/products' },
    { label: 'Battle Gear', to: '/products?category=Battle%20Gear', emoji: '⚔️' },
    { label: 'Capsules', to: '/products?category=Capsules', emoji: '🏠' },
    { label: 'Training', to: '/products?category=Training', emoji: '💪' },
    { label: 'Tech', to: '/products?category=Tech', emoji: '📡' },
    { label: 'Consumables', to: '/products?category=Consumables', emoji: '🍃' },
    { label: 'Vehicles', to: '/products?category=Vehicles', emoji: '🚗' },
  ];

  const otherLinks = [
    { label: "Track Order", to: "/order-tracking", emoji: "📦" },
    { label: "Contact", to: "/contact", emoji: "📞" }
  ];

  // Close dropdowns/search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowSearchResults(false);
      if (cartRef.current && !cartRef.current.contains(e.target) && activeDropdown === 'cart') setActiveDropdown(null);
      if (wishlistRef.current && !wishlistRef.current.contains(e.target) && activeDropdown === 'wishlist') setActiveDropdown(null);
      if (profileRef.current && !profileRef.current.contains(e.target) && activeDropdown === 'profile') setActiveDropdown(null);
      if (navRef.current && !navRef.current.contains(e.target) && activeDropdown === 'products') setActiveDropdown(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Lock scroll when mobile menu open. Use a body class and restore on cleanup.
  useEffect(() => {
    const body = document.body;
    const onKey = (e) => { if (e.key === 'Escape') setMobileMenuOpen(false); };

    if (mobileMenuOpen) {
      body.classList.add('no-scroll');
    } else {
      body.classList.remove('no-scroll');
    }

    document.addEventListener('keydown', onKey);
    return () => {
      body.classList.remove('no-scroll');
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try { await logout(); setActiveDropdown(null); } 
    catch (e) { console.error(e); }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setShowSearchResults(false);
      setSearch("");
    }
  };

  const toggleDropdown = (name) => setActiveDropdown(prev => prev === name ? null : name);
  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <div ref={navRef}>
      {/* Desktop Navigation */}
      <header className="navbar-desktop bg-neutral-900 text-white">
        <div className="navbar-desktop-container flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="navbar-logo"><CapsuleCorpLogo variant="white" size="md" /></div>

          {/* Search */}
          <div className="search-container flex-1 mx-4">
            <form onSubmit={handleSearchSubmit} className="search-form relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => search.trim() && setShowSearchResults(true)}
                placeholder="Search for products, capsules or categories..."
                className="search-input w-full rounded-full px-4 py-2 text-black"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-black">
                <FaSearch />
              </button>
              {showSearchResults && searchResults.length > 0 && (
                <div className="search-results-panel absolute w-full bg-white text-black rounded-lg shadow-lg mt-1 z-50">
                  {searchResults.map(p => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="search-result-item flex items-center p-2" onClick={() => { setShowSearchResults(false); setSearch(""); }}>
                      <img src={resolveImageSrc(p, 80)} alt={p.name} className="w-12 h-12 object-cover mr-2 rounded"/>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div><Price value={p.price} /></div>
                      </div>
                    </Link>
                  ))}
                  <div className="text-center py-2">
                    <button onClick={handleSearchSubmit} className="text-blue-600 font-semibold">View all results →</button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* User Controls */}
          <div className="user-controls flex items-center gap-4">
            <CurrencySelector showLabel={false} size="small" />
            <ThemeToggle />

            {user ? (
              <div className="logged-in-icons flex items-center gap-4">
                {/* Wishlist */}
                <div className="relative" ref={wishlistRef}>
                  <button className="icon-button" onClick={() => toggleDropdown('wishlist')} aria-haspopup="true" aria-expanded={activeDropdown === 'wishlist'}>
                    <FaHeart />
                    {wishlistCount > 0 && <span className="notification-badge">{wishlistCount}</span>}
                  </button>
                  {activeDropdown === 'wishlist' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="dropdown-header flex justify-between px-2 py-1 font-bold border-b border-neutral-300">
                        <span>Wishlist</span>
                        <Link to="/wishlist" onClick={() => setActiveDropdown(null)}>View All</Link>
                      </div>
                      {wishlistItems.length === 0 ? <div className="p-2">No items in wishlist</div> :
                        wishlistItems.slice(0,5).map(item => (
                          <div key={item.id} className="dropdown-item flex items-center p-2 border-b border-neutral-200">
                            <img src={resolveImageSrc(item, 80)} alt={item.name} className="w-10 h-10 object-cover rounded mr-2"/>
                            <div className="flex-1">
                              <div>{item.name}</div>
                              <div><Price value={item.price} /></div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button onClick={() => navigate(`/product/${item.slug}`)} className="text-green-600"><FaShoppingCart/></button>
                              <button onClick={() => removeFromWishlist(item.id)} className="text-red-600"><FaTimes/></button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>

                {/* Cart */}
                <div className="relative" ref={cartRef}>
                  <button className="icon-button" onClick={() => toggleDropdown('cart')} aria-haspopup="true" aria-expanded={activeDropdown==='cart'}>
                    <FaShoppingCart/>
                    {cartCount>0 && <span className="notification-badge">{cartCount}</span>}
                  </button>
                  {activeDropdown==='cart' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-72 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="dropdown-header flex justify-between px-2 py-1 font-bold border-b border-neutral-300">
                        <span>Shopping Cart</span>
                        <Link to="/cart" onClick={()=>setActiveDropdown(null)}>View Cart</Link>
                      </div>
                      {cartItems.length===0 ? (
                        <div className="p-4 text-center">Your cart is empty</div>
                      ) : (
                        <>
                          {cartItems.slice(0,5).map(item => (
                            <div key={item.id} className="dropdown-item flex items-center p-2 border-b border-neutral-200">
                              <img src={resolveImageSrc(item, 80)} alt={item.name} className="w-12 h-12 object-cover rounded mr-2"/>
                              <div className="flex-1">
                                <div>{item.name}</div>
                                <div><Price value={item.price} /></div>
                                <div>Qty: {item.quantity}</div>
                              </div>
                              <button onClick={()=>removeFromCart(item.id)} className="text-red-600"><FaTimes/></button>
                            </div>
                          ))}
                          <div className="flex justify-between items-center p-2 font-bold">
                            <span>Total:</span>
                            <span><Price value={cartItems.reduce((total,item)=>total+(item.price*item.quantity),0)}/></span>
                          </div>
                          <Link to="/checkout" className="block text-center bg-blue-600 text-white py-2 rounded mt-1" onClick={()=>setActiveDropdown(null)}>Checkout</Link>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                  <button className="flex items-center gap-2" onClick={()=>toggleDropdown('profile')} aria-haspopup="true" aria-expanded={activeDropdown==='profile'}>
                      <img src={user.photoURL||'/default-avatar.png'} alt="Profile" className="w-8 h-8 rounded-full"/>
                    <span>{user.displayName || user.name || 'Profile'}</span>
                    <FaCaretDown/>
                  </button>
                  {activeDropdown==='profile' && (
                    <div className="dropdown-menu absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-50">
                      <div className="p-2 font-bold border-b border-neutral-300">Welcome, {user.displayName || user.name || user.email}</div>
                      <Link to="/profile" className="block px-2 py-1 hover:bg-neutral-200">My Profile</Link>
                      <Link to="/profile/account" className="block px-2 py-1 hover:bg-neutral-200">Account Info</Link>
                      <Link to="/profile/address-book" className="block px-2 py-1 hover:bg-neutral-200">Address Book</Link>
                      <Link to="/profile/order-history" className="block px-2 py-1 hover:bg-neutral-200">Order History</Link>
                      <Link to="/profile/change-password" className="block px-2 py-1 hover:bg-neutral-200">Change Password</Link>
                      <Link to="/profile/returns" className="block px-2 py-1 hover:bg-neutral-200">Return Requests</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-2 py-1 hover:bg-neutral-200 font-bold">Log Out</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={()=>navigate('/auth')} className="hover:underline">Login</button>
                <span>|</span>
                <button onClick={()=>navigate('/auth?tab=signup')} className="hover:underline">Register</button>
                <span>|</span>
                <button onClick={()=>navigate('/auth')}><FaShoppingCart/></button>
              </div>
            )}
          </div>
        </div>
      </header>

  {/* Secondary Navigation (desktop categories) */}
  <nav className="secondary-nav bg-neutral-800 text-white hidden md:block">
  <div className="secondary-nav-container flex justify-center px-4 py-1">
    <ul className="flex gap-4">
      <li className="relative" 
          onMouseEnter={() => setActiveDropdown('products')} 
          onMouseLeave={() => setActiveDropdown(null)}>
        <button className="flex items-center gap-1">
          Products <FaCaretDown/>
        </button>
        {activeDropdown === 'products' && (
          <div className="absolute top-full left-0 w-60 bg-neutral-900 rounded shadow-lg mt-1 z-50">
            {desktopProductsSubmenu.map(item => (
              <Link key={item.label} to={item.to} className="block px-4 py-2 hover:bg-neutral-700" onClick={() => setActiveDropdown(null)}>
                {item.emoji && <span className="mr-2">{item.emoji}</span>}
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </li>
      {otherLinks.map(link => (
        <li key={link.label}>
          <Link to={link.to} className="px-2 py-1 hover:underline">{link.label}</Link>
        </li>
      ))}
    </ul>
  </div>
</nav>

{/* Mobile Header */}
<header className="mobile-header block md:hidden bg-neutral-900 text-white relative">
  <div className="flex items-center justify-between px-4 py-3">
    <button type="button" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" aria-expanded={mobileMenuOpen} aria-controls="mobile-menu-panel" className="p-2 rounded-full bg-neutral-800">
      <FaBars className="text-xl"/>
    </button>
    <div className="flex justify-center items-center flex-1">
      <CapsuleCorpLogo variant="white" size="sm"/>
    </div>
    <div className="flex gap-2">
      <ThemeToggle />
      <CurrencySelector showLabel={false} size="small"/>
    </div>
  </div>
  <form onSubmit={handleSearchSubmit} className="px-4 py-2">
    <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search products..."
      className="w-full rounded-full px-4 py-2 bg-neutral-800 text-white placeholder-gray-400"
    />
  </form>
</header>

{/* Mobile Bottom Navigation */}
<nav className="mobile-bottom-nav fixed bottom-0 left-0 w-full flex justify-evenly items-center bg-neutral-900 text-white py-2 px-2 gap-2 md:hidden rounded-t-2xl shadow-lg">
  {!user ? (
    <>
      <button onClick={()=>navigate('/auth')} className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs">Login</button>
      <button onClick={()=>navigate('/auth?tab=signup')} className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs">Register</button>
    </>
  ) : null}
  <button onClick={()=>navigate('/cart')} className="relative px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center">
    <FaShoppingCart className="text-lg"/>
    {cartCount>0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full px-1">{cartCount}</span>}
  </button>
</nav>

{/* Mobile Slide-in Menu */}
{mobileMenuOpen && (
  <div className="mobile-menu-overlay fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-start" onClick={() => setMobileMenuOpen(false)}>
  <div id="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Main menu" className="mobile-menu-panel w-[95%] max-w-sm mt-4 bg-neutral-900 rounded-2xl shadow-2xl p-4" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white text-lg">Menu</h3>
        <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" className="p-2 rounded-full bg-neutral-800">
          <FaTimes/>
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        <Link to="/" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>Home</Link>
        <Link to="/products" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>All Products</Link>

        <div className="text-xs text-neutral-400 mt-2 mb-1">Categories</div>
        {desktopProductsSubmenu.map(item => (
          <Link key={item.label} to={item.to} className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700 flex items-center" onClick={()=>setMobileMenuOpen(false)}>
            {item.emoji && <span className="mr-1">{item.emoji}</span>}
            {item.label}
          </Link>
        ))}

        <div className="text-xs text-neutral-400 mt-2 mb-1">Support</div>
        {otherLinks.map(link => (
          <Link key={link.label} to={link.to} className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700 flex items-center" onClick={()=>setMobileMenuOpen(false)}>
            {link.emoji && <span className="mr-1">{link.emoji}</span>}
            {link.label}
          </Link>
        ))}

        <div className="text-xs text-neutral-400 mt-2 mb-1">Account</div>
        {user ? (
          <>
            <Link to="/profile" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>My Profile</Link>
            <Link to="/profile/order-history" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>Order History</Link>
            <Link to="/wishlist" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>Wishlist</Link>
            <button onClick={()=>{handleLogout(); setMobileMenuOpen(false)}} className="px-3 py-2 bg-red-700 rounded-lg text-white hover:bg-red-600">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/auth" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>Login</Link>
            <Link to="/auth?tab=signup" className="px-3 py-2 bg-neutral-800 rounded-lg text-white hover:bg-neutral-700" onClick={()=>setMobileMenuOpen(false)}>Register</Link>
          </>
        )}
      </nav>

      <div className="mt-4 flex justify-center">
        <ThemeToggle label={true} />
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Navbar;
