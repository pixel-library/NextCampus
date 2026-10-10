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
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#9E153E] to-[#BE123C] hover:from-[#881337] hover:to-[#9E153E] text-white shadow-sm hover:shadow hover:shadow-rose-900/10 border border-transparent',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm hover:border-slate-300',
    ghost:
      'bg-transparent hover:bg-slate-100/80 text-slate-600 hover:text-slate-900 border border-transparent',
    brandSoft:
      'bg-rose-50 hover:bg-rose-100 text-[#9E153E] border border-rose-200/80',
    danger:
      'bg-red-600 hover:bg-red-700 text-white shadow-sm border border-transparent',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        Icon && <Icon size={iconSizes[size] || 16} className="shrink-0" />
      )}
      {children && <span>{children}</span>}
      {IconRight && !loading && <IconRight size={iconSizes[size] || 16} className="shrink-0" />}
    </button>
  );
};

export default Button;
