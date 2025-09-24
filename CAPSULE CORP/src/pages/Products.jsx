// ...existing code...
import React, { useState } from "react";
import { Link } from "react-router-dom";

const LOCAL_CART_KEY = "capsule_cart_v1";

function parseCents(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ""));
    return isNaN(n) ? 0 : Math.round(n * 100);
  }
  return 0;
}

/*
  Minimal / optimized Products page:
  - Removed duplicated navbar & search (assumes global Navbar handles those)
  - Single addToCart that persists to localStorage and updates setCartCount
  - Keeps filters / featured / grid but removes duplicate navigation & search UI
*/

const featuredItems = [
  { id: "goku-gi", name: "Goku's Damaged Gi", pl: "PL: 8,000 🔥", tag: "KAMEHAMEHA TESTED", priceOld: "$599", price: "$499", status: "Available", sku: "LEG-001" },
  { id: "senzu-3", name: "Senzu Beans (3-Pack)", pl: "🔥 OVER 9000!", tag: "SAIYAN APPROVED", price: "$999", status: "Available", sku: "CON-003" },
  { id: "frieza-tail", name: "Frieza's Tail Fragment", pl: "PL: 2,500", tag: "COLLECTIBLE", price: "$199", status: "Available", sku: "COL-002" },
];

const allCapsules = [
  { id: "krillin-disc", name: "Krillin's Destructo Disc", pl: "PL: 3,500", price: "$399.99", status: "Available", sku: "WPN-101" },
  { id: "bulma-17", name: "Bulma's Capsule #17", pl: "PL: 7,000", price: "$699.99", status: "Available", sku: "CAP-017" },
  { id: "yamcha-bandana", name: "Yamcha's Bandana", pl: "PL: 800", price: "$59.99", status: "Available", sku: "CLTH-009" },
  { id: "zarbon-ear", name: "Zarbon's Earring", pl: "PL: 3,200", price: "$229.99", status: "Available", sku: "ACC-221" },
  { id: "guru-staff", name: "Guru's Old Staff", pl: "PL: 6,500", price: "$549.99", status: "Available", sku: "COL-330" },
  { id: "oolong-kit", name: "Oolong's Disguise Kit", pl: "PL: 900", price: "$119.99", status: "Available", sku: "GAD-014" },
  { id: "cell-wing", name: "Cell's Broken Wing", pl: "🔥 OVER 9000!", price: "$999.99", status: "Destroyed", sku: "DMG-404" },
  { id: "saibaman-seed", name: "Saibaman Seed", pl: "PL: 1,800", price: "$199.99", status: "Last Capsule", sku: "BIO-007" },
];

function addToCartLocal(product, setCartCount) {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    const id = product.id ?? product.sku ?? product.name;
    const idx = arr.findIndex((i) => i.id === id);
    if (idx >= 0) {
      arr[idx].qty = (arr[idx].qty || 0) + 1;
    } else {
      arr.push({
        id,
        name: product.name,
        sku: product.sku ?? "",
        qty: 1,
        priceCents: parseCents(product.price),
        img: product.img ?? null,
        link: product.link ?? "/products",
      });
    }
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(arr));
    const qty = arr.reduce((s, it) => s + (it.qty || 0), 0);
    if (typeof setCartCount === "function") setCartCount(qty);
  } catch (e) {
    console.error("Failed to add to cart", e);
  }
}

