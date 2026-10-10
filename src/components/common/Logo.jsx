import React from 'react';

export const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const iconSizes = {
    sm: '28px',
    md: '36px',
    lg: '48px',
  };

  const dim = iconSizes[size] || iconSizes.md;

  return (
    <div className={`flex items-center gap-3 ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={dim} height={dim} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" rx="16" fill="var(--bg-surface-subtle)" />
        <rect width="64" height="64" rx="16" stroke="rgba(158, 21, 62, 0.18)" strokeWidth="2" />
        <path d="M18 46V18L32 34V46L18 30Z" fill="url(#logoGrad1)" />
        <path d="M46 18V46L32 30V18L46 34Z" fill="url(#logoGrad2)" />
        <path d="M18 18L32 34L46 18" stroke="var(--brand-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id="logoGrad1" x1="18" y1="18" x2="32" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E11D48" />
            <stop offset="1" stopColor="#9E153E" />
          </linearGradient>
          <linearGradient id="logoGrad2" x1="32" y1="18" x2="46" y2="46" gradientUnits="userSpaceOnUse">
            <stop stopColor="#9E153E" />
            <stop offset="1" stopColor="#E11D48" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: size === 'lg' ? '22px' : '17px', color: 'var(--text-primary)' }}>
            Next<span style={{ color: 'var(--brand-primary)', fontWeight: 800 }}>Campus</span>
          </div>
          <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--brand-primary)', textTransform: 'uppercase' }}>
            SMART CAMPUS PLATFORM
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
