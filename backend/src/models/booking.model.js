import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    pricing: {
      totalAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "no_show"],
      default: "confirmed",
    },
    specialRequests: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict", "super_strict"],
      default: "moderate",
    },
    // Duration in nights (calculated field)
    nights: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate nights
bookingSchema.pre("save", function (next) {
  if (this.checkIn && this.checkOut) {
    const timeDiff = this.checkOut.getTime() - this.checkIn.getTime();
    this.nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  next();
});

// Validation to ensure checkOut is after checkIn
bookingSchema.pre("save", function (next) {
  if (this.checkOut <= this.checkIn) {
    const error = new Error("Check-out date must be after check-in date");
    return next(error);
  }
  next();
});

// Validation to ensure total guests don't exceed listing capacity
bookingSchema.pre("save", async function (next) {
  const totalGuests =
    this.guests.adults + this.guests.children + this.guests.infants;

  try {
    const listing = await mongoose.model("Listing").findById(this.listing);
    if (listing && totalGuests > listing.capacity.guests) {
      const error = new Error("Total guests exceed listing capacity");
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// Ensure no overlapping bookings for the same listing
bookingSchema.index(
  {
    listing: 1,
    checkIn: 1,
    checkOut: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["confirmed", "pending"] },
    },
  }
);

// Additional indexes for better query performance
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ listing: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
