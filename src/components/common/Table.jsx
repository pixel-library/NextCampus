import React from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-2xl border border-[#E4EAE5] bg-white shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return (
    <thead className={`bg-[#F0F4F1] border-b border-[#E4EAE5] ${className}`}>
      {children}
    </thead>
  );
};

export const TableHeader = ({ children, className = '' }) => {
  return (
    <th
      className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[#65736B] select-none ${className}`}
    >
      {children}
    </th>
  );
};

export const TableBody = ({ children, className = '' }) => {
  return <tbody className={`divide-y divide-[#E4EAE5]/80 ${className}`}>{children}</tbody>;
};

export const TableRow = ({
  children,
  onClick,
  className = '',
  hover = true,
}) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors duration-150 ${
        hover ? 'hover:bg-[#F2F7F4]/60' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '' }) => {
  return (
    <td className={`px-4 py-3 text-[#202A27] text-xs sm:text-sm font-medium ${className}`}>
      {children}
    </td>
  );
};

export default Table;
