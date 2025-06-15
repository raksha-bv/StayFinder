import React, { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";

const Navbar = ({ onAuthClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleAuthClick = (authType) => {
    setIsMenuOpen(false);
    if (onAuthClick) {
      onAuthClick(authType);
    }
  };

  return (
    <div className="absolute top-0 left-0 w-full p-4 sm:p-6 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg sm:text-2xl tracking-tight">
            StayFinder
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-white/90 text-sm font-medium">
          <a
            href="#"
            className="hover:text-white transition-all duration-300 hover:scale-105"
          >
            Host
          </a>
          <a
            href="#"
            className="hover:text-white transition-all duration-300 hover:scale-105"
          >
            Experiences
          </a>
          <a
            href="#"
            className="hover:text-white transition-all duration-300 hover:scale-105"
          >
            Help
          </a>
          <div className="flex items-center space-x-4 ml-6">
            <button
              onClick={() => handleAuthClick("signup")}
              className="hover:text-white transition-all duration-300"
            >
              Sign up
            </button>
            <button
              onClick={() => handleAuthClick("login")}
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300"
            >
              Log in
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden bg-white/10 backdrop-blur-sm p-2 rounded-lg text-white"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div className="absolute top-20 left-4 right-4 bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex flex-col space-y-4 text-gray-800 text-center">
              <a
                href="#"
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Host
              </a>
              <a
                href="#"
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Experiences
              </a>
              <a
                href="#"
                className="hover:text-gray-600 transition-all duration-300 py-3 text-lg font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </a>
              <div className="border-t border-gray-200 pt-4 mt-4">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
