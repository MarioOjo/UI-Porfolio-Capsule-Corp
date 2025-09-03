import { useState } from "react";
import { Link } from "react-router-dom";

const featuredItems = [
  {
    name: "Goku's Damaged Gi",
    pl: "PL: 8,000 🔥",
    tag: "KAMEHAMEHA TESTED",
    priceOld: "$599",
    price: "$499",
    status: "Available",
  },
  {
    name: "Senzu Beans (3-Pack)",
    pl: "🔥 OVER 9000!",
    tag: "SAIYAN APPROVED",
    price: "$999",
    status: "Available",
  },
  {
    name: "Frieza's Tail Fragment",
    pl: "PL: 2,500",
    tag: "COLLECTIBLE",
    price: "$199",
    status: "Available",
  },
];

const allCapsules = [
  {
    name: "Krillin's Destructo Disc",
    pl: "PL: 3,500",
    price: "$399.99",
    status: "Available",
  },
  {
    name: "Bulma's Capsule #17",
    pl: "PL: 7,000",
    price: "$699.99",
    status: "Available",
  },
  {
    name: "Yamcha's Bandana",
    pl: "PL: 800",
    price: "$59.99",
    status: "Available",
  },
  {
    name: "Zarbon's Earring",
    pl: "PL: 3,200",
    price: "$229.99",
    status: "Available",
  },
  {
    name: "Guru's Old Staff",
    pl: "PL: 6,500",
    price: "$549.99",
    status: "Available",
  },
  {
    name: "Oolong's Disguise Kit",
    pl: "PL: 900",
    price: "$119.99",
    status: "Available",
  },
  {
    name: "Cell's Broken Wing",
    pl: "🔥 OVER 9000!",
    price: "$999.99",
    status: "Destroyed",
  },
  {
    name: "Saibaman Seed",
    pl: "PL: 1,800",
    price: "$199.99",
    status: "Last Capsule",
  },
];

