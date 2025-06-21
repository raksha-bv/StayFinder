import express from "express";
import {
  createWishlist,
  getUserWishlists,
  getWishlistById,
  updateWishlist,
  addToWishlist,
  removeFromWishlist,
  deleteWishlist,
} from "../controllers/wishlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  checkWishlistOwnership,
  validateWishlistData,
  checkWishlistAccess,
} from "../middleware/wishlist.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Create a new wishlist
router.post("/", validateWishlistData, createWishlist);

// Get all wishlists for authenticated user
router.get("/", getUserWishlists);

// Get specific wishlist by ID (owner only)
router.get("/:wishlistId", checkWishlistOwnership, getWishlistById);

// Update wishlist details
router.put("/:wishlistId", validateWishlistData, checkWishlistOwnership, updateWishlist);

// Add listing to wishlist
router.post("/:wishlistId/listings", checkWishlistOwnership, addToWishlist);

// Remove listing from wishlist
router.delete("/:wishlistId/listings/:listingId", checkWishlistOwnership, removeFromWishlist);

// Delete wishlist
router.delete("/:wishlistId", checkWishlistOwnership, deleteWishlist);

export default router;