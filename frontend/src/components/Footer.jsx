import { Link } from "react-router-dom";
import { FaCapsules, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer({ className = "" }) {
  return (
    <>
      {/* Desktop/Large screens: original footer */}
      <footer className={`bg-neutral-900 text-white py-12 hidden md:block ${className}`}>
        <div className="max-w-6xl mx-auto px-4">
          {/* ...existing code... */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* ...existing code for desktop footer... */}
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center relative">
            <p className="text-neutral-400 text-sm">
              © Age 762 Capsule Corporation. All rights reserved. No Saiyans were harmed in the making of this website.
            </p>
            <div className="absolute inset-0 border-2 border-dashed border-neutral-700 opacity-30 pointer-events-none"></div>
          </div>
        </div>
      </footer>

      {/* Mobile/Small screens: compact footer */}
      <footer className={`bg-neutral-900 text-white py-4 px-2 block md:hidden ${className}`}>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
              <FaCapsules className="text-neutral-900 text-lg" />
            </div>
            <span className="font-saiyan text-base tracking-wide">CAPSULE CORP</span>
          </div>
          <div className="flex space-x-4 mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebook className="text-xl hover:text-neutral-300 transition-colors" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter className="text-xl hover:text-neutral-300 transition-colors" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-xl hover:text-neutral-300 transition-colors" />
            </a>
          </div>
          {/* Collapsible menu for links */}
          <details className="w-full mb-2">
            <summary className="text-neutral-400 text-sm py-1 px-2 rounded cursor-pointer bg-neutral-800">More Links</summary>
            <div className="flex flex-col gap-2 py-2">
              <Link to="/" className="text-neutral-400 hover:text-white text-sm">Home</Link>
              <Link to="/battle-gear" className="text-neutral-400 hover:text-white text-sm">Battle Gear</Link>
              <Link to="/products" className="text-neutral-400 hover:text-white text-sm">Products</Link>
              <Link to="/training" className="text-neutral-400 hover:text-white text-sm">Training</Link>
              <Link to="/contact" className="text-neutral-400 hover:text-white text-sm">Contact Us</Link>
              <Link to="/capsules" className="text-neutral-400 hover:text-white text-sm">Capsule Technology</Link>
              <Link to="/about" className="text-neutral-400 hover:text-white text-sm">About Us</Link>
            </div>
          </details>
          <p className="text-neutral-400 text-xs text-center mt-2">
            © Age 762 Capsule Corporation. All rights reserved.<br />No Saiyans were harmed in the making of this website.
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;
