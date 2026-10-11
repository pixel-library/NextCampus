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
  iconRight: IconRight,
  helperText,
  disabled = false,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 px-3',
    md: 'text-xs sm:text-sm py-2 px-3.5',
    lg: 'text-sm sm:text-base py-2.5 px-4',
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#202A27] select-none flex items-center justify-between">
          <span>
            {label} {required && <span className="text-[#C43D4B] ml-0.5">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3.5 text-[#87968D] pointer-events-none"
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
          className={`w-full rounded-xl bg-white border outline-none transition-all duration-150 text-[#202A27] placeholder:text-[#A3B0A8] disabled:bg-[#F6F8F6] disabled:text-[#87968D] disabled:cursor-not-allowed ${
            sizeClasses[size] || sizeClasses.md
          } ${Icon ? 'pl-10' : ''} ${IconRight ? 'pr-10' : ''} ${
            error
              ? 'border-[#C43D4B] focus:border-[#C43D4B] focus:ring-3 focus:ring-[#C43D4B]/15 bg-[#FDF2F3]/30'
              : 'border-[#E4EAE5] focus:border-[#168567] focus:ring-3 focus:ring-[#168567]/15'
          }`}
          {...props}
        />
        {IconRight && (
          <div className="absolute right-3.5 text-[#87968D]">
            <IconRight size={16} />
          </div>
        )}
      </div>
      {error && <span className="text-xs text-[#C43D4B] font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#65736B]">{helperText}</span>
      )}
    </div>
  );
};

export default Input;
