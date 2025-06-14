import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Globe,
} from "lucide-react";

const HeroSection = () => {
  const [filters, setFilters] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [activeField, setActiveField] = useState(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Refs for click outside handling
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const adjustGuests = (increment) => {
    setFilters((prev) => ({
      ...prev,
      guests: Math.max(1, prev.guests + increment),
    }));
  };

  const handleSearch = () => {
    console.log("Search filters:", filters);
  };

  // Fixed click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowGuestDropdown(false);
      }
    };

    if (showGuestDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestDropdown]);

  return (
    <section className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background with enhanced gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        }}
      />

      {/* Modern gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Ultra-modern hero title */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 leading-[0.9] tracking-tight">
            Book unique accommodation
            <br />
            and{" "}
            <span className="bg-white bg-clip-text text-transparent">
              experiences
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-light max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
            Discover extraordinary places to stay and unique experiences around
            the world
          </p>
        </div>

        {/* Ultra-sleek search interface */}
        <div className="w-full max-w-6xl">
          {/* Desktop - Individual capsules with glass morphism */}
          <div className="hidden lg:flex items-center justify-center space-x-4 mb-8">
            {/* Where capsule */}
            <div
              className={`group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[240px] ${
                activeField === "where"
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : ""
              }`}
              onClick={() =>
                setActiveField(activeField === "where" ? null : "where")
              }
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-full">
                  <MapPin className="w-4 h-4 text-rose-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Where
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={filters.where}
                    onChange={(e) => handleInputChange("where", e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/50 border-none outline-none font-medium text-sm"
                    onFocus={() => setActiveField("where")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Check-in capsule - Restored size */}
            <div
              className={`group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[200px] ${
                activeField === "checkin"
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : ""
              }`}
              onClick={() => document.getElementById('checkin-desktop').showPicker()}
            >
              <input
                id="checkin-desktop"
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleInputChange("checkIn", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center space-x-3 pointer-events-none">
                <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full">
                  <Calendar className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check in
                  </div>
                  <div className="text-white/50 text-sm">
                    {filters.checkIn || "Add dates"}
                  </div>
                </div>
              </div>
            </div>

            {/* Check-out capsule - Restored size */}
            <div
              className={`group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[200px] ${
                activeField === "checkout"
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : ""
              }`}
              onClick={() => document.getElementById('checkout-desktop').showPicker()}
            >
              <input
                id="checkout-desktop"
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleInputChange("checkOut", e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex items-center space-x-3 pointer-events-none">
                <div className="p-2 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full">
                  <Calendar className="w-4 h-4 text-purple-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check out
                  </div>
                  <div className="text-white/50 text-sm">
                    {filters.checkOut || "Add dates"}
                  </div>
                </div>
              </div>
            </div>

            {/* Guests capsule - FIXED */}
            <div className="relative">
              <div
                ref={triggerRef}
                className={`group cursor-pointer backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl min-w-[180px] ${
                  showGuestDropdown ? "bg-white/20 scale-105 shadow-2xl" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowGuestDropdown(!showGuestDropdown);
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full">
                    <Users className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                      Who
                    </div>
                    <div className="text-white font-medium text-sm">
                      {filters.guests} guest{filters.guests !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                      showGuestDropdown ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Ultra-modern guest dropdown - FIXED */}
              {showGuestDropdown && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full mt-4 backdrop-blur-2xl bg-white/95 rounded-3xl shadow-2xl border border-white/30 p-6 z-[9999] animate-in slide-in-from-top-2 duration-300 w-80"
                  style={{
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-800 font-semibold text-lg">
                        Guests
                      </span>
                      <p className="text-gray-500 text-sm">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustGuests(-1);
                        }}
                        disabled={filters.guests <= 1}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-300 font-semibold text-gray-600 hover:scale-110 disabled:hover:scale-100"
                      >
                        −
                      </button>
                      <span className="font-bold text-gray-800 text-lg w-8 text-center">
                        {filters.guests}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustGuests(1);
                        }}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-all duration-300 font-semibold text-gray-600 hover:scale-110"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Ultra-modern search button */}
            <button
              onClick={handleSearch}
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full p-5 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-rose-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Search className="w-6 h-6 relative z-10" />
            </button>
          </div>

          {/* Mobile & Tablet - Compact capsules with full rounded corners */}
          <div className="lg:hidden space-y-3 sm:space-y-4 max-w-lg mx-auto">
            {/* Where capsule - Mobile with centered content */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-4 sm:p-5 transition-all duration-300 hover:bg-white/15 h-16 sm:h-20">
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-full flex-shrink-0">
                    <MapPin className="w-4 h-4 text-rose-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {filters.where ? (
                      <input
                        type="text"
                        value={filters.where}
                        onChange={(e) =>
                          handleInputChange("where", e.target.value)
                        }
                        className="w-full bg-transparent text-white border-none outline-none font-medium text-sm sm:text-base text-center"
                      />
                    ) : (
                      <div className="text-center">
                        <input
                          type="text"
                          placeholder="Search destinations"
                          value={filters.where}
                          onChange={(e) =>
                            handleInputChange("where", e.target.value)
                          }
                          className="w-full bg-transparent text-white placeholder-white/70 border-none outline-none font-medium text-sm sm:text-base text-center"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Date capsules - Mobile Grid - More rounded */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-3 sm:p-4 transition-all duration-300 hover:bg-white/15 h-20 sm:h-24 cursor-pointer relative"
                onClick={() => {
                  const input = document.getElementById('checkin-mobile');
                  input.focus();
                  input.showPicker();
                }}
              >
                <input
                  id="checkin-mobile"
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => handleInputChange("checkIn", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                <div className="flex flex-col items-center justify-center text-center h-full pointer-events-none">
                  <div className="p-1.5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full mb-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300" />
                  </div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check in
                  </div>
                  <div className="text-white/50 text-xs">
                    {filters.checkIn || "Add date"}
                  </div>
                </div>
              </div>

              <div
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-3 sm:p-4 transition-all duration-300 hover:bg-white/15 h-20 sm:h-24 cursor-pointer relative"
                onClick={() => {
                  const input = document.getElementById('checkout-mobile');
                  input.focus();
                  input.showPicker();
                }}
              >
                <input
                  id="checkout-mobile"
                  type="date"
                  value={filters.checkOut}
                  onChange={(e) => handleInputChange("checkOut", e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                />
                <div className="flex flex-col items-center justify-center text-center h-full pointer-events-none">
                  <div className="p-1.5 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full mb-2">
                    <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300" />
                  </div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check out
                  </div>
                  <div className="text-white/50 text-xs">
                    {filters.checkOut || "Add date"}
                  </div>
                </div>
              </div>
            </div>
            {/* Guests capsule - Mobile */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-4 sm:p-5 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full">
                    <Users className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                      Guests
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base">
                      {filters.guests} guest{filters.guests !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustGuests(-1);
                    }}
                    disabled={filters.guests <= 1}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 disabled:opacity-50 flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white font-bold text-sm sm:text-base hover:scale-110"
                  >
                    −
                  </button>
                  <span className="font-bold text-white text-sm sm:text-base w-4 sm:w-6 text-center">
                    {filters.guests}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustGuests(1);
                    }}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white font-bold text-sm sm:text-base hover:scale-110"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Search button - Mobile */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full py-4 sm:py-5 font-bold text-sm sm:text-base transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/25 flex items-center justify-center space-x-2"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Search amazing places</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110">
          <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* Bottom right info - Simple text */}
      <div className="absolute bottom-8 right-8 text-right hidden xl:block">
        <p className="text-2xl font-bold text-white mb-1">300+</p>
        <p className="text-sm text-white/80 font-medium">Unique stays</p>
        <p className="text-xs text-white/60">worldwide</p>
      </div>
    </section>
  );
};

export default HeroSection;
