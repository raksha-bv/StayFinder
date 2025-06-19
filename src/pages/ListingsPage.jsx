import React, { useState, useEffect } from "react";
import SearchBar from "../components/ListingsPage/SearchBar";
import ListingsGrid from "../components/ListingsPage/ListingsGrid";
import useListingStore from "../store/useListingStore";

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    children: 0,
    dateRange: [null, null],
  });

  // Get listings and functions from Zustand store
  const {
    listings,
    isLoading,
    pagination,
    getListings,
    getFilteredListings,
    setFilters: setStoreFilters,
    clearFilters,
  } = useListingStore();

  // Add debugging
  console.log("ListingsPage - listings:", listings);
  console.log("ListingsPage - isLoading:", isLoading);
  console.log("ListingsPage - pagination:", pagination);

  // Load listings on component mount
  useEffect(() => {
    console.log("ListingsPage - useEffect triggered, calling getListings");
    getListings()
      .then(() => {
        console.log("ListingsPage - getListings completed");
      })
      .catch((error) => {
        console.error("ListingsPage - getListings error:", error);
      });
  }, []); // Remove getListings from dependency array to prevent infinite loop

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));

    // Update store filters based on search form
    if (field === "where") {
      setStoreFilters({ city: value });
    }
    if (field === "guests") {
      setStoreFilters({ guests: value });
    }
  };

  const adjustGuests = (field, increment) => {
    setFilters((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + increment),
    }));

    // Update total guests in store
    const totalGuests = Math.max(
      0,
      filters.guests + (field === "guests" ? increment : 0)
    );
    setStoreFilters({ guests: totalGuests });
  };

  const handleSearch = async () => {
    console.log("Search filters:", filters);

    // Convert form filters to store filters format
    const storeFilters = {
      city: filters.where,
      guests: filters.guests + filters.children,
    };

    setStoreFilters(storeFilters);
    await getFilteredListings(1);
  };

  const handleDateChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      dateRange: value,
      checkIn: value && value[0] ? value[0].toISOString().split("T")[0] : "",
      checkOut: value && value[1] ? value[1].toISOString().split("T")[0] : "",
    }));
  };

  const handleClearDates = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: [null, null],
      checkIn: "",
      checkOut: "",
    }));
  };

  const handleCloseCalendar = () => {
    // This will be handled by the SearchBar component
  };

  // Load more listings for pagination
  const handleLoadMore = async () => {
    if (pagination.currentPage < pagination.totalPages) {
      await getFilteredListings(pagination.currentPage + 1);
    }
  };

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest" },
  ];

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      <SearchBar
        filters={filters}
        handleInputChange={handleInputChange}
        adjustGuests={adjustGuests}
        handleSearch={handleSearch}
        handleDateChange={handleDateChange}
        handleCloseCalendar={handleCloseCalendar}
        handleClearDates={handleClearDates}
      />

      <ListingsGrid
        stays={listings}
        sortBy="recommended"
        sortOptions={sortOptions}
        isLoading={isLoading}
        pagination={pagination}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
};

export default ListingsPage;
