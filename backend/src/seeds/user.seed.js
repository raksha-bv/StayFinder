import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users (Guests)
  {
    firstName: "Emma",
    lastName: "Thompson",
    email: "emma.thompson@example.com",
    password: "123456",
    phone: "+1234567890",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    isHost: false,
  },
  {
    firstName: "Olivia",
    lastName: "Miller",
    email: "olivia.miller@example.com",
    password: "123456",
    phone: "+1234567891",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    isHost: false,
  },
  {
    firstName: "Sophia",
    lastName: "Davis",
    email: "sophia.davis@example.com",
    password: "123456",
    phone: "+1234567892",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    isHost: true,
  },
  {
    firstName: "Ava",
    lastName: "Wilson",
    email: "ava.wilson@example.com",
    password: "123456",
    phone: "+1234567893",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    isHost: false,
  },
  {
    firstName: "Isabella",
    lastName: "Brown",
    email: "isabella.brown@example.com",
    password: "123456",
    phone: "+1234567894",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    isHost: true,
  },
  {
    firstName: "Mia",
    lastName: "Johnson",
    email: "mia.johnson@example.com",
    password: "123456",
    phone: "+1234567895",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    isHost: false,
  },
  {
    firstName: "Charlotte",
    lastName: "Williams",
    email: "charlotte.williams@example.com",
    password: "123456",
    phone: "+1234567896",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    isHost: true,
  },
  {
    firstName: "Amelia",
    lastName: "Garcia",
    email: "amelia.garcia@example.com",
    password: "123456",
    phone: "+1234567897",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    isHost: false,
  },
  {
    firstName: "Harper",
    lastName: "Martinez",
    email: "harper.martinez@example.com",
    password: "123456",
    phone: "+1234567898",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    isHost: true,
  },
  {
    firstName: "Luna",
    lastName: "Lopez",
    email: "luna.lopez@example.com",
    password: "123456",
    phone: "+1234567899",
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    isHost: false,
  },

  // Male Users (Mix of Guests and Hosts)
  {
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@example.com",
    password: "123456",
    phone: "+1234567800",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    isHost: false,
  },
  {
    firstName: "William",
    lastName: "Clark",
    email: "william.clark@example.com",
    password: "123456",
    phone: "+1234567801",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    isHost: true,
  },
  {
    firstName: "Benjamin",
    lastName: "Taylor",
    email: "benjamin.taylor@example.com",
    password: "123456",
    phone: "+1234567802",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    isHost: false,
  },
  {
    firstName: "Lucas",
    lastName: "Moore",
    email: "lucas.moore@example.com",
    password: "123456",
    phone: "+1234567803",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    isHost: true,
  },
  {
    firstName: "Henry",
    lastName: "Jackson",
    email: "henry.jackson@example.com",
    password: "123456",
    phone: "+1234567804",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    isHost: false,
  },
  {
    firstName: "Alexander",
    lastName: "Martin",
    email: "alexander.martin@example.com",
    password: "123456",
    phone: "+1234567805",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    isHost: true,
  },
  {
    firstName: "Daniel",
    lastName: "Rodriguez",
    email: "daniel.rodriguez@example.com",
    password: "123456",
    phone: "+1234567806",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    isHost: false,
  },
  {
    firstName: "Matthew",
    lastName: "Lewis",
    email: "matthew.lewis@example.com",
    password: "123456",
    phone: "+1234567807",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    isHost: true,
  },
  {
    firstName: "Jackson",
    lastName: "Walker",
    email: "jackson.walker@example.com",
    password: "123456",
    phone: "+1234567808",
    avatar: "https://randomuser.me/api/portraits/men/9.jpg",
    isHost: false,
  },
  {
    firstName: "Sebastian",
    lastName: "Hall",
    email: "sebastian.hall@example.com",
    password: "123456",
    phone: "+1234567809",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    isHost: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany({});
    console.log("Existing users cleared");

    // Insert new users
    await User.insertMany(seedUsers);
    console.log(`Database seeded successfully with ${seedUsers.length} users`);
    console.log(`Hosts: ${seedUsers.filter((user) => user.isHost).length}`);
    console.log(`Guests: ${seedUsers.filter((user) => !user.isHost).length}`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Call the function
seedDatabase();
