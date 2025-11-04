import React from 'react';
import PropTypes from 'prop-types';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'orange', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    orange: 'border-orange-500',
    blue: 'border-blue-500',
    white: 'border-white',
    gray: 'border-gray-500'
  };

  const spinnerClass = `
    ${sizeClasses[size]} 
    ${colorClasses[color]} 
    border-4 border-t-transparent 
    rounded-full animate-spin
  `;

  const container = fullScreen 
    ? "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    : "flex items-center justify-center py-8";

  return (
    <div className={container} role={fullScreen ? 'dialog' : undefined} aria-modal={fullScreen ? 'true' : undefined} tabIndex={fullScreen ? -1 : undefined}>
      <div className="flex flex-col items-center gap-4">
        <div className={spinnerClass}></div>
        {text && (
          <p className="text-gray-600 font-saiyan text-sm animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xl']),
  color: PropTypes.oneOf(['orange', 'blue', 'white', 'gray']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default LoadingSpinner;