import React, { useState } from 'react';
import { useReviews } from '../contexts/ReviewContext';
import { useAuth } from '../AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const ReviewForm = ({ productId, onClose }) => {
  const { addReview } = useReviews();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addReview({
        ...formData,
        productId,
        userId: user.id,
        userName: user.username || user.displayName
      });

      showSuccess('✅ Review submitted successfully!');
      onClose();
    } catch (error) {
      showError('❌ Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="write-review-title">
      <div className="bg-white rounded-xl max-w-md w-full p-6 overflow-x-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 id="write-review-title" className="text-xl font-bold font-saiyan">WRITE A REVIEW</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">Rating *</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                  className={`text-2xl ${
                    star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400 transition-colors`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Review Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Summarize your experience..."
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Review *</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts about this product..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReviewDisplay = ({ productId }) => {
  const { reviews, fetchReviews, markHelpful, getAverageRating, getRatingDistribution } = useReviews();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  React.useEffect(() => {
    fetchReviews(productId);
  }, [productId]);

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

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-500">{averageRating}</div>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`text-lg ${
                    star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
          
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center gap-2 mb-1">
                <span className="text-sm w-8">{rating}⭐</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: totalReviews ? `${(distribution[rating] / totalReviews) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-8">{distribution[rating]}</span>
              </div>
            ))}
          </div>
        </div>

        {user && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-gray-200 pb-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="font-medium">{review.userName}</span>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified Purchase
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">{formatDate(review.date)}</span>
                </div>
                
                <h4 className="font-semibold mb-2">{review.title}</h4>
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <button
                  onClick={() => markHelpful(review.id)}
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
                >
                  👍 Helpful ({review.helpful})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ReviewForm
          productId={productId}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ReviewDisplay;