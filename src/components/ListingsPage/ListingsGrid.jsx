import React from "react";
import StayCard from "../StayCard";

const ListingsGrid = ({
  stays,
  sortBy,
  sortOptions,
  isLoading,
  pagination,
  onLoadMore,
}) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-300 rounded-xl aspect-square mb-3"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
      {/* Results Header */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 sm:mb-2 tracking-tight">
            {isLoading
              ? "Loading..."
              : `Over ${pagination?.totalListings || 0} places`}
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

      {/* Loading State */}
      {isLoading && stays.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && stays.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No listings found</div>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </div>
      )}

      {/* Listings Grid */}
      {stays.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {stays.map((stay) => (
            <StayCard
              key={stay._id}
              id={stay._id}
              images={stay.images?.map((img) => img.url) || []}
              location={`${stay.location?.city || "Unknown"}, ${
                stay.location?.country || "Unknown"
              }`}
              area={stay.location?.address || stay.propertyType}
              dates={stay.availability ? "Available" : "Check dates"}
              price={`₹${stay.pricing?.basePrice || 0}`}
              rating={stay.rating?.average || 0}
              isGuestFavorite={stay.isGuestFavorite || false}
              title={stay.title}
              roomType={stay.roomType}
              maxGuests={stay.capacity?.guests}
              amenities={stay.amenities}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {stays.length > 0 &&
        pagination &&
        pagination.currentPage < pagination.totalPages && (
          <div className="mt-12 sm:mt-16 text-center">
            <button
              onClick={onLoadMore}
              disabled={isLoading}
              className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Show more places"}
            </button>
          </div>
        )}

      {/* Pagination Info */}
      {pagination && stays.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {stays.length} of {pagination.totalListings} places
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
          )}
        </div>
      )}
    </main>
  );
};

export default ListingsGrid;
