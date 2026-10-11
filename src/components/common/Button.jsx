import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  title,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-[#168567]/25 focus-visible:ring-offset-1';

  const sizeClasses = {
    xs: 'text-[11px] px-2.5 py-1 gap-1 rounded-lg',
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-sm sm:text-base px-5 py-2.5 gap-2.5 rounded-xl',
    icon: 'p-2 rounded-xl aspect-square',
    'icon-sm': 'p-1.5 rounded-lg aspect-square',
  };

  const variantClasses = {
    primary:
      'bg-[#168567] hover:bg-[#0F6B52] active:bg-[#142D28] text-white shadow-xs hover:shadow border border-[#168567]',
    secondary:
      'bg-white hover:bg-[#F6F8F6] text-[#202A27] border border-[#E4EAE5] shadow-xs hover:border-[#D0DAD2]',
    ghost:
      'bg-transparent hover:bg-[#EAF5EF]/70 text-[#65736B] hover:text-[#142D28] border border-transparent',
    soft:
      'bg-[#EAF5EF] hover:bg-[#DCEEE3] text-[#168567] border border-[#CBE2D4] font-semibold',
    brandSoft:
      'bg-[#EAF5EF] hover:bg-[#DCEEE3] text-[#168567] border border-[#CBE2D4] font-semibold',
    outline:
      'bg-transparent hover:bg-[#EAF5EF]/50 text-[#168567] border border-[#168567]',
    danger:
      'bg-[#C43D4B] hover:bg-[#AF323F] text-white shadow-xs border border-[#C43D4B]',
    forest:
      'bg-[#142D28] hover:bg-[#1E3E37] text-white shadow-xs border border-[#142D28]',
  };

  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    icon: 16,
    'icon-sm': 14,
  };

  const currentIconSize = iconSizes[size] || 16;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && <Icon size={currentIconSize} className="shrink-0" />
      )}
      {children && <span>{children}</span>}
      {IconRight && !loading && <IconRight size={currentIconSize} className="shrink-0" />}
    </button>
  );
};

export default Button;
