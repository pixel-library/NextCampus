import React from 'react';

export const Badge = ({
  children,
  variant = 'brand',
  status,
  size = 'md',
  dot = true,
  className = '',
}) => {
  // Map legacy status prop to variant if provided
  const resolvedVariant = status
    ? status === 'active' || status === 'resolved'
      ? 'success'
      : status === 'pending'
      ? 'warning'
      : status === 'closed'
      ? 'neutral'
      : 'brand'
    : variant;

  const variantStyles = {
    brand: 'bg-rose-50 text-[#9E153E] border-rose-200/80',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    danger: 'bg-red-50 text-red-700 border-red-200/80',
    info: 'bg-sky-50 text-sky-700 border-sky-200/80',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotStyles = {
    brand: 'bg-[#9E153E]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
    neutral: 'bg-slate-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[resolvedVariant] || variantStyles.brand} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[resolvedVariant] || dotStyles.brand}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
