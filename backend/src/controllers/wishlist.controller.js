import Wishlist from "../models/wishlist.model.js";
import mongoose from "mongoose";

// Create a new wishlist
export const createWishlist = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const userId = req.user._id;

    const newWishlist = new Wishlist({
      user: userId,
      name: name || "My Wishlist",
      isPrivate: isPrivate !== undefined ? isPrivate : true,
      listings: [],
    });

    await newWishlist.save();

    res.status(201).json({
      message: "Wishlist created successfully",
      wishlist: newWishlist,
    });
  } catch (error) {
    console.log("Error in createWishlist controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all wishlists for authenticated user
export const getUserWishlists = async (req, res) => {
  try {
    const userId = req.user._id;

    const wishlists = await Wishlist.find({ user: userId })
      .populate("listings", "title price images location")
      .sort({ createdAt: -1 });

    // Always return success, even if empty array
    res.status(200).json({
      message: "Wishlists retrieved successfully",
      wishlists: wishlists || [],
    });
  } catch (error) {
    console.log("Error in getUserWishlists controller", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get a specific wishlist by ID
export const getWishlistById = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid wishlist ID" });
    }

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
    }).populate("listings", "title price images location host");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({
      message: "Wishlist retrieved successfully",
      wishlist,
    });
  } catch (error) {
    console.log("Error in getWishlistById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update wishlist details
export const updateWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { name, isPrivate } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid wishlist ID" });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;

    const updatedWishlist = await Wishlist.findOneAndUpdate(
      { _id: wishlistId, user: userId },
      updateData,
      { new: true }
    ).populate("listings", "title price images location");

    if (!updatedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({
      message: "Wishlist updated successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.log("Error in updateWishlist controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add listing to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const { listingId } = req.body;
    const userId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(wishlistId) ||
      !mongoose.Types.ObjectId.isValid(listingId)
    ) {
      return res.status(400).json({ message: "Invalid wishlist or listing ID" });
    }

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if listing is already in wishlist
    if (wishlist.listings.includes(listingId)) {
      return res.status(400).json({ message: "Listing already in wishlist" });
    }

    wishlist.listings.push(listingId);
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate(
      "listings",
      "title price images location"
    );

    res.status(200).json({
      message: "Listing added to wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.log("Error in addToWishlist controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove listing from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { wishlistId, listingId } = req.params;
    const userId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(wishlistId) ||
      !mongoose.Types.ObjectId.isValid(listingId)
    ) {
      return res.status(400).json({ message: "Invalid wishlist or listing ID" });
    }

    const wishlist = await Wishlist.findOne({
      _id: wishlistId,
      user: userId,
    });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.listings = wishlist.listings.filter(
      (id) => id.toString() !== listingId
    );
    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlistId).populate(
      "listings",
      "title price images location"
    );

    res.status(200).json({
      message: "Listing removed from wishlist successfully",
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.log("Error in removeFromWishlist controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete wishlist
export const deleteWishlist = async (req, res) => {
  try {
    const { wishlistId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(wishlistId)) {
      return res.status(400).json({ message: "Invalid wishlist ID" });
    }

    const deletedWishlist = await Wishlist.findOneAndDelete({
      _id: wishlistId,
      user: userId,
    });

    if (!deletedWishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json({
      message: "Wishlist deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteWishlist controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};