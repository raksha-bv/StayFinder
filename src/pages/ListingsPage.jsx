import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/ListingsPage/SearchBar";
import ListingsGrid from "../components/ListingsPage/ListingsGrid";
import useListingStore from "../store/useListingStore";

const ListingsPage = () => {
  const [searchParams] = useSearchParams();
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
    sortBy,
    getListings,
    getFilteredListings,
    setFilters: setStoreFilters,
    setSortBy,
    clearFilters,
  } = useListingStore();

  // Initialize filters from URL parameters
  useEffect(() => {
    const urlWhere = searchParams.get("where") || "";
    const urlCheckIn = searchParams.get("checkIn") || "";
    const urlCheckOut = searchParams.get("checkOut") || "";
    const urlGuests = parseInt(searchParams.get("guests")) || 1;

    // Parse dates from URL
    let dateRange = [null, null];
    if (urlCheckIn) {
      dateRange[0] = new Date(urlCheckIn);
      if (urlCheckOut) {
        dateRange[1] = new Date(urlCheckOut);
      }
    }

    // Update local filters
    const initialFilters = {
      where: urlWhere,
      checkIn: urlCheckIn,
      checkOut: urlCheckOut,
      guests: urlGuests,
      children: 0,
      dateRange: dateRange,
    };

    setFilters(initialFilters);

    // Update store filters
    const storeFilters = {
      city: urlWhere,
      guests: urlGuests.toString(),
      checkIn: urlCheckIn,
      checkOut: urlCheckOut,
    };

    setStoreFilters(storeFilters);

    // Load listings with initial filters
    if (urlWhere || urlCheckIn || urlGuests > 1) {
      console.log("Loading listings with URL parameters");
      getFilteredListings(1, sortBy);
    } else {
      console.log("Loading all listings");
      getListings(1, {}, sortBy);
    }
  }, [
    searchParams,
    getListings,
    getFilteredListings,
    setStoreFilters,
    setSortBy,
    sortBy,
  ]);

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));

    // Update store filters based on search form
    if (field === "where") {
      setStoreFilters({ city: value });
    }
    if (field === "guests") {
      setStoreFilters({ guests: value.toString() });
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
      filters.guests +
        (field === "guests" ? increment : 0) +
        (field === "children" ? increment : 0)
    );
    setStoreFilters({ guests: totalGuests.toString() });
  };

  const handleSearch = async () => {
    console.log("Search filters:", filters);

    // Convert form filters to store filters format
    const storeFilters = {
      city: filters.where,
      guests: (filters.guests + filters.children).toString(),
      checkIn: filters.checkIn,
      checkOut: filters.checkOut,
    };

    setStoreFilters(storeFilters);
    await getFilteredListings(1, sortBy);
  };

  const handleDateChange = (value) => {
    const checkIn =
      value && value[0] ? value[0].toISOString().split("T")[0] : "";
    const checkOut =
      value && value[1] ? value[1].toISOString().split("T")[0] : "";

    setFilters((prev) => ({
      ...prev,
      dateRange: value,
      checkIn: checkIn,
      checkOut: checkOut,
    }));

    // Update store filters
    setStoreFilters({
      checkIn: checkIn,
      checkOut: checkOut,
    });
  };

  const handleClearDates = () => {
    setFilters((prev) => ({
      ...prev,
      dateRange: [null, null],
      checkIn: "",
      checkOut: "",
    }));

    setStoreFilters({
      checkIn: "",
      checkOut: "",
    });
  };

  const handleCloseCalendar = () => {
    // This will be handled by the SearchBar component
  };

  // Handle sorting
  const handleSort = async (sortOption) => {
    console.log("ListingsPage - Sorting by:", sortOption);
    console.log(
      "ListingsPage - Current listings before sort:",
      listings.length
    );

    // Update sort in store
    setSortBy(sortOption);

    // Always fetch from page 1 when sorting to get fresh sorted results
    await getFilteredListings(1, sortOption);

    console.log("ListingsPage - Sort completed");
  };

  // Load more listings for pagination
  const handleLoadMore = async () => {
    if (pagination.currentPage < pagination.totalPages) {
      await getFilteredListings(pagination.currentPage + 1, sortBy);
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
        sortBy={sortBy}
        handleSort={handleSort}
        sortOptions={sortOptions}
      />

      <ListingsGrid
        stays={listings}
        sortBy={sortBy}
        sortOptions={sortOptions}
        isLoading={isLoading}
        pagination={pagination}
        onLoadMore={handleLoadMore}
        onSort={handleSort}
      />
    </div>
  );
};

export default ListingsPage;
