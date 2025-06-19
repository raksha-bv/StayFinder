import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Home,
  BookOpen,
  Star,
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Loader,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Edit,
  Check,
  Ban,
} from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import useBookingStore from "../store/useBookingStore";
import useListingStore from "../store/useListingStore";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { 
    getUserBookings, 
    getHostBookings, 
    bookings, 
    hostBookings, 
    cancelBooking, 
    isCancelling,
    updateBookingStatus,
    isUpdating
  } = useBookingStore();
  const { getHostListings, hostListings } = useListingStore();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [statusUpdateReason, setStatusUpdateReason] = useState("");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    profilePic: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (authUser) {
      setProfileData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        bio: authUser.bio || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      getUserBookings(1);
      if (authUser.isHost) {
        getHostBookings(1);
        getHostListings(1);
      }
    }
  }, [authUser]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileData(prev => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(profileData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original data
    if (authUser) {
      setProfileData({
        firstName: authUser.firstName || "",
        lastName: authUser.lastName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        bio: authUser.bio || "",
        location: authUser.location || "",
        profilePic: authUser.profilePic || "",
      });
    }
    setIsEditing(false);
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const handleUpdateBookingStatus = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setShowUpdateModal(true);
  };

  const confirmCancellation = async () => {
    if (!selectedBooking) return;

    const success = await cancelBooking(selectedBooking._id, cancellationReason);
    if (success) {
      setShowCancelModal(false);
      setSelectedBooking(null);
      setCancellationReason("");
      
      // Refresh bookings
      if (activeTab === "bookings") {
        getUserBookings(1);
      } else if (activeTab === "hosting") {
        getHostBookings(1);
      }
    }
  };

  const confirmStatusUpdate = async () => {
    if (!selectedBooking || !newStatus) return;

    const success = await updateBookingStatus(selectedBooking._id, newStatus, statusUpdateReason);
    if (success) {
      setShowUpdateModal(false);
      setSelectedBooking(null);
      setNewStatus("");
      setStatusUpdateReason("");
      
      // Refresh host bookings
      getHostBookings(1);
    }
  };

  const canCancelBooking = (booking) => {
    if (!booking) return false;
    
    // Cannot cancel if already cancelled or completed
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }

    // Check if check-in date is in the future (allow cancellation up to check-in date)
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    
    return checkInDate > now;
  };

  const canUpdateBooking = (booking) => {
    if (!booking || !authUser?.isHost) return false;
    
    // Can update if not completed or cancelled
    return booking.status !== "completed" && booking.status !== "cancelled";
  };

  const getAvailableStatuses = (currentStatus) => {
    const statusOptions = [
      { value: "pending", label: "Pending", description: "Waiting for approval" },
      { value: "confirmed", label: "Confirmed", description: "Booking is confirmed" },
      { value: "cancelled", label: "Cancelled", description: "Booking is cancelled" },
      { value: "completed", label: "Completed", description: "Stay is completed" },
    ];

    // Filter based on current status and business logic
    switch (currentStatus) {
      case "pending":
        return statusOptions.filter(s => ["pending", "confirmed", "cancelled"].includes(s.value));
      case "confirmed":
        return statusOptions.filter(s => ["confirmed", "cancelled", "completed"].includes(s.value));
      case "cancelled":
        return statusOptions.filter(s => s.value === "cancelled");
      case "completed":
        return statusOptions.filter(s => s.value === "completed");
      default:
        return statusOptions;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle size={16} className="text-green-600" />;
      case "pending":
        return <Clock size={16} className="text-yellow-600" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-600" />;
      case "completed":
        return <CheckCircle size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "bookings", name: "My Bookings", icon: BookOpen },
    ...(authUser?.isHost ? [
      { id: "hosting", name: "Hosting", icon: Home },
      { id: "listings", name: "My Listings", icon: Home }
    ] : []),
  ];

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to cancel this booking for{" "}
                <span className="font-semibold">{selectedBooking?.listing?.title}</span>?
              </p>
              <p className="text-sm text-gray-500">
                Check-in: {selectedBooking && new Date(selectedBooking.checkIn).toLocaleDateString()} -{" "}
                Check-out: {selectedBooking && new Date(selectedBooking.checkOut).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please let us know why you're cancelling..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {cancellationReason.length}/500 characters
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                  setCancellationReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                disabled={isCancelling}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isCancelling ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Cancel Booking</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Booking Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Edit className="text-blue-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">Update Booking Status</h3>
            </div>

            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Update status for booking at{" "}
                <span className="font-semibold">{selectedBooking?.listing?.title}</span>
              </p>
              <p className="text-sm text-gray-500">
                Guest: {selectedBooking?.guest?.firstName} {selectedBooking?.guest?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                Check-in: {selectedBooking && new Date(selectedBooking.checkIn).toLocaleDateString()} -{" "}
                Check-out: {selectedBooking && new Date(selectedBooking.checkOut).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {getAvailableStatuses(selectedBooking?.status).map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label} - {status.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for status change (optional)
              </label>
              <textarea
                value={statusUpdateReason}
                onChange={(e) => setStatusUpdateReason(e.target.value)}
                placeholder="Explain why you're updating the status..."
                rows={3}
                maxLength={500}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="text-xs text-gray-500 mt-1">
                {statusUpdateReason.length}/500 characters
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowUpdateModal(false);
                  setSelectedBooking(null);
                  setNewStatus("");
                  setStatusUpdateReason("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmStatusUpdate}
                disabled={isUpdating || newStatus === selectedBooking?.status}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isUpdating ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Status</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center overflow-hidden">
                {profileData.profilePic ? (
                  <img
                    src={profileData.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-2xl">
                    {profileData.firstName?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <Camera size={16} />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <div className="flex items-center space-x-2">
                  {isEditing && (
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition-colors"
                    >
                      <X size={16} />
                      <span>Cancel</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (isEditing) {
                        handleSaveProfile();
                      } else {
                        setIsEditing(true);
                      }
                    }}
                    disabled={isUpdatingProfile}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isUpdatingProfile ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : isEditing ? (
                      <>
                        <Save size={16} />
                        <span>Save</span>
                      </>
                    ) : (
                      <>
                        <Edit3 size={16} />
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <Mail size={16} />
                  <span className="text-sm">{profileData.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone size={16} />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Joined {new Date(authUser.joinedDate || authUser.createdAt).getFullYear()}</span>
                </div>
                {authUser.isHost && (
                  <div className="flex items-center space-x-1">
                    <Shield size={14} />
                    <span className="text-red-600 font-medium">Host</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-red-500 text-red-600 bg-red-50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <IconComponent size={18} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Add your phone number"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Add your location"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself"
                    maxLength={500}
                    rows={4}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-colors resize-none ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                  {isEditing && (
                    <div className="text-xs text-gray-500 mt-1">
                      {profileData.bio.length}/500 characters
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 rounded-lg p-2">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Bookings</p>
                      <p className="text-2xl font-bold text-blue-900">{bookings?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {authUser.isHost && (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-500 rounded-lg p-2">
                          <Home className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-green-600 font-medium">Listings</p>
                          <p className="text-2xl font-bold text-green-900">{hostListings?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-500 rounded-lg p-2">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Host Bookings</p>
                          <p className="text-2xl font-bold text-purple-900">{hostBookings?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {booking.listing?.images?.[0] && (
                            <img
                              src={booking.listing.images[0].url || booking.listing.images[0]}
                              alt={booking.listing.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{booking.listing?.title}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {booking.guests.adults} adults
                              {booking.guests.children > 0 && `, ${booking.guests.children} children`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-2 mb-2">
                            {getStatusIcon(booking.status)}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-2">₹{booking.pricing.totalAmount}</p>
                          
                          {/* Cancel Button */}
                          {canCancelBooking(booking) && (
                            <button
                              onClick={() => handleCancelBooking(booking)}
                              className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
                            >
                              Cancel Booking
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600">Start exploring and book your first stay!</p>
                </div>
              )}
            </div>
          )}

          {/* Hosting Tab */}
          {activeTab === "hosting" && authUser.isHost && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Hosting Dashboard</h2>
              
              {hostBookings && hostBookings.length > 0 ? (
                <div className="space-y-4">
                  {hostBookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {booking.listing?.images?.[0] && (
                            <img
                              src={booking.listing.images[0].url || booking.listing.images[0]}
                              alt={booking.listing.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{booking.listing?.title}</h3>
                            <p className="text-sm text-gray-600">
                              Guest: {booking.guest?.firstName} {booking.guest?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-2 mb-2">
                            {getStatusIcon(booking.status)}
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900 mb-2">₹{booking.pricing.totalAmount}</p>
                          
                          <div className="flex space-x-2">
                            {/* Update Status Button */}
                            {canUpdateBooking(booking) && (
                              <button
                                onClick={() => handleUpdateBookingStatus(booking)}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                Update Status
                              </button>
                            )}
                            
                            {/* Cancel Button */}
                            {canCancelBooking(booking) && (
                              <button
                                onClick={() => handleCancelBooking(booking)}
                                className="text-sm text-red-600 hover:text-red-800 hover:underline transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings received yet</h3>
                  <p className="text-gray-600">Your hosting journey is just beginning!</p>
                </div>
              )}
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === "listings" && authUser.isHost && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">My Listings</h2>
              
              {hostListings && hostListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hostListings.map((listing) => (
                    <div key={listing._id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      {listing.images?.[0] && (
                        <img
                          src={listing.images[0].url || listing.images[0]}
                          alt={listing.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {listing.location?.city}, {listing.location?.country}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900">₹{listing.pricing?.basePrice}/night</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.status === 'active' ? 'bg-green-100 text-green-800' :
                            listing.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {listing.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No listings yet</h3>
                  <p className="text-gray-600">Create your first listing to start hosting!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
