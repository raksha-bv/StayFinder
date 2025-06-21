import React, { useState } from "react";
import { Star, MessageCircle } from "lucide-react";
import useReviewStore from "../store/useReviewStore";

const BookingReviewPrompt = ({ booking }) => {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { createReview, isCreatingReview } = useReviewStore();

  if (booking.status !== "completed" || booking.hasReviewed) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
      <div className="flex items-start space-x-4">
        <MessageCircle className="text-blue-600 mt-1" size={24} />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">
            How was your stay at {booking.listing.title}?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Your review helps other travelers and improves the experience for everyone.
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Write a review
          </button>
        </div>
      </div>

      {showReviewForm && (
        <ReviewFormModal
          booking={booking}
          onClose={() => setShowReviewForm(false)}
          onSubmit={createReview}
          isSubmitting={isCreatingReview}
        />
      )}
    </div>
  );
};

export default BookingReviewPrompt;