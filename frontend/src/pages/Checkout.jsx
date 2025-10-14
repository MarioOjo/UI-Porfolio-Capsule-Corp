import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaShieldAlt, FaCreditCard, FaUser, FaTruck, FaCheck } from "react-icons/fa";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../AuthContext";
import { useNotifications } from "../contexts/NotificationContext";
import Price from "../components/Price";
import { useCurrency } from "../contexts/CurrencyContext";

function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    
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
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, cartItems, navigate]);

  const { formatPrice } = useCurrency();
  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 25.99; // Free shipping over $500
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    }

    if (step === 2) {
      // Validate payment information
      if (!formData.cardNumber.replace(/\s/g, '')) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!formData.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name on card is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and show success
      clearCart();
      showSuccess('🎉 Order placed successfully! Your capsules are being prepared for battle!', {
        title: 'ORDER CONFIRMED',
        duration: 5000
      });
      
      navigate('/');
    } catch (error) {
      showError('Failed to place order. Please try again.', {
        title: 'ORDER FAILED'
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Shipping', description: 'Delivery information' },
    { number: 2, title: 'Payment', description: 'Payment details' },
    { number: 3, title: 'Review', description: 'Confirm order' }
  ];

  if (!user || cartItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 font-saiyan mb-2">
            SECURE CHECKOUT
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Complete your legendary purchase</p>
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
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.number ? <FaCheck /> : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-gray-800 text-xs sm:text-sm whitespace-nowrap">{step.title}</div>
                    <div className="text-xs text-gray-600 hidden sm:block">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 sm:w-16 h-1 mx-2 sm:mx-4 ${
                    currentStep > step.number ? 'bg-orange-400' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 font-saiyan flex items-center">
                    <FaTruck className="mr-3 text-orange-500" />
                    SHIPPING INFORMATION
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.firstName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.lastName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="your@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="123 Main Street"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="West City"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.state ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="CA"
                      />
                      {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.zipCode ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="12345"
                      />
                      {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Method</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="standard"
                          checked={formData.shippingMethod === 'standard'}
                          onChange={handleInputChange}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Standard Shipping</div>
                          <div className="text-sm text-gray-600">5-7 business days</div>
                        </div>
                        <div className="font-bold text-orange-600">
                          {subtotal > 500 ? 'FREE' : <Price value={25.99} />}
                        </div>
                      </label>
                      <label className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="mr-4"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Instant Transmission</div>
                          <div className="text-sm text-gray-600">1-2 business days</div>
                        </div>
                        <div className="font-bold text-orange-600"><Price value={49.99} /></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Information */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 font-saiyan flex items-center">
                    <FaCreditCard className="mr-3 text-orange-500" />
                    PAYMENT INFORMATION
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.cardNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="1234 5678 9012 3456"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Month *</label>
                        <select
                          name="expiryMonth"
                          value={formData.expiryMonth}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.expiryMonth ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                          }`}
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                              {String(i + 1).padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                        {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
                        <select
                          name="expiryYear"
                          value={formData.expiryYear}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.expiryYear ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                          }`}
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() + i}>
                              {new Date().getFullYear() + i}
                            </option>
                          ))}
                        </select>
                        {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                        <input
                          type="text"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                            errors.cvv ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                          }`}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
                      <input
                        type="text"
                        name="nameOnCard"
                        value={formData.nameOnCard}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                          errors.nameOnCard ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review Order */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 font-saiyan flex items-center">
                    <FaCheck className="mr-3 text-orange-500" />
                    REVIEW ORDER
                  </h2>

                  <div className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <img 
                                src={item.image || item.imageUrl} 
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                              </div>
                            </div>
                            <div className="font-bold text-orange-600">
                              <Price value={parseFloat(item.price) * item.quantity} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Shipping Address</h3>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div>{formData.firstName} {formData.lastName}</div>
                        <div>{formData.address}</div>
                        <div>{formData.city}, {formData.state} {formData.zipCode}</div>
                        <div>{formData.phone}</div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Method</h3>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div>**** **** **** {formData.cardNumber.slice(-4)}</div>
                        <div>{formData.nameOnCard}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                {currentStep > 1 && (
                  <button
                    onClick={handlePreviousStep}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className={`px-8 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-bold transition-all hover:scale-105 kamehameha-glow ${
                      currentStep === 1 ? 'ml-auto' : ''
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="ml-auto px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 font-saiyan">ORDER SUMMARY</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <img 
                        src={item.image || item.imageUrl} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{item.name}</div>
                        <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-sm whitespace-nowrap"><Price value={(parseFloat(item.price) * item.quantity)} /></div>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 mb-4" />
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span><Price value={subtotal} /></span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                    {shipping === 0 ? 'FREE' : <Price value={shipping} />}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span><Price value={tax} /></span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600 font-saiyan"><Price value={total} /></span>
                </div>
              </div>

              {/* Security Features */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaLock className="mr-2 text-green-500" />
                  <span>SSL Secured Checkout</span>
                </div>
                <div className="flex items-center">
                  <FaShieldAlt className="mr-2 text-blue-500" />
                  <span>Capsule Corp Protection</span>
                </div>
                <div className="flex items-center">
                  <FaUser className="mr-2 text-orange-500" />
                  <span>30-Day Money Back</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;