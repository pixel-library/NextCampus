import React from 'react';

export const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  className = '',
  icon: Icon,
  helperText,
  disabled = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-slate-700 select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 text-slate-400 pointer-events-none"
          />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full text-sm text-slate-900 bg-slate-50/70 border rounded-xl outline-none transition-all duration-200 placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed ${
            Icon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5'
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50/20'
              : 'border-slate-200 focus:border-[#9E153E] focus:ring-2 focus:ring-rose-100 focus:bg-white'
          }`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-slate-500">{helperText}</span>
      )}
    </div>
  );
};

export default Input;
