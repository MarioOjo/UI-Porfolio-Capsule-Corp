import { Link } from "react-router-dom";
import { FaCapsules, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer({ className = "" }) {
  return (
    // keep footer part of page flow (App handles bottom placement via flex + min-h-screen)
    <footer className={`bg-neutral-900 text-white py-4 md:py-6 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center">
                <FaCapsules className="text-neutral-900" />
              </div>
              <h5 className="font-saiyan text-sm tracking-wide">CAPSULE CORP</h5>
            </div>
            <p className="text-neutral-400 text-[11px] mb-2">
              Founded by Dr. Brief — Earth's leading tech since Age 712.
            </p>
            {/* Contact Info (compact) */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-neutral-500 text-[10px]" />
                <span className="text-neutral-400">Cupertino, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-neutral-500 text-[10px]" />
                <span className="text-neutral-400">+1 (555) CAPSULE</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-neutral-500 text-[10px]" />
                <span className="text-neutral-400">capsulecorp.8999@gmail.com</span>
              </div>
            </div>
          </div>
          <div>
            <h6 className="mb-1 font-semibold text-sm">Quick Links</h6>
            <ul className="space-y-1 text-sm text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/battle-gear" className="hover:text-white transition-colors">Battle Gear</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-white transition-colors">Training</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-1 font-semibold text-sm">Categories</h6>
            <ul className="space-y-1 text-sm text-neutral-400">
              <li>
                <Link to="/battle-gear" className="hover:text-white transition-colors">Battle Armor</Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-white transition-colors">Training Equipment</Link>
              </li>
              <li>
                <Link to="/capsules" className="hover:text-white transition-colors">Capsule Tech</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Accessories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-1 font-semibold text-sm">Connect</h6>
            <div className="flex space-x-3 mb-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-lg hover:text-neutral-300 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-lg hover:text-neutral-300 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-lg hover:text-neutral-300 transition-colors" />
              </a>
            </div>
            <p className="text-neutral-400 text-[11px] mb-1">
              Follow us for product updates and promos.
            </p>
            {/* Address details are intentionally small and hidden on very small screens */}
            <div className="text-[10px] text-neutral-500 hidden sm:block">
              <p className="font-semibold mb-1">Silicon Valley HQ</p>
              <p>Capsule Corporation Tower</p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-4 pt-3 text-center">
          <p className="text-neutral-400 text-[11px]">
            © Age 762 Capsule Corporation. All rights reserved.
          </p>
          <p className="text-neutral-500 text-[10px] mt-1">
            Portfolio Project Designed & Developed by Mario Ojo
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
