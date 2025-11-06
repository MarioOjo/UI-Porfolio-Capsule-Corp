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

      // Backend returns { message: '...', data: {...} } on success (201 status)
      if (response.message || response.data) {
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
        throw new Error('Failed to send message');
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
    <div className={`min-h-screen ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className={`rounded-2xl shadow-2xl overflow-hidden mb-8 sm:mb-16 ${themeClasses.card}`}>
          <div className="bg-gradient-to-r from-[#3B4CCA] to-blue-600 px-6 sm:px-8 lg:px-12 py-12 sm:py-16 lg:py-20">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 font-saiyan leading-tight">
                CONTACT CAPSULE CORP
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Need assistance with your gear? Our legendary support team is here to help!
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Fixed responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 lg:mb-16">
          {/* Contact Information */}
          <div className={`rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 ${themeClasses.card} transition-all duration-300 hover:shadow-2xl`}>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan mb-8 lg:mb-12 ${themeClasses.text.brand}`}>
              GET IN TOUCH
            </h2>

            <div className="space-y-6 lg:space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-4 lg:space-x-6 group">
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg`}>
                    <item.icon className="text-white text-lg lg:text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold font-saiyan text-lg lg:text-xl mb-2 ${themeClasses.text.primary} group-hover:text-blue-400 transition-colors duration-300`}>
                      {item.title}
                    </h3>
                    <p className={`text-sm lg:text-base whitespace-pre-line leading-relaxed ${themeClasses.text.secondary}`}>
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Emergency Note */}
            <div className={`mt-8 lg:mt-12 p-4 lg:p-6 rounded-xl border-2 ${
              isDarkMode ? 'bg-orange-900/20 border-orange-500/40' : 'bg-orange-50 border-orange-200'
            } transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <FaRocket className="text-white text-sm lg:text-base" />
                </div>
                <h4 className={`font-bold font-saiyan text-lg lg:text-xl ${
                  isDarkMode ? 'text-orange-400' : 'text-orange-800'
                }`}>
                  EMERGENCY SUPPORT
                </h4>
              </div>
              <p className={`text-sm lg:text-base leading-relaxed ${isDarkMode ? 'text-orange-300' : 'text-orange-700'}`}>
                For planet-threatening emergencies, our 24/7 Z-Fighter hotline is always available! 
                Immediate response guaranteed.
              </p>
            </div>

            {/* Trust Badge */}
            <div className={`mt-6 lg:mt-8 p-4 lg:p-6 rounded-xl border ${
              isDarkMode ? 'bg-green-900/20 border-green-500/40' : 'bg-green-50 border-green-200'
            } transition-all duration-300 hover:shadow-lg`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <FaShieldAlt className="text-white text-sm lg:text-base" />
                </div>
                <span className={`font-saiyan text-base lg:text-lg ${
                  isDarkMode ? 'text-green-400' : 'text-green-800'
                }`}>
                  TRUSTED BY Z-FIGHTERS SINCE AGE 712
                </span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 ${themeClasses.card} transition-all duration-300 hover:shadow-2xl`}>
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan mb-8 lg:mb-12 ${themeClasses.text.brand}`}>
              SEND MESSAGE
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              <div>
                <label className={`block text-sm lg:text-base font-bold mb-3 font-saiyan ${themeClasses.text.secondary}`}>
                  NAME *
                </label>
                <div className="relative">
                  <FaUserAlt className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } text-lg`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl border-2 transition-all text-base lg:text-lg ${
                      themeClasses.input
                    } ${touched.name && !formData.name ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20`}
                    placeholder="Enter your name"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm lg:text-base font-bold mb-3 font-saiyan ${themeClasses.text.secondary}`}>
                  EMAIL *
                </label>
                <div className="relative">
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  } text-lg`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full pl-12 pr-4 py-3 lg:py-4 rounded-xl border-2 transition-all text-base lg:text-lg ${
                      themeClasses.input
                    } ${touched.email && !formData.email ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20`}
                    placeholder="Enter your email"
                    aria-required="true"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm lg:text-base font-bold mb-3 font-saiyan ${themeClasses.text.secondary}`}>
                  SUBJECT *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full px-4 py-3 lg:py-4 rounded-xl border-2 transition-all text-base lg:text-lg ${
                    themeClasses.input
                  } ${touched.subject && !formData.subject ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20`}
                  placeholder="What can we help you with?"
                  aria-required="true"
                />
              </div>

              <div>
                <label className={`block text-sm lg:text-base font-bold mb-3 font-saiyan ${themeClasses.text.secondary}`}>
                  MESSAGE *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  required
                  rows="6"
                  className={`w-full px-4 py-3 lg:py-4 rounded-xl border-2 transition-all resize-none text-base lg:text-lg ${
                    themeClasses.input
                  } ${touched.message && !formData.message ? 'border-red-500' : 'border-transparent'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20`}
                  placeholder="Tell us about your inquiry, project, or how we can assist you..."
                  aria-required="true"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 lg:py-5 px-8 rounded-xl font-bold font-saiyan text-lg lg:text-xl transition-all kamehameha-glow relative overflow-hidden group ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#3B4CCA] to-blue-600 hover:from-blue-600 hover:to-[#3B4CCA] transform hover:scale-105'
                } text-white shadow-2xl disabled:transform-none disabled:hover:scale-100`}
                aria-busy={isSubmitting}
              >
                <div className="relative z-10 flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 lg:h-6 lg:w-6 border-b-2 border-white"></div>
                      <span>SENDING MESSAGE...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="text-sm lg:text-base transform group-hover:translate-x-1 transition-transform duration-300" />
                      <span>SEND MESSAGE</span>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#3B4CCA] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Form Note */}
              <div className={`text-center p-4 rounded-lg ${
                isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
              }`}>
                <p className={`text-sm lg:text-base ${themeClasses.text.muted}`}>
                  💡 We typically respond within 2-4 hours during business hours. 
                  <span className="block mt-1 font-semibold">Your message is important to us!</span>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className={`rounded-2xl shadow-xl overflow-hidden mb-12 lg:mb-16 ${themeClasses.card} transition-all duration-300 hover:shadow-2xl`}>
          <div className="p-6 sm:p-8 lg:p-12 pb-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan mb-3 ${themeClasses.text.brand}`}>
                  FIND US IN SILICON VALLEY
                </h2>
                <p className={`text-base lg:text-lg leading-relaxed ${themeClasses.text.secondary}`}>
                  Visit our headquarters in the heart of Silicon Valley, where innovation meets Saiyan technology. 
                  Home to the most advanced capsule technology in the universe.
                </p>
              </div>
              <div className={`px-4 py-3 rounded-lg ${
                isDarkMode ? 'bg-yellow-900/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <p className={`text-sm font-saiyan font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>
                  🚀 FREE PARKING AVAILABLE
                </p>
              </div>
            </div>
          </div>
          <div className="h-80 sm:h-96 lg:h-[500px] w-full">
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
              className="filter saturate-110 contrast-110"
            />
          </div>
        </div>

        {/* Support Promise */}
        <div className={`rounded-2xl p-6 sm:p-8 lg:p-12 text-center ${
          isDarkMode ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
        } shadow-xl transition-all duration-300 hover:shadow-2xl`}>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <FaHeadset className="text-white text-2xl lg:text-3xl" />
            </div>
            <h3 className={`font-saiyan font-bold text-2xl sm:text-3xl lg:text-4xl ${
              isDarkMode ? 'text-blue-400' : 'text-blue-800'
            }`}>
              LEGENDARY SUPPORT PROMISE
            </h3>
          </div>
          <p className={`text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed ${themeClasses.text.secondary}`}>
            We're committed to providing Z-Fighter level support. Whether you're training for the World Martial Arts Tournament 
            or defending Earth from intergalactic threats, your satisfaction is our top priority!
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
            }`}>
              ⚡ 24/7 Emergency Support
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800'
            }`}>
              🛡️ Saiyan-Grade Security
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-800'
            }`}>
              🚀 Instant Response
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
Contact.displayName = 'ContactPage';

export default Contact;