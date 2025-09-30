import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaRocket, FaUserAlt, FaPaperPlane } from 'react-icons/fa';

function Contact() {
  const { isDarkMode } = useTheme();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      addNotification('Message sent successfully! Our Z-Fighter support team will respond within 24 hours.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-orange-50'}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-12 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-saiyan">
                CONTACT CAPSULE CORP
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Need assistance with your gear? Our legendary support team is here to help!
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
            <h2 className={`text-3xl font-bold font-saiyan mb-8 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              GET IN TOUCH
            </h2>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#3B4CCA] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-lg" />
                </div>
                <div>
                  <h3 className={`font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    HEADQUARTERS
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Capsule Corporation Tower<br />
                    10600 N De Anza Blvd<br />
                    Cupertino, CA 95014<br />
                    Silicon Valley, California
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaPhone className="text-white text-lg" />
                </div>
                <div>
                  <h3 className={`font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    PHONE
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    +1 (555) CAPSULE<br />
                    +1 (555) 227-7853
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white text-lg" />
                </div>
                <div>
                  <h3 className={`font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    EMAIL
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    support@capsulecorp.com<br />
                    sales@capsulecorp.com
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaClock className="text-white text-lg" />
                </div>
                <div>
                  <h3 className={`font-bold font-saiyan ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    BUSINESS HOURS
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Monday - Friday: 8:00 AM - 6:00 PM PST<br />
                    Saturday: 9:00 AM - 4:00 PM PST<br />
                    Sunday: Emergency Support Only
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Note */}
            <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <FaRocket className="text-orange-500" />
                <h4 className={`font-bold font-saiyan ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
                  EMERGENCY SUPPORT
                </h4>
              </div>
              <p className={`text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                For planet-threatening emergencies, our 24/7 Z-Fighter hotline is always available!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-2xl shadow-lg p-8 ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
            <h2 className={`text-3xl font-bold font-saiyan mb-8 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              SEND MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  NAME *
                </label>
                <div className="relative">
                  <FaUserAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  EMAIL *
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-all ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  SUBJECT *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="What can we help you with?"
                />
              </div>

              <div>
                <label className={`block text-sm font-bold mb-2 font-saiyan ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg border-2 transition-all resize-none ${
                    isDarkMode 
                      ? 'bg-slate-700 border-slate-600 text-white focus:border-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } focus:ring-2 focus:ring-blue-500`}
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-bold font-saiyan text-lg transition-all ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B4CCA] to-blue-600 hover:from-blue-600 hover:to-[#3B4CCA] transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>SENDING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FaPaperPlane />
                    <span>SEND MESSAGE</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className={`mt-12 rounded-2xl shadow-lg overflow-hidden ${isDarkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-blue-100'}`}>
          <div className="p-8 pb-0">
            <h2 className={`text-3xl font-bold font-saiyan mb-4 ${isDarkMode ? 'text-white' : 'text-[#3B4CCA]'}`}>
              FIND US IN SILICON VALLEY
            </h2>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Visit our headquarters in the heart of Silicon Valley, where innovation meets Saiyan technology.
            </p>
          </div>
          <div className="h-96 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01479868467422!3d37.33233377983394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb596e9cc9af7%3A0x3b0d8391510688!2s10600%20N%20De%20Anza%20Blvd%2C%20Cupertino%2C%20CA%2095014!5e0!3m2!1sen!2sus!4v1632847293257!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Capsule Corp Headquarters Location"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;