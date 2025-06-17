import React from "react";
import { Users, ChevronDown } from "lucide-react";

const GuestSearch = ({
  filters,
  showGuestDropdown,
  setShowGuestDropdown,
  adjustGuests,
  guestDropdownRef,
  guestTriggerRef,
  isMobile = false,
}) => {
  return (
    <div className="relative">
      <div
        ref={guestTriggerRef}
        className={`cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
          isMobile
            ? "px-3 py-3 rounded-xl"
            : "px-4 py-3 rounded-full bg-gray-50/50"
        }`}
        onClick={() => setShowGuestDropdown(!showGuestDropdown)}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-lg ${
              !isMobile ? "p-2 rounded-full" : ""
            }`}
          >
            <Users
              className={`text-emerald-500 ${
                isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
              }`}
            />
          </div>
          <div className="flex-1 text-left min-w-0">
            <div
              className={`font-semibold text-gray-500 uppercase tracking-wide mb-0.5 ${
                isMobile ? "text-xs" : "text-xs tracking-wider mb-1"
              }`}
            >
              Who
            </div>
            <div
              className={`text-gray-900 font-medium truncate ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {filters.guests + filters.children === 1
                ? "1 guest"
                : `${filters.guests + filters.children} guests`}
            </div>
          </div>
          <ChevronDown
            className={`text-gray-400 transition-transform duration-300 ${
              showGuestDropdown ? "rotate-180" : ""
            } ${isMobile ? "w-3 h-3" : "w-4 h-4"}`}
          />
        </div>
      </div>

      {/* Guests Dropdown */}
      {showGuestDropdown && (
        <div
          ref={guestDropdownRef}
          className={`absolute top-full mt-2 bg-white shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-300 ${
            isMobile
              ? "right-0 w-72 rounded-2xl p-4"
              : "right-0 w-80 rounded-3xl p-6"
          }`}
        >
          {/* Adults */}
          <div
            className={`flex items-center justify-between ${
              isMobile ? "mb-4" : "mb-6"
            }`}
          >
            <div>
              <span
                className={`text-gray-800 font-semibold ${
                  isMobile ? "" : "text-lg"
                }`}
              >
                Adults
              </span>
              <p
                className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                Ages 13 or above
              </p>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "space-x-3" : "space-x-4"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  adjustGuests("guests", -1);
                }}
                disabled={filters.guests <= 1}
                className={`rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 ${
                  isMobile
                    ? "w-8 h-8"
                    : "w-10 h-10 hover:scale-110 disabled:hover:scale-100"
                }`}
              >
                −
              </button>
              <span
                className={`font-bold text-gray-800 text-center ${
                  isMobile ? "w-6" : "text-lg w-8"
                }`}
              >
                {filters.guests}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  adjustGuests("guests", 1);
                }}
                className={`rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 ${
                  isMobile ? "w-8 h-8" : "w-10 h-10 hover:scale-110"
                }`}
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div className="flex items-center justify-between">
            <div>
              <span
                className={`text-gray-800 font-semibold ${
                  isMobile ? "" : "text-lg"
                }`}
              >
                Children
              </span>
              <p
                className={`text-gray-500 ${isMobile ? "text-xs" : "text-sm"}`}
              >
                Ages 2-12
              </p>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "space-x-3" : "space-x-4"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  adjustGuests("children", -1);
                }}
                disabled={filters.children <= 0}
                className={`rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 ${
                  isMobile
                    ? "w-8 h-8"
                    : "w-10 h-10 hover:scale-110 disabled:hover:scale-100"
                }`}
              >
                −
              </button>
              <span
                className={`font-bold text-gray-800 text-center ${
                  isMobile ? "w-6" : "text-lg w-8"
                }`}
              >
                {filters.children}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  adjustGuests("children", 1);
                }}
                className={`rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 ${
                  isMobile ? "w-8 h-8" : "w-10 h-10 hover:scale-110"
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestSearch;
