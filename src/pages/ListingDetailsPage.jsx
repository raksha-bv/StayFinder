import React, { useState, useEffect, useRef } from "react";
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
  ChevronDown,
} from "lucide-react";
import useListingStore from "../store/useListingStore";
import useBookingStore from "../store/useBookingStore";
import DateRangeCalendar from "../components/DateRangeCalendar";
import GuestSearch from "../components/ListingsPage/GuestSearch";
import toast from "react-hot-toast";

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Date and Guest state
  const [dateRange, setDateRange] = useState([null, null]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [guests, setGuests] = useState({
    guests: 1,
    children: 0,
  });
  
  const [specialRequests, setSpecialRequests] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [nights, setNights] = useState(0);

  // Refs for dropdowns
  const calendarDropdownRef = useRef(null);
  const calendarTriggerRef = useRef(null);
  const guestDropdownRef = useRef(null);
  const guestTriggerRef = useRef(null);

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
    if (dateRange[0] && dateRange[1] && currentListing) {
      const checkInDate = new Date(dateRange[0]);
      const checkOutDate = new Date(dateRange[1]);

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
  }, [dateRange, currentListing]);

  // Check availability when dates change
  useEffect(() => {
    if (dateRange[0] && dateRange[1] && id) {
      const timeoutId = setTimeout(() => {
        handleCheckAvailability();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      clearAvailability();
    }
  }, [dateRange, id]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        calendarDropdownRef.current &&
        !calendarDropdownRef.current.contains(event.target) &&
        calendarTriggerRef.current &&
        !calendarTriggerRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }

      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target) &&
        guestTriggerRef.current &&
        !guestTriggerRef.current.contains(event.target)
      ) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleDateChange = (range) => {
    setDateRange(range);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };

  const handleClearDates = () => {
    setDateRange([null, null]);
    clearAvailability();
  };

  const adjustGuests = (type, increment) => {
    setGuests(prev => ({
      ...prev,
      [type]: Math.max(type === 'guests' ? 1 : 0, prev[type] + increment)
    }));
  };

  const handleCheckAvailability = async () => {
    if (!dateRange[0] || !dateRange[1] || !id) return;

    const checkIn = dateRange[0].toISOString().split('T')[0];
    const checkOut = dateRange[1].toISOString().split('T')[0];

    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      return;
    }

    await checkAvailability(id, checkIn, checkOut);
  };

  const formatDateRange = () => {
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
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const handleReserve = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (!guests.guests || guests.guests < 1) {
      toast.error("At least 1 adult guest is required");
      return;
    }

    const checkIn = dateRange[0].toISOString().split('T')[0];
    const checkOut = dateRange[1].toISOString().split('T')[0];

    const dateValidation = validateBookingDates(checkIn, checkOut);
    if (!dateValidation.valid) {
      toast.error(dateValidation.message);
      return;
    }

    if (availability && !availability.available) {
      toast.error("Selected dates are not available");
      return;
    }

    const totalGuests = guests.guests + guests.children;
    if (totalGuests > currentListing.capacity?.guests) {
      toast.error(`Maximum ${currentListing.capacity.guests} guests allowed`);
      return;
    }

    const bookingData = {
      listingId: id,
      checkIn,
      checkOut,
      guests: {
        adults: guests.guests,
        children: guests.children,
      },
      specialRequests: specialRequests.trim(),
    };

    try {
      const booking = await createBooking(bookingData);

      if (booking) {
        toast.success("Booking created successfully!");
        
        setDateRange([null, null]);
        setGuests({ guests: 1, children: 0 });
        setSpecialRequests("");
        setTotalAmount(0);
        setNights(0);
        clearAvailability();
        
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
              {navigator.share && (
                <button
                  onClick={nativeShare}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Share size={20} className="text-gray-600" />
                  <span className="text-gray-700">Share via device</span>
                </button>
              )}

              <button
                onClick={copyToClipboard}
                className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Copy size={20} className="text-gray-600" />
                <span className="text-gray-700">Copy link</span>
              </button>

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

                  <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {currentListing.images.length}
                  </div>
                </>
              )}
            </div>

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

              {/* Date Selection */}
              <div className="relative">
                <div
                  ref={calendarTriggerRef}
                  className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 px-4 py-3 rounded-xl border border-gray-200 ${
                    showCalendar ? "border-gray-300 bg-gray-100" : ""
                  }`}
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-lg">
                      <Calendar className="text-blue-500 h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">
                        When
                      </div>
                      <div className="text-gray-900 font-medium text-sm">
                        {formatDateRange()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calendar Dropdown */}
                {showCalendar && (
                  <div
                    ref={calendarDropdownRef}
                    className="absolute top-full mt-2 z-50"
                    style={{
                      left: "50%",
                      transform: "translateX(-50%)",
                      maxWidth: "90vw",
                    }}
                  >
                    <DateRangeCalendar
                      dateRange={dateRange}
                      onDateChange={handleDateChange}
                      onClose={handleCloseCalendar}
                      onClear={handleClearDates}
                      minDate={new Date()}
                      showDoubleView={window.innerWidth > 768}
                    />
                  </div>
                )}
              </div>

              {/* Guest Selection */}
              <div className="relative">
                <div
                  ref={guestTriggerRef}
                  className={`cursor-pointer hover:bg-gray-100 transition-all duration-300 px-4 py-3 rounded-xl border border-gray-200 ${
                    showGuestDropdown ? "border-gray-300 bg-gray-100" : ""
                  }`}
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 rounded-lg">
                      <Users className="text-emerald-500 h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-semibold text-gray-500 uppercase tracking-wide text-xs mb-1">
                        Who
                      </div>
                      <div className="text-gray-900 font-medium text-sm">
                        {guests.guests + guests.children === 1
                          ? "1 guest"
                          : `${guests.guests + guests.children} guests`}
                      </div>
                    </div>
                    <ChevronDown
                      className={`text-gray-400 transition-transform duration-300 w-4 h-4 ${
                        showGuestDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Guests Dropdown */}
                {showGuestDropdown && (
                  <div
                    ref={guestDropdownRef}
                    className="absolute top-full mt-2 bg-white shadow-xl border border-gray-100 z-50 animate-in slide-in-from-top-2 duration-300 right-0 w-80 rounded-3xl p-6"
                    style={{
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(20px)",
                      background: "rgba(255, 255, 255, 0.98)",
                    }}
                  >
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-gray-800 font-semibold text-lg">
                          Adults
                        </span>
                        <p className="text-gray-500 text-sm">
                          Ages 13 or above
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            adjustGuests("guests", -1);
                          }}
                          disabled={guests.guests <= 1}
                          className="rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 w-10 h-10 hover:scale-110 disabled:hover:scale-100"
                        >
                          −
                        </button>
                        <span className="font-bold text-gray-800 text-center text-lg w-8">
                          {guests.guests}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            adjustGuests("guests", 1);
                          }}
                          className="rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 w-10 h-10 hover:scale-110"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-800 font-semibold text-lg">
                          Children
                        </span>
                        <p className="text-gray-500 text-sm">
                          Ages 2-12
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            adjustGuests("children", -1);
                          }}
                          disabled={guests.children <= 0}
                          className="rounded-full border-2 border-gray-300 disabled:border-gray-200 disabled:text-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 w-10 h-10 hover:scale-110 disabled:hover:scale-100"
                        >
                          −
                        </button>
                        <span className="font-bold text-gray-800 text-center text-lg w-8">
                          {guests.children}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            adjustGuests("children", 1);
                          }}
                          className="rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-400 hover:text-red-500 transition-all duration-300 font-semibold text-gray-600 w-10 h-10 hover:scale-110"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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
              {dateRange[0] && dateRange[1] && (
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
                  !dateRange[0] ||
                  !dateRange[1] ||
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
