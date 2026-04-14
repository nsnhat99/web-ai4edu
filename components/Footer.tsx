import React from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, CONTACTS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-blue-500/10 mt-16">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-extrabold text-sm">
                AI
              </div>
              <div>
                <div className="text-blue-100 font-bold text-sm">AI4EDU 2026</div>
                <div className="text-blue-400/50 text-[10px] tracking-[1.5px] uppercase">Hội thảo Quốc gia</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              "AI và Giáo dục Phổ thông: Hành động vì sự chuyển đổi"
            </p>
            <p className="text-slate-500 text-xs mt-3">Trường Đại học Thủ đô Hà Nội</p>

            {/* Co-organizer / sponsor */}
            <div className="mt-6 space-y-2">
              <p className="text-blue-400/60 text-xs uppercase tracking-wider font-semibold">Đồng tổ chức</p>
              <p className="text-slate-400 text-sm">Tạp chí Giáo dục</p>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-blue-400/60 text-xs uppercase tracking-wider font-semibold">Tài trợ</p>
              <p className="text-slate-400 text-sm">Báo Kinh tế - Đô thị</p>
              <p className="text-slate-400 text-sm">Nhà xuất bản Hà Nội</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-blue-300/80 text-xs font-semibold uppercase tracking-[2px] mb-5">Liên kết nhanh</h4>
            <div className="space-y-2">
              {NAV_LINKS.filter(l => l.path).map((link) => (
                <Link
                  key={link.id}
                  to={link.path || '/'}
                  className="block text-slate-400 hover:text-blue-300 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-blue-300/80 text-xs font-semibold uppercase tracking-[2px] mb-5">Liên hệ</h4>
            <div className="space-y-4">
              {CONTACTS.map((c, i) => (
                <div key={i}>
                  <p className="text-slate-300 text-sm font-medium">{c.name}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{c.role}</p>
                  {c.phone && <p className="text-slate-400 text-xs mt-1"><i className="fas fa-phone text-blue-400/50 mr-2"></i>{c.phone}</p>}
                  <p className="text-blue-400/70 text-xs mt-0.5"><i className="fas fa-envelope text-blue-400/50 mr-2"></i>{c.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 AI4EDU — Trường Đại học Thủ đô Hà Nội. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><i className="fab fa-youtube"></i></a>
            <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
