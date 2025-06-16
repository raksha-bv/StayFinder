import React, { useState } from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const DateRangeCalendar = ({
  dateRange,
  onDateChange,
  onClose,
  onClear,
  minDate = new Date(),
  showDoubleView = true,
  className = "",
}) => {
  return (
    <div className={`animate-in slide-in-from-top-2 duration-300 ${className}`}>
      {/* Custom Calendar Styles */}
      <style jsx>{`
        .react-calendar {
          border: none !important;
          border-radius: 1.5rem 1.5rem 0 0 !important;
          background: white !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          padding: 1.5rem !important;
          font-family: inherit !important;
          width: auto !important;
        }

        .react-calendar__navigation {
          margin-bottom: 1rem !important;
          background: none !important;
          border-radius: 0.75rem !important;
          padding: 0.5rem !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }

        .react-calendar__navigation button {
          background: none !important;
          border: none !important;
          color: #374151 !important;
          font-size: 1rem !important;
          font-weight: 600 !important;
          padding: 0.75rem !important;
          border-radius: 0.75rem !important;
          transition: all 0.2s !important;
        }

        .react-calendar__navigation button:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }

        .react-calendar__navigation__label {
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          color: #111827 !important;
        }

        .react-calendar__month-view__weekdays {
          background: none !important;
          padding: 0.5rem 0 !important;
        }

        .react-calendar__month-view__weekdays__weekday {
          color: #6b7280 !important;
          font-weight: 500 !important;
          font-size: 0.75rem !important;
          text-align: center !important;
          padding: 0.5rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
        }

        .react-calendar__tile {
          background: none !important;
          border: none !important;
          color: #374151 !important;
          font-size: 0.875rem !important;
          font-weight: 400 !important;
          padding: 0 !important;
          height: 2.5rem !important;
          width: 2.5rem !important;
          border-radius: 50% !important;
          transition: all 0.2s !important;
          position: relative !important;
          margin: 0.125rem !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .react-calendar__tile:hover {
          background: #f3f4f6 !important;
          color: #111827 !important;
        }

        .react-calendar__tile--active {
          background: #ef4444 !important;
          color: white !important;
          z-index: 10 !important;
        }

        .react-calendar__tile--active:hover {
          background: #dc2626 !important;
          color: white !important;
        }

        /* Range start and end dates - red circles */
        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background: #ef4444 !important;
          color: white !important;
          border-radius: 50% !important;
          z-index: 10 !important;
          position: relative !important;
        }

        /* Range middle dates - light red background */
        .react-calendar__tile--range {
          background: #fee2e2 !important;
          color: #ef4444 !important;
          border-radius: 50% !important;
          position: relative !important;
        }

        .react-calendar__tile--range:hover {
          background: #fecaca !important;
          color: #ef4444 !important;
        }

        .react-calendar__tile--now {
          background: #f3f4f6 !important;
          color: #111827 !important;
          font-weight: 600 !important;
        }

        .react-calendar__tile--neighboringMonth {
          color: #d1d5db !important;
        }

        /* Double view specific styles */
        .react-calendar--doubleView {
          width: auto !important;
        }

        .react-calendar--doubleView .react-calendar__viewContainer {
          display: flex !important;
          gap: 3rem !important;
        }

        .react-calendar--doubleView .react-calendar__navigation {
          justify-content: center !important;
        }

        .react-calendar__month-view {
          padding: 0 !important;
        }

        .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 0.125rem !important;
        }
      `}</style>

      <ReactCalendar
        onChange={onDateChange}
        value={dateRange}
        selectRange={true}
        minDate={minDate}
        showDoubleView={showDoubleView}
        prev2Label={null}
        next2Label={null}
        showNeighboringMonth={false}
        className="custom-calendar"
      />

      {/* Bottom Controls - Integrated into calendar */}
      <div className="bg-white rounded-b-3xl p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={onClear}
            className="text-sm text-gray-600 hover:text-gray-800 underline transition-colors font-medium"
          >
            Clear dates
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateRangeCalendar;
