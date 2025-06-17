import React from "react";
import { X } from "lucide-react";
import MobileHeader from "./MobileHeader";
import AuthForm from "./AuthForm";

const MobileAuthLayout = ({
  isLogin,
  formData,
  onInputChange,
  onSubmit,
  onToggleAuthMode,
  onClose,
}) => {
  return (
    <div className="lg:hidden w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[98vh] flex flex-col">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center text-gray-600 transition-colors duration-300"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <MobileHeader isLogin={isLogin} />

        {/* Form Section */}
        <div className="p-6 pb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin
                ? "Access your bookings and preferences"
                : "Start your journey with amazing stays"}
            </p>
          </div>

          <AuthForm
            isLogin={isLogin}
            formData={formData}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            onToggleAuthMode={onToggleAuthMode}
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileAuthLayout;
