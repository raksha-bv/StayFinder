import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share,
  Heart,
  Star,
  Wifi,
  Car,
  Tv,
  Coffee,
  Wind,
  Users,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Loader,
  Copy,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import useListingStore from "../store/useListingStore";
import useBookingStore from "../store/useBookingStore";
import toast from "react-hot-toast";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
  });
  const [specialRequests, setSpecialRequests] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);

  const { currentListing, isLoading, getListingById } = useListingStore();
  const {
    createBooking,
    checkAvailability,
    availability,
    isCreating,
    isCheckingAvailability,
    clearAvailability,
    calculateBookingAmount,
    validateBookingDates,
  } = useBookingStore();

  useEffect(() => {
    if (id) {
      getListingById(id);
    }
  }, [id, getListingById]);

  // Calculate total amount and nights when dates change
  useEffect(() => {
    if (checkIn && checkOut && currentListing) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (checkOutDate > checkInDate) {
        const calculatedNights = Math.ceil(
          (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );
        const amount = calculatedNights * currentListing.pricing?.basePrice;

        setNights(calculatedNights);
        setTotalAmount(amount);
      } else {
        setNights(0);
        setTotalAmount(0);
      }
    } else {
      setNights(0);
      setTotalAmount(0);
    }
  }, [checkIn, checkOut, currentListing]);

  // Check availability when dates change
  useEffect(() => {
    if (checkIn && checkOut && id) {
      const timeoutId = setTimeout(() => {
        handleCheckAvailability();
      }, 500); // Debounce the availability check

      return () => clearTimeout(timeoutId);
    } else {
      clearAvailability();
    }
  }, [checkIn, checkOut, id]);

  const amenityIcons = {
    wifi: Wifi,
    parking: Car,
    tv: Tv,
    coffee: Coffee,
    ac: Wind,
  };

  const handleNextImage = () => {
    if (currentListing?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % currentListing.images.length);
    }
  };

  const handlePrevImage = () => {
    if (currentListing?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentListing.images.length - 1 : prev - 1
      );
    }
  };

  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut || !id) return;

    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return;
    }

    await checkAvailability(id, checkIn, checkOut);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const copyToClipboard = async () => {
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("Link copied to clipboard!");
      setShowShareModal(false);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      toast.success("Link copied to clipboard!");
      setShowShareModal(false);
    }
  };

  const shareOnSocial = (platform) => {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(currentListing?.title || "Check out this amazing place");
    const description = encodeURIComponent(
      `${currentListing?.title} in ${currentListing?.location?.city}, ${currentListing?.location?.country}. Starting from ₹${currentListing?.pricing?.basePrice}/night`
    );

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${title}%20${currentUrl}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${currentUrl}&text=${title}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
    setShowShareModal(false);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentListing?.title || "Amazing Stay",
          text: `Check out this amazing place: ${currentListing?.title}`,
          url: window.location.href,
        });
        setShowShareModal(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
          copyToClipboard(); // Fallback to copy
        }
      }
    } else {
      copyToClipboard(); // Fallback if native share is not supported
    }
  };

  const handleReserve = async () => {
    // Validate form data
    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!guests.adults || guests.adults < 1) {
      toast.error("At least 1 adult guest is required");
      return;
    }

    // Validate dates
    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      toast.error(dateValidation.message);
      return;
    }

    // Check if dates are available
    if (availability && !availability.available) {
      toast.error("Selected dates are not available");
      return;
    }

    // Validate guest count
    const totalGuests = guests.adults + guests.children;
    if (totalGuests > currentListing.capacity?.guests) {
      toast.error(`Maximum ${currentListing.capacity.guests} guests allowed`);
      return;
    }

    // Create booking data
    const bookingData = {
      listingId: id,
      checkIn,
      checkOut,
      guests: {
        adults: guests.adults,
        children: guests.children,
      },
      specialRequests: specialRequests.trim(),
    };

    try {
      const booking = await createBooking(bookingData);

      if (booking) {
        toast.success("Booking created successfully!");
        
        // Reset form
        setCheckIn("");
        setCheckOut("");
        setGuests({ adults: 1, children: 0 });
        setSpecialRequests("");
        setTotalAmount(0);
        setNights(0);
        clearAvailability();
        
        // Redirect to booking confirmation page
        navigate(`/booking-confirmation/${booking._id}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking. Please try again.");
    }
  };

  const formatRoomType = (roomType) => {
    const roomTypeMap = {
      entire_place: "Entire place",
      private_room: "Private room",
      shared_room: "Shared room",
    };
    return roomTypeMap[roomType] || roomType;
  };

  const formatPropertyType = (propertyType) => {
    return propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-300 rounded-2xl aspect-square"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-20 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentListing) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Listing not found
          </h2>
          <button
            onClick={() => navigate("/listings")}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Share this listing</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              {/* Native Share (if supported) */}
              {navigator.share && (
                <button
                  onClick={nativeShare}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Share size={20} className="text-gray-600" />
                  <span className="text-gray-700">Share via device</span>
                </button>
              )}

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Copy size={20} className="text-gray-600" />
                <span className="text-gray-700">Copy link</span>
              </button>

              {/* Social Media Options */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => shareOnSocial("facebook")}
                  className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Facebook size={20} className="text-blue-600" />
                  <span className="text-gray-700 text-sm">Facebook</span>
                </button>

                <button
                  onClick={() => shareOnSocial("twitter")}
                  className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Twitter size={20} className="text-blue-400" />
                  <span className="text-gray-700 text-sm">Twitter</span>
                </button>

                <button
                  onClick={() => shareOnSocial("whatsapp")}
                  className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={20} className="text-green-600" />
                  <span className="text-gray-700 text-sm">WhatsApp</span>
                </button>

                <button
                  onClick={() => shareOnSocial("telegram")}
                  className="flex items-center space-x-2 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <MessageCircle size={20} className="text-blue-500" />
                  <span className="text-gray-700 text-sm">Telegram</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/listings")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium">
              Back to listings
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <button 
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share size={18} />
              <span className="hidden sm:inline text-sm font-medium">
                Share
              </span>
            </button>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Heart
                size={18}
                className={isLiked ? "fill-red-500 text-red-500" : ""}
              />
              <span className="hidden sm:inline text-sm font-medium">Save</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              {currentListing.images && currentListing.images.length > 0 && (
                <>
                  <img
                    src={
                      currentListing.images[currentImageIndex]?.url ||
                      currentListing.images[currentImageIndex]
                    }
                    alt={currentListing.title}
                    className="w-full h-full object-cover"
                  />

                  {currentListing.images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentListing.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {currentListing.images && currentListing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {currentListing.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index
                        ? "border-gray-900"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image?.url || image}
                      alt={`${currentListing.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            {/* Header Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {currentListing.title}
              </h1>

              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span className="text-sm">
                    {currentListing.location?.city},{" "}
                    {currentListing.location?.country}
                  </span>
                </div>

                {currentListing.rating?.average > 0 && (
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="fill-current text-yellow-400" />
                    <span className="text-sm font-medium">
                      {currentListing.rating.average} (
                      {currentListing.rating.count} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{formatRoomType(currentListing.roomType)}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{currentListing.capacity?.guests} guests</span>
                </span>
                <span>•</span>
                <span>{currentListing.capacity?.bedrooms} bedrooms</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                About this place
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {currentListing.description}
              </p>
            </div>

            {/* Amenities */}
            {currentListing.amenities &&
              currentListing.amenities.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    What this place offers
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {currentListing.amenities
                      .slice(0, 6)
                      .map((amenity, index) => {
                        const IconComponent =
                          amenityIcons[amenity.toLowerCase()] || Wifi;
                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <IconComponent
                              size={20}
                              className="text-gray-600"
                            />
                            <span className="text-gray-700 capitalize">
                              {amenity}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

            {/* Reservation Card */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{currentListing.pricing?.basePrice}
                </span>
                <span className="text-gray-600">night</span>
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={getTodayDate()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || getTomorrowDate()}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adults
                  </label>
                  <select
                    value={guests.adults}
                    onChange={(e) =>
                      setGuests({ ...guests, adults: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    {Array.from(
                      { length: currentListing.capacity?.guests || 8 },
                      (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "adult" : "adults"}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Children (optional)
                  </label>
                  <select
                    value={guests.children}
                    onChange={(e) =>
                      setGuests({ ...guests, children: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  >
                    {Array.from(
                      {
                        length:
                          Math.max(0, (currentListing.capacity?.guests || 8) -
                          guests.adults) + 1,
                      },
                      (_, i) => (
                        <option key={i} value={i}>
                          {i} {i === 1 ? "child" : "children"}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special requests (optional)
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Any special requests or notes for the host..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {specialRequests.length}/500 characters
                </div>
              </div>

              {/* Availability Status */}
              {checkIn && checkOut && (
                <div className="space-y-2">
                  {isCheckingAvailability ? (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Loader size={16} className="animate-spin" />
                      <span className="text-sm">Checking availability...</span>
                    </div>
                  ) : availability ? (
                    availability.available ? (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle size={16} />
                        <span className="text-sm font-medium">
                          Available for selected dates
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-red-600">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">
                          Not available for selected dates
                        </span>
                      </div>
                    )
                  ) : null}
                </div>
              )}

              {/* Pricing Breakdown */}
              {nights > 0 && totalAmount > 0 && (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ₹{currentListing.pricing?.basePrice} × {nights} nights
                    </span>
                    <span>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              <button
                onClick={handleReserve}
                disabled={
                  isCreating ||
                  !checkIn ||
                  !checkOut ||
                  (availability && !availability.available) ||
                  isCheckingAvailability
                }
                className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
              >
                {isCreating ? (
                  <>
                    <Loader size={20} className="animate-spin" />
                    <span>Creating booking...</span>
                  </>
                ) : (
                  <span>Reserve now</span>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                You'll be redirected to confirmation page
              </p>
            </div>
          </div>
        </div>

        {/* Host Information */}
        {currentListing.host && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Meet your host
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                {currentListing.host.profilePic ? (
                  <img
                    src={currentListing.host.profilePic}
                    alt={`${currentListing.host.firstName} ${currentListing.host.lastName}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold text-lg">
                    {currentListing.host.firstName?.charAt(0) ||
                      currentListing.host.lastName?.charAt(0) ||
                      "H"}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentListing.host.firstName} {currentListing.host.lastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  Host since{" "}
                  {new Date(
                    currentListing.host.joinedDate || currentListing.createdAt
                  ).getFullYear()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetailsPage;
