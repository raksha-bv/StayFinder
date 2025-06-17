import React from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const SortDropdown = ({
  sortBy,
  showSortDropdown,
  setShowSortDropdown,
  handleSort,
  sortDropdownRef,
  sortTriggerRef,
  sortOptions,
  isMobile = false,
}) => {
  return (
    <div className="relative">
      <button
        ref={sortTriggerRef}
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className={`flex items-center space-x-2 border border-gray-200 hover:bg-gray-50 transition-all duration-300 bg-white ${
          isMobile
            ? "px-4 py-2.5 rounded-xl text-sm"
            : "h-16 px-6 py-4 rounded-full hover:shadow-lg"
        }`}
      >
        <ArrowUpDown className="h-4 w-4" />
        <span className={`font-medium ${isMobile ? "text-sm" : ""}`}>Sort</span>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-300 ${
            showSortDropdown ? "rotate-180" : ""
          } ${isMobile ? "w-4 h-4" : "w-4 h-4"}`}
        />
      </button>

      {/* Sort Dropdown */}
      {showSortDropdown && (
        <div
          ref={sortDropdownRef}
          className={`absolute top-full mt-2 bg-white shadow-xl border border-gray-100 py-2 z-50 animate-in slide-in-from-top-2 duration-300 ${
            isMobile
              ? "left-0 w-48 rounded-xl"
              : "right-0 w-56 rounded-2xl shadow-2xl"
          }`}
        >
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSort(option.value)}
              className={`w-full text-left hover:bg-gray-50 transition-colors text-sm ${
                sortBy === option.value
                  ? "text-red-600 font-semibold bg-red-50"
                  : "text-gray-700"
              } ${isMobile ? "px-3 py-2.5" : "px-4 py-3"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
