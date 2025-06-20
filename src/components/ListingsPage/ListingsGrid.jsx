import React, { useMemo } from "react";
import StayCard from "../StayCard";

const ListingsGrid = ({
  stays,
  sortBy,
  sortOptions,
  isLoading,
  pagination,
  onLoadMore,
  onSort,
}) => {
  // Client-side sorting as fallback if API doesn't handle it
  const sortedStays = useMemo(() => {
    if (!stays || stays.length === 0) return stays;

    const staysCopy = [...stays];

    console.log("ListingsGrid - Sorting stays client-side:", {
      sortBy,
      originalOrder: staysCopy.map((s) => ({
        id: s._id,
        price: s.pricing?.basePrice,
        rating: s.rating?.average,
      })),
    });

    switch (sortBy) {
      case "price-low":
        return staysCopy.sort((a, b) => {
          const priceA = a.pricing?.basePrice || 0;
          const priceB = b.pricing?.basePrice || 0;
          return priceA - priceB;
        });

      case "price-high":
        return staysCopy.sort((a, b) => {
          const priceA = a.pricing?.basePrice || 0;
          const priceB = b.pricing?.basePrice || 0;
          return priceB - priceA;
        });

      case "rating":
        return staysCopy.sort((a, b) => {
          const ratingA = a.rating?.average || 0;
          const ratingB = b.rating?.average || 0;
          return ratingB - ratingA;
        });

      case "newest":
        return staysCopy.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA;
        });

      case "recommended":
      default:
        // Keep original order for recommended
        return staysCopy;
    }
  }, [stays, sortBy]);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Results header with sort indication */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h2 className="text-xl font-semibold text-gray-900">
          {isLoading
            ? "Loading..."
            : pagination.totalListings > 0
            ? `${pagination.totalListings} stays found`
            : "No stays found"}
        </h2>
        {!isLoading && sortedStays.length > 0 && (
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <span>Sorted by:</span>
            <span className="font-medium text-gray-700">
              {sortOptions.find((option) => option.value === sortBy)?.label ||
                "Recommended"}
            </span>
          </div>
        )}
      </div>

      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === "development" && !isLoading && (
        <div className="mb-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Debug: {sortedStays.length} stays, sortBy: {sortBy},
          first 3 prices:{" "}
          {sortedStays
            .slice(0, 3)
            .map((s) => s.pricing?.basePrice || 0)
            .join(", ")}
        </div>
      )} */}

      {/* Loading State */}
      {isLoading && sortedStays.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && sortedStays.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No listings found</div>
          <p className="text-gray-400">Try adjusting your search filters</p>
        </div>
      )}

      {/* Listings Grid */}
      {sortedStays.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {sortedStays.map((stay, index) => (
              <StayCard
                key={`${stay._id}-${sortBy}-${index}`} // Force re-render on sort change
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
        </>
      )}

      {/* Load More */}
      {sortedStays.length > 0 &&
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
      {pagination && sortedStays.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {sortedStays.length} of {pagination.totalListings} places
          {pagination.totalPages > 1 && (
            <span className="ml-2">
              (Page {pagination.currentPage} of {pagination.totalPages})
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ListingsGrid;
