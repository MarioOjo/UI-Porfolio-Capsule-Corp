import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/usePerformance';
import { apiFetch } from '../utils/api';
import { useAuth } from "./AuthContext";
import { useNotifications } from './NotificationContext';

const ReviewContext = createContext();

const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        loading: false,
        error: null
      };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        totalReviews: state.totalReviews + 1,
        error: null
      };
    
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        ),
        error: null
      };
    
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
        totalReviews: Math.max(0, state.totalReviews - 1),
        error: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
        error: action.payload ? null : state.error
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  reviews: [],
  totalReviews: 0,
  loading: false,
  error: null
};

export const ReviewProvider = ({ children }) => {
  const [reviewCache, setReviewCache] = useLocalStorage('reviewCache', {});
  const [state, dispatch] = useReducer(reviewReducer, initialState);
  const { user } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();

  // Clear error after 5 seconds
  useEffect(() => {
    if (state.error) {
      const timer = setTimeout(() => {
        dispatch({ type: 'CLEAR_ERROR' });
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.error]);

  const fetchReviews = async (productId) => {
    if (!productId) {
      dispatch({ type: 'SET_ERROR', payload: 'Product ID is required' });
      return;
    }

    // Check cache first
    if (reviewCache[productId] && Array.isArray(reviewCache[productId])) {
      dispatch({ type: 'SET_REVIEWS', payload: reviewCache[productId] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Fetch reviews from backend API
      const response = await apiFetch(`/api/products/${productId}/reviews`);
      const reviews = Array.isArray(response?.reviews) ? response.reviews : [];

      // Cache the results
      const updatedCache = { 
        ...reviewCache, 
        [productId]: reviews 
      };
      setReviewCache(updatedCache);
      
      dispatch({ type: 'SET_REVIEWS', payload: reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      const errorMessage = error?.message || 'Failed to load reviews';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(`❌ ${errorMessage}`);
    }
  };

  const addReview = async (reviewData) => {
    if (!user) {
      const error = 'Please log in to submit a review';
      dispatch({ type: 'SET_ERROR', payload: error });
      showInfo('🔐 Please log in to submit a review');
      throw new Error(error);
    }

    if (!reviewData?.productId || !reviewData?.rating) {
      const error = 'Product ID and rating are required';
      dispatch({ type: 'SET_ERROR', payload: error });
      throw new Error(error);
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Submit review to backend API
      const response = await apiFetch(`/api/products/${reviewData.productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: reviewData.rating,
          title: reviewData.title || '',
          comment: reviewData.comment || '',
          userId: user.id || user.uid
        })
      });

      const newReview = response.review || {
        id: Date.now().toString(),
        ...reviewData,
        userId: user.id || user.uid,
        userName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0
      };

      dispatch({ type: 'ADD_REVIEW', payload: newReview });
      
      // Update cache
      const productReviews = Array.isArray(reviewCache[reviewData.productId]) 
        ? reviewCache[reviewData.productId] 
        : [];
      
      const updatedCache = {
        ...reviewCache,
        [reviewData.productId]: [newReview, ...productReviews]
      };
      setReviewCache(updatedCache);
      
      showSuccess('⭐ Review submitted successfully!');
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      const errorMessage = error?.message || 'Failed to submit review';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(`❌ ${errorMessage}`);
      throw error;
    }
  };

  const markHelpful = async (reviewId) => {
    if (!user) {
      showInfo('🔐 Please log in to mark reviews as helpful');
      return;
    }

    try {
      // Send helpful vote to backend API
      await apiFetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        body: JSON.stringify({ userId: user.id || user.uid })
      });

      // Update review helpful count locally
      const updatedReviews = state.reviews.map(review =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      );
      
      dispatch({ type: 'SET_REVIEWS', payload: updatedReviews });
      
      // Update cache
      const updatedCache = { ...reviewCache };
      Object.keys(updatedCache).forEach(productId => {
        if (Array.isArray(updatedCache[productId])) {
          updatedCache[productId] = updatedCache[productId].map(review =>
            review.id === reviewId
              ? { ...review, helpful: (review.helpful || 0) + 1 }
              : review
          );
        }
      });
      setReviewCache(updatedCache);

      showSuccess('👍 Marked as helpful!');
    } catch (error) {
      console.error('Error marking review helpful:', error);
      const errorMessage = error?.message || 'Failed to mark review as helpful';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      showError(`❌ ${errorMessage}`);
    }
  };

  const getAverageRating = (productId) => {
    if (!productId) return 0;
    
    const productReviews = Array.isArray(reviewCache[productId]) 
      ? reviewCache[productId] 
      : [];
    
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return parseFloat((total / productReviews.length).toFixed(1));
  };

  const getRatingDistribution = (productId) => {
    if (!productId) return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    const productReviews = Array.isArray(reviewCache[productId]) 
      ? reviewCache[productId] 
      : [];
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    productReviews.forEach(review => {
      const rating = review.rating;
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    
    return distribution;
  };

  const getUserReview = (productId) => {
    if (!user || !productId) return null;
    
    const productReviews = Array.isArray(reviewCache[productId]) 
      ? reviewCache[productId] 
      : [];
    
    const userId = user.id || user.uid;
    return productReviews.find(review => review.userId === userId) || null;
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearReviews = () => {
    dispatch({ type: 'SET_REVIEWS', payload: [] });
  };

  const value = {
    ...state,
    fetchReviews,
    addReview,
    markHelpful,
    getAverageRating,
    getRatingDistribution,
    getUserReview,
    clearError,
    clearReviews
  };

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
};