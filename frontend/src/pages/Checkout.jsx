import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt, FaCreditCard, FaUser, FaTruck, FaCheck, FaExclamationTriangle, FaImage, FaPaypal, FaGoogle } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import { useTheme } from "../contexts/ThemeContext";
import Price from "../components/Price";
import { resolveImageSrc } from '../utils/images';
import { useCurrency } from "../contexts/CurrencyContext";
import { apiFetch } from "../utils/api";

// Enhanced Image Component for Checkout
const CheckoutImage = ({ item, size = 120, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState("");

  useEffect(() => {
    if (item?.image) {
      setCurrentSrc(resolveImageSrc(item, size));
    }
  }, [item, size]);

  const handleError = () => {
    if (!imageError && item?.image) {
      // First try the original image directly
      setCurrentSrc(item.image);
      setImageError(true);
    } else {
      // Final fallback - show placeholder
      setCurrentSrc("");
    }
  };

  if (!currentSrc || imageError) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold rounded-lg`}>
        {item?.name ? (
          <>
            <FaImage className="text-sm mr-1" />
            <span className="text-xs">{item.name.charAt(0)}</span>
          </>
        ) : (
          <FaImage className="text-sm" />
        )}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={item?.name || "Product image"}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, authInitialized } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const { isDarkMode } = useTheme();
  const { currency, location, getAvailableCurrencies, CURRENCIES } = useCurrency();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    zipCode: '',
    country: location?.country || 'United States',
    
    // Payment Information
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: '',
    
    // Order Options
    shippingMethod: 'standard',
    paymentMethod: 'credit-card',
    promoCode: '',
    subscribeNewsletter: false,
    agreeToTerms: false,
    orderNotes: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Theme classes for consistent theming
  const themeClasses = {
    background: isDarkMode 
      ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
      : 'bg-gradient-to-br from-blue-50 to-orange-50',
    card: isDarkMode 
      ? 'bg-slate-800 border border-slate-700' 
      : 'bg-white border border-blue-100',
    text: {
      primary: isDarkMode ? 'text-white' : 'text-gray-800',
      secondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      muted: isDarkMode ? 'text-gray-400' : 'text-gray-500'
    },
    input: isDarkMode 
      ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20' 
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20'
  };

  // Pre-fill user data when authenticated
  useEffect(() => {
    if (user && authInitialized) {
      setFormData(prev => ({
        ...prev,
        fullName: user.full_name || user.displayName || prev.fullName,
        firstName: user.firstName || user.displayName?.split(' ')[0] || prev.firstName,
        lastName: user.lastName || user.displayName?.split(' ')[1] || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user, authInitialized]);

  // Fetch and pre-fill default address
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      if (!user || !authInitialized) return;
      
      try {
        const response = await apiFetch('/api/addresses');
        if (response.addresses && response.addresses.length > 0) {
          // Find default address or use first one
          const defaultAddr = response.addresses.find(addr => addr.is_default) || response.addresses[0];
          
          if (defaultAddr) {
            setFormData(prev => ({
              ...prev,
              address: defaultAddr.street || defaultAddr.address_line1 || prev.address,
              apartment: defaultAddr.line2 || defaultAddr.address_line2 || prev.apartment,
              city: defaultAddr.city || prev.city,
              state: defaultAddr.state || prev.state,
              zip: defaultAddr.postal_code || defaultAddr.zip || prev.zip,
              country: defaultAddr.country || prev.country
            }));
          }
        }
      } catch (error) {
        console.log('No saved addresses found or error fetching:', error.message);
      }
    };

    fetchDefaultAddress();
  }, [user, authInitialized]);

  // Update country when currency changes
  useEffect(() => {
    if (location?.country) {
      setFormData(prev => ({
        ...prev,
        country: location.country
      }));
    }
  }, [location]);

  // Redirect if not authenticated or cart is empty
  useEffect(() => {
    if (authInitialized && (!user || cartItems.length === 0)) {
      if (!user) {
        navigate('/auth');
      } else if (cartItems.length === 0) {
        navigate('/cart');
      }
    }
  }, [user, cartItems, authInitialized, navigate]);

  const { formatPrice } = useCurrency();
  
  // Calculate order totals with useMemo for performance
  const orderTotals = useMemo(() => {
    const subtotal = getCartTotal();
    const shippingCost = formData.shippingMethod === 'express' ? 49.99 : (subtotal > 500 ? 0 : 25.99);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;
    
    return { subtotal, shipping: shippingCost, tax, total };
  }, [getCartTotal, formData.shippingMethod]);

  const { subtotal, shipping, tax, total } = orderTotals;

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  // Format card number as user types
  const handleCardNumberChange = useCallback((e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    value = value.replace(/(.{4})/g, '$1 ').trim();
    
    setFormData(prev => ({
      ...prev,
      cardNumber: value
    }));
    
    if (errors.cardNumber) {
      setErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  }, [errors]);

  const validateStep = useCallback((step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required *';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required *';
      if (!formData.email.trim()) newErrors.email = 'Email is required *';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required *';
      if (!formData.address.trim()) newErrors.address = 'Address is required *';
      if (!formData.city.trim()) newErrors.city = 'City is required *';
      if (!formData.state.trim()) newErrors.state = 'State/Province is required *';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP/Postal code is required *';
      if (!formData.country) newErrors.country = 'Country is required *';
    }

    if (step === 2) {
      // Validate payment information
      if (formData.paymentMethod === 'credit-card') {
        const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
        if (!cleanCardNumber) newErrors.cardNumber = 'Card number is required *';
        else if (cleanCardNumber.length !== 16) newErrors.cardNumber = 'Card number must be 16 digits';
        else if (!/^\d+$/.test(cleanCardNumber)) newErrors.cardNumber = 'Card number must contain only digits';
        
        if (!formData.expiryMonth) newErrors.expiryMonth = 'Expiry month is required *';
        if (!formData.expiryYear) newErrors.expiryYear = 'Expiry year is required *';
        
        if (!formData.cvv) newErrors.cvv = 'CVV is required *';
        else if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV must be 3 or 4 digits';
        
        if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required *';
      }
    }

    if (step === 3) {
      if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions *';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      // Scroll to top on step change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep]);

  const handlePreviousStep = useCallback(() => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      // Ensure fullName is set from firstName + lastName if not already set
      const customerFullName = formData.fullName || `${formData.firstName} ${formData.lastName}`.trim();
      
      // Prepare order data for API
      const orderData = {
        user_id: user?.id || null,
        customer_name: customerFullName,
        customer_email: formData.email,
        customer_phone: formData.phone || null,
        shipping_address: {
          street: formData.address,
          line2: formData.apartment || null,
          city: formData.city,
          state: formData.state || '',
          postal_code: formData.zip || formData.zipCode,
          country: formData.country
        },
        billing_address: {
          street: formData.address,
          line2: formData.apartment || null,
          city: formData.city,
          state: formData.state || '',
          postal_code: formData.zip || formData.zipCode,
          country: formData.country
        },
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          slug: item.slug,
          image: item.image,
          category: item.category,
          power_level: item.powerLevel || 0,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: subtotal,
        shipping_cost: shipping,
        tax: tax,
        total: total,
        payment_method: formData.paymentMethod === 'credit-card' ? 'credit_card' : formData.paymentMethod,
        payment_status: 'pending',
        customer_notes: formData.orderNotes || null
      };

      // Call the backend API
      const response = await apiFetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      if (response.success) {
        // Clear cart and show success
        clearCart();
        showSuccess('🎉 Order placed successfully! Your capsules are being prepared for battle!', {
          title: 'ORDER CONFIRMED',
          duration: 5000,
          position: 'top-center'
        });
        
        // Track conversion
        if (window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: response.order_number,
            value: total,
            currency: currentCurrency,
            items: cartItems.map(item => ({
              item_id: item.id,
              item_name: item.name,
              price: item.price,
              quantity: item.quantity
            }))
          });
        }
        
        navigate('/order-confirmation', { 
          state: { 
            orderData: {
              ...orderData,
              order_number: response.order_number,
              order_id: response.order_id
            }
          },
          replace: true 
        });
      } else {
        throw new Error(response.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      // If backend returns field-specific errors, show them inline
      if (error && error.details && Array.isArray(error.details)) {
        const backendErrors = {};
        error.details.forEach(e => {
          if (e.field) backendErrors[e.field] = e.message;
        });
        setErrors(prev => ({ ...prev, ...backendErrors }));
        showError('Please fix the highlighted errors and try again.', {
          title: 'ORDER FAILED',
          duration: 4000
        });
      } else {
        showError(error.message || 'Failed to place order. Please try again.', {
          title: 'ORDER FAILED',
          duration: 4000
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', description: 'Delivery information', icon: FaTruck },
    { number: 2, title: 'Payment', description: 'Payment details', icon: FaCreditCard },
    { number: 3, title: 'Review', description: 'Confirm order', icon: FaCheck }
  ];

  // Get supported countries from currency context
  const supportedCountries = useMemo(() => {
    const currencyCountries = {
      'USD': ['United States', 'Puerto Rico', 'Guam'],
      'ZAR': ['South Africa'],
      'EUR': ['Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria', 'Ireland', 'Portugal'],
      'GBP': ['United Kingdom']
    };
    
    return Object.entries(currencyCountries).flatMap(([currency, countries]) => 
      countries.map(country => ({ name: country, currency }))
    );
  }, []);

  const shippingOptions = [
    {
      value: 'standard',
      label: 'Standard Shipping',
      description: '5-7 business days',
      price: subtotal > 500 ? 0 : 25.99,
      free: subtotal > 500
    },
    {
      value: 'express',
      label: 'Instant Transmission',
      description: '1-2 business days',
      price: 49.99,
      free: false
    }
  ];

  if (!authInitialized || !user || cartItems.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-0 ${themeClasses.background} overflow-x-hidden`}>
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold font-saiyan mb-2 ${themeClasses.text.primary}`}>
            SECURE CHECKOUT
          </h1>
          <p className={`text-sm sm:text-base ${themeClasses.text.secondary}`}>Complete your legendary purchase</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8 sm:mb-12 overflow-x-auto pb-4">
          <div className="flex items-center space-x-4 sm:space-x-8 min-w-max px-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all text-sm sm:text-base ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                      : `${
                          isDarkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                        }`
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : <step.icon />}
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`font-medium text-xs sm:text-sm whitespace-nowrap ${themeClasses.text.primary}`}>
                      {step.title}
                    </div>
                    <div className={`text-xs ${themeClasses.text.muted} hidden sm:block`}>
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-16 h-1 mx-2 sm:mx-4 ${
                    currentStep > step.number 
                      ? 'bg-orange-400' 
                      : isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className={`rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 ${themeClasses.card}`}>
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold font-saiyan mb-4 sm:mb-6 flex items-center ${themeClasses.text.primary}`}>
                    <FaTruck className="mr-3 text-orange-500" />
                    SHIPPING INFORMATION
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {[
                      { name: 'firstName', label: 'First Name *', type: 'text', placeholder: 'Enter your first name' },
                      { name: 'lastName', label: 'Last Name *', type: 'text', placeholder: 'Enter your last name' },
                      { name: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com' },
                      { name: 'phone', label: 'Phone *', type: 'tel', placeholder: '(555) 123-4567' },
                      { name: 'address', label: 'Address *', type: 'text', placeholder: '123 Main Street', fullWidth: true },
                      { name: 'city', label: 'City *', type: 'text', placeholder: 'West City' },
                      { name: 'state', label: 'State/Province *', type: 'text', placeholder: 'CA' },
                      { name: 'zipCode', label: 'ZIP/Postal Code *', type: 'text', placeholder: '12345' },
                    ].map((field) => (
                      <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
                        <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                          {field.label}
                        </label>
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          onBlur={handleBlur}
                          className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                            themeClasses.input
                          } ${errors[field.name] ? 'border-red-500 focus:ring-red-200' : ''}`}
                          placeholder={field.placeholder}
                        />
                        {errors[field.name] && (
                          <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                            <FaExclamationTriangle className="mr-1" />
                            {errors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
                    
                    {/* Country Selector */}
                    <div className="md:col-span-2">
                      <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                          themeClasses.input
                        } ${errors.country ? 'border-red-500 focus:ring-red-200' : ''}`}
                      >
                        <option value="">Select Country</option>
                        {supportedCountries.map((country) => (
                          <option key={country.name} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                          <FaExclamationTriangle className="mr-1" />
                          {errors.country}
                        </p>
                      )}
                      <p className={`text-xs mt-2 ${themeClasses.text.muted}`}>
                        💡 Select your country for shipping. Additional countries coming soon!
                      </p>
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="mt-6 sm:mt-8">
                    <h3 className={`text-lg font-bold mb-4 ${themeClasses.text.primary}`}>Shipping Method</h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label 
                          key={option.value}
                          className={`flex items-center p-3 sm:p-4 border rounded-xl cursor-pointer transition-all ${
                            formData.shippingMethod === option.value
                              ? isDarkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-200'
                              : isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={option.value}
                            checked={formData.shippingMethod === option.value}
                            onChange={handleInputChange}
                            className="mr-3 sm:mr-4"
                          />
                          <div className="flex-1">
                            <div className={`font-medium text-sm sm:text-base ${themeClasses.text.primary}`}>
                              {option.label}
                            </div>
                            <div className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>
                              {option.description}
                            </div>
                          </div>
                          <div className={`font-bold text-sm sm:text-base ${
                            option.free ? 'text-green-500' : 'text-orange-500'
                          }`}>
                            {option.free ? 'FREE' : <Price value={option.price} />}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold font-saiyan mb-4 sm:mb-6 flex items-center ${themeClasses.text.primary}`}>
                    <FaCreditCard className="mr-3 text-orange-500" />
                    PAYMENT INFORMATION
                  </h2>

                  <div className="space-y-6">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'credit-card', label: 'Credit Card', icon: FaCreditCard },
                        { id: 'paypal', label: 'PayPal', icon: FaPaypal },
                        { id: 'google_pay', label: 'Google Pay', icon: FaGoogle },
                      ].map((method) => (
                        <div
                          key={method.id}
                          onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                          className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center space-y-2 ${
                            formData.paymentMethod === method.id
                              ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                              : `${isDarkMode ? 'border-slate-600 hover:border-slate-500' : 'border-gray-200 hover:border-gray-300'}`
                          }`}
                        >
                          <method.icon className={`text-2xl ${
                            formData.paymentMethod === method.id ? 'text-orange-500' : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            formData.paymentMethod === method.id ? 'text-orange-600' : themeClasses.text.secondary
                          }`}>
                            {method.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Credit Card Form */}
                    {formData.paymentMethod === 'credit-card' && (
                      <div className="space-y-4 sm:space-y-6 animate-fadeIn">
                        {[
                          { 
                            name: 'cardNumber', 
                            label: 'Card Number *', 
                            type: 'text', 
                            placeholder: '1234 5678 9012 3456',
                            onChange: handleCardNumberChange
                          },
                          { 
                            name: 'nameOnCard', 
                            label: 'Name on Card *', 
                            type: 'text', 
                            placeholder: 'John Doe' 
                          },
                        ].map((field) => (
                          <div key={field.name}>
                            <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                              {field.label}
                            </label>
                            <input
                              type={field.type}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={field.onChange || handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                                themeClasses.input
                              } ${errors[field.name] ? 'border-red-500 focus:ring-red-200' : ''}`}
                              placeholder={field.placeholder}
                            />
                            {errors[field.name] && (
                              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" />
                                {errors[field.name]}
                              </p>
                            )}
                          </div>
                        ))}

                        <div className="grid grid-cols-3 gap-3 sm:gap-4">
                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                              Month *
                            </label>
                            <select
                              name="expiryMonth"
                              value={formData.expiryMonth}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                                themeClasses.input
                              } ${errors.expiryMonth ? 'border-red-500 focus:ring-red-200' : ''}`}
                            >
                              <option value="">MM</option>
                              {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                  {String(i + 1).padStart(2, '0')}
                                </option>
                              ))}
                            </select>
                            {errors.expiryMonth && (
                              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" />
                                {errors.expiryMonth}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                              Year *
                            </label>
                            <select
                              name="expiryYear"
                              value={formData.expiryYear}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                                themeClasses.input
                              } ${errors.expiryYear ? 'border-red-500 focus:ring-red-200' : ''}`}
                            >
                              <option value="">YYYY</option>
                              {Array.from({ length: 10 }, (_, i) => (
                                <option key={i} value={new Date().getFullYear() + i}>
                                  {new Date().getFullYear() + i}
                                </option>
                              ))}
                            </select>
                            {errors.expiryYear && (
                              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" />
                                {errors.expiryYear}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            <label className={`block text-xs sm:text-sm font-medium mb-2 ${themeClasses.text.secondary}`}>
                              CVV *
                            </label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              onBlur={handleBlur}
                              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all text-sm sm:text-base ${
                                themeClasses.input
                              } ${errors.cvv ? 'border-red-500 focus:ring-red-200' : ''}`}
                              placeholder="123"
                              maxLength="4"
                            />
                            {errors.cvv && (
                              <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                                <FaExclamationTriangle className="mr-1" />
                                {errors.cvv}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PayPal Mock UI */}
                    {formData.paymentMethod === 'paypal' && (
                      <div className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center space-y-4 animate-fadeIn ${
                        isDarkMode ? 'border-slate-600 bg-slate-800/50' : 'border-gray-300 bg-gray-50'
                      }`}>
                        <FaPaypal className="text-5xl text-[#003087]" />
                        <div className="text-center">
                          <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>Pay with PayPal</h3>
                          <p className={`text-sm ${themeClasses.text.muted}`}>
                            You will be redirected to PayPal to complete your purchase securely.
                          </p>
                        </div>
                        <button className="px-6 py-2 bg-[#003087] text-white rounded-full font-bold hover:bg-[#001c64] transition-colors">
                          Connect PayPal Account
                        </button>
                      </div>
                    )}

                    {/* Google Pay Mock UI */}
                    {formData.paymentMethod === 'google_pay' && (
                      <div className={`p-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center space-y-4 animate-fadeIn ${
                        isDarkMode ? 'border-slate-600 bg-slate-800/50' : 'border-gray-300 bg-gray-50'
                      }`}>
                        <FaGoogle className="text-5xl text-red-500" />
                        <div className="text-center">
                          <h3 className={`font-bold text-lg ${themeClasses.text.primary}`}>Pay with Google Pay</h3>
                          <p className={`text-sm ${themeClasses.text.muted}`}>
                            Complete your purchase using your saved Google Pay methods.
                          </p>
                        </div>
                        <button className="px-6 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors flex items-center">
                          <FaGoogle className="mr-2" /> Pay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div>
                  <h2 className={`text-xl sm:text-2xl font-bold font-saiyan mb-4 sm:mb-6 flex items-center ${themeClasses.text.primary}`}>
                    <FaCheck className="mr-3 text-orange-500" />
                    REVIEW ORDER
                  </h2>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className={`text-lg font-bold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>Order Items</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                            isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                              <CheckoutImage 
                                item={item}
                                size={160}
                                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                              />
                              <div>
                                <div className={`font-medium text-sm sm:text-base ${themeClasses.text.primary}`}>
                                  {item.name}
                                </div>
                                <div className={`text-xs sm:text-sm ${themeClasses.text.muted}`}>
                                  Qty: {item.quantity}
                                </div>
                                {item.category && (
                                  <div className={`text-xs ${themeClasses.text.muted}`}>
                                    {item.category}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className={`font-bold text-sm sm:text-base text-orange-500`}>
                              <Price value={parseFloat(item.price) * item.quantity} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className={`text-lg font-bold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>Shipping Address</h3>
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className={themeClasses.text.primary}>{formData.firstName} {formData.lastName}</div>
                        <div className={themeClasses.text.secondary}>{formData.address}</div>
                        <div className={themeClasses.text.secondary}>{formData.city}, {formData.state} {formData.zipCode}</div>
                        <div className={themeClasses.text.secondary}>{formData.country}</div>
                        <div className={themeClasses.text.secondary}>{formData.phone}</div>
                        <div className={themeClasses.text.secondary}>{formData.email}</div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className={`text-lg font-bold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>Payment Method</h3>
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className={themeClasses.text.primary}>Credit Card ending in {formData.cardNumber.slice(-4)}</div>
                        <div className={themeClasses.text.secondary}>{formData.nameOnCard}</div>
                        <div className={themeClasses.text.secondary}>
                          Expires: {formData.expiryMonth}/{formData.expiryYear}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className={`text-lg font-bold mb-3 sm:mb-4 ${themeClasses.text.primary}`}>Shipping Method</h3>
                      <div className={`p-3 sm:p-4 rounded-xl ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      }`}>
                        <div className={themeClasses.text.primary}>
                          {shippingOptions.find(opt => opt.value === formData.shippingMethod)?.label}
                        </div>
                        <div className={themeClasses.text.secondary}>
                          {shippingOptions.find(opt => opt.value === formData.shippingMethod)?.description}
                        </div>
                        <div className={`font-medium ${shipping === 0 ? 'text-green-500' : 'text-orange-500'}`}>
                          {shipping === 0 ? 'FREE' : <Price value={shipping} />}
                        </div>
                      </div>
                    </div>

                    {/* Terms Agreement */}
                    <div>
                      <label className={`flex items-start space-x-3 p-3 sm:p-4 rounded-xl ${
                        isDarkMode ? 'bg-slate-700' : 'bg-gray-50'
                      } ${errors.agreeToTerms ? 'border border-red-500' : ''}`}>
                        <input
                          type="checkbox"
                          name="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange}
                          className="mt-1"
                        />
                        <div>
                          <div className={`font-medium text-sm sm:text-base ${themeClasses.text.primary}`}>
                            I agree to the Terms of Service and Privacy Policy
                          </div>
                          <div className={`text-xs sm:text-sm ${themeClasses.text.muted} mt-1`}>
                            By placing this order, you agree to our terms and conditions
                          </div>
                          {errors.agreeToTerms && (
                            <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                              <FaExclamationTriangle className="mr-1" />
                              {errors.agreeToTerms}
                            </p>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-600">
                {currentStep > 1 && (
                  <button
                    onClick={handlePreviousStep}
                    className={`px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-xl font-medium text-sm sm:text-base transition-colors ${
                      isDarkMode 
                        ? 'border-slate-600 text-gray-300 hover:bg-slate-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className={`px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-bold transition-all hover:scale-105 kamehameha-glow text-sm sm:text-base ${
                      currentStep === 1 ? 'ml-auto' : ''
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="ml-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 kamehameha-glow text-sm sm:text-base"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Placing Order...</span>
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-lg p-4 sm:p-6 sticky top-4 ${themeClasses.card}`}>
              <h3 className={`text-lg sm:text-xl font-bold font-saiyan mb-4 sm:mb-6 ${themeClasses.text.primary}`}>
                ORDER SUMMARY
              </h3>
              
              {/* Order Items */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-80 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-2 sm:gap-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                      <CheckoutImage 
                        item={item}
                        size={80}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-xs sm:text-sm truncate ${themeClasses.text.primary}`}>
                          {item.name}
                        </div>
                        <div className={`text-xs ${themeClasses.text.muted}`}>Qty: {item.quantity}</div>
                        {item.category && (
                          <div className={`text-xs ${themeClasses.text.muted} truncate`}>
                            {item.category}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`font-bold text-xs sm:text-sm whitespace-nowrap text-orange-500`}>
                      <Price value={(parseFloat(item.price) * item.quantity)} />
                    </div>
                  </div>
                ))}
              </div>

              <hr className={`border-gray-200 dark:border-slate-600 mb-3 sm:mb-4`} />
              
              {/* Order Totals */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className={themeClasses.text.secondary}>Subtotal:</span>
                  <span className={themeClasses.text.primary}><Price value={subtotal} /></span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className={themeClasses.text.secondary}>Shipping:</span>
                  <span className={shipping === 0 ? 'text-green-500 font-medium' : themeClasses.text.primary}>
                    {shipping === 0 ? 'FREE' : <Price value={shipping} />}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className={themeClasses.text.secondary}>Tax:</span>
                  <span className={themeClasses.text.primary}><Price value={tax} /></span>
                </div>
                <hr className={`border-gray-200 dark:border-slate-600`} />
                <div className="flex justify-between text-lg sm:text-xl font-bold">
                  <span className={themeClasses.text.primary}>Total:</span>
                  <span className="text-orange-500 font-saiyan"><Price value={total} /></span>
                </div>

                {/* Free Shipping Progress */}
                {subtotal < 500 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                    <div className="flex justify-between text-xs mb-1">
                      <span className={themeClasses.text.muted}>
                        ${(500 - subtotal).toFixed(2)} away from free shipping!
                      </span>
                      <span className={themeClasses.text.muted}>
                        {Math.min((subtotal / 500) * 100, 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${
                      isDarkMode ? 'bg-slate-600' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Security Features */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className={`flex items-center ${themeClasses.text.muted}`}>
                  <FaLock className="mr-2 text-green-500 flex-shrink-0" />
                  <span>SSL Secured Checkout</span>
                </div>
                <div className={`flex items-center ${themeClasses.text.muted}`}>
                  <FaShieldAlt className="mr-2 text-blue-500 flex-shrink-0" />
                  <span>Capsule Corp Protection</span>
                </div>
                <div className={`flex items-center ${themeClasses.text.muted}`}>
                  <FaUser className="mr-2 text-orange-500 flex-shrink-0" />
                  <span>30-Day Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="mb-6 p-4 rounded-lg bg-yellow-100 text-yellow-900 border border-yellow-300 text-center">
          <strong>Demo Notice:</strong> This checkout is for portfolio/demo purposes only. No real payments are processed and credit card info is not stored or sent to any payment gateway.
        </div>
      </div>
    </div>
  );
}

// Add display name for better debugging
Checkout.displayName = 'CheckoutPage';

export default Checkout;