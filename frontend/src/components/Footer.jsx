import { Link } from "react-router-dom";
import { FaCapsules, FaFacebook, FaTwitter, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

function Footer({ className = "" }) {
  return (
    <footer
      className={`bg-neutral-900 text-white py-1 md:py-1 ${className} w-full bottom-0 left-0 z-50 sticky-footer`}
      style={{ position: 'static' }}
    >
      <div className="max-w-6xl mx-auto px-0 md:px-1">
        <div className="flex flex-col md:grid md:grid-cols-4 gap-1 md:gap-1">
          <div className="mb-1 md:mb-0">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-5 h-5 bg-gradient-to-br from-blue-300 via-white to-blue-500 rounded-full flex items-center justify-center shadow-md border border-blue-400">
                <FaCapsules className="text-blue-900 text-[10px]" />
              </div>
              <h5 className="font-saiyan text-xs tracking-widest font-extrabold text-blue-200 drop-shadow-sm" style={{letterSpacing:'0.12em'}}>CAPSULE CORP</h5>
            </div>
            <p className="text-neutral-400 text-xs mb-2">
              Founded by Dr. Brief, Capsule Corp has been Earth's leading technology company since Age 712.
            </p>
            {/* Contact Info */}
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
          <div className="mb-1 md:mb-0">
            <h6 className="mb-2 font-bold text-xs">Quick Links</h6>
            <ul className="space-y-1 text-xs text-neutral-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>
          <div className="mb-1 md:mb-0">
            <h6 className="mb-2 font-bold text-xs">Categories</h6>
            <ul className="space-y-1 text-xs text-neutral-400">
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
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
            </ul>
          </div>
          <div className="mb-1 md:mb-0">
            <h6 className="mb-2 font-bold text-xs">Connect</h6>
            <div className="flex space-x-2 mb-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebook className="text-[16px] hover:text-neutral-300 transition-colors" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter className="text-[16px] hover:text-neutral-300 transition-colors" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram className="text-[16px] hover:text-neutral-300 transition-colors" />
              </a>
            </div>
            {/* Removed 'Follow us for updates from Earth's greatest scientists!' */}
            {/* Silicon Valley Address removed */}
          </div>
        </div>
  <div className="border-t border-neutral-800 mt-1 md:mt-1 pt-1 md:pt-1 text-center relative">
    <p className="text-neutral-400 text-[10px] md:text-xs">
            © Age 762 Capsule Corporation. All rights reserved. No Saiyans were harmed in the making of this website.
          </p>
          <div className="absolute inset-0 border-2 border-dashed border-neutral-700 opacity-30 pointer-events-none"></div>
          {/* Sticky on desktop only */}
          <style>{`
            @media (min-width: 768px) {
              footer.sticky-footer {
                position: sticky !important;
                bottom: 0;
                margin-top: auto;
              }
            }
          `}</style>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
