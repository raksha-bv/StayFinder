import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useListingStore = create((set, get) => ({
  // State
  listings: [],
  currentListing: null,
  hostListings: [],
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  searchResults: [],
  isSearching: false,
  filters: {
    city: "",
    country: "",
    propertyType: "",
    roomType: "",
    minPrice: "",
    maxPrice: "",
    guests: "",
    amenities: [],
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalListings: 0,
    limit: 10,
  },

  // Get all listings with filters
  getListings: async (page = 1, filters = {}) => {
    console.log("Store - getListings called with:", { page, filters });
    set({ isLoading: true });

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: get().pagination.limit.toString(),
        ...filters,
      });

      // Remove empty values
      for (const [key, value] of queryParams.entries()) {
        if (
          !value ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          queryParams.delete(key);
        }
      }

      const url = `/listings?${queryParams}`;
      console.log("Store - Making request to:", url);

      const res = await axiosInstance.get(url);
      console.log("Store - API response:", res.data);

      set({
        listings: res.data.listings,
        pagination: {
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalListings: res.data.totalListings,
          limit: get().pagination.limit,
        },
      });

      console.log("Store - Updated state with listings:", res.data.listings);
    } catch (error) {
      console.error("Store - Error in getListings:", error);
      console.error("Store - Error response:", error.response?.data);
      console.error("Store - Error status:", error.response?.status);
      toast.error(error.response?.data?.message || "Failed to fetch listings");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get filtered listings (apply current filters)
  getFilteredListings: async (page = 1) => {
    const { filters } = get();
    const activeFilters = {};

    // Only include non-empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "" && filters[key].length > 0) {
        activeFilters[key] = filters[key];
      }
    });

    await get().getListings(page, activeFilters);
  },

  // Get single listing by ID
  getListingById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/listings/${id}`);
      set({ currentListing: res.data });
      return res.data;
    } catch (error) {
      console.log("Error in getListingById:", error);
      toast.error(error.response?.data?.message || "Failed to fetch listing");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Create new listing
  createListing: async (listingData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/listings", listingData);

      // Add to listings array if on first page
      if (get().pagination.currentPage === 1) {
        set((state) => ({
          listings: [res.data.listing, ...state.listings],
        }));
      }

      toast.success("Listing created successfully");
      return res.data.listing;
    } catch (error) {
      console.log("Error in createListing:", error);
      toast.error(error.response?.data?.message || "Failed to create listing");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  // Update listing
  updateListing: async (id, updateData) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.put(`/listings/${id}`, updateData);

      // Update in listings array
      set((state) => ({
        listings: state.listings.map((listing) =>
          listing._id === id ? res.data.listing : listing
        ),
        currentListing: res.data.listing,
      }));

      toast.success("Listing updated successfully");
      return res.data.listing;
    } catch (error) {
      console.log("Error in updateListing:", error);
      toast.error(error.response?.data?.message || "Failed to update listing");
      return null;
    } finally {
      set({ isUpdating: false });
    }
  },

  // Delete listing
  deleteListing: async (id) => {
    set({ isDeleting: true });
    try {
      await axiosInstance.delete(`/listings/${id}`);

      // Remove from listings array
      set((state) => ({
        listings: state.listings.filter((listing) => listing._id !== id),
      }));

      toast.success("Listing deleted successfully");
      return true;
    } catch (error) {
      console.log("Error in deleteListing:", error);
      toast.error(error.response?.data?.message || "Failed to delete listing");
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Get host's listings
  getHostListings: async (page = 1) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/listings/host/my-listings?page=${page}&limit=${
          get().pagination.limit
        }`
      );

      set({
        hostListings: res.data.listings,
        pagination: {
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalListings: res.data.totalListings,
          limit: get().pagination.limit,
        },
      });
    } catch (error) {
      console.log("Error in getHostListings:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch host listings"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // Update listing status
  updateListingStatus: async (id, status) => {
    try {
      const res = await axiosInstance.patch(`/listings/${id}/status`, {
        status,
      });

      // Update in listings array
      set((state) => ({
        listings: state.listings.map((listing) =>
          listing._id === id ? { ...listing, status } : listing
        ),
      }));

      toast.success("Listing status updated successfully");
      return res.data.listing;
    } catch (error) {
      console.log("Error in updateListingStatus:", error);
      toast.error(
        error.response?.data?.message || "Failed to update listing status"
      );
      return null;
    }
  },

  // Search listings
  searchListings: async (query, location = {}) => {
    set({ isSearching: true });
    try {
      const params = new URLSearchParams({ query });
      if (location.lat && location.lng) {
        params.append("lat", location.lat);
        params.append("lng", location.lng);
      }

      const res = await axiosInstance.get(`/listings/search?${params}`);

      set({ searchResults: res.data });
      return res.data;
    } catch (error) {
      console.log("Error in searchListings:", error);
      toast.error(error.response?.data?.message || "Failed to search listings");
      return [];
    } finally {
      set({ isSearching: false });
    }
  },

  // Set filters
  setFilters: (newFilters) => {
    set({
      filters: { ...get().filters, ...newFilters },
    });
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: {
        city: "",
        country: "",
        propertyType: "",
        roomType: "",
        minPrice: "",
        maxPrice: "",
        guests: "",
        amenities: [],
      },
    });
  },

  // Clear current listing
  clearCurrentListing: () => {
    set({ currentListing: null });
  },

  // Clear search results
  clearSearchResults: () => {
    set({ searchResults: [] });
  },

  // Reset pagination
  resetPagination: () => {
    set({
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalListings: 0,
        limit: 10,
      },
    });
  },

  // Set loading states
  setLoading: (isLoading) => {
    set({ isLoading });
  },
}));

export default useListingStore;
