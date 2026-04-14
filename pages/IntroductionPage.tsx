import React from 'react';
import { Link } from 'react-router-dom';

const IntroductionPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Giới thiệu Hội thảo
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          AI4EDU 2026 — Hành động vì sự chuyển đổi giáo dục
        </p>
      </div>

      <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl overflow-hidden">
        <div className="px-6 sm:px-10 py-8 sm:py-10 space-y-6">
          <p className="text-slate-300 text-base sm:text-lg leading-[1.9]">
            Hội thảo Quốc gia <strong className="text-blue-200">"AI và Giáo dục Phổ thông: Hành động vì sự chuyển đổi" (AI4EDU 2026)</strong> được tổ chức bởi Trường Đại học Thủ đô Hà Nội, nhằm tạo diễn đàn khoa học để các nhà nghiên cứu, nhà giáo dục, nhà quản lý và doanh nghiệp cùng thảo luận về vai trò của trí tuệ nhân tạo trong đổi mới giáo dục phổ thông.
          </p>
          <p className="text-slate-300 text-base sm:text-lg leading-[1.9]">
            Hội thảo tập trung vào 3 trục nội dung chính: <em className="text-blue-300">AI trong giảng dạy</em>, <em className="text-blue-300">AI trong học tập</em>, và <em className="text-blue-300">AI trong quản trị giáo dục</em>. Đây là cơ hội để kết nối các bên liên quan, chia sẻ kinh nghiệm thực tiễn và đề xuất chính sách cho tương lai giáo dục Việt Nam.
          </p>
        </div>

        {/* Organizer info cards */}
        <div className="border-t border-blue-500/10 px-6 sm:px-10 py-8 space-y-8">
          {[
            { label: 'Đơn vị tổ chức', items: ['Trường Đại học Thủ đô Hà Nội'], icon: 'fa-university' },
            { label: 'Đơn vị đồng tổ chức', items: ['Tạp chí Giáo dục'], icon: 'fa-handshake' },
            { label: 'Đơn vị tài trợ', items: ['Báo Kinh tế - Đô thị', 'Nhà xuất bản Hà Nội'], icon: 'fa-award' },
          ].map((section, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 mb-3">
                <i className={`fas ${section.icon} text-blue-400/50`}></i>
                <h3 className="text-blue-400/70 text-xs font-bold uppercase tracking-[2px]">{section.label}</h3>
              </div>
              {section.items.map((item, j) => (
                <p key={j} className="text-slate-300 text-[15px] ml-7 mb-1">
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="flex justify-center gap-4 mt-10 flex-wrap">
        <Link to="/topics" className="px-6 py-3 rounded-xl bg-blue-500/15 border border-blue-400/20 text-blue-200 text-sm font-semibold hover:bg-blue-500/25 transition-all">
          <i className="fas fa-tags mr-2"></i>Xem chủ đề
        </Link>
        <Link to="/schedule" className="px-6 py-3 rounded-xl bg-blue-500/15 border border-blue-400/20 text-blue-200 text-sm font-semibold hover:bg-blue-500/25 transition-all">
          <i className="fas fa-calendar mr-2"></i>Chương trình
        </Link>
        <Link to="/register" className="px-6 py-3 rounded-xl bg-blue-600/30 border border-blue-400/30 text-blue-100 text-sm font-semibold hover:bg-blue-600/40 transition-all">
          <i className="fas fa-user-plus mr-2"></i>Đăng ký
        </Link>
      </div>
    </div>
  );
};

export default IntroductionPage;
