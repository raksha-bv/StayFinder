import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import useWishlistStore from "../store/useWishlistStore";
import useAuthStore from "../store/useAuthStore";

const StayCard = ({
  id,
  images = [
    "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
  ],
  location = "Kollam, India",
  area = "Kollam beach",
  dates = "9-15 Jan",
  price = "₹2,568",
  rating = 4.79,
  isGuestFavorite = true,
  title,
  roomType,
  maxGuests,
  amenities,
}) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  const { authUser } = useAuthStore();
  const {
    wishlists,
    isListingInWishlist,
    getWishlistsWithListing,
    addToWishlist,
    removeFromWishlist,
    createWishlist,
    getUserWishlists,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlistStore();

  const [isLiked, setIsLiked] = useState(false);

  // Check if listing is in wishlist on component mount and when wishlists change
  useEffect(() => {
    if (id && wishlists.length > 0) {
      setIsLiked(isListingInWishlist(id));
    }
  }, [id, wishlists, isListingInWishlist]);

  // Load user wishlists on component mount if user is authenticated
  useEffect(() => {
    if (authUser) {
      getUserWishlists();
    }
  }, [authUser, getUserWishlists]);

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImage(index);
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (!authUser) {
      navigate("/login");
      return;
    }

    if (!id) {
      console.error("Listing ID is required");
      return;
    }

    try {
      if (isLiked) {
        // Remove from wishlist
        const wishlistsWithListing = getWishlistsWithListing(id);

        if (wishlistsWithListing.length > 0) {
          // Remove from the first wishlist (or you could show a modal to select which one)
          const firstWishlist = wishlistsWithListing[0];
          await removeFromWishlist(firstWishlist._id, id);
        }
      } else {
        // Add to wishlist
        if (wishlists.length === 0) {
          // Create a default wishlist if user has none
          const newWishlist = await createWishlist({
            name: "My Wishlist",
            isPrivate: true,
          });

          if (newWishlist) {
            await addToWishlist(newWishlist._id, id);
          }
        } else {
          // Add to the first wishlist (or you could show a modal to select which one)
          const defaultWishlist = wishlists[0];
          await addToWishlist(defaultWishlist._id, id);
        }
      }
    } catch (error) {
      console.error("Error handling wishlist action:", error);
    }
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/listings/${id}`);
    }
  };

  // Show loading state on heart button when adding/removing
  const isWishlistLoading = isAddingToWishlist || isRemovingFromWishlist;

  return (
    <div className="w-full group cursor-pointer" onClick={handleCardClick}>
      {/* Image Container - Square Aspect Ratio */}
      <div className="relative aspect-square overflow-hidden rounded-xl sm:rounded-2xl">
        {/* Guest Favorite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 bg-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium text-gray-800 shadow-sm">
            Guest favourite
          </div>
        )}

        {/* Heart Icon */}
        <button
          onClick={handleLike}
          disabled={isWishlistLoading}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full transition-all duration-300 ${
            isWishlistLoading
              ? "bg-black/20 cursor-not-allowed"
              : "bg-black/10 hover:bg-black/20"
          }`}
        >
          <Heart
            size={14}
            className={`sm:w-4 sm:h-4 transition-all duration-300 ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            } ${isWishlistLoading ? "animate-pulse" : ""}`}
          />
        </button>

        {/* Image */}
        <img
          src={images[currentImage]}
          alt={title || `${location} accommodation`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Navigation Overlay */}
        <div className="absolute inset-0 flex">
          <button
            onClick={prevImage}
            className="flex-1 bg-transparent"
            aria-label="Previous image"
          />
          <button
            onClick={nextImage}
            className="flex-1 bg-transparent"
            aria-label="Next image"
          />
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                index === currentImage ? "bg-white" : "bg-white/60"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Content - Now Transparent */}
      <div className="pt-2 sm:pt-3 px-1 sm:px-0">
        {/* Location and Rating */}
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {location}
            </h3>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            <Star size={10} className="sm:w-3 sm:h-3 text-black fill-current" />
            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {rating}
            </span>
          </div>
        </div>

        {/* Area - Hidden on smaller screens */}
        <p className="text-gray-500 text-xs sm:text-sm mb-1 truncate hidden sm:block">
          {area}
        </p>

        {/* Dates - Hidden on smaller screens */}
        <p className="text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2 hidden sm:block">
          {dates}
        </p>

        {/* Price - Hidden on smaller screens */}
        <div className="flex items-baseline space-x-1 hidden sm:flex">
          <span className="text-xs sm:text-sm font-semibold text-gray-900">
            {price}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">night</span>
        </div>
      </div>
    </div>
  );
};

export default StayCard;
