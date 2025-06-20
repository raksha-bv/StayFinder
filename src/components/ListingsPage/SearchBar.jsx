import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import LocationSearch from "./LocationSearch";
import DateSearch from "./DateSearch";
import GuestSearch from "./GuestSearch";
import SortDropdown from "./SortDropdown";
import HostActions from "./HostActions";

const SearchBar = ({
  filters,
  handleInputChange,
  adjustGuests,
  handleSearch,
  handleDateChange,
  handleCloseCalendar,
  handleClearDates,
  sortBy = "recommended",
  handleSort,
  sortOptions,
}) => {
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  // Refs for click outside handling
  const guestDropdownRef = useRef(null);
  const guestTriggerRef = useRef(null);
  const locationDropdownRef = useRef(null);
  const locationTriggerRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const sortTriggerRef = useRef(null);
  const calendarDropdownRef = useRef(null);
  const calendarTriggerRef = useRef(null);

  const popularDestinations = [
    "Mumbai, India",
    "Delhi, India",
    "Bangalore, India",
    "Goa, India",
    "Kerala, India",
    "Rajasthan, India",
  ];

  const handleSortChange = (sortOption) => {
    handleSort(sortOption);
    setShowSortDropdown(false);
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

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-3">
          {/* Mobile Search Bar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
            {/* Where */}
            <div className="relative mb-3">
              <LocationSearch
                filters={filters}
                showLocationDropdown={showLocationDropdown}
                setShowLocationDropdown={setShowLocationDropdown}
                handleInputChange={handleInputChange}
                locationDropdownRef={locationDropdownRef}
                locationTriggerRef={locationTriggerRef}
                popularDestinations={popularDestinations}
                isMobile={true}
              />
            </div>

            {/* When and Who - Side by side on mobile */}
            <div className="grid grid-cols-2 gap-3">
              <DateSearch
                filters={filters}
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                handleDateChange={handleDateChange}
                handleCloseCalendar={handleCloseCalendar}
                handleClearDates={handleClearDates}
                calendarDropdownRef={calendarDropdownRef}
                calendarTriggerRef={calendarTriggerRef}
                isMobile={true}
              />

              <GuestSearch
                filters={filters}
                showGuestDropdown={showGuestDropdown}
                setShowGuestDropdown={setShowGuestDropdown}
                adjustGuests={adjustGuests}
                guestDropdownRef={guestDropdownRef}
                guestTriggerRef={guestTriggerRef}
                isMobile={true}
              />
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
            <SortDropdown
              sortBy={sortBy}
              showSortDropdown={showSortDropdown}
              setShowSortDropdown={setShowSortDropdown}
              handleSort={handleSortChange}
              sortDropdownRef={sortDropdownRef}
              sortTriggerRef={sortTriggerRef}
              sortOptions={sortOptions}
              isMobile={true}
            />
            <HostActions />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Main Search Capsule */}
          <div className="flex flex-1 items-center bg-white border border-gray-200 rounded-full hover:shadow-xl transition-all duration-300 p-2">
            <div className="flex flex-1 items-center">
              <div className="flex-1">
                <LocationSearch
                  filters={filters}
                  showLocationDropdown={showLocationDropdown}
                  setShowLocationDropdown={setShowLocationDropdown}
                  handleInputChange={handleInputChange}
                  locationDropdownRef={locationDropdownRef}
                  locationTriggerRef={locationTriggerRef}
                  popularDestinations={popularDestinations}
                  isMobile={false}
                />
              </div>

              <div className="flex-1 mx-2">
                <DateSearch
                  filters={filters}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                  handleDateChange={handleDateChange}
                  handleCloseCalendar={handleCloseCalendar}
                  handleClearDates={handleClearDates}
                  calendarDropdownRef={calendarDropdownRef}
                  calendarTriggerRef={calendarTriggerRef}
                  isMobile={false}
                />
              </div>

              <div className="flex-1">
                <GuestSearch
                  filters={filters}
                  showGuestDropdown={showGuestDropdown}
                  setShowGuestDropdown={setShowGuestDropdown}
                  adjustGuests={adjustGuests}
                  guestDropdownRef={guestDropdownRef}
                  guestTriggerRef={guestTriggerRef}
                  isMobile={false}
                />
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
          <SortDropdown
            sortBy={sortBy}
            showSortDropdown={showSortDropdown}
            setShowSortDropdown={setShowSortDropdown}
            handleSort={handleSortChange}
            sortDropdownRef={sortDropdownRef}
            sortTriggerRef={sortTriggerRef}
            sortOptions={sortOptions}
            isMobile={false}
          />
          <HostActions />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
