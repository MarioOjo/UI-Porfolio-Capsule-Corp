import React from 'react';
import PropTypes from 'prop-types';

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
    <div className="h-64 bg-gray-200"></div>
    <div className="p-6">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-10 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  </div>
);

const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {Array.from({ length: count }, (_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  </div>
);

const CartItemSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border-b animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-16"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

const SkeletonLoader = ({ type = 'product', count = 8 }) => {
  const skeletonComponents = {
    product: () => <ProductCardSkeleton />,
    productGrid: () => <ProductGridSkeleton count={count} />,
    profile: () => <ProfileSkeleton />,
    cartItem: () => <CartItemSkeleton />
  };

  const SkeletonComponent = skeletonComponents[type];
  
  if (!SkeletonComponent) {
    console.warn(`Unknown skeleton type: ${type}`);
    return <ProductCardSkeleton />;
  }

  return <SkeletonComponent />;
};

SkeletonLoader.propTypes = {
  type: PropTypes.oneOf(['product', 'productGrid', 'profile', 'cartItem']),
  count: PropTypes.number
};

export default SkeletonLoader;