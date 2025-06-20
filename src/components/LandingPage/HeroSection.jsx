import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Globe,
} from "lucide-react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const HeroSection = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    dateRange: [null, null],
  });

  const [activeField, setActiveField] = useState(null);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Refs for click outside handling
  const guestDropdownRef = useRef(null);
  const guestTriggerRef = useRef(null);

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

    // Create search parameters
    const searchParams = new URLSearchParams();

    if (filters.where) {
      searchParams.set("where", filters.where);
    }

    if (filters.dateRange && filters.dateRange[0]) {
      searchParams.set(
        "checkIn",
        filters.dateRange[0].toISOString().split("T")[0]
      );
      if (filters.dateRange[1]) {
        searchParams.set(
          "checkOut",
          filters.dateRange[1].toISOString().split("T")[0]
        );
      }
    }

    if (filters.guests) {
      searchParams.set("guests", filters.guests.toString());
    }

    // Navigate to listings page with search parameters
    navigate(`/listings?${searchParams.toString()}`);
  };

  // Handle date range changes
  const handleDateChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: value,
      checkIn: value && value[0] ? value[0].toISOString().split("T")[0] : "",
      checkOut: value && value[1] ? value[1].toISOString().split("T")[0] : "",
    }));
  };

  const handleClearDates = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: [null, null],
      checkIn: "",
      checkOut: "",
    }));
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const formatDateRange = () => {
    const { dateRange } = filters;
    if (!dateRange || !dateRange[0]) return "Add dates";

    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const endDate = dateRange[1].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      return `${startDate} - ${endDate}`;
    } else if (dateRange[0]) {
      return dateRange[0].toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    return "Add dates";
  };

  // Updated click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target) &&
        guestTriggerRef.current &&
        !guestTriggerRef.current.contains(event.target)
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

  // Add scroll to featured stays function
  const scrollToFeaturedStays = () => {
    const featuredStaysElement = document.getElementById("featured-stays");
    if (featuredStaysElement) {
      featuredStaysElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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

      {/* Calendar Overlay - Positioned absolutely to overlap title */}
      {showCalendar && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div className="relative transform scale-90">
            {/* Custom Calendar Styles for Hero Section */}
            <style jsx>{`
              .hero-calendar-container {
                border-radius: 1.5rem !important;
                background: rgba(255, 255, 255, 0.98) !important;
                backdrop-filter: blur(20px) !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
                overflow: hidden !important;
              }

              .hero-calendar .react-calendar {
                border: none !important;
                border-radius: 0 !important;
                background: transparent !important;
                padding: 1.2rem 1.2rem 1rem 1.2rem !important;
                font-family: inherit !important;
                width: auto !important;
              }

              .hero-calendar .react-calendar__navigation {
                margin-bottom: 0.8rem !important;
                background: none !important;
                border-radius: 0.75rem !important;
                padding: 0.4rem !important;
              }

              .hero-calendar .react-calendar__navigation button {
                background: none !important;
                border: none !important;
                color: #374151 !important;
                font-size: 0.9rem !important;
                font-weight: 600 !important;
                padding: 0.6rem !important;
                border-radius: 0.75rem !important;
                transition: all 0.2s !important;
              }

              .hero-calendar .react-calendar__navigation button:hover {
                background: #f3f4f6 !important;
                color: #111827 !important;
              }

              .hero-calendar .react-calendar__navigation__label {
                font-size: 1rem !important;
                font-weight: 600 !important;
                color: #111827 !important;
              }

              .hero-calendar .react-calendar__month-view__weekdays {
                background: none !important;
                padding: 0.4rem 0 !important;
              }

              .hero-calendar .react-calendar__month-view__weekdays__weekday {
                color: #6b7280 !important;
                font-weight: 500 !important;
                font-size: 0.7rem !important;
                text-align: center !important;
                padding: 0.4rem !important;
                text-transform: uppercase !important;
                letter-spacing: 0.05em !important;
              }

              .hero-calendar .react-calendar__tile {
                background: none !important;
                border: none !important;
                color: #374151 !important;
                font-size: 0.8rem !important;
                font-weight: 400 !important;
                padding: 0 !important;
                height: 2.2rem !important;
                width: 2.2rem !important;
                border-radius: 50% !important;
                transition: all 0.2s !important;
                position: relative !important;
                margin: 0.1rem !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
              }

              .hero-calendar .react-calendar__tile:hover {
                background: #f3f4f6 !important;
                color: #111827 !important;
              }

              .hero-calendar .react-calendar__tile--active {
                background: #3b82f6 !important;
                color: white !important;
                z-index: 10 !important;
              }

              .hero-calendar .react-calendar__tile--active:hover {
                background: #2563eb !important;
                color: white !important;
              }

              .hero-calendar .react-calendar__tile--rangeStart,
              .hero-calendar .react-calendar__tile--rangeEnd {
                background: #3b82f6 !important;
                color: white !important;
                border-radius: 50% !important;
                z-index: 10 !important;
                position: relative !important;
              }

              .hero-calendar .react-calendar__tile--range {
                background: #dbeafe !important;
                color: #3b82f6 !important;
                border-radius: 50% !important;
                position: relative !important;
              }

              .hero-calendar .react-calendar__tile--range:hover {
                background: #bfdbfe !important;
                color: #3b82f6 !important;
              }

              .hero-calendar .react-calendar__tile--now {
                background: #f3f4f6 !important;
                color: #111827 !important;
                font-weight: 600 !important;
              }

              .hero-calendar .react-calendar__tile--neighboringMonth {
                color: #d1d5db !important;
              }

              .hero-calendar .react-calendar--doubleView {
                width: auto !important;
              }

              .hero-calendar .react-calendar--doubleView .react-calendar__viewContainer {
                display: flex !important;
                gap: 2.5rem !important;
              }

              .hero-calendar .react-calendar--doubleView .react-calendar__navigation {
                justify-content: center !important;
              }

              .hero-calendar .react-calendar__month-view {
                padding: 0 !important;
              }

              .hero-calendar .react-calendar__month-view__days {
                display: grid !important;
                grid-template-columns: repeat(7, 1fr) !important;
                gap: 0.1rem !important;
              }
            `}</style>

            <div className="hero-calendar-container">
              <div className="hero-calendar">
                <ReactCalendar
                  onChange={handleDateChange}
                  value={filters.dateRange}
                  selectRange={true}
                  minDate={new Date()}
                  showDoubleView={window.innerWidth >= 768}
                  prev2Label={null}
                  next2Label={null}
                  showNeighboringMonth={false}
                  className="custom-calendar"
                />
              </div>

              {/* Integrated Calendar Controls - Seamlessly connected */}
              <div className="bg-transparent border-t border-gray-200/50 p-3">
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleClearDates}
                    className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors font-medium"
                  >
                    Clear dates
                  </button>
                  <button
                    onClick={handleCloseCalendar}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors shadow-md"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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

            {/* Date Range capsule */}
            <div
              className={`group backdrop-blur-xl bg-white/10 hover:bg-white/15 border border-white/20 rounded-full px-6 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer min-w-[300px] ${
                showCalendar ? "bg-white/20 scale-105 shadow-2xl" : ""
              }`}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full">
                  <Calendar className="w-4 h-4 text-blue-300" />
                </div>
                <div className="flex-1 text-left">
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                    When
                  </div>
                  <div className="text-white font-medium text-sm">
                    {formatDateRange()}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                    showCalendar ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Guests capsule */}
            <div className="relative">
              <div
                ref={guestTriggerRef}
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

              {/* Guest dropdown */}
              {showGuestDropdown && (
                <div
                  ref={guestDropdownRef}
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

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="group relative overflow-hidden bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white rounded-full p-5 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-rose-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Search className="w-6 h-6 relative z-10" />
            </button>
          </div>

          {/* Mobile & Tablet version */}
          <div className="lg:hidden space-y-3 sm:space-y-4 max-w-lg mx-auto">
            {/* Where capsule - Mobile */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-4 sm:p-5 transition-all duration-300 hover:bg-white/15 h-16 sm:h-20">
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-rose-400/20 to-rose-600/20 rounded-full flex-shrink-0">
                    <MapPin className="w-4 h-4 text-rose-300" />
                  </div>
                  <div className="flex-1 min-w-0">
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
                </div>
              </div>
            </div>

            {/* Date Range capsule - Mobile */}
            <div
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-full p-4 sm:p-5 transition-all duration-300 hover:bg-white/15 h-16 sm:h-20 cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-300" />
                  </div>
                  <div className="flex-1 text-center">
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-1">
                      When
                    </div>
                    <div className="text-white font-medium text-sm">
                      {formatDateRange()}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform duration-300 ${
                      showCalendar ? "rotate-180" : ""
                    }`}
                  />
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
        <div
          className="w-10 h-10 sm:w-14 sm:h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all duration-300 hover:scale-110"
          onClick={scrollToFeaturedStays}
        >
          <ChevronDown className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
        </div>
      </div>

      {/* Bottom right info */}
      <div className="absolute bottom-8 right-8 text-right hidden xl:block">
        <p className="text-2xl font-bold text-white mb-1">300+</p>
        <p className="text-sm text-white/80 font-medium">Unique stays</p>
        <p className="text-xs text-white/60">worldwide</p>
      </div>
    </section>
  );
};

export default HeroSection;
