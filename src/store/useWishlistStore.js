import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useWishlistStore = create((set, get) => ({
  wishlists: [],
  currentWishlist: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isAddingToWishlist: false,
  isRemovingFromWishlist: false,
  hasLoadedWishlists: false, // Add this flag

  // Get all wishlists for the authenticated user
  getUserWishlists: async () => {
    const { hasLoadedWishlists, isLoading } = get();

    // Prevent multiple simultaneous calls
    if (isLoading || hasLoadedWishlists) {
      return get().wishlists;
    }

    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/wishlists");
      set({
        wishlists: res.data.wishlists || [],
        hasLoadedWishlists: true,
      });
      return res.data.wishlists || [];
    } catch (error) {
      console.log("Error in getUserWishlists:", error);
      // Only show toast for actual errors, not 404 or empty results
      if (error.response?.status !== 404) {
        toast.error(
          error.response?.data?.message || "Failed to fetch wishlists"
        );
      }
      set({
        wishlists: [],
        hasLoadedWishlists: true,
      });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  // Get a specific wishlist by ID
  getWishlistById: async (wishlistId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/wishlists/${wishlistId}`);
      set({ currentWishlist: res.data.wishlist });
      return res.data.wishlist;
    } catch (error) {
      console.log("Error in getWishlistById:", error);
      toast.error(error.response?.data?.message || "Failed to fetch wishlist");
      set({ currentWishlist: null });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create a new wishlist
  createWishlist: async (data) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/wishlists", data);
      const newWishlist = res.data.wishlist;

      set((state) => ({
        wishlists: [newWishlist, ...state.wishlists],
      }));

      // toast.success("Wishlist created successfully");
      return newWishlist;
    } catch (error) {
      console.log("Error in createWishlist:", error);
      toast.error(error.response?.data?.message || "Failed to create wishlist");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  // Update wishlist details
  updateWishlist: async (wishlistId, data) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/wishlists/${wishlistId}`, data);
      const updatedWishlist = res.data.wishlist;

      set((state) => ({
        wishlists: state.wishlists.map((wishlist) =>
          wishlist._id === wishlistId ? updatedWishlist : wishlist
        ),
        currentWishlist:
          state.currentWishlist?._id === wishlistId
            ? updatedWishlist
            : state.currentWishlist,
      }));

      toast.success("Wishlist updated successfully");
      return updatedWishlist;
    } catch (error) {
      console.log("Error in updateWishlist:", error);
      toast.error(error.response?.data?.message || "Failed to update wishlist");
      return null;
    } finally {
      set({ isUpdating: false });
    }
  },

  // Add listing to wishlist
  addToWishlist: async (wishlistId, listingId) => {
    set({ isAddingToWishlist: true });
    try {
      const res = await axiosInstance.post(
        `/wishlists/${wishlistId}/listings`,
        {
          listingId,
        }
      );
      const updatedWishlist = res.data.wishlist;

      set((state) => ({
        wishlists: state.wishlists.map((wishlist) =>
          wishlist._id === wishlistId ? updatedWishlist : wishlist
        ),
        currentWishlist:
          state.currentWishlist?._id === wishlistId
            ? updatedWishlist
            : state.currentWishlist,
      }));

      toast.success("Added to wishlist successfully");
      return updatedWishlist;
    } catch (error) {
      console.log("Error in addToWishlist:", error);
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
      return null;
    } finally {
      set({ isAddingToWishlist: false });
    }
  },

  // Remove listing from wishlist
  removeFromWishlist: async (wishlistId, listingId) => {
    set({ isRemovingFromWishlist: true });
    try {
      const res = await axiosInstance.delete(
        `/wishlists/${wishlistId}/listings/${listingId}`
      );
      const updatedWishlist = res.data.wishlist;

      set((state) => ({
        wishlists: state.wishlists.map((wishlist) =>
          wishlist._id === wishlistId ? updatedWishlist : wishlist
        ),
        currentWishlist:
          state.currentWishlist?._id === wishlistId
            ? updatedWishlist
            : state.currentWishlist,
      }));

      toast.success("Removed from wishlist successfully");
      return updatedWishlist;
    } catch (error) {
      console.log("Error in removeFromWishlist:", error);
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
      return null;
    } finally {
      set({ isRemovingFromWishlist: false });
    }
  },

  // Delete wishlist
  deleteWishlist: async (wishlistId) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/wishlists/${wishlistId}`);

      set((state) => ({
        wishlists: state.wishlists.filter(
          (wishlist) => wishlist._id !== wishlistId
        ),
        currentWishlist:
          state.currentWishlist?._id === wishlistId
            ? null
            : state.currentWishlist,
      }));

      toast.success("Wishlist deleted successfully");
      return true;
    } catch (error) {
      console.log("Error in deleteWishlist:", error);
      toast.error(error.response?.data?.message || "Failed to delete wishlist");
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Helper function to check if a listing is in any wishlist
  isListingInWishlist: (listingId) => {
    const { wishlists } = get();
    return wishlists.some((wishlist) =>
      wishlist.listings.some((listing) =>
        typeof listing === "string"
          ? listing === listingId
          : listing._id === listingId
      )
    );
  },

  // Helper function to get wishlists containing a specific listing
  getWishlistsWithListing: (listingId) => {
    const { wishlists } = get();
    return wishlists.filter((wishlist) =>
      wishlist.listings.some((listing) =>
        typeof listing === "string"
          ? listing === listingId
          : listing._id === listingId
      )
    );
  },

  // Clear current wishlist
  clearCurrentWishlist: () => {
    set({ currentWishlist: null });
  },

  // Clear all wishlists (useful for logout)
  clearWishlists: () => {
    set({
      wishlists: [],
      currentWishlist: null,
      isLoading: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      isAddingToWishlist: false,
      isRemovingFromWishlist: false,
      hasLoadedWishlists: false, // Reset the flag
    });
  },

  // Add method to force refresh wishlists
  refreshWishlists: async () => {
    set({ hasLoadedWishlists: false });
    return get().getUserWishlists();
  },
}));

export default useWishlistStore;
