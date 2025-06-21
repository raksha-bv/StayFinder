import React, { useState, useEffect } from "react";
import { Star, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import useReviewStore from "../../store/useReviewStore";
import useAuthStore from "../../store/useAuthStore";
import toast from "react-hot-toast";

const ReviewSection = ({ listingId, hostId }) => {
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);

  const { authUser } = useAuthStore();
  const {
    reviews,
    reviewStats,
    isCreatingReview,
    isFetchingReviews,
    isFetchingStats,
    isAddingResponse,
    isDeletingReview,
    getListingReviews,
    getListingReviewStats,
    createReview,
    addReviewResponse,
    deleteReview,
    clearReviews,
  } = useReviewStore();

  useEffect(() => {
    if (listingId && !hasAttemptedLoad) {
      const loadReviews = async () => {
        try {
          await Promise.all([
            getListingReviews(listingId, 1, 6),
            getListingReviewStats(listingId),
          ]);
        } catch (error) {
          console.log("Reviews not available for this listing");
        } finally {
          setHasAttemptedLoad(true);
        }
      };

      loadReviews();
    }

    return () => {
      clearReviews();
    };
  }, [
    listingId,
    hasAttemptedLoad,
    getListingReviews,
    getListingReviewStats,
    clearReviews,
  ]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);
  const hasReviews = reviews.length > 0;

  const renderStars = (rating, size = 16) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating ? "fill-current text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Show loading skeleton
  if (!hasAttemptedLoad && (isFetchingReviews || isFetchingStats)) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {hasReviews ? (
              <div className="flex items-center space-x-3">
                <span>Reviews</span>
                {reviewStats && reviewStats.totalReviews > 0 && (
                  <div className="flex items-center space-x-2">
                    {renderStars(Math.round(reviewStats.averageOverall), 20)}
                    <span className="text-lg font-semibold">
                      {reviewStats.averageOverall?.toFixed(1)}
                    </span>
                    <span className="text-gray-600">
                      ({reviewStats.totalReviews} review
                      {reviewStats.totalReviews !== 1 ? "s" : ""})
                    </span>
                  </div>
                )}
              </div>
            ) : (
              "Reviews"
            )}
          </h2>
        </div>

        {authUser && (
          <button
            onClick={() => setShowCreateReview(true)}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors font-medium"
          >
            Write a review
          </button>
        )}
      </div>

      {/* Review Statistics */}
      {reviewStats && reviewStats.totalReviews > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {[
            {
              label: "Cleanliness",
              value: reviewStats.averageCleanliness,
            },
            {
              label: "Accuracy",
              value: reviewStats.averageAccuracy,
            },
            {
              label: "Communication",
              value: reviewStats.averageCommunication,
            },
            {
              label: "Location",
              value: reviewStats.averageLocation,
            },
            {
              label: "Value",
              value: reviewStats.averageValue,
            },
            {
              label: "Overall",
              value: reviewStats.averageOverall,
            },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-semibold text-gray-900">
                {stat.value?.toFixed(1) || "N/A"}
              </div>
              <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
              <div className="flex justify-center">
                {renderStars(Math.round(stat.value || 0), 12)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reviews List */}
      {hasReviews ? (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              authUser={authUser}
              hostId={hostId}
              onAddResponse={addReviewResponse}
              onDeleteReview={deleteReview}
              isAddingResponse={isAddingResponse}
              isDeletingReview={isDeletingReview}
            />
          ))}

          {reviews.length > 6 && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-gray-900 font-semibold hover:underline"
              >
                {showAllReviews
                  ? "Show less"
                  : `Show all ${
                      reviewStats?.totalReviews || reviews.length
                    } reviews`}
              </button>
            </div>
          )}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-gray-600 mb-6">
            Be the first to share your experience at this place!
          </p>
          {authUser && (
            <button
              onClick={() => setShowCreateReview(true)}
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              Write the first review
            </button>
          )}
        </div>
      )}

      {/* Create Review Modal */}
      {showCreateReview && (
        <CreateReviewModal
          listingId={listingId}
          hostId={hostId}
          onClose={() => setShowCreateReview(false)}
          onSubmit={createReview}
          isSubmitting={isCreatingReview}
        />
      )}
    </div>
  );
};

