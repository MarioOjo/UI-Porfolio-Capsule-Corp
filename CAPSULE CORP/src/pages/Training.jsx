import React from "react";

const trainingProducts = [
  {
    id: "gravity-chamber",
    name: "Gravity Chamber",
    tagline: "Adjustable gravity simulator for testing and training.",
    description:
      "Enclosed chamber with precision-controlled gravity settings (0.1–2.0g) for stress-testing capsules and hands‑on training under variable loads. Includes integrated monitoring ports, safety interlocks, and data export for compliance and analysis.",
    features: ["Adjustable gravity (0.1–2.0g)", "Safety interlocks", "Integrated monitoring & data export"],
    link: "/products/gravity-chamber",
    priceCents: 1500000,
    sku: "TRN-GRC-00",
    availability: "Made to order",
    pl: "PL: 85,000",
  },
  {
    id: "training-kit",
    name: "Training Kit",
    tagline: "All-in-one maintenance & training starter.",
    description:
      "A compact kit containing demo seals, sample foams, inspection tools and a printed quick-start manual — perfect for workshops and hands-on demos.",
    features: ["Demo seals", "Inspection tools", "Quick-start manual"],
    link: "/products/training-kit",
    priceCents: 9900,
    sku: "TRN-KIT-01",
    availability: "In stock",
    pl: "PL: 8,500",
  },
  {
    id: "seal-repair-set",
    name: "Seal Repair Set",
    tagline: "Replacement seals and repair essentials.",
    description:
      "Replacement O‑rings, adhesive pads and spares designed to match Capsule Corp sealing tolerances. Includes a precision tool for safe removal and install.",
    features: ["Replacement O‑rings", "Precision tool", "Adhesive pads"],
    link: "/products/seal-repair-set",
    priceCents: 2499,
    sku: "TRN-SRS-02",
    availability: "In stock",
    pl: "PL: 2,000",
  },
  {
    id: "climate-monitor",
    name: "Climate Monitor Module",
    tagline: "Mini telemetry for internal conditions.",
    description:
      "Compact battery-powered module that logs temperature and humidity inside a capsule. Bluetooth sync and CSV export for audits and training records.",
    features: ["Temp & humidity", "Bluetooth export", "Battery powered"],
    link: "/products/climate-monitor",
    priceCents: 6999,
    sku: "TRN-CLM-03",
    availability: "Limited",
    pl: "PL: 6,000",
  },
  {
    id: "diagnostic-toolkit",
    name: "Diagnostic Toolkit",
    tagline: "Lab-grade leak and stress diagnostics.",
    description:
      "Portable diagnostic kit with pressure tester, vacuum gauge and leak detection kit. Built for field service engineers and classroom demonstrations.",
    features: ["Pressure tester", "Vacuum gauge", "Leak dye kit"],
    link: "/products/diagnostic-toolkit",
    priceCents: 14999,
    sku: "TRN-DTK-04",
    availability: "Preorder",
    pl: "PL: 12,000",
  },
  {
    id: "enterprise-telemetry",
    name: "Enterprise Telemetry Pack",
    tagline: "Fleet-grade telemetry & integration bundle.",
    description:
      "Industrial telemetry pack with long-range radio, encrypted reporting and SDK access for fleet management and training simulators.",
    features: ["Long-range radio", "Encrypted reports", "SDK access"],
    link: "/products/enterprise-telemetry",
    priceCents: 49900,
    sku: "TRN-ETP-05",
    availability: "Made to order",
    pl: "PL: 45,000",
  },
  {
    id: "field-maintenance-case",
    name: "Field Maintenance Case",
    tagline: "Complete mobile repair station for capsules.",
    description:
      "Heavy-duty case with organized compartments for all essential tools, spare parts, and diagnostic equipment for on-site capsule maintenance.",
    features: ["Organized compartments", "Essential tools", "Spare parts kit"],
    link: "/products/field-maintenance-case",
    priceCents: 17999,
    sku: "TRN-FMC-06",
    availability: "In stock",
    pl: "PL: 15,000",
  },
];

function formatPrice(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function Training({ cartCount, setCartCount }) {
  const safeSetCart = typeof setCartCount === "function" ? setCartCount : () => {};

  const handleAddToCart = (product) => {
    safeSetCart((c) => (typeof c === "number" ? c + 1 : 1));
  };

  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-saiyan text-[#3B4CCA] mb-4">Training Products</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Professional training equipment and maintenance tools for Capsule Corp technicians. 
          Designed to support hands-on learning and ensure optimal capsule performance in the field.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainingProducts.map((p) => (
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
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Training;