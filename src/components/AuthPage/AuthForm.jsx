import React, { useState } from "react";
import InputField from "./InputField";
import { Mail, Lock, User, Phone } from "lucide-react";

const AuthForm = ({
  isLogin,
  formData,
  onInputChange,
  onSubmit,
  onToggleAuthMode,
  isMobile,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const inputClass = isMobile
    ? "w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
    : "w-full pl-10 xl:pl-12 pr-3 xl:pr-4 py-3 xl:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm xl:text-base";

  const passwordInputClass = isMobile
    ? "w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm"
    : "w-full pl-10 xl:pl-12 pr-10 xl:pr-12 py-3 xl:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-colors text-sm xl:text-base";

  const iconSize = isMobile ? "w-4 h-4" : "w-4 h-4 xl:w-5 xl:h-5";

  return (
    <form
      onSubmit={onSubmit}
      className={isMobile ? "space-y-4" : "space-y-4 xl:space-y-6"}
    >
      {!isLogin && (
        <div
          className={
            isMobile
              ? "grid grid-cols-2 gap-3"
              : "grid grid-cols-2 gap-3 xl:gap-4"
          }
        >
          <InputField
            icon={
              <User
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
              />
            }
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={(e) => onInputChange("firstName", e.target.value)}
            className={inputClass}
            required
          />
          <InputField
            icon={
              <User
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
              />
            }
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={(e) => onInputChange("lastName", e.target.value)}
            className={inputClass}
            required
          />
        </div>
      )}

      <InputField
        icon={
          <Mail
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
          />
        }
        type="email"
        placeholder={isMobile ? "Email address" : "Email Address"}
        value={formData.email}
        onChange={(e) => onInputChange("email", e.target.value)}
        className={inputClass}
        required
      />

      {!isLogin && (
        <InputField
          icon={
            <Phone
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
            />
          }
          type="tel"
          placeholder={isMobile ? "Phone number" : "Phone Number"}
          value={formData.phone}
          onChange={(e) => onInputChange("phone", e.target.value)}
          className={inputClass}
          required
        />
      )}

      <InputField
        icon={
          <Lock
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
          />
        }
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={formData.password}
        onChange={(e) => onInputChange("password", e.target.value)}
        className={passwordInputClass}
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        iconSize={iconSize}
        required
      />

      {!isLogin && (
        <InputField
          icon={
            <Lock
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${iconSize}`}
            />
          }
          type={showConfirmPassword ? "text" : "password"}
          placeholder={isMobile ? "Confirm password" : "Confirm Password"}
          value={formData.confirmPassword}
          onChange={(e) => onInputChange("confirmPassword", e.target.value)}
          className={passwordInputClass}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          iconSize={iconSize}
          required
        />
      )}

      <div
        className={`flex items-center justify-between ${
          isMobile ? "text-sm pt-1" : "text-sm"
        }`}
      >
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => onInputChange("rememberMe", e.target.checked)}
            className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500"
          />
          <span
            className={`text-gray-700 ${
              isMobile ? "text-xs" : "text-xs xl:text-sm"
            }`}
          >
            {isLogin
              ? "Remember me"
              : isMobile
              ? "I agree to Terms"
              : "I agree to the Terms & Conditions"}
          </span>
        </label>
        {isLogin && (
          <button
            type="button"
            className={`text-rose-600 hover:text-rose-700 font-medium ${
              isMobile ? "text-xs" : "text-xs xl:text-sm hover:text-rose-800"
            }`}
          >
            {isMobile ? "Forgot?" : "Forgot password?"}
          </button>
        )}
      </div>

      <button
        type="submit"
        className={`w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-rose-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg ${
          isMobile ? "py-3 text-sm mt-4" : "py-3 xl:py-4 text-sm xl:text-base"
        }`}
      >
        {isLogin ? "Sign In" : "Create Account"}
      </button>

      <div className={isMobile ? "text-center pt-3" : "text-center"}>
        <p
          className={`text-gray-600 ${
            isMobile ? "text-xs" : "text-xs xl:text-sm"
          }`}
        >
          {isLogin ? "Don't have an account?" : "Already have an account?"}
        </p>
        <button
          type="button"
          onClick={onToggleAuthMode}
          className={`text-rose-600 hover:text-rose-700 font-semibold ${
            isMobile ? "text-sm mt-1" : "ml-1 hover:text-rose-800"
          }`}
        >
          {isLogin
            ? isMobile
              ? "Create one now"
              : "Sign up"
            : isMobile
            ? "Sign in instead"
            : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
