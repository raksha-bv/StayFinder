import { useEffect } from "react";
import StayCard from "../StayCard";
import useListingStore from "../../store/useListingStore";

const FeaturedStays = () => {
  // Get listings and functions from Zustand store
  const {
    listings,
    isLoading,
    getListings,
    setFilters,
    setSortBy,
  } = useListingStore();

  useEffect(() => {
    // Clear any existing filters and set sort to recommended for featured stays
    setFilters({
      city: "",
      country: "",
      propertyType: "",
      roomType: "",
      minPrice: "",
      maxPrice: "",
      guests: "",
      amenities: [],
      checkIn: "",
      checkOut: "",
    });
    
    setSortBy("recommended");
    
    // Fetch featured listings when component mounts
    getListings(1, {}, "recommended");
  }, [getListings, setFilters, setSortBy]);

  // Show loading state
  if (isLoading) {
    return (
      <section className="py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="scrolling-container mb-4 sm:mb-6 md:mb-8">
          <div className="horizontal-scrolling-items bebas-neue-regular">
            <div className="horizontal-scrolling-items__item">
              FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS •
              FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS
              •&nbsp;
            </div>
            <div className="horizontal-scrolling-items__item">
              FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS •
              FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS
              •&nbsp;
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading featured stays...</div>
        </div>
      </section>
    );
  }

  // Transform listing data to match StayCard props
  const transformedListings = listings.map((listing) => {
    // Handle rating properly - ensure it's always a number
    let ratingValue = 4.5; // default value
    if (listing.rating) {
      if (typeof listing.rating === 'object' && listing.rating.average) {
        ratingValue = listing.rating.average;
      } else if (typeof listing.rating === 'number') {
        ratingValue = listing.rating;
      }
    }

    return {
      id: listing._id,
      images: listing.images?.map((img) => img.url) || [],
      location: `${listing.address?.city || listing.location?.city || ""}, ${listing.address?.country || listing.location?.country || ""}`,
      area: listing.address?.area || listing.location?.address || listing.propertyType,
      dates: listing.availability ? "Available" : "Check dates",
      price: `₹${listing.pricePerNight || listing.pricing?.basePrice || 0}`,
      rating: ratingValue,
      isGuestFavorite: listing.featured || listing.isGuestFavorite || false,
      title: listing.title,
      propertyType: listing.propertyType,
      roomType: listing.roomType,
      maxGuests: listing.capacity?.guests,
      amenities: listing.amenities,
    };
  });

  return (
    <section
      id="featured-stays"
      className="py-6 sm:py-8 md:py-12 lg:py-16 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16"
    >
      <div className="scrolling-container mb-4 sm:mb-6 md:mb-8">
        <div className="horizontal-scrolling-items bebas-neue-regular">
          <div className="horizontal-scrolling-items__item">
            FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS •
            FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS
            •&nbsp;
          </div>
          <div className="horizontal-scrolling-items__item">
            FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS •
            FEATURED STAYS • FEATURED STAYS • FEATURED STAYS • FEATURED STAYS
            •&nbsp;
          </div>
        </div>
      </div>

      {transformedListings.length > 0 ? (
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 pb-4">
            {transformedListings.map((stay) => (
              <div
                key={stay.id}
                className="flex-shrink-0 w-40 xs:w-44 sm:w-52 md:w-60 lg:w-72 xl:w-80"
              >
                <StayCard {...stay} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No featured stays available</div>
        </div>
      )}

      <style jsx={true}>{`
        @keyframes infiniteScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .scrolling-container {
          width: 100%;
          overflow-x: hidden;
        }

        .horizontal-scrolling-items {
          display: flex;
          font-size: 1.25rem;
          animation-name: infiniteScroll;
          animation-duration: 30s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .horizontal-scrolling-items__item {
          white-space: nowrap;
          font-weight: 400;
          color: #111827;
          font-family: "Bebas Neue", sans-serif;
        }

        @media (min-width: 375px) {
          .horizontal-scrolling-items {
            font-size: 1.4rem;
            animation-duration: 28s;
          }
        }

        @media (min-width: 480px) {
          .horizontal-scrolling-items {
            font-size: 1.6rem;
            animation-duration: 25s;
          }
        }

        @media (min-width: 640px) {
          .horizontal-scrolling-items {
            font-size: 1.8rem;
            animation-duration: 22s;
          }
        }

        @media (min-width: 768px) {
          .horizontal-scrolling-items {
            font-size: 2.2rem;
            animation-duration: 20s;
          }
        }

        @media (min-width: 1024px) {
          .horizontal-scrolling-items {
            font-size: 2.8rem;
            animation-duration: 18s;
          }
        }

        @media (min-width: 1280px) {
          .horizontal-scrolling-items {
            font-size: 3rem;
            animation-duration: 20s;
          }
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Custom breakpoint for extra small screens */
        @media (min-width: 475px) {
          .xs\:w-44 {
            width: 11rem;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturedStays;
