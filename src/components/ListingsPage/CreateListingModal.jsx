import React, { useState } from "react";
import {
  X,
  Upload,
  MapPin,
  Home,
  Users,
  Wifi,
  Car,
  Coffee,
  Tv,
  Waves,
  Mountain,
  TreePine,
  Building,
} from "lucide-react";
import toast from "react-hot-toast";
import useListingStore from "../../store/useListingStore";

const CreateListingModal = ({ isOpen, onClose }) => {
  const { createListing, isCreating } = useListingStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "",
    roomType: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      coordinates: {
        type: "Point",
        coordinates: [0, 0], // [longitude, latitude]
      },
    },
    capacity: {
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
    },
    pricing: {
      basePrice: "",
      currency: "INR",
    },
    amenities: [],
    images: [],
    houseRules: {
      checkIn: "15:00",
      checkOut: "11:00",
      petsAllowed: false,
      additionalRules: [],
    },
    availability: {
      minStay: 1,
      maxStay: 365,
      instantBook: true,
    },
  });

  const propertyTypes = [
    { id: "apartment", name: "Apartment", icon: Building },
    { id: "house", name: "House", icon: Home },
    { id: "condo", name: "Condo", icon: Building },
    { id: "villa", name: "Villa", icon: Mountain },
    { id: "studio", name: "Studio", icon: Home },
    { id: "loft", name: "Loft", icon: Building },
    { id: "cabin", name: "Cabin", icon: TreePine },
    { id: "other", name: "Other", icon: Home },
  ];

  const roomTypes = [
    {
      id: "entire_place",
      name: "Entire place",
      description: "Guests have the whole place to themselves",
    },
    {
      id: "private_room",
      name: "Private room",
      description:
        "Guests have their own room in a home, plus access to shared spaces",
    },
    {
      id: "shared_room",
      name: "Shared room",
      description:
        "Guests sleep in a room or common area that may be shared with you or others",
    },
  ];

  const amenitiesList = [
    { id: "wifi", name: "WiFi", icon: Wifi },
    { id: "kitchen", name: "Kitchen", icon: Coffee },
    { id: "parking", name: "Free Parking", icon: Car },
    { id: "pool", name: "Pool", icon: Waves },
    { id: "gym", name: "Gym", icon: Home },
    { id: "air_conditioning", name: "Air Conditioning", icon: Home },
    { id: "heating", name: "Heating", icon: Home },
    { id: "tv", name: "TV", icon: Tv },
    { id: "washer", name: "Washer", icon: Home },
    { id: "dryer", name: "Dryer", icon: Home },
    { id: "balcony", name: "Balcony", icon: Home },
    { id: "garden", name: "Garden", icon: TreePine },
    { id: "hot_tub", name: "Hot Tub", icon: Waves },
    { id: "fireplace", name: "Fireplace", icon: Home },
    { id: "workspace", name: "Workspace", icon: Home },
    { id: "pet_friendly", name: "Pet Friendly", icon: Home },
    { id: "smoking_allowed", name: "Smoking Allowed", icon: Home },
  ];

  // Function to get coordinates for a given location
  const getCoordinatesForLocation = async (city, state, country) => {
    try {
      // You can use a geocoding service like OpenCage, Google Maps API, or others
      // For now, I'll provide some default coordinates for common Indian cities
      const defaultCoordinates = {
        bangalore: [77.5946, 12.9716],
        mumbai: [72.8777, 19.076],
        delhi: [77.1025, 28.7041],
        chennai: [80.2707, 13.0827],
        hyderabad: [78.4867, 17.385],
        pune: [73.8567, 18.5204],
        kolkata: [88.3639, 22.5726],
        ahmedabad: [72.5714, 23.0225],
        jaipur: [75.7873, 26.9124],
        surat: [72.8311, 21.1702],
      };

      const cityKey = city.toLowerCase().replace(/\s+/g, "");

      if (defaultCoordinates[cityKey]) {
        return defaultCoordinates[cityKey];
      }

      // Default coordinates for India if city not found
      return [77.1025, 28.7041]; // Delhi coordinates as default
    } catch (error) {
      console.error("Error getting coordinates:", error);
      return [77.1025, 28.7041]; // Default to Delhi
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const keys = field.split(".");
      setFormData((prev) => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }

    // Update coordinates when city changes
    if (field === "location.city" && value) {
      updateCoordinates(
        value,
        formData.location.state,
        formData.location.country
      );
    }
  };

  const updateCoordinates = async (city, state, country) => {
    if (city) {
      const coordinates = await getCoordinatesForLocation(city, state, country);
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          coordinates: {
            type: "Point",
            coordinates: coordinates,
          },
        },
      }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      // Check file size (limit to 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(
          `${file.name} is too large. Please upload images smaller than 5MB.`
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: e.target.result, caption: "" }],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addHouseRule = () => {
    setFormData((prev) => ({
      ...prev,
      houseRules: {
        ...prev.houseRules,
        additionalRules: [...prev.houseRules.additionalRules, ""],
      },
    }));
  };

  const updateHouseRule = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      houseRules: {
        ...prev.houseRules,
        additionalRules: prev.houseRules.additionalRules.map((rule, i) =>
          i === index ? value : rule
        ),
      },
    }));
  };

  const removeHouseRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      houseRules: {
        ...prev.houseRules,
        additionalRules: prev.houseRules.additionalRules.filter(
          (_, i) => i !== index
        ),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (
        !formData.title ||
        !formData.description ||
        !formData.propertyType ||
        !formData.roomType
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (
        !formData.location.address ||
        !formData.location.city ||
        !formData.location.state ||
        !formData.location.country
      ) {
        toast.error("Please fill in complete location information");
        return;
      }

      if (!formData.pricing.basePrice || formData.pricing.basePrice <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (formData.images.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Ensure coordinates are properly set
      if (
        !formData.location.coordinates.coordinates ||
        (formData.location.coordinates.coordinates[0] === 0 &&
          formData.location.coordinates.coordinates[1] === 0)
      ) {
        const coordinates = await getCoordinatesForLocation(
          formData.location.city,
          formData.location.state,
          formData.location.country
        );
        formData.location.coordinates.coordinates = coordinates;
      }

      // console.log("Creating listing with data:", formData);

      // Call the createListing function from the store
      const result = await createListing(formData);

      if (result) {
        toast.success("Listing created successfully!");
        onClose();
        // Reset form
        setFormData({
          title: "",
          description: "",
          propertyType: "",
          roomType: "",
          location: {
            address: "",
            city: "",
            state: "",
            country: "",
            zipCode: "",
            coordinates: {
              type: "Point",
              coordinates: [0, 0],
            },
          },
          capacity: {
            guests: 1,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1,
          },
          pricing: {
            basePrice: "",
            currency: "INR",
          },
          amenities: [],
          images: [],
          houseRules: {
            checkIn: "15:00",
            checkOut: "11:00",
            petsAllowed: false,
            additionalRules: [],
          },
          availability: {
            minStay: 1,
            maxStay: 365,
            instantBook: true,
          },
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error("Error creating listing:", error);
      toast.error("Failed to create listing");
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-xl flex flex-col overflow-hidden">
        {/* Header section */}
        <div className="p-6 border-b border-gray-200">
          {/* Header content */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Create New Listing</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 ">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 ${
                    step < 5 ? "flex-1" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep >= step
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step}
                  </div>
                  <span className="text-sm font-medium text-gray-600 hidden sm:block">
                    {step === 1 && "Basic Info"}
                    {step === 2 && "Property Details"}
                    {step === 3 && "Amenities"}
                    {step === 4 && "Photos"}
                    {step === 5 && "Pricing & Rules"}
                  </span>
                  {step < 5 && (
                    <div
                      className={`flex-1 h-0.5 ${
                        currentStep > step ? "bg-red-500" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Give your place a catchy title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your place..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          handleInputChange("propertyType", type.id)
                        }
                        className={`p-4 border-2 rounded-xl flex flex-col items-center space-y-2 transition-all ${
                          formData.propertyType === type.id
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent className="h-6 w-6" />
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Type *
                </label>
                <div className="space-y-3">
                  {roomTypes.map((type) => (
                    <label
                      key={type.id}
                      className="flex items-start space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="roomType"
                        value={type.id}
                        checked={formData.roomType === type.id}
                        onChange={(e) =>
                          handleInputChange("roomType", e.target.value)
                        }
                        className="mt-1 text-red-500 focus:ring-red-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {type.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {type.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) =>
                      handleInputChange("location.address", e.target.value)
                    }
                    placeholder="Street address"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) =>
                      handleInputChange("location.city", e.target.value)
                    }
                    placeholder="City"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) =>
                      handleInputChange("location.state", e.target.value)
                    }
                    placeholder="State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={formData.location.country}
                    onChange={(e) =>
                      handleInputChange("location.country", e.target.value)
                    }
                    placeholder="Country"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.location.zipCode}
                    onChange={(e) =>
                      handleInputChange("location.zipCode", e.target.value)
                    }
                    placeholder="Zip Code"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              {/* Show coordinates info */}
              {formData.location.coordinates.coordinates[0] !== 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-700">
                    📍 Coordinates automatically set for{" "}
                    {formData.location.city}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity.guests}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity.guests",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.capacity.bedrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity.bedrooms",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Beds
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.capacity.beds}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity.beds",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.capacity.bathrooms}
                    onChange={(e) =>
                      handleInputChange(
                        "capacity.bathrooms",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Stay (nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.availability.minStay}
                    onChange={(e) =>
                      handleInputChange(
                        "availability.minStay",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Stay (nights)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.availability.maxStay}
                    onChange={(e) =>
                      handleInputChange(
                        "availability.maxStay",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    id="instantBook"
                    checked={formData.availability.instantBook}
                    onChange={(e) =>
                      handleInputChange(
                        "availability.instantBook",
                        e.target.checked
                      )
                    }
                    className="text-red-500 focus:ring-red-500"
                  />
                  <label
                    htmlFor="instantBook"
                    className="text-sm font-medium text-gray-700"
                  >
                    Instant Book
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Amenities */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => {
                    const IconComponent = amenity.icon;
                    return (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-3 border-2 rounded-xl flex items-center space-x-2 transition-all ${
                          formData.amenities.includes(amenity.id)
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{amenity.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Photos */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Property Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Upload photos of your property (Max 5MB per image)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-red-500 text-white px-6 py-3 rounded-xl cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    Choose Files
                  </label>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Pricing & Rules */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Price per night *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={formData.pricing.basePrice}
                      onChange={(e) =>
                        handleInputChange("pricing.basePrice", e.target.value)
                      }
                      placeholder="Enter price per night"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={formData.pricing.currency}
                    onChange={(e) =>
                      handleInputChange("pricing.currency", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    value={formData.houseRules.checkIn}
                    onChange={(e) =>
                      handleInputChange("houseRules.checkIn", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    value={formData.houseRules.checkOut}
                    onChange={(e) =>
                      handleInputChange("houseRules.checkOut", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="petsAllowed"
                  checked={formData.houseRules.petsAllowed}
                  onChange={(e) =>
                    handleInputChange(
                      "houseRules.petsAllowed",
                      e.target.checked
                    )
                  }
                  className="text-red-500 focus:ring-red-500"
                />
                <label
                  htmlFor="petsAllowed"
                  className="text-sm font-medium text-gray-700"
                >
                  Pets Allowed
                </label>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional House Rules
                  </label>
                  <button
                    type="button"
                    onClick={addHouseRule}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    + Add Rule
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.houseRules.additionalRules.map((rule, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateHouseRule(index, e.target.value)}
                        placeholder="Enter house rule"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => removeHouseRule(index)}
                        className="px-3 py-3 text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-4">Listing Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Property Type:</span>
                    <span className="font-medium">
                      {formData.propertyType || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Room Type:</span>
                    <span className="font-medium">
                      {formData.roomType?.replace("_", " ") || "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">
                      {formData.location.city || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Capacity:</span>
                    <span className="font-medium">
                      {formData.capacity.guests} guests
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amenities:</span>
                    <span className="font-medium">
                      {formData.amenities.length} selected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Photos:</span>
                    <span className="font-medium">
                      {formData.images.length} uploaded
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="font-semibold">Price per night:</span>
                    <span className="font-bold text-red-600">
                      ₹{formData.pricing.basePrice || "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer section */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>

            <div className="flex space-x-3">
              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Listing</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingModal;
