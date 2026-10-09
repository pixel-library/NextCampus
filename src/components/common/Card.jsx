import React from 'react';

export const Card = ({ children, className = '', interactive = false, style = {} }) => {
  return (
    <div
      className={`${interactive ? 'glass-panel-interactive' : 'glass-panel'} ${className}`}
      style={{
        padding: '20px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
