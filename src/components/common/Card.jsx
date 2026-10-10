import React from 'react';

export const Card = ({
  children,
  className = '',
  interactive = false,
  padding = 'p-6',
  hover = false,
  style = {},
  onClick,
  ...props
}) => {
  const baseClasses = "bg-white border border-slate-200/90 rounded-2xl shadow-sm transition-all duration-200";
  const interactiveClasses = (interactive || hover) 
    ? "hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer" 
    : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${padding} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
