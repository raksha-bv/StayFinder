import express from "express";
import {
  createReview,
  getListingReviews,
  getUserReviews,
  getReviewsByUser,
  addReviewResponse,
  deleteReview,
  getListingReviewStats,
} from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Test route to verify reviews endpoint is working
router.get("/test", (req, res) => {
  res.json({ message: "Reviews routes are working!" });
});

// Create a new review (requires authentication only)
router.post("/", protectRoute, createReview);

// Get reviews for a specific listing (public)
router.get("/listing/:listingId", getListingReviews);

// Get review statistics for a listing (public)
router.get("/listing/:listingId/stats", getListingReviewStats);

// Get reviews for a specific user as reviewee (public)
router.get("/user/:userId", getUserReviews);

// Get reviews written by a specific user (requires authentication)
router.get("/by-user/:userId", protectRoute, getReviewsByUser);

// Add response to a review (requires authentication)
router.put("/:reviewId/response", protectRoute, addReviewResponse);

// Delete a review (requires authentication)
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;