import React from "react";
import { Calendar } from "lucide-react";
import DateRangeCalendar from "../DateRangeCalendar";

const DateSearch = ({
  filters,
  showCalendar,
  setShowCalendar,
  handleDateChange,
  handleCloseCalendar,
  handleClearDates,
  calendarDropdownRef,
  calendarTriggerRef,
  isMobile = false,
}) => {
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

  return (
    <div className="relative">
      <div
        ref={calendarTriggerRef}
        className={`cursor-pointer hover:bg-gray-50 transition-all duration-300 ${
          isMobile
            ? "px-3 py-3 rounded-xl"
            : "px-4 py-3 rounded-full bg-gray-50/50"
        }`}
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg ${
              !isMobile ? "p-2 rounded-full" : ""
            }`}
          >
            <Calendar
              className={`text-blue-500 ${
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
              When
            </div>
            <div
              className={`text-gray-900 font-medium truncate ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
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
            showDoubleView={!isMobile}
          />
        </div>
      )}
    </div>
  );
};

export default DateSearch;
