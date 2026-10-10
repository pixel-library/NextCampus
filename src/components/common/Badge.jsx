import React from 'react';

export const Badge = ({ children, status = 'active', className = '' }) => {
  const statusStyles = {
    active: {
      bg: '#FFE4E6',
      color: '#9E153E',
      border: '1px solid rgba(158, 21, 62, 0.2)',
    },
    pending: {
      bg: '#FEF3C7',
      color: '#B45309',
      border: '1px solid rgba(180, 83, 9, 0.25)',
    },
    resolved: {
      bg: '#DCFCE7',
      color: '#15803D',
      border: '1px solid rgba(21, 128, 61, 0.25)',
    },
    closed: {
      bg: '#F1F5F9',
      color: '#64748B',
      border: '1px solid #E2E8F0',
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
