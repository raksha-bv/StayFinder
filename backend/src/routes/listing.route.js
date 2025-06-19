import express from "express";
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getHostListings,
  updateListingStatus,
  searchListings,
} from "../controllers/listing.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  requireHost,
  requireListingOwner,
  validateListingData,
  validateAmenities,
  checkListingStatus,
  validateListingUpdate,
} from "../middleware/listing.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getListings);
router.get("/search", searchListings);
router.get("/:id", getListingById);

// Protected routes - require authentication
router.use(protectRoute);

// Host-only routes
router.post(
  "/",
  requireHost,
  validateListingData,
  validateAmenities,
  createListing
);

router.get("/host/my-listings", requireHost, getHostListings);

// Listing owner routes
router.put(
  "/:id",
  requireListingOwner,
  validateListingUpdate,
  validateAmenities,
  updateListing
);

router.delete("/:id", requireListingOwner, deleteListing);

router.patch("/:id/status", requireListingOwner, updateListingStatus);

// Special routes with status checking
router.get(
  "/:id/details",
  checkListingStatus(["active", "inactive"]),
  getListingById
);

export default router;