export default function Products({ cartCount, setCartCount }) {
  const [plFilter, setPlFilter] = useState(null);
  const [sortBy, setSortBy] = useState("pl-desc");

  // simple filtering/sorting for demo; removed local search & nav to avoid duplication
  const filteredFeatured = featuredItems.filter((i) => {
    if (!plFilter) return true;
    const n = parseInt((i.pl || "").replace(/[^0-9]/g, ""), 10) || 0;
    return n >= plFilter;
  });

  let filteredCapsules = allCapsules.slice();
  if (plFilter) {
    filteredCapsules = filteredCapsules.filter((i) => {
      const n = parseInt((i.pl || "").replace(/[^0-9]/g, ""), 10) || 0;
      return n >= plFilter;
    });
  }

  if (sortBy === "pl-desc") {
    filteredCapsules.sort((a, b) => (parseInt((b.pl || "").replace(/[^0-9]/g, ""), 10) || 0) - (parseInt((a.pl || "").replace(/[^0-9]/g, ""), 10) || 0));
  } else if (sortBy === "pl-asc") {
    filteredCapsules.sort((a, b) => (parseInt((a.pl || "").replace(/[^0-9]/g, ""), 10) || 0) - (parseInt((b.pl || "").replace(/[^0-9]/g, ""), 10) || 0));
  } else if (sortBy === "price-asc") {
    filteredCapsules.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, "")) - parseFloat(b.price.replace(/[^0-9.]/g, "")));
  } else if (sortBy === "price-desc") {
    filteredCapsules.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, "")) - parseFloat(a.price.replace(/[^0-9.]/g, "")));
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Title only — global Navbar provides site nav and search */}
      <div className="mb-8">
        <h1 className="text-4xl font-saiyan mb-2 text-[#3B4CCA]">BATTLE-TESTED INVENTORY</h1>
        <p className="text-neutral-600">Power up with authentic Z-Fighter equipment</p>
      </div>

      {/* Filters (kept, but non-search) */}
      <div className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 mb-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Power Level Filter</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <button onClick={() => setPlFilter(null)} className={`px-3 py-1 rounded ${plFilter === null ? "bg-[#3B4CCA] text-white" : "bg-[#F3F4F6]"}`}>All</button>
                <button onClick={() => setPlFilter(1000)} className={`px-3 py-1 rounded ${plFilter === 1000 ? "bg-[#3B4CCA] text-white" : "bg-[#F3F4F6]"}`}>1k+</button>
                <button onClick={() => setPlFilter(5000)} className={`px-3 py-1 rounded ${plFilter === 5000 ? "bg-[#3B4CCA] text-white" : "bg-[#F3F4F6]"}`}>5k+</button>
              </div>
              <button
                className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-4 py-2 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow"
                type="button"
                onClick={() => setPlFilter(null)}
              >
                RESET
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Category</h3>
            <div className="space-y-2">
              {/* static labels for visual grouping; real category controls belong in global nav */}
              {["☄️ Weapons", "👕 Clothing", "🍃 Consumables", "📡 Tech"].map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <span className="bg-[#3B4CCA] text-white px-2 py-1 rounded text-sm">{cat}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg mb-4 text-[#3B4CCA] font-bold">Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-4 py-2 border-2 border-[#3B4CCA] rounded focus:ring-2 focus:ring-[#FFD700]">
              <option value="pl-desc">PL: High to Low</option>
              <option value="pl-asc">PL: Low to High</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
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
          {filteredFeatured.map((item) => (
            <div key={item.id} className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 hover:shadow-xl hover:border-[#FF9E00] transition-all">
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
                onClick={() => addToCartLocal(item, setCartCount)}
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
          {filteredCapsules.map((item) => (
            <div key={item.id} className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-4 hover:shadow-xl hover:border-[#FF9E00] transition-all">
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
                className={`w-full py-2 rounded text-sm transition-all shadow ${item.status === "Destroyed" ? "bg-neutral-300 text-neutral-600 cursor-not-allowed" : "bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black"}`}
                disabled={item.status === "Destroyed"}
                type="button"
                onClick={() => item.status === "Destroyed" ? null : addToCartLocal(item, setCartCount)}
              >
                {item.status === "Destroyed" ? "DESTROYED" : "Add to Capsule"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/capsules" className="bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white px-8 py-3 rounded hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black transition-all shadow">
            MORE CAPSULES →
          </Link>
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
// ...existing code...