import React, { useEffect } from "react";
import { Heart } from "lucide-react";
import useWishlistStore from "../store/useWishlistStore";
import useAuthStore from "../store/useAuthStore";
import StayCard from "../components/StayCard";

const WishlistPage = () => {
  const { authUser } = useAuthStore();
  const { wishlists, getUserWishlists, isLoading } = useWishlistStore();

  useEffect(() => {
    if (authUser) {
      getUserWishlists();
    }
  }, [authUser, getUserWishlists]);

  // Transform listing data to match StayCard props
  const transformListingForCard = (listing) => {
    // Handle location data properly
    let locationString = "";
    if (listing.location) {
      if (typeof listing.location === 'string') {
        locationString = listing.location;
      } else if (typeof listing.location === 'object') {
        const city = listing.location.city || listing.location.address?.city || "";
        const country = listing.location.country || listing.location.address?.country || "";
        locationString = city && country ? `${city}, ${country}` : city || country || "";
      }
    }

    // Handle rating properly
    let ratingValue = 4.5;
    if (listing.rating) {
      if (typeof listing.rating === 'object' && listing.rating.average) {
        ratingValue = listing.rating.average;
      } else if (typeof listing.rating === 'number') {
        ratingValue = listing.rating;
      }
    }

    // Handle images
    const images = listing.images?.map((img) => 
      typeof img === 'string' ? img : img.url || img
    ) || [];

    return {
      id: listing._id,
      images: images,
      location: locationString || "Location not specified",
      area: listing.propertyType || listing.roomType || "Property",
      dates: "Available",
      price: `₹${listing.price || listing.pricePerNight || 0}`,
      rating: ratingValue,
      isGuestFavorite: listing.featured || false,
      title: listing.title,
      propertyType: listing.propertyType,
      roomType: listing.roomType,
      maxGuests: listing.maxGuests || listing.capacity?.guests,
      amenities: listing.amenities,
    };
  };

  // Get all liked listings from all wishlists
  const allLikedListings = wishlists.flatMap(wishlist => wishlist.listings);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlists</h1>
          <p className="text-gray-600">
            Your favorite properties you've saved
          </p>
        </div>

        {/* Liked Properties Grid */}
        {allLikedListings.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No saved properties yet
            </h3>
            <p className="text-gray-500">
              Start exploring and save your favorite properties by clicking the heart icon
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allLikedListings.map((listing) => {
              const transformedListing = transformListingForCard(listing);
              return (
                <StayCard key={listing._id} {...transformedListing} />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;