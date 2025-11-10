import React, { useState } from 'react';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from '../contexts/NotificationContext';
import { FaStar, FaTimes, FaEdit, FaTrash, FaThumbsUp, FaCheckCircle } from 'react-icons/fa';

const ReviewForm = ({ productId, onClose, existingReview = null }) => {
  const { addReview, updateReview } = useReviews();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 5,
    title: existingReview?.title || '',
    comment: existingReview?.comment || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    } else if (formData.comment.trim().length > 2000) {
      newErrors.comment = 'Comment must be less than 2000 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);

    try {
      if (existingReview) {
        // Update existing review
        await updateReview(existingReview.id, {
          rating: formData.rating,
          title: formData.title.trim(),
          comment: formData.comment.trim()
        });
        showSuccess('✅ Review updated successfully!');
      } else {
        // Create new review
        await addReview({
          ...formData,
          productId,
          userId: user.id,
          userName: user.username || user.displayName
        });
        showSuccess('✅ Review submitted successfully!');
      }
      
      onClose();
    } catch (error) {
      showError(error.message || '❌ Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="write-review-title" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 id="write-review-title" className="text-xl font-bold font-saiyan dark:text-white">
            {existingReview ? 'EDIT REVIEW' : 'WRITE A REVIEW'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-3xl ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  } hover:text-yellow-400 transition-colors`}
                  aria-label={`Rate ${star} stars`}
                >
                  <FaStar />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 self-center">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Review Title * 
              <span className="text-xs text-gray-500 ml-2">
                ({formData.title.length}/200)
              </span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={200}
              className={`w-full px-3 py-2 border ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors`}
              placeholder="Summarize your experience..."
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">
              Your Review *
              <span className="text-xs text-gray-500 ml-2">
                ({formData.comment.length}/2000)
              </span>
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              maxLength={2000}
              rows={5}
              className={`w-full px-3 py-2 border ${
                errors.comment ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none dark:bg-gray-700 dark:text-white transition-colors`}
              placeholder="Share your thoughts about this product..."
            />
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : existingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewDisplay = ({ productId }) => {
  const { reviews, fetchReviews, deleteReview, markHelpful, getAverageRating, getRatingDistribution, getUserReview } = useReviews();
  const { user } = useAuth();
  const { showSuccess, showError, showConfirm } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  React.useEffect(() => {
    if (productId) {
      fetchReviews(productId, { sortBy });
    }
  }, [productId, sortBy]);

  const userReview = user ? getUserReview(productId) : null;
  const averageRating = getAverageRating(productId);
  const distribution = getRatingDistribution(productId);
  const totalReviews = reviews.length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      showSuccess('🗑️ Review deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      showError(error.message || '❌ Failed to delete review');
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    if (!user) {
      showError('🔐 Please log in to mark reviews as helpful');
      return;
    }
    
    try {
      await markHelpful(reviewId);
    } catch (error) {
      // Error already handled in context
    }
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
          <div className="text-center md:border-r md:border-gray-300 dark:md:border-gray-600 md:pr-6">
            <div className="text-4xl font-bold text-orange-500">{averageRating.toFixed(1)}</div>
            <div className="flex justify-center my-2">
              {[1, 2, 3, 4, 5].map(star => (
                <FaStar
                  key={star}
                  className={`text-xl ${
                    star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-1 w-full">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2 mb-2">
                <span className="text-sm w-8 dark:text-gray-300">{rating}<FaStar className="inline text-xs text-yellow-400" /></span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: totalReviews ? `${(distribution[rating] / totalReviews) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {distribution[rating]} ({totalReviews ? Math.round((distribution[rating] / totalReviews) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {user && !userReview && (
          <button
            onClick={() => { setEditingReview(null); setShowForm(true); }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaStar /> Write a Review
          </button>
        )}
        
        {user && userReview && (
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <FaCheckCircle className="text-blue-500" /> You reviewed this product
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <FaStar
                      key={star}
                      className={`text-sm ${
                        star <= userReview.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(userReview)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm flex items-center gap-1"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(userReview.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{userReview.title}</h4>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{userReview.comment}</p>
          </div>
        )}
      </div>

      {/* Sort Options */}
      {totalReviews > 0 && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold dark:text-white">Customer Reviews</h3>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-700 dark:text-white"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating_high">Highest Rating</option>
              <option value="rating_low">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {totalReviews === 0 ? (
        <div className="text-center py-12">
          <FaStar className="text-gray-300 dark:text-gray-600 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">No reviews yet</p>
          {user && (
            <button
              onClick={() => { setEditingReview(null); setShowForm(true); }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Be the First to Review
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => {
            const isOwnReview = user && review.userId === user.id;
            
            return (
              <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map(star => (
                          <FaStar
                            key={star}
                            className={`text-sm ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium dark:text-white">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded flex items-center gap-1">
                          <FaCheckCircle /> Verified Purchase
                        </span>
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{formatDate(review.date)}</span>
                    </div>
                    
                    <h4 className="font-semibold mb-2 dark:text-white">{review.title}</h4>
                    <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">{review.comment}</p>
                    
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleMarkHelpful(review.id)}
                        disabled={!user}
                        className={`text-sm flex items-center gap-1 transition-colors ${
                          user 
                            ? 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400' 
                            : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        <FaThumbsUp /> Helpful ({review.helpful || 0})
                      </button>
                      
                      {isOwnReview && (
                        <>
                          <button
                            onClick={() => handleEdit(review)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(review.id)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1"
                          >
                            <FaTrash /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Form Modal */}
      {showForm && (
        <ReviewForm
          productId={productId}
          existingReview={editingReview}
          onClose={() => { setShowForm(false); setEditingReview(null); }}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Delete Review?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete this review? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplay;