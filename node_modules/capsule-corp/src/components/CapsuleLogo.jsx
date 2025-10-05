import React from "react";

function CapsuleLogo() {
  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
        {/* Capsule Corp SVG Logo */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Capsule Corp Logo"
        >
          <ellipse cx="24" cy="24" rx="20" ry="20" fill="#3B4CCA" />
          <ellipse cx="24" cy="24" rx="12" ry="12" fill="#fff" />
          <ellipse cx="24" cy="24" rx="6" ry="6" fill="#3B4CCA" />
        </svg>
      </div>
      <span className="mt-2 text-xl font-saiyan text-[#3B4CCA] tracking-wide drop-shadow font-bold uppercase">
        Capsule Corp.
      </span>
    </div>
  );
}

export default CapsuleLogo;