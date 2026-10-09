import React from 'react';

export const Badge = ({ children, status = 'active', className = '' }) => {
  const statusStyles = {
    active: {
      bg: 'rgba(172, 39, 79, 0.18)',
      color: '#FFD9DA',
      border: '1px solid rgba(235, 99, 139, 0.3)',
    },
    pending: {
      bg: 'rgba(235, 99, 139, 0.12)',
      color: '#EB638B',
      border: '1px solid rgba(235, 99, 139, 0.25)',
    },
    resolved: {
      bg: 'rgba(255, 255, 255, 0.08)',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
    closed: {
      bg: 'rgba(56, 46, 49, 0.6)',
      color: '#D6C4C8',
      border: '1px solid rgba(255, 217, 218, 0.08)',
    },
  };

  const style = statusStyles[status] || statusStyles.active;

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: style.bg,
        color: style.color,
        border: style.border,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: style.color,
        }}
      />
      {children}
    </span>
  );
};

export default Badge;
