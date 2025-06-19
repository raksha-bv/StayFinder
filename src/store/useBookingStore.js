import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

const useBookingStore = create((set, get) => ({
  // State
  bookings: [],
  hostBookings: [],
  currentBooking: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isCancelling: false,
  isCheckingAvailability: false,
  availability: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 10,
  },
  hostPagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    limit: 10,
  },
  filters: {
    status: "",
    fromDate: "",
    toDate: "",
  },

  // Create new booking
  createBooking: async (bookingData) => {
    set({ isCreating: true });
    try {
      const res = await axiosInstance.post("/bookings", bookingData);

      // Add to bookings array if on first page
      if (get().pagination.currentPage === 1) {
        set((state) => ({
          bookings: [res.data.booking, ...state.bookings],
        }));
      }

      //   toast.success("Booking created successfully");
      return res.data.booking;
    } catch (error) {
      console.log("Error in createBooking:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  // Get user's bookings (as guest)
  getUserBookings: async (page = 1, filters = {}) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: get().pagination.limit.toString(),
        ...filters,
      });

      // Remove empty values
      for (const [key, value] of queryParams.entries()) {
        if (!value || value === "") {
          queryParams.delete(key);
        }
      }

      const url = `/bookings/my-bookings?${queryParams}`;
      const res = await axiosInstance.get(url);

      set({
        bookings: res.data.bookings,
        pagination: {
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalBookings: res.data.totalBookings,
          limit: get().pagination.limit,
        },
      });

      return res.data.bookings;
    } catch (error) {
      console.log("Error in getUserBookings:", error);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  // Get host's bookings
  getHostBookings: async (page = 1, filters = {}) => {
    set({ isLoading: true });
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: get().hostPagination.limit.toString(),
        ...filters,
      });

      // Remove empty values
      for (const [key, value] of queryParams.entries()) {
        if (!value || value === "") {
          queryParams.delete(key);
        }
      }

      const url = `/bookings/host-bookings?${queryParams}`;
      const res = await axiosInstance.get(url);

      set({
        hostBookings: res.data.bookings,
        hostPagination: {
          currentPage: res.data.currentPage,
          totalPages: res.data.totalPages,
          totalBookings: res.data.totalBookings,
          limit: get().hostPagination.limit,
        },
      });

      return res.data.bookings;
    } catch (error) {
      console.log("Error in getHostBookings:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch host bookings"
      );
      return [];
    } finally {
      set({ isLoading: false });
    }
  },

  // Get filtered user bookings
  getFilteredUserBookings: async (page = 1) => {
    const { filters } = get();
    const activeFilters = {};

    // Only include non-empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "") {
        activeFilters[key] = filters[key];
      }
    });

    await get().getUserBookings(page, activeFilters);
  },

  // Get filtered host bookings
  getFilteredHostBookings: async (page = 1) => {
    const { filters } = get();
    const activeFilters = {};

    // Only include non-empty filters
    Object.keys(filters).forEach((key) => {
      if (filters[key] && filters[key] !== "") {
        activeFilters[key] = filters[key];
      }
    });

    await get().getHostBookings(page, activeFilters);
  },

  // Get single booking by ID
  getBookingById: async (id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/bookings/${id}`);
      set({ currentBooking: res.data });
      return res.data;
    } catch (error) {
      console.log("Error in getBookingById:", error);
      toast.error(error.response?.data?.message || "Failed to fetch booking");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Cancel booking
  cancelBooking: async (id, cancellationReason = "") => {
    set({ isCancelling: true });
    try {
      const res = await axiosInstance.patch(`/bookings/${id}/cancel`, {
        cancellationReason,
      });

      // Update in bookings arrays
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        hostBookings: state.hostBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentBooking:
          state.currentBooking?._id === id
            ? res.data.booking
            : state.currentBooking,
      }));

      toast.success("Booking cancelled successfully");
      return res.data.booking;
    } catch (error) {
      console.log("Error in cancelBooking:", error);
      toast.error(error.response?.data?.message || "Failed to cancel booking");
      return null;
    } finally {
      set({ isCancelling: false });
    }
  },

  // Update booking status (for hosts)
  updateBookingStatus: async (id, status) => {
    set({ isUpdating: true });
    try {
      const res = await axiosInstance.patch(`/bookings/${id}/status`, {
        status,
      });

      // Update in bookings arrays
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        hostBookings: state.hostBookings.map((booking) =>
          booking._id === id ? res.data.booking : booking
        ),
        currentBooking:
          state.currentBooking?._id === id
            ? res.data.booking
            : state.currentBooking,
      }));

      toast.success("Booking status updated successfully");
      return res.data.booking;
    } catch (error) {
      console.log("Error in updateBookingStatus:", error);
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
      return null;
    } finally {
      set({ isUpdating: false });
    }
  },

  // Check availability for a listing
  checkAvailability: async (listingId, checkIn, checkOut) => {
    set({ isCheckingAvailability: true });
    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
      });

      const res = await axiosInstance.get(
        `/bookings/availability/${listingId}?${params}`
      );

      set({ availability: res.data });
      return res.data;
    } catch (error) {
      console.log("Error in checkAvailability:", error);
      toast.error(
        error.response?.data?.message || "Failed to check availability"
      );
      return { available: false, message: "Failed to check availability" };
    } finally {
      set({ isCheckingAvailability: false });
    }
  },

  // Get booking statistics for dashboard
  getBookingStats: async () => {
    try {
      const [userRes, hostRes] = await Promise.all([
        axiosInstance.get("/bookings/my-bookings?limit=1"),
        axiosInstance.get("/bookings/host-bookings?limit=1"),
      ]);

      return {
        totalUserBookings: userRes.data.totalBookings || 0,
        totalHostBookings: hostRes.data.totalBookings || 0,
      };
    } catch (error) {
      console.log("Error in getBookingStats:", error);
      return {
        totalUserBookings: 0,
        totalHostBookings: 0,
      };
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
        status: "",
        fromDate: "",
        toDate: "",
      },
    });
  },

  // Clear current booking
  clearCurrentBooking: () => {
    set({ currentBooking: null });
  },

  // Clear availability
  clearAvailability: () => {
    set({ availability: null });
  },

  // Reset pagination
  resetPagination: () => {
    set({
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        limit: 10,
      },
    });
  },

  // Reset host pagination
  resetHostPagination: () => {
    set({
      hostPagination: {
        currentPage: 1,
        totalPages: 1,
        totalBookings: 0,
        limit: 10,
      },
    });
  },

  // Set loading states
  setLoading: (isLoading) => {
    set({ isLoading });
  },

  // Get upcoming bookings (for dashboard)
  getUpcomingBookings: async (isHost = false) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const endpoint = isHost
        ? "/bookings/host-bookings"
        : "/bookings/my-bookings";

      const res = await axiosInstance.get(
        `${endpoint}?status=confirmed&fromDate=${today}&limit=5`
      );

      return res.data.bookings || [];
    } catch (error) {
      console.log("Error in getUpcomingBookings:", error);
      return [];
    }
  },

  // Get recent bookings (for dashboard)
  getRecentBookings: async (isHost = false) => {
    try {
      const endpoint = isHost
        ? "/bookings/host-bookings"
        : "/bookings/my-bookings";

      const res = await axiosInstance.get(`${endpoint}?limit=5`);

      return res.data.bookings || [];
    } catch (error) {
      console.log("Error in getRecentBookings:", error);
      return [];
    }
  },

  // Calculate total amount for booking
  calculateBookingAmount: (listing, checkIn, checkOut) => {
    if (!listing || !checkIn || !checkOut) return 0;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    return nights * listing.pricing.basePrice;
  },

  // Validate booking dates
  validateBookingDates: (checkIn, checkOut) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return { valid: false, message: "Check-in date cannot be in the past" };
    }

    if (checkOutDate <= checkInDate) {
      return {
        valid: false,
        message: "Check-out date must be after check-in date",
      };
    }

    return { valid: true, message: "" };
  },
}));

export default useBookingStore;
