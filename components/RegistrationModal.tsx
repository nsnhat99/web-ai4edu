import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import type { NavLink } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ICON_MAP: Record<number, string> = {
  61: 'fa-file-lines',
  62: 'fa-file-pdf',
  63: 'fa-ticket',
  64: 'fa-book-open',
};

const getOptions = (): NavLink[] => {
  const reg = NAV_LINKS.find((l) => l.id === 6);
  return reg?.children ?? [];
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const options = getOptions();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md mx-4 bg-[#0a1628]/95 backdrop-blur-xl border border-blue-500/20 rounded-2xl shadow-2xl shadow-blue-900/30 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/15">
          <h3 className="text-blue-50 font-bold text-base sm:text-lg tracking-wide">
            Chọn loại đăng ký
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-blue-200/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-3 sm:p-4 flex flex-col gap-2">
          {options.map((opt) => {
            const icon = ICON_MAP[opt.id] ?? 'fa-circle-arrow-right';
            const content = (
              <>
                <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500/15 text-blue-300 group-hover:bg-blue-500/25 group-hover:text-blue-100 transition-colors">
                  <i className={`fas ${icon}`}></i>
                </span>
                <span className="flex-1 text-blue-50/90 group-hover:text-white text-sm sm:text-[15px] font-medium">
                  {opt.name}
                </span>
                <i
                  className={`fas ${
                    opt.external ? 'fa-up-right-from-square' : 'fa-arrow-right'
                  } text-blue-300/60 group-hover:text-blue-200 group-hover:translate-x-0.5 transition-all text-xs`}
                ></i>
              </>
            );

            const baseClass =
              'group flex items-center gap-3 px-4 py-3 rounded-xl border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/15 hover:border-blue-400/30 transition-all duration-200';

            return opt.external ? (
              <a
                key={opt.id}
                href={opt.path || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={baseClass}
              >
                {content}
              </a>
            ) : (
              <Link
                key={opt.id}
                to={opt.path || '#'}
                onClick={onClose}
                className={baseClass}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;
