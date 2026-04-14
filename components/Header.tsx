import React, { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, Link } from 'react-router-dom';
import type { NavLink } from '../types';
import { NAV_LINKS } from '../constants';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const closeAll = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const renderNavLink = (link: NavLink, isMobile: boolean = false) => {
    if (link.children && link.children.length > 0) {
      const isOpen = openDropdown === link.id;
      return (
        <div key={link.id} className="relative">
          <button
            onClick={() => setOpenDropdown(isOpen ? null : link.id)}
            className="flex items-center gap-1 py-2 px-3 text-blue-100/80 rounded-lg hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
          >
            {link.name}
            <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
          </button>
          {isOpen && (
            <div className={`${isMobile ? 'relative mt-1 ml-4' : 'absolute top-full left-0 mt-2'} min-w-[220px] bg-[#0a1628]/95 backdrop-blur-xl border border-blue-500/20 rounded-xl shadow-2xl shadow-blue-900/30 overflow-hidden z-50`}>
              {link.children.map((child) => (
                <RouterNavLink
                  key={child.id}
                  to={child.path || '#'}
                  onClick={closeAll}
                  className={({ isActive }) =>
                    `block px-5 py-3 text-sm transition-all duration-200 border-b border-blue-500/5 last:border-0 ${
                      isActive
                        ? 'text-blue-300 bg-blue-500/15 font-medium'
                        : 'text-blue-100/70 hover:text-white hover:bg-blue-500/10'
                    }`
                  }
                >
                  {child.name}
                </RouterNavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <RouterNavLink
        key={link.id}
        to={link.path || '/'}
        onClick={closeAll}
        className={({ isActive }) =>
          `py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'text-white bg-blue-500/20 border border-blue-400/30'
              : 'text-blue-100/70 hover:text-white hover:bg-white/5 border border-transparent'
          }`
        }
      >
        {link.name}
      </RouterNavLink>
    );
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071437]/97 backdrop-blur-xl shadow-lg shadow-blue-900/20 border-b border-blue-500/10'
          : 'bg-[#071437]/70 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" onClick={closeAll}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-shadow">
              AI
            </div>
            <div className="hidden sm:block">
              <div className="text-blue-50 font-bold text-[15px] tracking-wide leading-tight">AI4EDU 2026</div>
              <div className="text-blue-400/70 text-[10px] tracking-[2px] uppercase">Hội thảo Quốc gia</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => renderNavLink(link))}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-blue-300 hover:text-white rounded-lg hover:bg-white/10 transition-all"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden pb-5 pt-2 border-t border-blue-500/10 animate-fadeIn">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => renderNavLink(link, true))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
