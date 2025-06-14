import React from "react";
import { MapPin } from "lucide-react";

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 w-full p-6 z-20">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10  rounded-2xl flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-2xl hidden sm:block tracking-tight">
            StayFinder
          </span>
        </div>
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
            <a
              href="#"
              className="hover:text-white transition-all duration-300"
            >
              Sign up
            </a>
            <a
              href="#"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-300"
            >
              Log in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
