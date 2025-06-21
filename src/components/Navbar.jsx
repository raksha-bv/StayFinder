import React, { useState, useEffect } from "react";
import { MapPin, Menu, X, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const Navbar = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();

  // Check if we're on landing page
  const isLandingPage = location.pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthClick = (authType) => {
    setIsMenuOpen(false);
    if (onAuthClick) {
      onAuthClick(authType);
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await logout();
  };

  const handleNavigation = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  // Determine navbar styles based on page and scroll state
  const getNavbarStyles = () => {
    if (isLandingPage) {
      return isScrolled ? "bg-white/95 backdrop-blur-lg " : "bg-transparent";
    } else {
      return "bg-white ";
    }
  };

  const getTextColor = () => {
    if (isLandingPage) {
      return isScrolled ? "text-gray-900" : "text-white";
    } else {
      return "text-gray-900";
    }
  };

  const getLogoBgColor = () => {
    if (isLandingPage) {
      return isScrolled ? "bg-red-500" : "bg-white/10 backdrop-blur-sm";
    } else {
      return "bg-red-500";
    }
  };

  const getLogoTextColor = () => {
    return "text-white";
  };

  const getButtonStyles = () => {
    if (isLandingPage) {
      return isScrolled
        ? "bg-gray-900 hover:bg-gray-800 text-white"
        : "bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white";
    } else {
      return "bg-gray-900 hover:bg-gray-800 text-white";
    }
  };

  const getMobileButtonStyles = () => {
    if (isLandingPage) {
      return isScrolled
        ? "bg-gray-100 text-gray-900"
        : "bg-white/10 backdrop-blur-sm text-white";
    } else {
      return "bg-gray-100 text-gray-900";
    }
  };

  const getProfileIconStyles = () => {
    if (isLandingPage) {
      return isScrolled
        ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
        : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20";
    } else {
      return "bg-gray-100 text-gray-900 hover:bg-gray-200";
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full p-4 sm:p-6 z-50 transition-all duration-300 ${getNavbarStyles()}`}
    >
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          onClick={() => handleNavigation("/")}
        >
          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 ${getLogoBgColor()} rounded-xl sm:rounded-2xl flex items-center justify-center  transition-all duration-300`}
          >
            <MapPin className={`w-4 h-4 sm:w-5 sm:h-5 ${getLogoTextColor()}`} />
          </div>
          <span
            className={`${getTextColor()} font-bold text-lg sm:text-2xl tracking-tight transition-all duration-300`}
          >
            StayFinder
          </span>
        </div>

        {/* Desktop Menu */}
        <div
          className={`hidden md:flex items-center space-x-8 ${getTextColor()} text-sm font-medium`}
        >
          <button
            onClick={() => handleNavigation("/listings")}
            className="hover:opacity-80 transition-all duration-300 hover:scale-105"
          >
            Listings
          </button>
          
          {authUser && (
            <button
              onClick={() => handleNavigation("/wishlists")}
              className="hover:opacity-80 transition-all duration-300 hover:scale-105"
            >
              Wishlists
            </button>
          )}

          <div className="flex items-center space-x-4 ml-6">
            {authUser ? (
              <>
                {/* Profile Icon with Picture */}
                <span className={getTextColor()}>
                  Welcome, {authUser.firstName}
                </span>
                <button
                  onClick={() => handleNavigation("/profile")}
                  className={`${getProfileIconStyles()} p-2 rounded-full transition-all duration-300 hover:scale-105`}
                  title="Profile"
                >
                  {authUser.profilePic ? (
                    <img
                      src={authUser.profilePic}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {authUser.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </button>

                <button
                  onClick={handleLogout}
                  className={`${getButtonStyles()} px-4 py-2 rounded-full transition-all duration-300`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleAuthClick("signup")}
                  className="hover:opacity-80 transition-all duration-300"
                >
                  Sign up
                </button>
                <button
                  onClick={() => handleAuthClick("login")}
                  className={`${getButtonStyles()} px-4 py-2 rounded-full transition-all duration-300`}
                >
                  Log in
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden ${getMobileButtonStyles()} p-2 rounded-lg transition-all duration-300`}
        >
          {isMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-lg rounded-2xl p-6  border border-white/20">
            <div className="flex flex-col space-y-4 text-gray-800 text-center">
              <button
                onClick={() => handleNavigation("/listings")}
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
              >
                Listings
              </button>
              
              {authUser && (
                <button
                  onClick={() => handleNavigation("/wishlists")}
                  className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                >
                  Wishlists
                </button>
              )}
              
              <button
                onClick={() => handleNavigation("/experiences")}
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
              >
                Experiences
              </button>
              <button
                onClick={() => handleNavigation("/help")}
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
              >
                Help
              </button>
              <div className="border-t border-gray-200 pt-4 mt-4">
                {authUser ? (
                  <>
                    {/* Mobile Profile Section */}
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      {authUser.profilePic ? (
                        <img
                          src={authUser.profilePic}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {authUser.firstName?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-gray-900">
                          {authUser.firstName} {authUser.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {authUser.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavigation("/profile")}
                      className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                    >
                      View Profile
                    </button>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <button
                        onClick={handleLogout}
                        className="block w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-6 py-3 rounded-full transition-all duration-300 font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleAuthClick("signup")}
                      className="block w-full hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => handleAuthClick("login")}
                      className="block w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-6 py-3 rounded-full transition-all duration-300 mt-3 font-medium"
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
