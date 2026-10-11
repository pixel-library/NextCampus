import React from 'react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon,
  title = 'No records found',
  description = 'There are no active records or entries matching your criteria.',
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-white border border-[#E4EAE5] ${className}`}
    >
      {Icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#EAF5EF] text-[#168567] border border-[#CBE2D4] flex items-center justify-center mb-4 shadow-xs">
          <Icon size={24} />
        </div>
      )}
      <h3 className="text-base sm:text-lg font-bold text-[#202A27] tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs sm:text-sm text-[#65736B] max-w-md mt-1.5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <div className="mt-5">
          <Button
            variant="primary"
            size="sm"
            icon={actionIcon}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
