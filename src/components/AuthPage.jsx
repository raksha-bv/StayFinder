import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, Star, Wifi, ArrowRight } from 'lucide-react';

const AuthPage = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
    agreeToTerms: false,
  });

  // Update auth mode when initialMode changes
  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      rememberMe: false,
      agreeToTerms: false,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const preventScroll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onWheel={preventScroll}
      onTouchMove={preventScroll}
      style={{ 
        overflow: 'hidden',
        touchAction: 'none',
        overscrollBehavior: 'none'
      }}
    >
      {/* Mobile Layout - Redesigned */}
      <div className="lg:hidden w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mobile Header with Branding */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-8 text-white text-center relative overflow-hidden">
          {/* Background Pattern - Simplified for mobile */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-4 w-12 h-12 border border-white rounded-full"></div>
            <div className="absolute bottom-2 left-4 w-8 h-8 border border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h1 className="text-2xl font-bold mb-2">StayFinder</h1>
            <p className="text-sm opacity-90">
              {isLogin ? 'Welcome back!' : 'Join our community'}
            </p>
            
            {/* Compact Features */}
            <div className="flex justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span className="text-xs">Prime Locations</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span className="text-xs">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin 
                ? 'Access your bookings and preferences' 
                : 'Start your journey with amazing stays'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                    required
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                    required
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="email"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                required
              />
            </div>

            {!isLogin && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                />
                <span className="text-gray-700 text-xs">
                  {isLogin ? 'Remember me' : 'I agree to Terms'}
                </span>
              </label>
              {isLogin && (
                <button type="button" className="text-rose-600 hover:text-rose-700 text-xs font-medium">
                  Forgot?
                </button>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-3 rounded-lg font-semibold text-sm hover:from-rose-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg mt-4"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center pt-3">
              <p className="text-gray-600 text-xs">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={toggleAuthMode}
                className="text-rose-600 hover:text-rose-700 font-semibold text-sm mt-1"
              >
                {isLogin ? 'Create one now' : 'Sign in instead'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop Layout - unchanged */}
      <div className="hidden lg:block bg-white rounded-2xl max-w-5xl w-full h-[90vh] shadow-2xl overflow-hidden">
        <div className="flex h-full">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-60 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Side - Branding & Features */}
          <div className="w-1/2 bg-gradient-to-br from-rose-500 to-rose-600 p-8 flex flex-col justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute top-1/2 right-20 w-8 h-8 bg-white rounded-full"></div>
              <div className="absolute bottom-10 left-1/3 w-6 h-6 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 text-white">
              <div className="mb-8">
                <h1 className="text-5xl font-bold mb-4">StayFinder</h1>
                <p className="text-xl opacity-90">Your perfect stay awaits</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Prime Locations</h3>
                    <p className="text-base opacity-80">Discover amazing stays in the best neighborhoods</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Top Rated</h3>
                    <p className="text-base opacity-80">Only the highest quality accommodations</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Premium Amenities</h3>
                    <p className="text-base opacity-80">WiFi, parking, and luxury facilities included</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center space-x-6">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 bg-white rounded-full border-2 border-rose-500"></div>
                  <div className="w-10 h-10 bg-rose-200 rounded-full border-2 border-rose-500"></div>
                  <div className="w-10 h-10 bg-rose-300 rounded-full border-2 border-rose-500"></div>
                </div>
                <p className="text-base opacity-90">Join 10,000+ happy travelers</p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-1/2 flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-600">
                  {isLogin 
                    ? 'Sign in to access your bookings and preferences' 
                    : 'Join StayFinder and discover amazing accommodations'
                  }
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                        required
                      />
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                    required
                  />
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                      className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-gray-700">
                      {isLogin ? 'Remember me' : 'I agree to the Terms & Conditions'}
                    </span>
                  </label>
                  {isLogin && (
                    <button type="button" className="text-rose-600 hover:text-rose-800">
                      Forgot password?
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-lg font-semibold hover:from-rose-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="text-rose-600 hover:text-rose-800 font-semibold ml-1"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
