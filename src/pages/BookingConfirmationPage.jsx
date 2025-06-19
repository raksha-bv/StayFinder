import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle, Calendar, Users, MapPin, ArrowLeft } from "lucide-react";
import useBookingStore from "../store/useBookingStore";

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBookingById, currentBooking, isLoading } = useBookingStore();

  useEffect(() => {
    if (id) {
      getBookingById(id);
    }
  }, [id, getBookingById]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Booking not found
          </h2>
          <Link
            to="/listings"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your reservation has been successfully created
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Listing Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Stay
              </h2>

              {currentBooking.listing?.images?.[0] && (
                <img
                  src={
                    currentBooking.listing.images[0].url ||
                    currentBooking.listing.images[0]
                  }
                  alt={currentBooking.listing.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}

              <h3 className="font-semibold text-gray-900 mb-2">
                {currentBooking.listing?.title}
              </h3>

              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={16} className="mr-1" />
                <span className="text-sm">
                  {currentBooking.listing?.location?.city},{" "}
                  {currentBooking.listing?.location?.country}
                </span>
              </div>
            </div>

            {/* Booking Info */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Booking ID:</span>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {currentBooking._id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">
                    {new Date(currentBooking.checkIn).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">
                    {new Date(currentBooking.checkOut).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-semibold">
                    {currentBooking.guests.adults} adults
                    {currentBooking.guests.children > 0 &&
                      `, ${currentBooking.guests.children} children`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nights:</span>
                  <span className="font-semibold">
                    {Math.ceil(
                      (new Date(currentBooking.checkOut) -
                        new Date(currentBooking.checkIn)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    nights
                  </span>
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₹
                    {currentBooking.pricing?.totalAmount ||
                      currentBooking.totalAmount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {currentBooking.status || "Pending"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {currentBooking.specialRequests && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Special Requests
              </h3>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                {currentBooking.specialRequests}
              </p>
            </div>
          )}
        </div>

        {/* Host Info */}
        {(currentBooking.listing?.host || currentBooking.host) && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Host
            </h2>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {currentBooking.listing?.host?.profilePic ||
                currentBooking.host?.profilePic ? (
                  <img
                    src={
                      currentBooking.listing?.host?.profilePic ||
                      currentBooking.host?.profilePic
                    }
                    alt="Host"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-semibold">
                    {(
                      currentBooking.listing?.host?.firstName ||
                      currentBooking.host?.firstName
                    )?.charAt(0) || "H"}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {currentBooking.listing?.host?.firstName ||
                    currentBooking.host?.firstName}{" "}
                  {currentBooking.listing?.host?.lastName ||
                    currentBooking.host?.lastName}
                </h3>
                <p className="text-gray-600 text-sm">
                  {currentBooking.listing?.host?.email ||
                    currentBooking.host?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">
            Important Information
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>
              • Check-in time:{" "}
              {currentBooking.listing?.houseRules?.checkIn || "15:00"}
            </li>
            <li>
              • Check-out time:{" "}
              {currentBooking.listing?.houseRules?.checkOut || "11:00"}
            </li>
            <li>• You can cancel your booking from your profile page</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/listings"
            className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Listings</span>
          </Link>

          <Link
            to="/profile"
            className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-center"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
