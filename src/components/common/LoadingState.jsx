import React from 'react';

export const LoadingState = ({
  message = 'Loading data...',
  size = 'md',
  className = '',
  fullscreen = false,
}) => {
  const spinnerSizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 text-center p-8 ${className}`}>
      <div
        className={`${spinnerSizes[size] || spinnerSizes.md} border-[#168567] border-t-transparent rounded-full animate-spin shrink-0`}
      />
      {message && (
        <span className="text-xs sm:text-sm font-semibold text-[#65736B]">
          {message}
        </span>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#F6F8F6]/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};

export const Skeleton = ({
  className = '',
  rounded = 'rounded-xl',
  height = 'h-4',
  width = 'w-full',
}) => {
  return (
    <div
      className={`animate-pulse bg-[#E4EAE5]/60 ${rounded} ${height} ${width} ${className}`}
    />
  );
};

export default LoadingState;
