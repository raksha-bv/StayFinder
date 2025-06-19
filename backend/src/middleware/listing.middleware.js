import Listing from "../models/listing.model.js";

// Check if user is a host
export const requireHost = (req, res, next) => {
  try {
    if (!req.user.isHost) {
      return res.status(403).json({
        message: "Access denied. Only hosts can perform this action.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in requireHost middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check if user owns the listing
export const requireListingOwner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (listing.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only modify your own listings.",
      });
    }

    req.listing = listing;
    next();
  } catch (error) {
    console.log("Error in requireListingOwner middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate listing data
export const validateListingData = (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      roomType,
      location,
      capacity,
      pricing,
    } = req.body;

    // Check required fields
    if (!title || !description || !propertyType || !roomType) {
      return res.status(400).json({
        message:
          "Missing required fields: title, description, propertyType, roomType",
      });
    }

    // Validate location
    if (
      !location ||
      !location.address ||
      !location.city ||
      !location.state ||
      !location.country
    ) {
      return res.status(400).json({
        message: "Complete location information is required",
      });
    }

    // Validate capacity
    if (
      !capacity ||
      !capacity.guests ||
      !capacity.bedrooms ||
      !capacity.beds ||
      !capacity.bathrooms
    ) {
      return res.status(400).json({
        message: "Complete capacity information is required",
      });
    }

    // Validate pricing
    if (!pricing || !pricing.basePrice || pricing.basePrice <= 0) {
      return res.status(400).json({
        message: "Valid base price is required",
      });
    }

    // Validate property type
    const validPropertyTypes = [
      "apartment",
      "house",
      "condo",
      "villa",
      "studio",
      "loft",
      "cabin",
      "other",
    ];
    if (!validPropertyTypes.includes(propertyType)) {
      return res.status(400).json({
        message: "Invalid property type",
      });
    }

    // Validate room type
    const validRoomTypes = ["entire_place", "private_room", "shared_room"];
    if (!validRoomTypes.includes(roomType)) {
      return res.status(400).json({
        message: "Invalid room type",
      });
    }

    // Validate capacity values
    if (
      capacity.guests < 1 ||
      capacity.bedrooms < 0 ||
      capacity.beds < 1 ||
      capacity.bathrooms < 0.5
    ) {
      return res.status(400).json({
        message: "Invalid capacity values",
      });
    }

    next();
  } catch (error) {
    console.log("Error in validateListingData middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Validate amenities
export const validateAmenities = (req, res, next) => {
  try {
    const { amenities } = req.body;

    if (amenities && Array.isArray(amenities)) {
      const validAmenities = [
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
      ];

      const invalidAmenities = amenities.filter(
        (amenity) => !validAmenities.includes(amenity)
      );

      if (invalidAmenities.length > 0) {
        return res.status(400).json({
          message: `Invalid amenities: ${invalidAmenities.join(", ")}`,
        });
      }
    }

    next();
  } catch (error) {
    console.log("Error in validateAmenities middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check listing status
export const checkListingStatus = (allowedStatuses = ["active"]) => {
  return async (req, res, next) => {
    try {
      const { id } = req.params;

      const listing = await Listing.findById(id);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      if (!allowedStatuses.includes(listing.status)) {
        return res.status(403).json({
          message: `Listing is ${listing.status}. Only ${allowedStatuses.join(
            ", "
          )} listings are allowed for this action.`,
        });
      }

      req.listing = listing;
      next();
    } catch (error) {
      console.log("Error in checkListingStatus middleware: ", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Validate listing update
export const validateListingUpdate = (req, res, next) => {
  try {
    const { status, pricing, capacity } = req.body;

    // Validate status if provided
    if (status) {
      const validStatuses = ["draft", "active", "inactive", "suspended"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Invalid status. Must be one of: draft, active, inactive, suspended",
        });
      }
    }

    // Validate pricing if provided
    if (pricing && pricing.basePrice !== undefined) {
      if (pricing.basePrice <= 0) {
        return res.status(400).json({
          message: "Base price must be greater than 0",
        });
      }
    }

    // Validate capacity if provided
    if (capacity) {
      if (capacity.guests && capacity.guests < 1) {
        return res.status(400).json({
          message: "Guest capacity must be at least 1",
        });
      }
      if (capacity.bedrooms !== undefined && capacity.bedrooms < 0) {
        return res.status(400).json({
          message: "Bedroom count cannot be negative",
        });
      }
      if (capacity.beds && capacity.beds < 1) {
        return res.status(400).json({
          message: "Bed count must be at least 1",
        });
      }
      if (capacity.bathrooms && capacity.bathrooms < 0.5) {
        return res.status(400).json({
          message: "Bathroom count must be at least 0.5",
        });
      }
    }

    next();
  } catch (error) {
    console.log("Error in validateListingUpdate middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
