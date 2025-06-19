import Booking from "../models/booking.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const {
      listingId,
      checkIn,
      checkOut,
      guests,
      specialRequests,
    } = req.body;

    // Validate required fields
    if (!listingId || !checkIn || !checkOut || !guests?.adults) {
      return res.status(400).json({ 
        message: "Please provide listing, check-in/check-out dates, and guest count" 
      });
    }

    // Check if listing exists and is active
    const listing = await Listing.findById(listingId).populate("host");
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.status !== "active") {
      return res.status(400).json({ message: "Listing is not available for booking" });
    }

    // Prevent users from booking their own listings
    if (listing.host._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot book your own listing" });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const currentDate = new Date();

    if (checkInDate < currentDate) {
      return res.status(400).json({ message: "Check-in date cannot be in the past" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    // Calculate nights and total amount
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * listing.pricing.basePrice;

    // Check for minimum and maximum stay requirements
    if (nights < listing.availability.minStay) {
      return res.status(400).json({ 
        message: `Minimum stay is ${listing.availability.minStay} nights` 
      });
    }

    if (nights > listing.availability.maxStay) {
      return res.status(400).json({ 
        message: `Maximum stay is ${listing.availability.maxStay} nights` 
      });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
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
    });

    if (overlappingBooking) {
      return res.status(400).json({ 
        message: "Listing is not available for the selected dates" 
      });
    }

    // Create the booking
    const newBooking = new Booking({
      listing: listingId,
      guest: req.user._id,
      host: listing.host._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: {
        adults: guests.adults,
        children: guests.children || 0,
      },
      pricing: {
        totalAmount,
        currency: listing.pricing.currency,
      },
      specialRequests: specialRequests || "",
      cancellationPolicy: listing.availability.cancellationPolicy || "moderate",
    });

    await newBooking.save();

    // Update listing total bookings
    await Listing.findByIdAndUpdate(listingId, {
      $inc: { totalBookings: 1 }
    });

    // Populate the booking with listing and host details
    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("listing", "title images location pricing")
      .populate("host", "firstName lastName email phone profilePic")
      .populate("guest", "firstName lastName email phone");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.log("Error in createBooking controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all bookings for a user (guest)
export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = { guest: req.user._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate("listing", "title images location pricing")
      .populate("host", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(filter);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(totalBookings / parseInt(limit)),
      currentPage: parseInt(page),
      totalBookings,
    });
  } catch (error) {
    console.log("Error in getUserBookings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all bookings for a host
export const getHostBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let filter = { host: req.user._id };
    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate("listing", "title images location pricing")
      .populate("guest", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalBookings = await Booking.countDocuments(filter);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(totalBookings / parseInt(limit)),
      currentPage: parseInt(page),
      totalBookings,
    });
  } catch (error) {
    console.log("Error in getHostBookings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("listing", "title description images location amenities capacity pricing houseRules")
      .populate("host", "firstName lastName email phone profilePic joinedDate")
      .populate("guest", "firstName lastName email phone profilePic");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to view this booking
    if (
      booking.guest._id.toString() !== req.user._id.toString() &&
      booking.host._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to view this booking" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.log("Error in getBookingById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is authorized to cancel this booking
    if (
      booking.guest.toString() !== req.user._id.toString() &&
      booking.host.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    // Update booking status
    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason || "";
    await booking.save();

    // Decrease listing total bookings if it was confirmed
    if (booking.status === "confirmed") {
      await Listing.findByIdAndUpdate(booking.listing, {
        $inc: { totalBookings: -1 }
      });
    }

    const populatedBooking = await Booking.findById(booking._id)
      .populate("listing", "title images location")
      .populate("host", "firstName lastName profilePic")
      .populate("guest", "firstName lastName profilePic");

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.log("Error in cancelBooking controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update booking status (for hosts)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed", "no_show"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Only hosts can update booking status
    if (booking.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only hosts can update booking status" });
    }

    booking.status = status;
    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("listing", "title images location")
      .populate("guest", "firstName lastName profilePic");

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    console.log("Error in updateBookingStatus controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check availability for a listing
export const checkAvailability = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { checkIn, checkOut } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "Please provide check-in and check-out dates" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
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
    });

    const isAvailable = !overlappingBooking;

    res.status(200).json({
      available: isAvailable,
      message: isAvailable ? "Dates are available" : "Dates are not available"
    });
  } catch (error) {
    console.log("Error in checkAvailability controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};