// Much Smaller Review Card Component
const ReviewCard = ({
  review,
  authUser,
  hostId,
  onAddResponse,
  onDeleteReview,
  isAddingResponse,
  isDeletingReview,
}) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseComment, setResponseComment] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const canRespond =
    authUser && authUser._id === hostId && !review.response?.comment;
  const canDelete = authUser && authUser._id === review.reviewer._id;

  const handleAddResponse = async () => {
    if (!responseComment.trim()) return;

    const success = await onAddResponse(review._id, responseComment.trim());
    if (success) {
      setShowResponseForm(false);
      setResponseComment("");
    }
  };

  const handleDeleteReview = async () => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await onDeleteReview(review._id);
    }
    setShowDropdown(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={`${
              star <= rating ? "fill-current text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
      {/* Review Header - More Compact */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {review.reviewer.profilePic ? (
              <img
                src={review.reviewer.profilePic}
                alt={`${review.reviewer.firstName} ${review.reviewer.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-600 font-semibold text-xs">
                {review.reviewer.firstName?.charAt(0)}
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-xs">
                {review.reviewer.firstName} {review.reviewer.lastName}
              </h4>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating.overall)}
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span>•</span>
              <span className="capitalize">{review.reviewerType}</span>
            </div>
          </div>
        </div>

        {(canRespond || canDelete) && (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50"
            >
              <MoreHorizontal size={14} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 min-w-28">
                {canRespond && (
                  <button
                    onClick={() => {
                      setShowResponseForm(true);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 flex items-center space-x-1"
                  >
                    <MessageCircle size={10} />
                    <span>Respond</span>
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDeleteReview}
                    disabled={isDeletingReview}
                    className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Trash2 size={10} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Content - Smaller */}
      <p className="text-gray-700 mb-2 leading-relaxed text-xs">
        {review.comment}
      </p>

      {/* Detailed Ratings - Smaller */}
      {Object.keys(review.rating).length > 1 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2 text-xs">
          {Object.entries(review.rating)
            .filter(
              ([key]) =>
                key !== "overall" && key !== "_id" && review.rating[key] > 0
            )
            .map(([category, rating]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-500 capitalize text-xs">
                  {category}:
                </span>
                <span className="font-medium text-gray-900 text-xs ml-1">
                  {rating}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Host Response - Smaller */}
      {review.response?.comment && (
        <div className="mt-2 bg-gray-50 rounded-lg p-2">
          <div className="flex items-center space-x-1 mb-1">
            <span className="text-xs font-semibold text-gray-900">
              Host response
            </span>
            <span className="text-xs text-gray-500">
              {new Date(review.response.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 text-xs leading-relaxed">
            {review.response.comment}
          </p>
        </div>
      )}

      {/* Response Form - Smaller */}
      {showResponseForm && (
        <div className="mt-2 bg-blue-50 rounded-lg p-2">
          <h5 className="font-semibold text-gray-900 mb-2 text-xs">
            Respond to this review
          </h5>
          <textarea
            value={responseComment}
            onChange={(e) => setResponseComment(e.target.value)}
            placeholder="Write your response..."
            maxLength={1000}
            rows={2}
            className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent resize-none text-xs"
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">
              {responseComment.length}/1000
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setShowResponseForm(false)}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddResponse}
                disabled={!responseComment.trim() || isAddingResponse}
                className="bg-blue-600 text-white px-2 py-1 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs"
              >
                {isAddingResponse ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Fixed Create Review Modal with PROPER rounded corners and compact spacing
const CreateReviewModal = ({
  listingId,
  hostId,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    rating: {
      overall: 0,
      cleanliness: 0,
      accuracy: 0,
      communication: 0,
      location: 0,
      value: 0,
    },
    comment: "",
  });

  const handleRatingChange = (category, rating) => {
    setFormData((prev) => ({
      ...prev,
      rating: {
        ...prev.rating,
        [category]: rating,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating.overall === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const reviewData = {
      listingId,
      revieweeId: hostId,
      reviewerType: "guest",
      rating: formData.rating,
      comment: formData.comment.trim(),
    };

    const success = await onSubmit(reviewData);
    if (success) {
      onClose();
    }
  };

  const ratingCategories = [
    { key: "overall", label: "Overall Experience", required: true },
    { key: "cleanliness", label: "Cleanliness" },
    { key: "accuracy", label: "Accuracy" },
    { key: "communication", label: "Communication" },
    { key: "location", label: "Location" },
    { key: "value", label: "Value for Money" },
  ];

  const renderStarSelector = (category, rating) => {
    return (
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium text-sm min-w-[140px]">
          {ratingCategories.find((cat) => cat.key === category)?.label}
          {category === "overall" && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </span>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(category, star)}
              className={`p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-full ${
                star <= rating
                  ? "text-yellow-400"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
            >
              <Star
                size={18}
                className={`${
                  star <= rating ? "fill-current" : ""
                } transition-all duration-150`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 min-w-[40px] font-medium">
            {rating > 0 ? `${rating}` : ""}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* SUPER ROUNDED Modal Container */}
      <div
        className="bg-white p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{
          borderRadius: "24px", // Force extra rounded corners
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Write a review
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Categories - Much more compact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm mb-3">
              Rate your experience
            </h4>

            {ratingCategories.map((category) => (
              <div key={category.key} className="py-1">
                {renderStarSelector(
                  category.key,
                  formData.rating[category.key]
                )}
              </div>
            ))}
          </div>

          {/* Comment - Super rounded */}
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-medium text-gray-700">
              Your review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience at this place..."
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none text-sm"
              required
              style={{ borderRadius: "16px" }} // Super rounded textarea
            />
            <div className="text-xs text-gray-500">
              {formData.comment.length}/1000 characters
            </div>
          </div>

          {/* Submit Button - Super rounded */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              style={{ borderRadius: "16px" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isSubmitting ||
                formData.rating.overall === 0 ||
                !formData.comment.trim()
              }
              className="bg-gray-900 text-white px-6 py-2 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 font-medium"
              style={{ borderRadius: "16px" }} // Super rounded button
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSection;
