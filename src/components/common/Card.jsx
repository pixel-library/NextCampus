import React from 'react';

export const Card = ({
  children,
  className = '',
  interactive = false,
  padding = 'p-6',
  hover = false,
  style = {},
  onClick,
  title,
  subtitle,
  action,
  ...props
}) => {
  const baseClasses =
    'bg-white border border-[#E4EAE5] rounded-2xl shadow-[0_1px_3px_rgba(20,45,40,0.04)] transition-all duration-200';
  const interactiveClasses = (interactive || hover)
    ? 'hover:border-[#D0DAD2] hover:shadow-[0_4px_16px_rgba(20,45,40,0.08)] hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      style={style}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#E4EAE5]/80">
          <div>
            {title && (
              <h3 className="text-base font-bold text-[#202A27] tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-[#65736B] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={title ? 'p-6' : padding}>{children}</div>
    </div>
  );
};

export default Card;
