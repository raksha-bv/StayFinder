import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewerType: {
      type: String,
      enum: ["guest", "host"],
      required: true,
    },
    rating: {
      overall: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      accuracy: {
        type: Number,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      location: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    response: {
      comment: {
        type: String,
        maxlength: 1000,
      },
      createdAt: {
        type: Date,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// One review per booking per user
reviewSchema.index({ booking: 1, reviewer: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
