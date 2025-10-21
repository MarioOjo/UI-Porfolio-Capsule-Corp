import { Link } from "react-router-dom";
import { FaCapsules, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer({ className = "" }) {
  return (
    <footer className={`bg-neutral-900 text-white py-12 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FaCapsules className="text-neutral-900" />
              </div>
              <h5 className="font-saiyan text-lg tracking-wide">CAPSULE CORP.</h5>
            </div>
            <p className="text-neutral-400 text-sm mb-4">
              Founded by Dr. Brief, Capsule Corp. has been Earth's leading technology company since Age 712.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <FaMapMarkerAlt className="text-neutral-500 text-xs" />
                <span className="text-neutral-400">Cupertino, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaPhone className="text-neutral-500 text-xs" />
                <span className="text-neutral-400">+1 (555) CAPSULE</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-neutral-500 text-xs" />
                <span className="text-neutral-400">capsulecorp.8999@gmail.com</span>
              </div>
            </div>
          </div>
          <div>
            <h6 className="mb-4 font-bold">Quick Links</h6>
            <ul className="space-y-2 text-sm text-neutral-400">
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
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-4 font-bold">Categories</h6>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link to="/battle-gear" className="hover:text-white transition-colors">Battle Armor</Link>
              </li>
              <li>
                <Link to="/training" className="hover:text-white transition-colors">Training Equipment</Link>
              </li>
              <li>
                <Link to="/capsules" className="hover:text-white transition-colors">Capsule Technology</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Accessories</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-4 font-bold">Connect</h6>
            <div className="flex space-x-4 mb-4">
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
            <p className="text-neutral-400 text-sm mb-4">
              Follow us for updates from Earth's greatest scientists!
            </p>
            {/* Silicon Valley Address */}
            <div className="text-xs text-neutral-500">
              <p className="font-semibold mb-1">Silicon Valley HQ:</p>
              <p>Capsule Corporation Tower</p>
              <p>10600 N De Anza Blvd</p>
              <p>Cupertino, CA 95014</p>
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center relative">
          <p className="text-neutral-400 text-sm">
            © Age 762 Capsule Corporation. All rights reserved. No Saiyans were harmed in the making of this website.
          </p>
          <div className="absolute inset-0 border-2 border-dashed border-neutral-700 opacity-30 pointer-events-none"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
