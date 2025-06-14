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

      {/* Ultra-modern navigation */}
      {/* <div className="absolute top-0 left-0 w-full p-6 z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5 text-white" />
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
      </div> */}

      {/* Hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Ultra-modern hero title */}
        <div className="mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black mb-6 leading-[0.9] tracking-tight">
            Book unique accommodation
            <br />
            and{" "}
            <span className="bg-white bg-clip-text text-transparent">
              experiences
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
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

            {/* Check-in capsule */}
            <div
              className={`group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[200px] ${
                activeField === "checkin"
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : ""
              }`}
              onClick={() =>
                setActiveField(activeField === "checkin" ? null : "checkin")
              }
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full">
                  <Calendar className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check in
                  </div>
                  <input
                    type="date"
                    value={filters.checkIn}
                    onChange={(e) =>
                      handleInputChange("checkIn", e.target.value)
                    }
                    className="w-full bg-transparent text-white border-none outline-none font-medium text-sm [color-scheme:dark]"
                    onFocus={() => setActiveField("checkin")}
                    onBlur={() => setActiveField(null)}
                  />
                </div>
              </div>
            </div>

            {/* Check-out capsule */}
            <div
              className={`group relative backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[200px] ${
                activeField === "checkout"
                  ? "bg-white/20 scale-105 shadow-2xl"
                  : ""
              }`}
              onClick={() =>
                setActiveField(activeField === "checkout" ? null : "checkout")
              }
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full">
                  <Calendar className="w-4 h-4 text-purple-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    Check out
                  </div>
                  <input
                    type="date"
                    value={filters.checkOut}
                    onChange={(e) =>
                      handleInputChange("checkOut", e.target.value)
                    }
                    className="w-full bg-transparent text-white border-none outline-none font-medium text-sm [color-scheme:dark]"
                    onFocus={() => setActiveField("checkout")}
                    onBlur={() => setActiveField(null)}
                  />
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

          {/* Mobile - Sleek stacked capsules */}
          <div className="lg:hidden space-y-4">
            {/* Where capsule - Mobile */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-2xl">
                  <MapPin className="w-5 h-5 text-rose-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Where to?
                  </div>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={filters.where}
                    onChange={(e) => handleInputChange("where", e.target.value)}
                    className="w-full bg-transparent text-white placeholder-white/50 border-none outline-none font-medium text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Date capsules - Mobile */}
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-2xl mb-3">
                    <Calendar className="w-5 h-5 text-blue-300" />
                  </div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Check in
                  </div>
                  <input
                    type="date"
                    value={filters.checkIn}
                    onChange={(e) =>
                      handleInputChange("checkIn", e.target.value)
                    }
                    className="w-full bg-transparent text-white border-none outline-none font-medium text-center [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-2xl mb-3">
                    <Calendar className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                    Check out
                  </div>
                  <input
                    type="date"
                    value={filters.checkOut}
                    onChange={(e) =>
                      handleInputChange("checkOut", e.target.value)
                    }
                    className="w-full bg-transparent text-white border-none outline-none font-medium text-center [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Guests capsule - Mobile */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 transition-all duration-300 hover:bg-white/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-2xl">
                    <Users className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                      Who's coming?
                    </div>
                    <div className="text-white font-medium text-lg">
                      {filters.guests} guest{filters.guests !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustGuests(-1);
                    }}
                    disabled={filters.guests <= 1}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 disabled:opacity-50 flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white font-bold text-lg hover:scale-110"
                  >
                    −
                  </button>
                  <span className="font-bold text-white text-xl w-6 text-center">
                    {filters.guests}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      adjustGuests(1);
                    }}
                    className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 text-white font-bold text-lg hover:scale-110"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Search button - Mobile */}
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-3xl py-6 font-bold text-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/25 flex items-center justify-center space-x-3"
            >
              <Search className="w-6 h-6" />
              <span>Search amazing places</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110">
          <ChevronDown className="w-6 h-6 text-white" />
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
