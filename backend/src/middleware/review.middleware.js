import Review from "../models/review.model.js";
import Booking from "../models/booking.model.js";

// Middleware to check if user can review a specific booking
export const canReviewBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user._id;

    const booking = await Booking.findById(bookingId).populate("listing");
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if booking is completed
    if (booking.status !== "completed") {
      return res.status(400).json({ message: "You can only review completed bookings" });
    }

    // Check if user is part of this booking
    const isGuest = booking.guest.toString() === userId.toString();
    const isHost = booking.listing.host.toString() === userId.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: "You are not authorized to review this booking" });
    }

    req.booking = booking;
    next();
  } catch (error) {
    console.log("Error in canReviewBooking middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if review exists and user owns it
export const checkReviewOwnership = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only modify your own reviews" });
    }

    req.review = review;
    next();
  } catch (error) {
    console.log("Error in checkReviewOwnership middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};