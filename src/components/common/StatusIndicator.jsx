import React from 'react';

export const StatusIndicator = ({
  status = 'online', // 'online' | 'warning' | 'critical' | 'offline' | 'busy'
  label,
  pulse = true,
  size = 'md',
  className = '',
}) => {
  const statusColors = {
    online: {
      dot: 'bg-[#168567]',
      ring: 'bg-[#168567]',
      text: 'text-[#142D28]',
      label: 'Operational',
    },
    warning: {
      dot: 'bg-[#B7791F]',
      ring: 'bg-[#B7791F]',
      text: 'text-[#B7791F]',
      label: 'Attention Needed',
    },
    critical: {
      dot: 'bg-[#C43D4B]',
      ring: 'bg-[#C43D4B]',
      text: 'text-[#C43D4B]',
      label: 'Critical Alert',
    },
    offline: {
      dot: 'bg-[#87968D]',
      ring: 'bg-[#87968D]',
      text: 'text-[#65736B]',
      label: 'Offline',
    },
    busy: {
      dot: 'bg-[#3478B8]',
      ring: 'bg-[#3478B8]',
      text: 'text-[#3478B8]',
      label: 'In Use',
    },
  };

  const current = statusColors[status] || statusColors.online;

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="relative flex shrink-0">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.ring}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full ${currentSize} ${current.dot}`}
        />
      </span>
      {label !== false && (
        <span className={`text-xs font-semibold ${current.text}`}>
          {typeof label === 'string' ? label : current.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;
