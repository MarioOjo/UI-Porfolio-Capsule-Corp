import React from "react";

function CapsuleLogo() {
  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <div className="w-20 h-20 bg-gradient-to-br from-[#FFD700] to-[#FF9E00] rounded-full flex items-center justify-center shadow-lg border-4 border-white capsule-shadow">
        {/* You can use an SVG, image, or icon here */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="24" cy="24" rx="20" ry="20" fill="#3B4CCA" />
          <ellipse cx="24" cy="24" rx="12" ry="12" fill="#fff" />
          <ellipse cx="24" cy="24" rx="6" ry="6" fill="#3B4CCA" />
        </svg>
      </div>
      <span className="mt-2 text-xl font-saiyan text-blue-700 tracking-wide drop-shadow">
        Capsule Corp.
      </span>
    </div>
  );
}

export default CapsuleLogo;
// filepath: c:\Users\User\OneDrive\Desktop\UI-Porfolio-Capsule-Corp\CAPSULE CORP\src\components\CapsuleLogo.jsx