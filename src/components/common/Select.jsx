import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  className = '',
  helperText,
  disabled = false,
  size = 'md',
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs py-1.5 pl-3 pr-8',
    md: 'text-xs sm:text-sm py-2 pl-3.5 pr-9',
    lg: 'text-sm sm:text-base py-2.5 pl-4 pr-10',
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
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full appearance-none rounded-xl bg-white border outline-none transition-all duration-150 text-[#202A27] disabled:bg-[#F6F8F6] disabled:text-[#87968D] disabled:cursor-not-allowed cursor-pointer ${
            sizeClasses[size] || sizeClasses.md
          } ${
            error
              ? 'border-[#C43D4B] focus:border-[#C43D4B] focus:ring-3 focus:ring-[#C43D4B]/15 bg-[#FDF2F3]/30'
              : 'border-[#E4EAE5] focus:border-[#168567] focus:ring-3 focus:ring-[#168567]/15'
          }`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-[#87968D]">
              {placeholder}
            </option>
          )}
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={idx} value={val} className="text-[#202A27]">
                {lbl}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3 pointer-events-none text-[#87968D]">
          <ChevronDown size={16} />
        </div>
      </div>
      {error && <span className="text-xs text-[#C43D4B] font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#65736B]">{helperText}</span>
      )}
    </div>
  );
};

export default Select;
