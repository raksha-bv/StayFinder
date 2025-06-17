import React from "react";
import StayCard from "../StayCard";

const ListingsGrid = ({ stays, sortBy, sortOptions }) => {
  return (
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
  );
};

export default ListingsGrid;
