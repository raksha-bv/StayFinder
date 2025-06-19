import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, phone, isHost } = req.body;
  try {
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone: phone || "",
      isHost: isHost || false,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        message: "User created successfully",
        _id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone,
        bio: newUser.bio,
        location: newUser.location,
        isHost: newUser.isHost,
        profilePic: newUser.profilePic,
        joinedDate: newUser.joinedDate,
      });
    } else {
      res.status(400).json({ message: "Failed to create user" });
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    const isValidPassword = await user.comparePassword(password);
    
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      isHost: user.isHost,
      profilePic: user.profilePic,
      joinedDate: user.joinedDate,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, bio, location, profilePic } = req.body;
    const userId = req.user._id;

    const updateData = {};

    // Handle profile picture upload if provided
    if (profilePic && profilePic.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        updateData.profilePic = uploadResponse.secure_url;
      } catch (uploadError) {
        console.log("Error uploading to cloudinary:", uploadError);
        return res.status(400).json({ message: "Failed to upload profile picture" });
      }
    }

    // Update other fields if provided
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Error in update profile controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check auth controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
