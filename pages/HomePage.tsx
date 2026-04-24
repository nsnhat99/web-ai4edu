import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONFERENCE_TOPICS } from '../constants';
import { useSiteContent } from '../contexts/SiteContentContext';

const HomePage: React.FC = () => {
  const [hoveredTopic, setHoveredTopic] = useState<number | null>(null);
  const { siteContent } = useSiteContent();
  const speakers = siteContent.keynoteSpeakers || [];
  const eventBanner = siteContent.eventBannerImage;

  return (
    <div className="flex flex-col">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-[72px] pt-[72px]">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#071437]/90 via-[#0a1e3d]/85 to-[#071437]/95" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(37,99,235,0.12) 0%, transparent 70%), radial-gradient(ellipse at 70% 20%, rgba(96,165,250,0.08) 0%, transparent 60%)',
        }} />

        {/* Animated particles (CSS-only) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-400/20 animate-float"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <div className="inline-block px-5 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-xs sm:text-sm font-semibold tracking-[3px] uppercase mb-8 backdrop-blur-sm">
            Tháng 9 năm 2026 · Hà Nội
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold text-blue-50 leading-[1.1] mb-5 tracking-tight">
            HỘI THẢO QUỐC GIA
          </h1>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-light text-blue-200/90 leading-relaxed mb-3 italic">
            "AI và Giáo dục Phổ thông:
            <br className="hidden sm:block" />
            Hành động vì sự chuyển đổi"
          </h2>
          <p className="text-blue-400 text-sm sm:text-base font-bold tracking-[4px] uppercase mb-10">
            (AI4EDU 2026)
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/schedule"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <i className="fas fa-calendar-alt mr-2"></i>
              Xem chương trình
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-200 font-bold text-sm sm:text-base hover:bg-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Đăng ký tham dự
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-blue-400/30 rounded-full flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-blue-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* ==================== INFO CARDS ==================== */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: 'fa-calendar-alt', label: 'Thời gian', value: 'Tháng 9 năm 2026', sub: '(dự kiến)', iconBg: 'from-blue-600 to-blue-400' },
            { icon: 'fa-map-marker-alt', label: 'Địa điểm', value: 'Trường ĐH Thủ đô Hà Nội', sub: null, iconBg: 'from-blue-700 to-blue-500' },
            { icon: 'fa-users', label: 'Quy mô', value: 'Chuyên gia hàng đầu', sub: 'AI & Giáo dục', iconBg: 'from-blue-800 to-blue-600' },
          ].map((item, i) => (
            <div
              key={i}
              className="group bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-8 text-center hover:border-blue-400/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${item.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <i className={`fas ${item.icon} text-white text-xl`}></i>
              </div>
              <div className="text-blue-400/60 text-[11px] font-semibold tracking-[2px] uppercase mb-2">{item.label}</div>
              <div className="text-blue-50 text-lg font-bold">{item.value}</div>
              {item.sub && <div className="text-slate-500 text-sm mt-1">{item.sub}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ==================== 3 TOPIC BLOCKS ==================== */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">Chủ đề Hội thảo</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
              Bấm vào từng chủ đề để xem chương trình chi tiết các phiên báo cáo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONFERENCE_TOPICS.map((topic) => (
              <Link
                key={topic.id}
                to={`/schedule?session=${topic.id}`}
                onMouseEnter={() => setHoveredTopic(topic.id)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  hoveredTopic === topic.id
                    ? 'border-blue-400/40 -translate-y-2 shadow-2xl shadow-blue-600/20'
                    : 'border-blue-500/10 shadow-lg shadow-black/20'
                }`}
                style={{
                  background: hoveredTopic === topic.id
                    ? `linear-gradient(160deg, ${topic.color}40, ${topic.color}15)`
                    : 'linear-gradient(160deg, rgba(12,30,58,0.8), rgba(7,20,55,0.9))',
                }}
              >
                <div className="p-8 sm:p-10 relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 text-center">{topic.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-50 leading-snug mb-3">
                    {topic.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-2 text-blue-400 text-sm font-semibold">
                    <span>Xem chương trình</span>
                    <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
                  </div>
                </div>

                {/* Corner glow */}
                <div
                  className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${topic.color}, transparent 70%)` }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== EVENT BANNER ==================== */}
      {eventBanner && (
        <section className="px-4 sm:px-6 pt-8">
          <div className="max-w-6xl mx-auto">
            <img
              src={eventBanner}
              alt="Banner sự kiện"
              className="w-full h-auto rounded-2xl border border-blue-500/10 shadow-lg shadow-black/30 object-cover"
            />
          </div>
        </section>
      )}

      {/* ==================== BÁO CÁO VIÊN ==================== */}
      {speakers.length > 0 && (
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
                Báo cáo viên
              </h2>
              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
                Các chuyên gia, diễn giả hàng đầu tham gia hội thảo
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {speakers.map((sp) => (
                <div
                  key={sp.id}
                  className="group bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 text-center hover:border-blue-400/30 hover:-translate-y-1 transition-all duration-300"
                >
                  <img
                    src={sp.imageUrl}
                    alt={sp.name}
                    className="w-32 h-32 mx-auto mb-5 rounded-full object-cover border-2 border-blue-400/30 group-hover:border-blue-400/60 transition"
                  />
                  <h3 className="text-lg font-bold text-blue-50 mb-1">{sp.name}</h3>
                  <div className="text-blue-300/80 text-sm mb-3">{sp.affiliation}</div>
                  {sp.keynoteTopic && (
                    <div className="text-blue-400/90 text-xs font-semibold uppercase tracking-wider mb-3">
                      {sp.keynoteTopic}
                    </div>
                  )}
                  {sp.bio && (
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{sp.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== CTA ==================== */}
      <section className="py-24 px-4 sm:px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-blue-50 mb-5 tracking-tight">
            Đừng bỏ lỡ sự kiện quan trọng này!
          </h2>
          <p className="text-slate-400 text-base leading-relaxed mb-10">
            Hãy đăng ký tham dự ngay hôm nay để cùng chúng tôi khám phá những ý tưởng mới, gặp gỡ các chuyên gia và mở rộng mạng lưới chuyên môn.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-10 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              Đăng ký ngay
            </Link>
            <Link
              to="/schedule"
              className="px-10 py-4 rounded-xl border border-blue-400/30 bg-blue-500/10 text-blue-200 font-bold hover:bg-blue-500/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              Xem chương trình
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
