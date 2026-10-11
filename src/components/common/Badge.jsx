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
    ? status === 'active' || status === 'resolved' || status === 'online'
      ? 'success'
      : status === 'pending' || status === 'in_progress'
      ? 'warning'
      : status === 'closed' || status === 'offline'
      ? 'neutral'
      : status === 'critical' || status === 'high'
      ? 'danger'
      : 'brand'
    : variant;

  const variantStyles = {
    brand: 'bg-[#EAF5EF] text-[#168567] border-[#CBE2D4]',
    forest: 'bg-[#142D28] text-white border-[#142D28]',
    success: 'bg-[#EAF5EF] text-[#168567] border-[#CBE2D4]',
    warning: 'bg-[#FEF8EC] text-[#B7791F] border-[#F6E3B8]',
    danger: 'bg-[#FDF2F3] text-[#C43D4B] border-[#FACBD0]',
    info: 'bg-[#EEF5FA] text-[#3478B8] border-[#C9DFEE]',
    neutral: 'bg-[#F0F4F1] text-[#65736B] border-[#E4EAE5]',
  };

  const dotStyles = {
    brand: 'bg-[#168567]',
    forest: 'bg-[#EAF5EF]',
    success: 'bg-[#168567]',
    warning: 'bg-[#B7791F]',
    danger: 'bg-[#C43D4B]',
    info: 'bg-[#3478B8]',
    neutral: 'bg-[#87968D]',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1 font-semibold',
    sm: 'text-[11px] px-2 py-0.5 gap-1.5 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variantStyles[resolvedVariant] || variantStyles.brand} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[resolvedVariant] || dotStyles.brand}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
