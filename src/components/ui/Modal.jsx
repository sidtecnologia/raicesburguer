import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        ref={modalRef}
        className="w-full sm:max-w-lg max-h-[92dvh] flex flex-col animate-pop-in"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'clamp(0px, calc((100vw - 640px) * 9999), 24px) clamp(0px, calc((100vw - 640px) * 9999), 24px) 0 0',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="flex-shrink-0 flex justify-between items-center px-5 py-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <h3 className="display text-2xl" style={{ color: 'var(--text)' }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full transition-all hover:bg-white/10"
            style={{ background: 'var(--surface2)', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 min-h-0">
          {children}
        </div>

        {footer && (
          <div
            className="flex-shrink-0 px-5 py-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;