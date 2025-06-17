import React from "react";
import { MapPin } from "lucide-react";

const LocationSearch = ({
  filters,
  showLocationDropdown,
  setShowLocationDropdown,
  handleInputChange,
  locationDropdownRef,
  locationTriggerRef,
  popularDestinations,
  isMobile = false,
}) => {
  return (
    <div className="relative">
      <div
        ref={locationTriggerRef}
        className={`cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
          isMobile
            ? "px-3 py-3 rounded-xl"
            : "px-4 py-3 rounded-full bg-gray-50/50"
        }`}
        onClick={() => setShowLocationDropdown(!showLocationDropdown)}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-lg ${
              !isMobile ? "rounded-full" : ""
            }`}
          >
            <MapPin
              className={`text-red-500 ${isMobile ? "h-3.5 w-3.5" : "h-4 w-4"}`}
            />
          </div>
          <div className="flex-1 text-left">
            <div
              className={`font-semibold text-gray-500 uppercase tracking-wide mb-0.5 ${
                isMobile ? "text-xs" : "text-xs tracking-wider mb-1"
              }`}
            >
              Where
            </div>
            <div
              className={`text-gray-900 font-medium ${
                isMobile ? "text-sm" : "text-sm"
              }`}
            >
              {filters.where || "Search destinations"}
            </div>
          </div>
        </div>
      </div>

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <div
          ref={locationDropdownRef}
          className={`absolute top-full left-0 mt-2 bg-white shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-300 ${
            isMobile ? "right-0 rounded-2xl p-4" : "w-80 rounded-3xl p-6"
          }`}
        >
          <div className={isMobile ? "mb-3" : "mb-4"}>
            <input
              type="text"
              placeholder="Search destinations"
              value={filters.where}
              onChange={(e) => handleInputChange("where", e.target.value)}
              className={`w-full border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none ${
                isMobile
                  ? "px-3 py-2.5 rounded-xl text-sm"
                  : "px-4 py-3 rounded-2xl text-sm"
              }`}
              autoFocus
            />
          </div>
          <div>
            <h4
              className={`font-semibold text-gray-900 ${
                isMobile ? "text-sm mb-2" : "text-sm mb-3"
              }`}
            >
              Popular destinations
            </h4>
            <div className={isMobile ? "space-y-1" : "space-y-2"}>
              {popularDestinations.map((destination, index) => (
                <button
                  key={index}
                  onClick={() => {
                    handleInputChange("where", destination);
                    setShowLocationDropdown(false);
                  }}
                  className={`w-full text-left hover:bg-gray-50 transition-colors text-gray-700 ${
                    isMobile
                      ? "px-2 py-2 rounded-lg text-sm"
                      : "px-3 py-2 rounded-xl text-sm"
                  }`}
                >
                  {destination}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