function Products({ cartCount, setCartCount }) {
  const [search, setSearch] = useState("");

  // Filter products by search
  const filteredFeatured = featuredItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCapsules = allCapsules.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Add to cart handler (demo: just increments cartCount)
  const handleAddToCart = () => setCartCount(count => count + 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center border-2 border-[#3B4CCA] shadow-lg group-hover:scale-105 transition-transform">
            <i className="fa-solid fa-capsules text-[#3B4CCA] text-lg"></i>
          </div>
          <h1 className="text-2xl font-saiyan text-[#3B4CCA] group-hover:text-[#FF9E00] transition-colors">CAPSULE CORP.</h1>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Find Senzu Beans..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-80 px-4 py-2 border-2 border-[#3B4CCA] rounded-lg bg-white text-neutral-700 focus:ring-2 focus:ring-[#FFD700] transition-all"
              aria-label="Search products"
            />
            <i className="fa-solid fa-search absolute right-3 top-3 text-[#3B4CCA]"></i>
          </div>
          <div className="relative">
            <Link to="/cart" aria-label="View Cart">
              <i className="fa-solid fa-shopping-cart text-2xl text-[#3B4CCA] hover:text-[#FFD700] transition-colors"></i>
              <span className="absolute -top-2 -right-2 bg-[#FF9E00] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#F3F4F6] border-b mb-8 rounded-lg">
        <div className="flex items-center space-x-8 py-3 px-2">
          <Link to="/" className="hover:text-[#3B4CCA] transition-colors">Home</Link>
          <Link to="/battle-gear" className="hover:text-[#3B4CCA] transition-colors">Battle Gear</Link>
          <span className="text-[#3B4CCA] font-bold">Products</span>
          <span className="text-neutral-400 cursor-not-allowed">Saiyan Sale</span>
          <Link to="/cart" className="hover:text-[#3B4CCA] transition-colors">Cart</Link>
        </div>
      </nav>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-saiyan mb-2 text-[#3B4CCA]">BATTLE-TESTED INVENTORY</h1>
        <p className="text-neutral-600">Power up with authentic Z-Fighter equipment</p>
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Power Level Filter</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <span className="text-sm">0</span>
                <div className="flex-1 h-3 bg-[#E5E7EB] rounded-full">
                  <div className="w-1/3 h-3 bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] rounded-full"></div>
                </div>
                <span className="text-sm">10,000+</span>
              </div>
              <button
                className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-4 py-2 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
                type="button"
              >
                SCAN RANGE
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Category</h3>
            <div className="space-y-2">
              {["☄️ Weapons", "👕 Clothing", "🍃 Consumables", "📡 Tech"].map(cat => (
                <label key={cat} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded accent-[#3B4CCA]" checked readOnly />
                  <span className="bg-[#3B4CCA] text-white px-2 py-1 rounded text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Sort By</h3>
            <select className="w-full px-4 py-2 border-2 border-[#3B4CCA] rounded focus:ring-2 focus:ring-[#FFD700]">
              <option>PL: High to Low</option>
              <option>PL: Low to High</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Z-Fighter Ranked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white text-center py-3 mb-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-saiyan tracking-wide">LEGENDARY ITEMS</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredFeatured.map(item => (
            <div key={item.name} className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 hover:shadow-xl hover:border-[#FF9E00] transition-all">
              <div className="w-full h-48 bg-[#3B4CCA] rounded-lg mb-4 flex items-center justify-center border-2 border-[#FF9E00] relative">
                <span className="text-white font-bold">{item.name}</span>
                <div className="absolute inset-0 bg-[#FF9E00] opacity-10 rounded-lg"></div>
              </div>
              <h3 className="text-lg mb-2 text-[#3B4CCA] font-bold">{item.name}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-[#3B4CCA] text-white px-2 py-1 rounded text-xs">{item.pl}</span>
                <span className="bg-[#FF9E00] text-white px-2 py-1 rounded text-xs">{item.tag}</span>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                {item.priceOld && <span className="text-neutral-400 line-through">{item.priceOld}</span>}
                <span className="text-xl text-[#FF9E00] font-bold">{item.price}</span>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white py-2 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
                type="button"
                onClick={handleAddToCart}
              >
                Add to Capsule
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* All Capsules Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-saiyan mb-6 text-[#3B4CCA]">ALL CAPSULES</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {filteredCapsules.map(item => (
            <div key={item.name} className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-4 hover:shadow-xl hover:border-[#FF9E00] transition-all">
              <div className="w-full h-32 bg-[#3B4CCA] rounded mb-3 flex items-center justify-center border-2 border-[#FF9E00] relative">
                <span className="text-white text-xs font-bold">{item.name}</span>
                <div className="absolute inset-0 bg-[#FF9E00] opacity-10 rounded"></div>
              </div>
              <h4 className="mb-2 text-[#3B4CCA] font-bold">{item.name}</h4>
              <div className="flex items-center space-x-1 mb-2">
                <span className="bg-[#3B4CCA] text-white px-2 py-1 rounded text-xs">{item.pl}</span>
                <span className="text-[#00FF00]">{item.status === "Destroyed" ? "🔴" : "🟢"}</span>
              </div>
              <div className={`text-lg mb-3 ${item.status === "Destroyed" ? "text-neutral-400 line-through" : "text-[#FF9E00] font-bold"}`}>{item.price}</div>
              <button
                className={`w-full py-2 rounded text-sm transition-all shadow ${
                  item.status === "Destroyed"
                    ? "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black"
                }`}
                disabled={item.status === "Destroyed"}
                type="button"
                onClick={item.status === "Destroyed" ? undefined : handleAddToCart}
              >
                {item.status === "Destroyed" ? "DESTROYED" : "Add to Capsule"}
              </button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <button
            className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
            type="button"
          >
            MORE CAPSULES →
          </button>
        </div>
      </section>

      {/* Battle Tip */}
      <div className="bg-[#F3F4F6] border rounded-lg p-6 text-center mt-8">
        <i className="fa-solid fa-lightbulb text-2xl mb-2 text-[#3B4CCA]"></i>
        <p className="text-lg text-[#3B4CCA]">Battle Tip: Stronger together! Bundle items for PL discounts</p>
      </div>
    </div>
  );
}

export default Products;