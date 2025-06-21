import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useReviewStore = create((set, get) => ({
  reviews: [],
  userReviews: [],
  reviewStats: null,
  isCreatingReview: false,
  isFetchingReviews: false,
  isFetchingUserReviews: false,
  isFetchingStats: false,
  isAddingResponse: false,
  isDeletingReview: false,
  currentPage: 1,
  totalPages: 1,
  totalReviews: 0,

  // Create a new review
  createReview: async (reviewData) => {
    set({ isCreatingReview: true });
    try {
      const res = await axiosInstance.post("/reviews", reviewData);
      
      // Add new review to existing reviews
      set((state) => ({
        reviews: [res.data.review, ...state.reviews],
        totalReviews: state.totalReviews + 1,
      }));
      
      toast.success("Review created successfully");
      return true;
    } catch (error) {
      console.log("Error in createReview:", error);
      toast.error(error.response?.data?.message || "Failed to create review");
      return false;
    } finally {
      set({ isCreatingReview: false });
    }
  },

  // Get reviews for a specific listing
  getListingReviews: async (listingId, page = 1, limit = 10) => {
    set({ isFetchingReviews: true });
    try {
      const res = await axiosInstance.get(`/reviews/listing/${listingId}?page=${page}&limit=${limit}`);
      
      if (page === 1) {
        set({
          reviews: res.data.reviews,
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        });
      } else {
        // Append to existing reviews for pagination
        set((state) => ({
          reviews: [...state.reviews, ...res.data.reviews],
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        }));
      }
      
      return res.data.reviews;
    } catch (error) {
      console.log("Error in getListingReviews:", error);
      // Only show toast error for actual server errors, not 404 or empty results
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch reviews");
      }
      // Set empty state for 404 or errors
      set({
        reviews: [],
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
      });
      return [];
    } finally {
      set({ isFetchingReviews: false });
    }
  },

  // Get review statistics for a listing
  getListingReviewStats: async (listingId) => {
    set({ isFetchingStats: true });
    try {
      const res = await axiosInstance.get(`/reviews/listing/${listingId}/stats`);
      set({ reviewStats: res.data });
      return res.data;
    } catch (error) {
      console.log("Error in getListingReviewStats:", error);
      // Only show toast error for actual server errors, not 404 or empty results
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch review statistics");
      }
      // Set default stats for no reviews
      set({ 
        reviewStats: {
          totalReviews: 0,
          averageOverall: 0,
          averageCleanliness: 0,
          averageAccuracy: 0,
          averageCommunication: 0,
          averageLocation: 0,
          averageValue: 0,
        }
      });
      return null;
    } finally {
      set({ isFetchingStats: false });
    }
  },

  // Get reviews for a specific user (as reviewee)
  getUserReviews: async (userId, page = 1, limit = 10, reviewerType = null) => {
    set({ isFetchingUserReviews: true });
    try {
      let url = `/reviews/user/${userId}?page=${page}&limit=${limit}`;
      if (reviewerType) {
        url += `&reviewerType=${reviewerType}`;
      }
      
      const res = await axiosInstance.get(url);
      
      if (page === 1) {
        set({
          userReviews: res.data.reviews,
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        });
      } else {
        set((state) => ({
          userReviews: [...state.userReviews, ...res.data.reviews],
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        }));
      }
      
      return res.data.reviews;
    } catch (error) {
      console.log("Error in getUserReviews:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch user reviews");
      }
      set({
        userReviews: [],
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
      });
      return [];
    } finally {
      set({ isFetchingUserReviews: false });
    }
  },

  // Get reviews written by a user
  getReviewsByUser: async (userId, page = 1, limit = 10) => {
    set({ isFetchingUserReviews: true });
    try {
      const res = await axiosInstance.get(`/reviews/by-user/${userId}?page=${page}&limit=${limit}`);
      
      if (page === 1) {
        set({
          userReviews: res.data.reviews,
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        });
      } else {
        set((state) => ({
          userReviews: [...state.userReviews, ...res.data.reviews],
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalReviews: res.data.total,
        }));
      }
      
      return res.data.reviews;
    } catch (error) {
      console.log("Error in getReviewsByUser:", error);
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch reviews");
      }
      set({
        userReviews: [],
        currentPage: 1,
        totalPages: 1,
        totalReviews: 0,
      });
      return [];
    } finally {
      set({ isFetchingUserReviews: false });
    }
  },

  // Add response to a review
  addReviewResponse: async (reviewId, comment) => {
    set({ isAddingResponse: true });
    try {
      const res = await axiosInstance.put(`/reviews/${reviewId}/response`, { comment });
      
      // Update the review in both reviews and userReviews arrays
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? res.data.review : review
        ),
        userReviews: state.userReviews.map((review) =>
          review._id === reviewId ? res.data.review : review
        ),
      }));
      
      toast.success("Response added successfully");
      return true;
    } catch (error) {
      console.log("Error in addReviewResponse:", error);
      toast.error(error.response?.data?.message || "Failed to add response");
      return false;
    } finally {
      set({ isAddingResponse: false });
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    set({ isDeletingReview: true });
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      
      // Remove review from both arrays
      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== reviewId),
        userReviews: state.userReviews.filter((review) => review._id !== reviewId),
        totalReviews: state.totalReviews - 1,
      }));
      
      toast.success("Review deleted successfully");
      return true;
    } catch (error) {
      console.log("Error in deleteReview:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
      return false;
    } finally {
      set({ isDeletingReview: false });
    }
  },

  // Clear reviews (useful when navigating away)
  clearReviews: () => {
    set({
      reviews: [],
      userReviews: [],
      reviewStats: null,
      currentPage: 1,
      totalPages: 1,
      totalReviews: 0,
    });
  },

  // Reset loading states
  resetLoadingStates: () => {
    set({
      isCreatingReview: false,
      isFetchingReviews: false,
      isFetchingUserReviews: false,
      isFetchingStats: false,
      isAddingResponse: false,
      isDeletingReview: false,
    });
  },

  // Update a specific review in the state (useful for real-time updates)
  updateReview: (reviewId, updatedData) => {
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review._id === reviewId ? { ...review, ...updatedData } : review
      ),
      userReviews: state.userReviews.map((review) =>
        review._id === reviewId ? { ...review, ...updatedData } : review
      ),
    }));
  },
}));

export default useReviewStore;