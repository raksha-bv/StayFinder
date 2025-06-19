import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    propertyType: {
      type: String,
      required: true,
      enum: [
        "apartment",
        "house",
        "condo",
        "villa",
        "studio",
        "loft",
        "cabin",
        "other",
      ],
    },
    roomType: {
      type: String,
      required: true,
      enum: ["entire_place", "private_room", "shared_room"],
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        caption: String,
      },
    ],
    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "kitchen",
          "parking",
          "pool",
          "gym",
          "air_conditioning",
          "heating",
          "tv",
          "washer",
          "dryer",
          "balcony",
          "garden",
          "hot_tub",
          "fireplace",
          "workspace",
          "pet_friendly",
          "smoking_allowed",
        ],
      },
    ],
    capacity: {
      guests: {
        type: Number,
        required: true,
        min: 1,
      },
      bedrooms: {
        type: Number,
        required: true,
        min: 0,
      },
      beds: {
        type: Number,
        required: true,
        min: 1,
      },
      bathrooms: {
        type: Number,
        required: true,
        min: 0.5,
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    availability: {
      minStay: {
        type: Number,
        default: 1,
      },
      maxStay: {
        type: Number,
        default: 365,
      },
      instantBook: {
        type: Boolean,
        default: true,
      },
    },
    houseRules: {
      checkIn: {
        type: String,
        default: "15:00",
      },
      checkOut: {
        type: String,
        default: "11:00",
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      additionalRules: [String],
    },
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "suspended"],
      default: "active",
    },
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based searches
listingSchema.index({ "location.coordinates": "2dsphere" });
listingSchema.index({ "location.city": 1, "location.country": 1 });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
