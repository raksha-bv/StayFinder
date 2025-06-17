import React, { useState } from "react";
import SearchBar from "../components/ListingsPage/SearchBar";
import ListingsGrid from "../components/ListingsPage/ListingsGrid";

const ListingsPage = () => {
  const [filters, setFilters] = useState({
    where: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    children: 0,
    dateRange: [null, null],
  });

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const adjustGuests = (field, increment) => {
    setFilters((prev) => ({
      ...prev,
      [field]: Math.max(0, prev[field] + increment),
    }));
  };

  const handleSearch = () => {
    console.log("Search filters:", filters);
    // Add your search logic here
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

  // Sample data for stays
  const stays = [
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Kollam, India",
      area: "Kollam beach",
      dates: "9-15 Jan",
      price: "₹2,568",
      rating: 4.79,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Goa, India",
      area: "Baga Beach",
      dates: "12-18 Jan",
      price: "₹3,200",
      rating: 4.85,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Mumbai, India",
      area: "Marine Drive",
      dates: "5-10 Feb",
      price: "₹4,500",
      rating: 4.92,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Kerala, India",
      area: "Backwaters",
      dates: "20-25 Jan",
      price: "₹1,800",
      rating: 4.67,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Udaipur, India",
      area: "City Palace",
      dates: "15-20 Mar",
      price: "₹3,800",
      rating: 4.88,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Jaipur, India",
      area: "Pink City",
      dates: "8-14 Feb",
      price: "₹2,900",
      rating: 4.71,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Manali, India",
      area: "Old Manali",
      dates: "22-28 Jan",
      price: "₹2,200",
      rating: 4.73,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Rishikesh, India",
      area: "Ganges Side",
      dates: "3-9 Mar",
      price: "₹1,600",
      rating: 4.65,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
      ],
      location: "Shimla, India",
      area: "Mall Road",
      dates: "18-24 Feb",
      price: "₹2,700",
      rating: 4.81,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
      ],
      location: "Agra, India",
      area: "Taj Mahal Area",
      dates: "10-15 Apr",
      price: "₹3,100",
      rating: 4.77,
      isGuestFavorite: false,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=400&fit=crop",
      ],
      location: "Darjeeling, India",
      area: "Tiger Hill",
      dates: "25-30 Mar",
      price: "₹2,000",
      rating: 4.69,
      isGuestFavorite: true,
    },
    {
      images: [
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=400&fit=crop",
      ],
      location: "Varanasi, India",
      area: "Ghats",
      dates: "6-12 Apr",
      price: "₹1,900",
      rating: 4.63,
      isGuestFavorite: false,
    },
  ];

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
        stays={stays}
        sortBy="recommended"
        sortOptions={sortOptions}
      />
    </div>
  );
};

export default ListingsPage;
