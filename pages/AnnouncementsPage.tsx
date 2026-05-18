import React, { useState, useEffect } from 'react';
import { useAnnouncements } from '../contexts/AnnouncementContext';

const AnnouncementsPage: React.FC = () => {
  const { announcements } = useAnnouncements();
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!lightboxSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxSrc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxSrc]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Thông báo Hội thảo
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Cập nhật tin tức mới nhất về AI4EDU 2026
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-16">
          <i className="fas fa-bullhorn text-5xl text-blue-400/40 mb-4"></i>
          <p className="text-slate-400 text-base">Chưa có thông báo nào. Vui lòng quay lại sau.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-bullhorn text-blue-300"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h3 className="text-lg font-bold text-blue-50">{item.title}</h3>
                    {item.date && (
                      <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-semibold uppercase tracking-wider">
                        {item.date}
                      </span>
                    )}
                  </div>

                  {item.content && (
                    <p className="text-slate-300 text-[15px] leading-relaxed whitespace-pre-line mt-2">
                      {item.content}
                    </p>
                  )}

                  {item.contentImages && item.contentImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      {item.contentImages.map((src, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setLightboxSrc(src)}
                          className="block w-full focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg"
                        >
                          <img
                            src={src}
                            alt={`${item.title} - ảnh ${idx + 1}`}
                            className="w-full h-32 sm:h-36 object-cover rounded-lg border border-blue-500/10 hover:border-blue-400/30 transition-colors cursor-zoom-in"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {item.externalLink && (
                    <p className="mt-4 text-sm text-slate-300">
                      <span className="text-slate-400">Xem thêm tại: </span>
                      <a
                        href={item.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline break-all"
                      >
                        {item.externalLink}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxSrc(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl"
            aria-label="Đóng"
          >
            ×
          </button>
          <img
            src={lightboxSrc}
            alt="Ảnh phóng to"
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Info notice */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 bg-blue-500/10 border border-blue-400/15 rounded-xl px-6 py-4">
          <i className="fas fa-info-circle text-blue-400"></i>
          <p className="text-slate-300 text-sm">
            Các thông báo sẽ được cập nhật liên tục. Vui lòng theo dõi trang này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
