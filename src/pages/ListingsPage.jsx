import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ChevronDown,
  Globe,
  ArrowUpDown,
} from "lucide-react";
import StayCard from "../components/StayCard";
import DateRangeCalendar from "../components/DateRangeCalendar"; // Default import, not named import

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    children: 0,
    dateRange: [null, null],
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");

  // Refs for click outside handling
  const guestDropdownRef = useRef(null);
  const guestTriggerRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const sortTriggerRef = useRef(null);
  const calendarDropdownRef = useRef(null);
  const calendarTriggerRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const adjustGuests = (field, increment) => {
    setFilters((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + increment),
    }));
  };

  const handleSearch = () => {
    console.log("Search filters:", filters);
    // Add your search logic here
  };

  const handleSort = (sortOption) => {
    setSortBy(sortOption);
    setShowSortDropdown(false);
    console.log("Sort by:", sortOption);
  };

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

  // Click outside handlers
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
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target) &&
        locationTriggerRef.current &&
        !locationTriggerRef.current.contains(event.target)
      ) {
        setShowLocationDropdown(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target) &&
        sortTriggerRef.current &&
        !sortTriggerRef.current.contains(event.target)
      ) {
        setShowSortDropdown(false);
      }
      if (
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(event.target) &&
        calendarTriggerRef.current &&
        !calendarTriggerRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }
    };

    if (
      showGuestDropdown ||
      showLocationDropdown ||
      showSortDropdown ||
      showCalendar
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestDropdown, showLocationDropdown, showSortDropdown, showCalendar]);

  // Sample data for stays
  const stays = [
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Kollam, India",
      area: "Kollam beach",
      dates: "9-15 Jan",
      price: "₹2,568",
      rating: 4.79,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Goa, India",
      area: "Baga Beach",
      dates: "12-18 Jan",
      price: "₹3,200",
      rating: 4.85,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Mumbai, India",
      area: "Marine Drive",
      dates: "5-10 Feb",
      price: "₹4,500",
      rating: 4.92,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Kerala, India",
      area: "Backwaters",
      dates: "20-25 Jan",
      price: "₹1,800",
      rating: 4.67,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Udaipur, India",
      area: "City Palace",
      dates: "15-20 Mar",
      price: "₹3,800",
      rating: 4.88,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Jaipur, India",
      area: "Pink City",
      dates: "8-14 Feb",
      price: "₹2,900",
      rating: 4.71,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Manali, India",
      area: "Old Manali",
      dates: "22-28 Jan",
      price: "₹2,200",
      rating: 4.73,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Rishikesh, India",
      area: "Ganges Side",
      dates: "3-9 Mar",
      price: "₹1,600",
      rating: 4.65,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Shimla, India",
      area: "Mall Road",
      dates: "18-24 Feb",
      price: "₹2,700",
      rating: 4.81,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Agra, India",
      area: "Taj Mahal Area",
      dates: "10-15 Apr",
      price: "₹3,100",
      rating: 4.77,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Darjeeling, India",
      area: "Tiger Hill",
      dates: "25-30 Mar",
      price: "₹2,000",
      rating: 4.69,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Varanasi, India",
      area: "Ghats",
      dates: "6-12 Apr",
      price: "₹1,900",
      rating: 4.63,
      isGuestFavorite: false,
    },
  ];

  const popularDestinations = [
    "Mumbai, India",
    "Delhi, India",
    "Bangalore, India",
    "Goa, India",
    "Kerala, India",
    "Rajasthan, India",
  ];

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Modern Search Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
          {/* Mobile Layout */}
          <div className="lg:hidden space-y-3">
            {/* Mobile Search Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
              {/* Where */}
              <div className="relative mb-3">
                <div
                  ref={locationTriggerRef}
                  className="px-3 py-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-all duration-300"
                  onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-lg">
                      <MapPin className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                        Where
                      </div>
                      <div className="text-gray-900 font-medium text-sm">
                        {filters.where || "Search destinations"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Dropdown - Mobile */}
                {showLocationDropdown && (
                  <div
                    ref={locationDropdownRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in slide-in-from-top-2 duration-300"
                  >
                    <div className="mb-3">
                      <input
                        type="text"
                        placeholder="Search destinations"
                        value={filters.where}
                        onChange={(e) => handleInputChange("where", e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                        autoFocus
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Popular destinations
                      </h4>
                      <div className="space-y-1">
                        {popularDestinations.map((destination, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              handleInputChange("where", destination);
                              setShowLocationDropdown(false);
                            }}
                            className="w-full text-left px-2 py-2 hover:bg-gray-50 rounded-lg transition-colors text-sm text-gray-700"
                          >
                            {destination}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* When and Who - Side by side on mobile */}
              <div className="grid grid-cols-2 gap-3">
                {/* Date Range */}
                <div className="relative">
                  <div
                    ref={calendarTriggerRef}
                    className="px-3 py-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-all duration-300"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
                        <Calendar className="h-3.5 w-3.5 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                          When
                        </div>
                        <div className="text-gray-900 font-medium text-xs truncate">
                          {formatDateRange()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Dropdown - Mobile */}
                  {showCalendar && (
                    <div
                      ref={calendarDropdownRef}
                      className="absolute top-full left-0 mt-2 z-50"
                    >
                      <DateRangeCalendar
                        dateRange={filters.dateRange}
                        onDateChange={handleDateChange}
                        onClose={handleCloseCalendar}
                        onClear={handleClearDates}
                        minDate={new Date()}
                        showDoubleView={false}
                      />
                    </div>
                  )}
                </div>

                {/* Guests */}
                <div className="relative">
                  <div
                    ref={guestTriggerRef}
                    className="px-3 py-3 cursor-pointer hover:bg-gray-50 rounded-xl transition-all duration-300"
                    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-lg">
                        <Users className="h-3.5 w-3.5 text-emerald-500" />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                          Who
                        </div>
                        <div className="text-gray-900 font-medium text-xs truncate">
                          {filters.guests + filters.children === 1
                            ? "1 guest"
                            : `${filters.guests + filters.children} guests`}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${
                          showGuestDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Guests Dropdown - Mobile */}
                  {showGuestDropdown && (
                    <div
                      ref={guestDropdownRef}
                      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in slide-in-from-top-2 duration-300"
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-gray-800 font-semibold">Adults</span>
                          <p className="text-gray-500 text-xs">Ages 13 or above</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("guests", -1);
                            }}
                            disabled={filters.guests <= 1}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-800 w-6 text-center">
                            {filters.guests}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("guests", 1);
                            }}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-800 font-semibold">Children</span>
                          <p className="text-gray-500 text-xs">Ages 2-12</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("children", -1);
                            }}
                            disabled={filters.children <= 0}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-800 w-6 text-center">
                            {filters.children}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("children", 1);
                            }}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button - Mobile */}
              <button
                onClick={handleSearch}
                className="w-full mt-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center space-x-2"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Mobile Sort */}
            <div className="flex justify-between items-center">
              <div className="relative">
                <button
                  ref={sortTriggerRef}
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 bg-white text-sm"
                >
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="font-medium">Sort</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                      showSortDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Sort Dropdown - Mobile */}
                {showSortDropdown && (
                  <div
                    ref={sortDropdownRef}
                    className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-300"
                  >
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSort(option.value)}
                        className={`w-full text-left px-3 py-2.5 hover:bg-gray-50 transition-colors text-sm ${
                          sortBy === option.value
                            ? "text-red-600 font-semibold bg-red-50"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            {/* Main Search Capsule */}
            <div className="flex flex-1 items-center bg-white border border-gray-200 rounded-full hover:shadow-xl transition-all duration-300 p-2">
              <div className="flex flex-1 items-center">
                {/* Where Capsule */}
                <div className="flex-1 relative">
                  <div
                    ref={locationTriggerRef}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-all duration-300 bg-gray-50/50"
                    onClick={() =>
                      setShowLocationDropdown(!showLocationDropdown)
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full">
                        <MapPin className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Where
                        </div>
                        <div className="text-gray-900 font-medium text-sm">
                          {filters.where || "Search destinations"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Dropdown */}
                  {showLocationDropdown && (
                    <div
                      ref={locationDropdownRef}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in slide-in-from-top-2 duration-300"
                    >
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Search destinations"
                          value={filters.where}
                          onChange={(e) =>
                            handleInputChange("where", e.target.value)
                          }
                          className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none text-sm"
                          autoFocus
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
                          Popular destinations
                        </h4>
                        <div className="space-y-2">
                          {popularDestinations.map((destination, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                handleInputChange("where", destination);
                                setShowLocationDropdown(false);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors text-sm text-gray-700"
                            >
                              {destination}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date Range Capsule */}
                <div className="flex-1 relative mx-2">
                  <div
                    ref={calendarTriggerRef}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-all duration-300 bg-gray-50/50"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          When
                        </div>
                        <div className="text-gray-900 font-medium text-sm">
                          {formatDateRange()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calendar Dropdown */}
                  {showCalendar && (
                    <div
                      ref={calendarDropdownRef}
                      className="absolute top-full left-0 mt-2 z-50"
                    >
                      <DateRangeCalendar
                        dateRange={filters.dateRange}
                        onDateChange={handleDateChange}
                        onClose={handleCloseCalendar}
                        onClear={handleClearDates}
                        minDate={new Date()}
                        showDoubleView={true}
                      />
                    </div>
                  )}
                </div>

                {/* Guests Capsule */}
                <div className="flex-1 relative">
                  <div
                    ref={guestTriggerRef}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-50 rounded-full transition-all duration-300 bg-gray-50/50"
                    onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-full">
                        <Users className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Who
                        </div>
                        <div className="text-gray-900 font-medium text-sm">
                          {filters.guests + filters.children === 1
                            ? "1 guest"
                            : `${filters.guests + filters.children} guests`}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                          showGuestDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Guests Dropdown */}
                  {showGuestDropdown && (
                    <div
                      ref={guestDropdownRef}
                      className="absolute top-full right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in slide-in-from-top-2 duration-300"
                    >
                      {/* Adults */}
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <span className="text-gray-800 font-semibold text-lg">
                            Adults
                          </span>
                          <p className="text-gray-500 text-sm">
                            Ages 13 or above
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("guests", -1);
                            }}
                            disabled={filters.guests <= 1}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 hover:scale-110 disabled:hover:scale-100"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-800 text-lg w-8 text-center">
                            {filters.guests}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("guests", 1);
                            }}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-800 font-semibold text-lg">
                            Children
                          </span>
                          <p className="text-gray-500 text-sm">Ages 2-12</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("children", -1);
                            }}
                            disabled={filters.children <= 0}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 hover:scale-110 disabled:hover:scale-100"
                          >
                            −
                          </button>
                          <span className="font-bold text-gray-800 text-lg w-8 text-center">
                            {filters.children}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              adjustGuests("children", 1);
                            }}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 hover:scale-110"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-red-200"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* Sort Control */}
            <div className="relative">
              <button
                ref={sortTriggerRef}
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="h-16 flex items-center space-x-2 px-6 py-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-all duration-300 hover:shadow-lg bg-white"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm font-medium">Sort</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                    showSortDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Sort Dropdown */}
              {showSortDropdown && (
                <div
                  ref={sortDropdownRef}
                  className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-300"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors text-sm ${
                        sortBy === option.value
                          ? "text-red-600 font-semibold bg-red-50"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Results Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2 tracking-tight">
              Over 1,000 places
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Discover amazing stays around the world
            </p>
          </div>
          <div className="text-xs sm:text-sm text-gray-500">
            Sorted by:{" "}
            {sortOptions.find((option) => option.value === sortBy)?.label}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {stays.map((stay, index) => (
            <StayCard
              key={index}
              images={stay.images}
              location={stay.location}
              area={stay.area}
              dates={stay.dates}
              price={stay.price}
              rating={stay.rating}
              isGuestFavorite={stay.isGuestFavorite}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 sm:mt-16 text-center">
          <button className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base">
            Show more places
          </button>
        </div>
      </main>
    </div>
  );
};

export default ListingsPage;
