import React from 'react';

export const Tabs = ({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pill', // 'pill' | 'underline'
  className = '',
  size = 'md',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-[#E4EAE5] overflow-x-auto ${className}`}>
        {tabs.map((tab) => {
          const id = typeof tab === 'object' ? tab.id : tab;
          const label = typeof tab === 'object' ? tab.label : tab;
          const count = typeof tab === 'object' ? tab.count : null;
          const Icon = typeof tab === 'object' ? tab.icon : null;
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange?.(id)}
              className={`pb-3 pt-1 text-xs sm:text-sm font-semibold transition-all relative flex items-center gap-2 whitespace-nowrap outline-none ${
                isActive
                  ? 'text-[#168567]'
                  : 'text-[#65736B] hover:text-[#202A27]'
              }`}
            >
              {Icon && <Icon size={16} />}
              <span>{label}</span>
              {count !== null && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#EAF5EF] text-[#168567]'
                      : 'bg-[#F0F4F1] text-[#65736B]'
                  }`}
                >
                  {count}
                </span>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168567] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill / Segmented Control style
  const sizeClasses = {
    sm: 'p-0.5 text-xs',
    md: 'p-1 text-xs sm:text-sm',
    lg: 'p-1.5 text-sm',
  };

  const itemSizeClasses = {
    sm: 'px-2.5 py-1',
    md: 'px-3.5 py-1.5',
    lg: 'px-4 py-2',
  };

  return (
    <div
      className={`inline-flex items-center rounded-xl bg-[#F0F4F1] border border-[#E4EAE5] ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const count = typeof tab === 'object' ? tab.count : null;
        const Icon = typeof tab === 'object' ? tab.icon : null;
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange?.(id)}
            className={`font-semibold rounded-lg transition-all duration-150 flex items-center gap-2 whitespace-nowrap outline-none ${
              itemSizeClasses[size] || itemSizeClasses.md
            } ${
              isActive
                ? 'bg-white text-[#142D28] shadow-xs border border-[#E4EAE5]/80 font-bold'
                : 'text-[#65736B] hover:text-[#202A27] hover:bg-white/40'
            }`}
          >
            {Icon && <Icon size={14} />}
            <span>{label}</span>
            {count !== null && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-[#EAF5EF] text-[#168567]'
                    : 'bg-[#E4EAE5] text-[#65736B]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
