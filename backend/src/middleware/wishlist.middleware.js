import Wishlist from "../models/wishlist.model.js";
import mongoose from "mongoose";

// Middleware to check if user owns the wishlist
export const checkWishlistOwnership = async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid wishlist ID" });
    }

    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    if (wishlist.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied. Not your wishlist" });
    }

    req.wishlist = wishlist;
    next();
  } catch (error) {
    console.log("Error in checkWishlistOwnership middleware", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message 
    });
  }
};

// Middleware to validate wishlist data
export const validateWishlistData = (req, res, next) => {
  try {
    const { name } = req.body;

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ message: "Wishlist name must be a non-empty string" });
      }
      if (name.trim().length > 100) {
        return res.status(400).json({ message: "Wishlist name must be less than 100 characters" });
      }
    }

    next();
  } catch (error) {
    console.log("Error in validateWishlistData middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to check if wishlist exists and user has access (for public viewing)
export const checkWishlistAccess = async (req, res, next) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid wishlist ID" });
    }

    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // If wishlist is private, only owner can access
    if (wishlist.isPrivate && (!userId || wishlist.user.toString() !== userId.toString())) {
      return res.status(403).json({ message: "Access denied. This wishlist is private" });
    }

    req.wishlist = wishlist;
    next();
  } catch (error) {
    console.log("Error in checkWishlistAccess middleware", error);
    res.status(500).json({ message: "Internal server error" });
  }
};