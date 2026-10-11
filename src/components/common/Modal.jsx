import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  className = '',
  footer,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#142D28]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidth} bg-white border border-[#E4EAE5] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#E4EAE5]/80 bg-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#202A27] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#65736B] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-[#87968D] hover:text-[#202A27] hover:bg-[#F0F4F1] rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#168567]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)] text-[#202A27]">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-[#E4EAE5]/80 bg-[#F6F8F6]/80 flex items-center justify-end gap-2.5">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
