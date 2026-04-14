import React from 'react';

const AnnouncementsPage: React.FC = () => {
  const announcements = [
    {
      id: 1,
      title: "Thông báo số 1",
      date: "Sắp cập nhật",
      content: "Thông tin chi tiết về Hội thảo Quốc gia AI4EDU 2026 sẽ được cập nhật trong thời gian tới.",
      status: "upcoming",
    },
    {
      id: 2,
      title: "Thông báo số 2",
      date: "Sắp cập nhật",
      content: "Thông tin bổ sung và hướng dẫn tham gia Hội thảo sẽ được công bố sau.",
      status: "upcoming",
    },
  ];

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
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-bold text-blue-50">{item.title}</h3>
                  <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-semibold uppercase tracking-wider">
                    {item.date}
                  </span>
                </div>
                <p className="text-slate-400 text-[15px] leading-relaxed">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

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
