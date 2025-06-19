import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";

// Check if user is authorized to access booking (guest or host)
export const requireBookingAccess = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is the guest or host of the booking
    if (
      booking.guest.toString() !== req.user._id.toString() &&
      booking.host.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Access denied. You can only access your own bookings.",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.log("Error in requireBookingAccess middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if user is the host of the booking
export const requireBookingHost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. Only the host can perform this action.",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.log("Error in requireBookingHost middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if user is the guest of the booking
export const requireBookingGuest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.guest.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. Only the guest can perform this action.",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.log("Error in requireBookingGuest middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate booking creation data
export const validateBookingData = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    // Check required fields
    if (!listingId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({
        message: "Missing required fields: listingId, checkIn, checkOut, guests",
      });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time for date comparison

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (checkInDate < currentDate) {
      return res.status(400).json({
        message: "Check-in date cannot be in the past",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    // Validate guests
    if (!guests.adults || guests.adults < 1) {
      return res.status(400).json({
        message: "At least 1 adult guest is required",
      });
    }

    if (guests.children < 0) {
      return res.status(400).json({
        message: "Children count cannot be negative",
      });
    }

    // Validate special requests length
    if (req.body.specialRequests && req.body.specialRequests.length > 500) {
      return res.status(400).json({
        message: "Special requests cannot exceed 500 characters",
      });
    }

    next();
  } catch (error) {
    console.log("Error in validateBookingData middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check listing availability and constraints
export const checkListingConstraints = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    // Check if listing exists and is active
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.status !== "active") {
      return res.status(400).json({
        message: "Listing is not available for booking",
      });
    }

    // Prevent users from booking their own listings
    if (listing.host.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot book your own listing",
      });
    }

    // Check guest capacity
    const totalGuests = guests.adults + (guests.children || 0);
    if (totalGuests > listing.capacity.guests) {
      return res.status(400).json({
        message: `Maximum ${listing.capacity.guests} guests allowed`,
      });
    }

    // Check minimum and maximum stay requirements
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights < listing.availability.minStay) {
      return res.status(400).json({
        message: `Minimum stay is ${listing.availability.minStay} nights`,
      });
    }

    if (nights > listing.availability.maxStay) {
      return res.status(400).json({
        message: `Maximum stay is ${listing.availability.maxStay} nights`,
      });
    }

    req.listing = listing;
    req.nights = nights;
    next();
  } catch (error) {
    console.log("Error in checkListingConstraints middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check for booking conflicts
export const checkBookingConflicts = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut } = req.body;
    const { id: bookingId } = req.params; // For updates

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Build query to check for overlapping bookings
    let query = {
      listing: listingId,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          checkIn: { $lte: checkInDate },
          checkOut: { $gt: checkInDate }
        },
        {
          checkIn: { $lt: checkOutDate },
          checkOut: { $gte: checkOutDate }
        },
        {
          checkIn: { $gte: checkInDate },
          checkOut: { $lte: checkOutDate }
        }
      ]
    };

    // Exclude current booking if updating
    if (bookingId) {
      query._id = { $ne: bookingId };
    }

    const overlappingBooking = await Booking.findOne(query);

    if (overlappingBooking) {
      return res.status(409).json({
        message: "Listing is not available for the selected dates",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkBookingConflicts middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate booking status update
export const validateBookingStatus = (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    const validStatuses = ["pending", "confirmed", "cancelled", "completed", "no_show"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    next();
  } catch (error) {
    console.log("Error in validateBookingStatus middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if booking can be cancelled
export const checkCancellationEligibility = async (req, res, next) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking is already cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // Check if booking is completed
    if (booking.status === "completed") {
      return res.status(400).json({
        message: "Cannot cancel completed booking",
      });
    }

    // Check if booking is in the past (for no_show status)
    const currentDate = new Date();
    if (booking.checkOut < currentDate && booking.status !== "no_show") {
      return res.status(400).json({
        message: "Cannot cancel past bookings",
      });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.log("Error in checkCancellationEligibility middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check booking status constraints for updates
export const checkStatusUpdateConstraints = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = req.booking; // Should be set by previous middleware

    // Define allowed status transitions
    const allowedTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["cancelled", "completed", "no_show"],
      cancelled: [], // No transitions from cancelled
      completed: [], // No transitions from completed
      no_show: [] // No transitions from no_show
    };

    if (!allowedTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        message: `Cannot change status from ${booking.status} to ${status}`,
      });
    }

    // Additional constraints based on dates
    const currentDate = new Date();
    
    // Cannot mark as completed before check-out date
    if (status === "completed" && booking.checkOut > currentDate) {
      return res.status(400).json({
        message: "Cannot mark booking as completed before check-out date",
      });
    }

    // Cannot mark as no_show before check-in date
    if (status === "no_show" && booking.checkIn > currentDate) {
      return res.status(400).json({
        message: "Cannot mark booking as no-show before check-in date",
      });
    }

    next();
  } catch (error) {
    console.log("Error in checkStatusUpdateConstraints middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate availability check parameters
export const validateAvailabilityCheck = (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "Both checkIn and checkOut dates are required",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date format",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out date must be after check-in date",
      });
    }

    next();
  } catch (error) {
    console.log("Error in validateAvailabilityCheck middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};