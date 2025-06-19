import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

// Create a new listing
export const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      propertyType,
      roomType,
      location,
      images,
      amenities,
      capacity,
      pricing,
      availability,
      houseRules,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !propertyType ||
      !roomType ||
      !location ||
      !capacity ||
      !pricing
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    // Check if user is a host
    if (!req.user.isHost) {
      return res
        .status(403)
        .json({ message: "Only hosts can create listings" });
    }

    // Upload images to cloudinary if provided
    let uploadedImages = [];
    if (images && images.length > 0) {
      for (let image of images) {
        const uploadResponse = await cloudinary.uploader.upload(image.url);
        uploadedImages.push({
          url: uploadResponse.secure_url,
          caption: image.caption || "",
        });
      }
    }

    const newListing = new Listing({
      title,
      description,
      host: req.user._id,
      propertyType,
      roomType,
      location,
      images: uploadedImages,
      amenities: amenities || [],
      capacity,
      pricing,
      availability: availability || {},
      houseRules: houseRules || {},
    });

    await newListing.save();

    const populatedListing = await Listing.findById(newListing._id).populate(
      "host",
      "firstName lastName email profilePic"
    );

    res.status(201).json({
      message: "Listing created successfully",
      listing: populatedListing,
    });
  } catch (error) {
    console.log("Error in createListing controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all listings with filters
export const getListings = async (req, res) => {
  try {
    const {
      city,
      country,
      propertyType,
      roomType,
      minPrice,
      maxPrice,
      guests,
      amenities,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object - include both active and draft for development
    let filter = { status: { $in: ["active", "draft"] } }; // Changed this line

    if (city) {
      filter["location.city"] = { $regex: city, $options: "i" };
    }
    if (country) {
      filter["location.country"] = { $regex: country, $options: "i" };
    }
    if (propertyType) {
      filter.propertyType = propertyType;
    }
    if (roomType) {
      filter.roomType = roomType;
    }
    if (guests) {
      filter["capacity.guests"] = { $gte: parseInt(guests) };
    }
    if (amenities) {
      const amenitiesArray = amenities.split(",");
      filter.amenities = { $in: amenitiesArray };
    }
    if (minPrice || maxPrice) {
      filter["pricing.basePrice"] = {};
      if (minPrice) filter["pricing.basePrice"].$gte = parseInt(minPrice);
      if (maxPrice) filter["pricing.basePrice"].$lte = parseInt(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(filter)
      .populate("host", "firstName lastName profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalListings = await Listing.countDocuments(filter);

    res.status(200).json({
      listings,
      totalPages: Math.ceil(totalListings / parseInt(limit)),
      currentPage: parseInt(page),
      totalListings,
    });
  } catch (error) {
    console.log("Error in getListings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get single listing by ID
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id).populate(
      "host",
      "firstName lastName email phone profilePic joinedDate"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.status(200).json(listing);
  } catch (error) {
    console.log("Error in getListingById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update listing
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the owner of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    // Handle image uploads if provided
    if (updateData.images && updateData.images.length > 0) {
      let uploadedImages = [];
      for (let image of updateData.images) {
        if (image.url.startsWith("data:")) {
          // New image - upload to cloudinary
          const uploadResponse = await cloudinary.uploader.upload(image.url);
          uploadedImages.push({
            url: uploadResponse.secure_url,
            caption: image.caption || "",
          });
        } else {
          // Existing image - keep as is
          uploadedImages.push(image);
        }
      }
      updateData.images = uploadedImages;
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("host", "firstName lastName email profilePic");

    res.status(200).json({
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.log("Error in updateListing controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete listing
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the owner of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    await Listing.findByIdAndDelete(id);

    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.log("Error in deleteListing controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get listings by host
export const getHostListings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find({ host: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalListings = await Listing.countDocuments({ host: req.user._id });

    res.status(200).json({
      listings,
      totalPages: Math.ceil(totalListings / parseInt(limit)),
      currentPage: parseInt(page),
      totalListings,
    });
  } catch (error) {
    console.log("Error in getHostListings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update listing status
export const updateListingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["draft", "active", "inactive", "suspended"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the owner of the listing
    if (listing.host.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    listing.status = status;
    await listing.save();

    res.status(200).json({
      message: "Listing status updated successfully",
      listing,
    });
  } catch (error) {
    console.log("Error in updateListingStatus controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Search listings by location
export const searchListings = async (req, res) => {
  try {
    const { query, lat, lng, radius = 10 } = req.query;

    let filter = { status: "active" };

    if (query) {
      filter.$or = [
        { title: new RegExp(query, "i") },
        { description: new RegExp(query, "i") },
        { "location.city": new RegExp(query, "i") },
        { "location.address": new RegExp(query, "i") },
      ];
    }

    // If coordinates provided, search by proximity
    if (lat && lng) {
      filter["location.coordinates"] = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      };
    }

    const listings = await Listing.find(filter)
      .populate("host", "firstName lastName profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(listings);
  } catch (error) {
    console.log("Error in searchListings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
