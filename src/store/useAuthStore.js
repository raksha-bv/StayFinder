import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      // Only log if it's not a 401 (unauthorized) error
      if (error.response?.status !== 401) {
        console.log("Error in checkAuth:", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      return true;
    } catch (error) {
      console.log("Error in signup:", error);
      toast.error(error.response?.data?.message || "Failed to create account");
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      console.log("Error in login:", error);
      toast.error(error.response?.data?.message || "Failed to login");
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      console.log("Error in logout:", error);
      toast.error("Failed to logout");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data.user });
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.log("Error in updateProfile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));

export default useAuthStore;
