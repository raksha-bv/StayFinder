import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";

config();

const seedListings = async () => {
  try {
    await connectDB();

    // Get all host users
    const hosts = await User.find({ isHost: true });
    
    if (hosts.length === 0) {
      console.log("No hosts found. Please seed users first.");
      process.exit(1);
    }

    console.log(`Found ${hosts.length} hosts`);

    // Clear existing listings
    await Listing.deleteMany({});
    console.log("Existing listings cleared");

    const listings = [
      // Sophia Davis's listings
      {
        title: "Cozy Downtown Apartment",
        description: "A beautiful and cozy apartment in the heart of downtown. Perfect for business travelers and tourists alike. Walking distance to restaurants, shopping, and public transportation.",
        host: hosts[0]._id,
        propertyType: "apartment",
        roomType: "entire_place",
        location: {
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          country: "United States",
          zipCode: "10001",
          coordinates: {
            type: "Point",
            coordinates: [-74.0060, 40.7128] // [longitude, latitude]
          }
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
            caption: "Living room with city view"
          },
          {
            url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
            caption: "Modern kitchen"
          },
          {
            url: "https://images.unsplash.com/photo-1540518614846-7eded1007763?w=800",
            caption: "Comfortable bedroom"
          }
        ],
        amenities: ["wifi", "kitchen", "tv", "air_conditioning", "workspace"],
        capacity: {
          guests: 2,
          bedrooms: 1,
          beds: 1,
          bathrooms: 1
        },
        pricing: {
          basePrice: 120,
          currency: "USD"
        },
        status: "active",
        rating: {
          average: 4.8,
          count: 24
        }
      },

      {
        title: "Luxury Villa with Pool",
        description: "Stunning luxury villa with private pool and garden. Perfect for families or groups looking for a premium experience. Located in a quiet residential area with easy access to the beach.",
        host: hosts[1]._id,
        propertyType: "villa",
        roomType: "entire_place",
        location: {
          address: "456 Ocean Drive",
          city: "Miami",
          state: "FL",
          country: "United States",
          zipCode: "33139",
          coordinates: {
            type: "Point",
            coordinates: [-80.1918, 25.7617]
          }
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
            caption: "Villa exterior with pool"
          },
          {
            url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
            caption: "Spacious living area"
          },
          {
            url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
            caption: "Master bedroom"
          }
        ],
        amenities: ["wifi", "pool", "parking", "garden", "air_conditioning", "kitchen"],
        capacity: {
          guests: 8,
          bedrooms: 4,
          beds: 4,
          bathrooms: 3
        },
        pricing: {
          basePrice: 350,
          currency: "USD"
        },
        status: "active",
        rating: {
          average: 4.9,
          count: 15
        }
      },

      {
        title: "Mountain Cabin Retreat",
        description: "Escape to this charming mountain cabin surrounded by nature. Features a fireplace, hot tub, and breathtaking mountain views. Perfect for a romantic getaway or family vacation.",
        host: hosts[2]._id,
        propertyType: "cabin",
        roomType: "entire_place",
        location: {
          address: "789 Mountain Trail",
          city: "Aspen",
          state: "CO",
          country: "United States",
          zipCode: "81611",
          coordinates: {
            type: "Point",
            coordinates: [-106.8175, 39.1911]
          }
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800",
            caption: "Cabin exterior in winter"
          },
          {
            url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
            caption: "Cozy interior with fireplace"
          },
          {
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            caption: "Mountain view from deck"
          }
        ],
        amenities: ["wifi", "fireplace", "hot_tub", "parking", "heating"],
        capacity: {
          guests: 6,
          bedrooms: 3,
          beds: 3,
          bathrooms: 2
        },
        pricing: {
          basePrice: 280,
          currency: "USD"
        },
        status: "active",
        rating: {
          average: 4.7,
          count: 31
        }
      },

      {
        title: "Modern Loft in Arts District",
        description: "Stylish industrial loft in the trendy arts district. High ceilings, exposed brick, and modern amenities. Walking distance to galleries, cafes, and nightlife.",
        host: hosts[3]._id,
        propertyType: "loft",
        roomType: "entire_place",
        location: {
          address: "321 Arts Boulevard",
          city: "Los Angeles",
          state: "CA",
          country: "United States",
          zipCode: "90013",
          coordinates: {
            type: "Point",
            coordinates: [-118.2437, 34.0522]
          }
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800",
            caption: "Open loft space"
          },
          {
            url: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=800",
            caption: "Industrial kitchen"
          },
          {
            url: "https://images.unsplash.com/photo-1562182384-08115de5ee97?w=800",
            caption: "Bedroom loft"
          }
        ],
        amenities: ["wifi", "workspace", "kitchen", "air_conditioning", "tv"],
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 2
        },
        pricing: {
          basePrice: 180,
          currency: "USD"
        },
        status: "active",
        rating: {
          average: 4.6,
          count: 18
        }
      },

      {
        title: "Beachfront Condo Paradise",
        description: "Wake up to ocean views in this stunning beachfront condo. Direct beach access, modern amenities, and breathtaking sunsets. Perfect for a beach vacation.",
        host: hosts[4]._id,
        propertyType: "condo",
        roomType: "entire_place",
        location: {
          address: "890 Oceanfront Boulevard",
          city: "San Diego",
          state: "CA",
          country: "United States",
          zipCode: "92101",
          coordinates: {
            type: "Point",
            coordinates: [-117.1611, 32.7157]
          }
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
            caption: "Ocean view from balcony"
          },
          {
            url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
            caption: "Modern living area"
          },
          {
            url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800",
            caption: "Bedroom with ocean view"
          }
        ],
        amenities: ["wifi", "pool", "gym", "balcony", "air_conditioning"],
        capacity: {
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 2
        },
        pricing: {
          basePrice: 250,
          currency: "USD"
        },
        status: "active",
        rating: {
          average: 4.9,
          count: 27
        }
      }
    ];

    // Insert listings
    const createdListings = await Listing.insertMany(listings);
    console.log(`Database seeded successfully with ${createdListings.length} listings`);
    
    const activeListings = createdListings.filter(listing => listing.status === 'active').length;
    const draftListings = createdListings.filter(listing => listing.status === 'draft').length;
    
    console.log(`Active listings: ${activeListings}`);
    console.log(`Draft listings: ${draftListings}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedListings();
