import { FaCapsules, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12 mt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <FaCapsules className="text-neutral-900" />
              </div>
              <h5>CAPSULE CORP.</h5>
            </div>
            <p className="text-neutral-400 text-sm">
              Founded by Dr. Brief, Capsule Corp. has been Earth's leading technology company since Age 712.
            </p>
          </div>
          <div>
            <h6 className="mb-4">Quick Links</h6>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><span className="hover:text-white cursor-pointer">About Us</span></li>
              <li><span className="hover:text-white cursor-pointer">Products</span></li>
              <li><span className="hover:text-white cursor-pointer">Training Center</span></li>
              <li><span className="hover:text-white cursor-pointer">Support</span></li>
            </ul>
          </div>
          <div>
            <h6 className="mb-4">Categories</h6>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li><span className="hover:text-white cursor-pointer">Battle Armor</span></li>
              <li><span className="hover:text-white cursor-pointer">Training Equipment</span></li>
              <li><span className="hover:text-white cursor-pointer">Capsule Technology</span></li>
              <li><span className="hover:text-white cursor-pointer">Accessories</span></li>
            </ul>
          </div>
          <div>
            <h6 className="mb-4">Connect</h6>
            <div className="flex space-x-4 mb-4">
              <FaFacebook className="text-xl hover:text-neutral-300" />
              <FaTwitter className="text-xl hover:text-neutral-300" />
              <FaInstagram className="text-xl hover:text-neutral-300" />
            </div>
            <p className="text-neutral-400 text-sm">
              Follow us for updates from Earth's greatest scientists!
            </p>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center relative">
          <p className="text-neutral-400 text-sm">
            © Age 762 Capsule Corporation. All rights reserved. No Saiyans were harmed in the making of this website.
          </p>
          <div className="absolute inset-0 border-2 border-dashed border-neutral-700 opacity-30"></div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;