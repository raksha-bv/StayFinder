import express from "express";
import {
  createBooking,
  getUserBookings,
  getHostBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
  checkAvailability,
} from "../controllers/booking.controller.js";
import {
  requireBookingAccess,
  requireBookingHost,
  requireBookingGuest,
  validateBookingData,
  checkListingConstraints,
  checkBookingConflicts,
  validateBookingStatus,
  checkCancellationEligibility,
  checkStatusUpdateConstraints,
  validateAvailabilityCheck,
} from "../middleware/booking.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a new booking
router.post(
  "/",
  protectRoute,
  validateBookingData,
  checkListingConstraints,
  checkBookingConflicts,
  createBooking
);

// Get all bookings for the authenticated user (as guest)
router.get("/my-bookings", protectRoute, getUserBookings);

// Get all bookings for the authenticated user (as host)
router.get("/host-bookings", protectRoute, getHostBookings);

// Check availability for a specific listing
router.get(
  "/availability/:listingId",
  validateAvailabilityCheck,
  checkAvailability
);

// Get a specific booking by ID
router.get("/:id", protectRoute, requireBookingAccess, getBookingById);

// Cancel a booking (guest or host can cancel)
router.patch(
  "/:id/cancel",
  protectRoute,
  requireBookingAccess,
  checkCancellationEligibility,
  cancelBooking
);

// Update booking status (only host can update)
router.patch(
  "/:id/status",
  protectRoute,
  requireBookingHost,
  validateBookingStatus,
  checkStatusUpdateConstraints,
  updateBookingStatus
);

export default router;