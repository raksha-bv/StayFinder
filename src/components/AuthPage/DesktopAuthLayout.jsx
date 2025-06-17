import React from "react";
import { X } from "lucide-react";
import BrandingSection from "./BrandingSection";
import AuthForm from "./AuthForm";

const DesktopAuthLayout = ({
  isLogin,
  formData,
  onInputChange,
  onSubmit,
  onToggleAuthMode,
  onClose,
}) => {
  return (
    <div className="hidden lg:block bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] shadow-2xl overflow-hidden">
      <div className="flex h-full max-h-[95vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 w-10 h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        <BrandingSection />

        {/* Right Side - Auth Form */}
        <div className="w-1/2 flex items-center justify-center p-4 xl:p-8 overflow-y-auto no-scrollbar">
          <div className="w-full max-w-md my-auto">
            <div className="text-center mb-6 xl:mb-8">
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-gray-600 text-sm xl:text-base">
                {isLogin
                  ? "Sign in to access your bookings and preferences"
                  : "Join StayFinder and discover amazing accommodations"}
              </p>
            </div>

            <AuthForm
              isLogin={isLogin}
              formData={formData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onToggleAuthMode={onToggleAuthMode}
              isMobile={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopAuthLayout;
