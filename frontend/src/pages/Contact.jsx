import React, { useState, useCallback, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from '../utils/api';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaRocket, 
  FaUserAlt, 
  FaPaperPlane,
  FaShieldAlt,
  FaHeadset 
} from 'react-icons/fa';

function Contact() {
  const { isDarkMode } = useTheme();
  const { showSuccess, showError } = useNotifications();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.displayName || user?.email?.split('@')[0] || '',
    email: user?.email || '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // Pre-fill user data if authenticated
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || user.email?.split('@')[0] || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          user_id: user?.id || null,
          timestamp: new Date().toISOString()
        })
      });

      if (response.success) {
        showSuccess('✅ Message sent successfully! Our Z-Fighter support team will respond within 24 hours.', {
          duration: 5000,
          position: 'top-center'
        });
        setFormData({ 
          name: user?.displayName || user?.email?.split('@')[0] || '', 
          email: user?.email || '', 
          subject: '', 
          message: '' 
        });
        setTouched({});
        
        // Track contact form submission
        if (window.gtag) {
          window.gtag('event', 'contact_form_submit', {
            event_category: 'engagement',
            event_label: 'contact_page'
          });
        }
      } else {
        throw new Error(response.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      showError('❌ Failed to send message. Please try again or contact us directly at capsulecorp.8999@gmail.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-blue-50 to-orange-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-blue-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-900',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-700',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
      brand: isDarkMode ? 'text-blue-400' : 'text-[#3B4CCA]'
    },
    input: isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "HEADQUARTERS",
      content: "Capsule Corporation Tower\n10600 N De Anza Blvd\nCupertino, CA 95014\nSilicon Valley, California",
      gradient: "from-[#3B4CCA] to-blue-600"
    },
    {
      icon: FaPhone,
      title: "PHONE",
      content: "+1 (555) CAPSULE\n+1 (555) 227-7853",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: FaEnvelope,
      title: "EMAIL",
      content: "capsulecorp.8999@gmail.com\nGeneral Inquiries & Support",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: FaClock,
      title: "BUSINESS HOURS",
      content: "Monday - Friday: 8:00 AM - 6:00 PM PST\nSaturday: 9:00 AM - 4:00 PM PST\nSunday: Emergency Support Only",
      gradient: "from-green-500 to-blue-500"
    }
  ];

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 sm:mb-12 ${themeClasses.card}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-4 sm:px-8 py-8 sm:py-12">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 font-saiyan leading-tight">
                CONTACT CAPSULE CORP
              </h1>
              <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Need assistance with your gear? Our legendary support team is here to help!
              </p>
            </div>
          </div>
        </div>

        <div className="mobile-grid gap-6 sm:gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 ${themeClasses.card}`}>
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan mb-6 sm:mb-8 ${themeClasses.text.brand}`}>
              GET IN TOUCH
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r ${item.gradient} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <item.icon className="text-white text-sm sm:text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold font-saiyan text-sm sm:text-base ${themeClasses.text.primary}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs sm:text-sm whitespace-pre-line ${themeClasses.text.secondary}`}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Note */}
            <div className={`mt-6 sm:mt-8 p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <FaRocket className="text-orange-500 text-sm sm:text-base" />
                <h4 className={`font-bold font-saiyan text-sm sm:text-base ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-800'
                }`}>
                  EMERGENCY SUPPORT
                </h4>
              </div>
              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                For planet-threatening emergencies, our 24/7 Z-Fighter hotline is always available!
              </p>
            </div>

            {/* Trust Badge */}
            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg ${
              isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-green-500 text-sm sm:text-base" />
                <span className={`font-saiyan text-xs sm:text-sm ${
                  isDarkMode ? 'text-green-400' : 'text-green-800'
                }`}>
                  TRUSTED BY Z-FIGHTERS SINCE AGE 712
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 ${themeClasses.card}`}>
            <h2 className={`text-2xl sm:text-3xl font-bold font-saiyan mb-6 sm:mb-8 ${themeClasses.text.brand}`}>
              SEND MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-2 font-saiyan ${themeClasses.text.secondary}`}>
                  NAME *
                </label>
                <div className="relative">
                  <FaUserAlt className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      themeClasses.input
                    } ${touched.name && !formData.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your name"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-2 font-saiyan ${themeClasses.text.secondary}`}>
                  EMAIL *
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                      themeClasses.input
                    } ${touched.email && !formData.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-2 font-saiyan ${themeClasses.text.secondary}`}>
                  SUBJECT *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-sm sm:text-base ${
                    themeClasses.input
                  } ${touched.subject && !formData.subject ? 'border-red-500' : ''}`}
                  placeholder="What can we help you with?"
                  aria-required="true"
                />
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-bold mb-2 font-saiyan ${themeClasses.text.secondary}`}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  rows="5"
                  className={`w-full px-4 py-2 sm:py-3 rounded-lg border-2 transition-all resize-none text-sm sm:text-base ${
                    themeClasses.input
                  } ${touched.message && !formData.message ? 'border-red-500' : ''}`}
                  placeholder="Tell us about your inquiry..."
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 px-6 rounded-lg font-bold font-saiyan text-sm sm:text-lg transition-all kamehameha-glow ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B4CCA] to-blue-600 hover:from-blue-600 hover:to-[#3B4CCA] transform hover:scale-105'
                } text-white shadow-lg disabled:transform-none disabled:hover:scale-100`}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span>SENDING...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FaPaperPlane className="text-xs sm:text-sm" />
                    <span>SEND MESSAGE</span>
                  </div>
                )}
              </button>

              {/* Form Note */}
              <p className={`text-xs ${themeClasses.text.muted} text-center`}>
                💡 We typically respond within 2-4 hours during business hours
              </p>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className={`mt-8 sm:mt-12 rounded-2xl shadow-lg overflow-hidden ${themeClasses.card}`}>
          <div className="p-4 sm:p-6 lg:p-8 pb-0">
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold font-saiyan mb-3 sm:mb-4 ${themeClasses.text.brand}`}>
              FIND US IN SILICON VALLEY
            </h2>
            <p className={`mb-4 sm:mb-6 text-sm sm:text-base ${themeClasses.text.secondary}`}>
              Visit our headquarters in the heart of Silicon Valley, where innovation meets Saiyan technology.
            </p>
          </div>
          <div className="h-64 sm:h-80 lg:h-96 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395304414!2d-122.01479868467422!3d37.33233377983394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fb596e9cc9af7%3A0x3b0d8391510688!2s10600%20N%20De%20Anza%20Blvd%2C%20Cupertino%2C%20CA%2095014!5e0!3m2!1sen!2sus!4v1632847293257!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Capsule Corp Headquarters Location"
              aria-label="Interactive map showing Capsule Corp headquarters location in Silicon Valley"
            />
          </div>
        </div>

        {/* Support Promise */}
        <div className={`mt-6 sm:mt-8 rounded-2xl p-4 sm:p-6 text-center ${
          isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FaHeadset className="text-blue-500 text-lg sm:text-xl" />
            <h3 className={`font-saiyan font-bold text-lg sm:text-xl ${
              isDarkMode ? 'text-blue-400' : 'text-blue-800'
            }`}>
              LEGENDARY SUPPORT PROMISE
            </h3>
          </div>
          <p className={`text-sm sm:text-base ${themeClasses.text.secondary}`}>
            We're committed to providing Z-Fighter level support. Your satisfaction is our top priority!
          </p>
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
Contact.displayName = 'ContactPage';

export default Contact;