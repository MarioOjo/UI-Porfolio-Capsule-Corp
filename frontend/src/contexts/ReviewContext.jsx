import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocalStorage } from '../hooks/usePerformance';
import { apiFetch } from '../utils/api';

const ReviewContext = createContext();

const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'SET_REVIEWS':
      return {
        ...state,
        reviews: action.payload,
        loading: false
      };
    
    case 'ADD_REVIEW':
      return {
        ...state,
        reviews: [action.payload, ...state.reviews],
        totalReviews: state.totalReviews + 1
      };
    
    case 'UPDATE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.map(review =>
          review.id === action.payload.id ? action.payload : review
        )
      };
    
    case 'DELETE_REVIEW':
      return {
        ...state,
        reviews: state.reviews.filter(review => review.id !== action.payload),
        totalReviews: state.totalReviews - 1
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

export const ReviewProvider = ({ children }) => {
  const [reviewCache, setReviewCache] = useLocalStorage('reviewCache', {});
  
  const [state, dispatch] = useReducer(reviewReducer, {
    reviews: [],
    totalReviews: 0,
    loading: false,
    error: null
  });

  const fetchReviews = async (productId) => {
    // Check cache first
    if (reviewCache[productId]) {
      dispatch({ type: 'SET_REVIEWS', payload: reviewCache[productId] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Fetch reviews from backend API
      const response = await apiFetch(`/api/products/${productId}/reviews`);
      const reviews = response.reviews || [];

      // Cache the results
      const updatedCache = { ...reviewCache, [productId]: reviews };
      setReviewCache(updatedCache);
      
      dispatch({ type: 'SET_REVIEWS', payload: reviews });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // If API fails, show empty state instead of error
      dispatch({ type: 'SET_REVIEWS', payload: [] });
    }
  };

  const addReview = async (reviewData) => {
    try {
      // Submit review to backend API
      const response = await apiFetch(`/api/products/${reviewData.productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment
        })
      });

      const newReview = response.review || {
        id: Date.now(),
        ...reviewData,
        date: new Date().toISOString().split('T')[0],
        verified: false,
        helpful: 0
      };

      dispatch({ type: 'ADD_REVIEW', payload: newReview });
      
      // Update cache
      const productReviews = reviewCache[reviewData.productId] || [];
      const updatedCache = {
        ...reviewCache,
        [reviewData.productId]: [newReview, ...productReviews]
      };
      setReviewCache(updatedCache);
      
      return newReview;
    } catch (error) {
      console.error('Error adding review:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const markHelpful = async (reviewId) => {
    try {
      // Send helpful vote to backend API
      await apiFetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST'
      });

      // Update review helpful count locally
      const updatedReviews = state.reviews.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      );
      
      dispatch({ type: 'SET_REVIEWS', payload: updatedReviews });
      
      // Update cache
      Object.keys(reviewCache).forEach(productId => {
        const productReviews = reviewCache[productId].map(review =>
          review.id === reviewId
            ? { ...review, helpful: review.helpful + 1 }
            : review
        );
        reviewCache[productId] = productReviews;
      });
      setReviewCache({ ...reviewCache });
    } catch (error) {
      console.error('Error marking review helpful:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const getAverageRating = (productId) => {
    const productReviews = reviewCache[productId] || [];
    if (productReviews.length === 0) return 0;
    
    const total = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / productReviews.length).toFixed(1);
  };

  const getRatingDistribution = (productId) => {
    const productReviews = reviewCache[productId] || [];
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    productReviews.forEach(review => {
      distribution[review.rating]++;
    });
    
    return distribution;
  };

  const value = {
    ...state,
    fetchReviews,
    addReview,
    markHelpful,
    getAverageRating,
    getRatingDistribution
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