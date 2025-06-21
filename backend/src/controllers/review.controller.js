import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

// Create a new review
export const createReview = async (req, res) => {
  try {
    console.log("Creating review with data:", req.body);
    const { listingId, revieweeId, reviewerType, rating, comment } = req.body;
    const reviewerId = req.user._id;

    // Validate required fields
    if (!listingId || !revieweeId || !reviewerType || !rating?.overall || !comment) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if reviewee exists
    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({ message: "User to review not found" });
    }

    // Prevent self-reviews
    if (reviewerId.toString() === revieweeId.toString()) {
      return res.status(400).json({ message: "You cannot review yourself" });
    }

    // Check if user has already reviewed this listing
    const existingReview = await Review.findOne({ 
      listing: listingId, 
      reviewer: reviewerId 
    });
    
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this listing" });
    }

    // Create review
    const newReview = new Review({
      listing: listingId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      reviewerType,
      rating,
      comment,
      booking: new mongoose.Types.ObjectId(), // Placeholder for now
    });

    await newReview.save();

    // Populate the review before sending response
    const populatedReview = await Review.findById(newReview._id)
      .populate("reviewer", "firstName lastName profilePic")
      .populate("reviewee", "firstName lastName profilePic")
      .populate("listing", "title");

    console.log("Review created successfully:", populatedReview);

    res.status(201).json({
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.log("Error in create review controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get reviews for a specific listing
export const getListingReviews = async (req, res) => {
  try {
    console.log("Getting reviews for listing:", req.params.listingId);
    const { listingId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ 
      listing: listingId, 
      isPublic: true 
    })
      .populate("reviewer", "firstName lastName profilePic")
      .populate("reviewee", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ listing: listingId, isPublic: true });

    console.log(`Found ${reviews.length} reviews for listing ${listingId}`);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.log("Error in get listing reviews controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get review statistics for a listing
export const getListingReviewStats = async (req, res) => {
  try {
    console.log("Getting review stats for listing:", req.params.listingId);
    const { listingId } = req.params;

    const stats = await Review.aggregate([
      { $match: { listing: new mongoose.Types.ObjectId(listingId), isPublic: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageOverall: { $avg: "$rating.overall" },
          averageCleanliness: { $avg: "$rating.cleanliness" },
          averageAccuracy: { $avg: "$rating.accuracy" },
          averageCommunication: { $avg: "$rating.communication" },
          averageLocation: { $avg: "$rating.location" },
          averageValue: { $avg: "$rating.value" },
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalReviews: 0,
      averageOverall: 0,
      averageCleanliness: 0,
      averageAccuracy: 0,
      averageCommunication: 0,
      averageLocation: 0,
      averageValue: 0,
    };

    console.log("Review stats:", result);

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in get listing review stats controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get reviews for a specific user (as reviewee)
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, reviewerType } = req.query;

    const filter = { 
      reviewee: userId, 
      isPublic: true 
    };

    if (reviewerType) {
      filter.reviewerType = reviewerType;
    }

    const reviews = await Review.find(filter)
      .populate("reviewer", "firstName lastName profilePic")
      .populate("listing", "title images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.log("Error in get user reviews controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Get reviews written by a user
export const getReviewsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ reviewer: userId })
      .populate("reviewee", "firstName lastName profilePic")
      .populate("listing", "title images")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ reviewer: userId });

    res.status(200).json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.log("Error in get reviews by user controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Add response to a review
export const addReviewResponse = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.user._id;

    if (!comment) {
      return res.status(400).json({ message: "Response comment is required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewee.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only respond to reviews about you" });
    }

    if (review.response.comment) {
      return res.status(400).json({ message: "Response already exists" });
    }

    review.response = {
      comment,
      createdAt: new Date(),
    };

    await review.save();

    const updatedReview = await Review.findById(reviewId)
      .populate("reviewer", "firstName lastName profilePic")
      .populate("reviewee", "firstName lastName profilePic")
      .populate("listing", "title");

    res.status(200).json({
      message: "Response added successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.log("Error in add review response controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.reviewer.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews" });
    }

    await Review.findByIdAndDelete(reviewId);

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log("Error in delete review controller", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
