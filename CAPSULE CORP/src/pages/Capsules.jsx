// ...existing code...
import React from "react";

const capsuleProducts = [
  {
    id: "alpha",
    name: "Alpha Capsule",
    tagline: "Compact storage. Maximum protection.",
    description:
      "A lightweight capsule engineered for everyday carry. Shock‑resistant polymer core with a hermetic seal to keep fragile contents safe.",
    features: ["Hermetic seal", "Shock‑absorbent shell", "Carry‑friendly"],
    link: "/products/alpha-capsule",
    priceCents: 2999,
    sku: "CAP-ALP-01",
    availability: "In stock",
    pl: "PL: 2,500",
  },
  {
    id: "beta",
    name: "Beta Capsule",
    tagline: "Balanced capacity for daily operators.",
    description:
      "Mid‑size capsule offering extra internal volume and modular inserts for organized storage. Ideal for tech and field kits.",
    features: ["Modular inserts", "Medium capacity", "IP67 rated"],
    link: "/products/beta-capsule",
    priceCents: 4499,
    sku: "CAP-BET-02",
    availability: "In stock",
    pl: "PL: 3,800",
  },
  {
    id: "omega",
    name: "Omega Capsule",
    tagline: "Industrial‑grade storage for extreme missions.",
    description:
      "Ruggedized alloy shell and thermal regulation for high‑stress environments. Ideal for long‑term stasis and hazardous transport.",
    features: ["Thermal regulation", "Alloy shell", "High capacity"],
    link: "/products/omega-capsule",
    priceCents: 12999,
    sku: "CAP-OMG-03",
    availability: "Limited",
    pl: "PL: 12,000",
  },
  {
    id: "senzu",
    name: "Senzu Capsule",
    tagline: "Premium. Fast access. Preserved vitality.",
    description:
      "Premium capsule with quick‑open latch and internal microclimate control. Designed for precious cargo that needs fast retrieval and stable storage.",
    features: ["Quick‑open latch", "Microclimate control", "Premium finish"],
    link: "/products/senzu-capsule",
    priceCents: 8999,
    sku: "CAP-SEN-04",
    availability: "Preorder",
    pl: "PL: 9,500",
  },
  {
    id: "titan",
    name: "Titan Capsule",
    tagline: "Maximum protection — for critical assets.",
    description:
      "Heavy‑duty containment engineered to survive severe impacts, fire exposure, and corrosive environments. For government and enterprise fleets.",
    features: ["Reinforced alloy", "Fire‑resistant lining", "Telemetry port"],
    link: "/products/titan-capsule",
    priceCents: 19999,
    sku: "CAP-TTN-05",
    availability: "Made to order",
    pl: "PL: 25,000",
  },
  {
    id: "micro",
    name: "Micro Capsule",
    tagline: "Tiny form. Big protection.",
    description:
      "Ultra‑compact capsule for delicate single items. Low profile design fits into pockets and specialized mounts.",
    features: ["Ultra‑compact", "Lightweight", "Secure foam insert"],
    link: "/products/micro-capsule",
    priceCents: 1999,
    sku: "CAP-MIC-06",
    availability: "In stock",
    pl: "PL: 1,800",
  },
];

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function Capsules({ cartCount, setCartCount }) {
  // provide safe fallback if parent doesn't pass setter
  const safeSetCart = typeof setCartCount === "function" ? setCartCount : () => {};

  const handleAddToCart = (product) => {
    safeSetCart((c) => (typeof c === "number" ? c + 1 : 1));
    // optional: basic feedback (toasts handled elsewhere)
    // e.g., toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-saiyan text-[#3B4CCA] mb-4">Capsules</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Explore Capsule Corp's lineup — from pocketable protection to mission‑critical containment.
          Each model is engineered for specific use cases with tested materials and precise engineering.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {capsuleProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white border-2 border-dashed border-[#3B4CCA] rounded-lg p-6 hover:shadow-xl hover:border-[#FF9E00] transition-all flex flex-col"
          >
            <div className="w-full h-32 bg-gradient-to-br from-[#EAF0FF] to-[#FDF3E6] rounded mb-4 flex items-center justify-center border-2 border-[#FF9E00] relative">
              <div className="text-center">
                <div className="text-xl font-semibold text-[#3B4CCA]">{p.name}</div>
                <div className="text-sm text-gray-500 mt-1">{p.tagline}</div>
              </div>
              <div className="absolute right-3 top-3 text-xs text-gray-600 bg-white/60 px-2 py-1 rounded">{p.sku}</div>
            </div>

            <p className="text-sm text-gray-600 mb-4 flex-1">{p.description}</p>

            <ul className="mb-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="text-sm text-gray-700 flex items-start">
                  <span className="inline-block mr-2 mt-0.5 w-3 h-3 bg-[#3B4CCA] rounded-full" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{p.pl}</div>
                <div className="text-sm font-medium text-gray-700">{p.availability}</div>
                <div className="text-lg text-[#FF9E00] font-bold">{formatPrice(p.priceCents)}</div>
              </div>

              <button
                type="button"
                onClick={() => handleAddToCart(p)}
                className="py-2 px-4 rounded text-sm transition-all shadow bg-gradient-to-r from-[#3B4CCA] to-[#FF9E00] text-white hover:from-[#FF9E00] hover:to-[#3B4CCA] hover:text-black"
              >
                Add to Capsule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Capsules;
// ...existing code...