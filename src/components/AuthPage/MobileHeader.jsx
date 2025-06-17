import React from "react";
import { MapPin, Star } from "lucide-react";

const MobileHeader = ({ isLogin }) => {
  return (
    <div className="bg-gradient-to-br from-rose-500 to-rose-600 px-6 py-6 text-white text-center relative overflow-hidden shrink-0">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 right-4 w-12 h-12 border border-white rounded-full"></div>
        <div className="absolute bottom-2 left-4 w-8 h-8 border border-white rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10">
        <h1 className="text-2xl font-bold mb-2">StayFinder</h1>
        <p className="text-sm opacity-90">
          {isLogin ? "Welcome back!" : "Join our community"}
        </p>

        {/* Compact Features */}
        <div className="flex justify-center space-x-6 mt-3">
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
  );
};

export default MobileHeader;
