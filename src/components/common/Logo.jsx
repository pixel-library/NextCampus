import React from 'react';

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: 30,
    md: 36,
    lg: 48,
  };

  const dim = iconSizes[size] || iconSizes.md;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="shrink-0 relative flex items-center justify-center rounded-xl bg-[#142D28] shadow-sm overflow-hidden"
        style={{ width: `${dim}px`, height: `${dim}px` }}
      >
        <svg
          width={Math.round(dim * 0.72)}
          height={Math.round(dim * 0.72)}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Geometric N emblem connecting campus nodes */}
          <path
            d="M8 32V8L20 24V32L8 16Z"
            fill="url(#logoGrad1)"
          />
          <path
            d="M32 8V32L20 16V8L32 24Z"
            fill="url(#logoGrad2)"
          />
          <circle cx="8" cy="8" r="2.5" fill="#EAF5EF" />
          <circle cx="32" cy="32" r="2.5" fill="#168567" />
          <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
          <defs>
            <linearGradient id="logoGrad1" x1="8" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#168567" />
              <stop offset="1" stopColor="#0F6B52" />
            </linearGradient>
            <linearGradient id="logoGrad2" x1="32" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EAF5EF" />
              <stop offset="1" stopColor="#168567" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="font-heading font-extrabold text-[#142D28] tracking-tight flex items-center text-[16px]">
            <span>Next</span>
            <span className="text-[#168567]">Campus</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.1em] text-[#65736B] uppercase mt-0.5">
            Smart Campus OS
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
