import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { PLENARY_SESSION, SPECIALIZED_SESSIONS } from '../constants';
import type { ReportItem } from '../types';

const TABS = [
  { id: 0, label: 'Phiên toàn thể', icon: 'fa-microphone-alt', color: 'blue' },
  { id: 1, label: 'Chuyên đề 1', icon: 'fa-chalkboard-teacher', color: 'emerald' },
  { id: 2, label: 'Chuyên đề 2', icon: 'fa-brain', color: 'violet' },
  { id: 3, label: 'Chuyên đề 3', icon: 'fa-cogs', color: 'amber' },
];

const ReportTable: React.FC<{ reports: ReportItem[] }> = ({ reports }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-blue-500/15">
            <th className="px-4 py-3 text-left text-blue-400/70 text-[11px] font-bold uppercase tracking-[2px] w-16">STT</th>
            <th className="px-4 py-3 text-left text-blue-400/70 text-[11px] font-bold uppercase tracking-[2px]">Chủ đề báo cáo</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, idx) => (
            <tr
              key={r.stt}
              className="group border-b border-blue-500/5 hover:bg-blue-500/5 transition-colors cursor-default"
            >
              <td className="px-4 py-5 align-top">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-300 font-bold text-sm">
                  {r.stt}
                </div>
              </td>
              <td className="px-4 py-5 align-top">
                <p className="text-blue-50 text-[15px] font-medium leading-relaxed">
                  {r.topic}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const SchedulePage: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSession = parseInt(params.get('session') || '0');
  const [activeTab, setActiveTab] = useState(initialSession > 0 && initialSession <= 3 ? initialSession : 0);

  // Update tab when URL changes
  useEffect(() => {
    const newParams = new URLSearchParams(location.search);
    const session = parseInt(newParams.get('session') || '0');
    if (session >= 0 && session <= 3) {
      setActiveTab(session);
    }
  }, [location.search]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Chương trình Hội thảo
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Chi tiết các phiên thảo luận và chuyên đề
        </p>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2 sm:gap-3 mb-10 flex-wrap justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-blue-500/20 border border-blue-400/40 text-blue-200 shadow-lg shadow-blue-600/10'
                : 'bg-[#0c1e3a]/40 border border-blue-500/10 text-slate-400 hover:text-blue-300 hover:bg-blue-500/10'
            }`}
          >
            <i className={`fas ${tab.icon} text-xs`}></i>
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.id === 0 ? 'Toàn thể' : `CĐ${tab.id}`}</span>
          </button>
        ))}
      </div>

      {/* PLENARY SESSION */}
      {activeTab === 0 && (
        <div className="animate-fadeIn">
          <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl overflow-hidden">
            {/* Session header */}
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/10 px-6 sm:px-8 py-6 border-b border-blue-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <i className="fas fa-microphone-alt text-blue-300"></i>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-blue-50">{PLENARY_SESSION.title}</h2>
              </div>

              {/* Theme badge */}
              <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl px-5 py-4">
                <div className="text-blue-400/60 text-[11px] font-semibold uppercase tracking-[2px] mb-1">Chủ đề phiên</div>
                <p className="text-blue-200 text-lg font-semibold italic">{PLENARY_SESSION.theme}</p>
              </div>
            </div>

            {/* Reports */}
            <div className="px-4 sm:px-6 py-4">
              <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] mb-4 px-2">
                <i className="fas fa-list-ol mr-2 text-blue-400/40"></i>
                Danh sách báo cáo phiên toàn thể
              </h3>
              <ReportTable reports={PLENARY_SESSION.reports} />
            </div>
          </div>
        </div>
      )}

      {/* SPECIALIZED SESSIONS */}
      {[1, 2, 3].map((sessionId) =>
        activeTab === sessionId ? (
          <div key={sessionId} className="animate-fadeIn">
            <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl overflow-hidden">
              {/* Session header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-blue-800/10 px-6 sm:px-8 py-6 border-b border-blue-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <i className={`fas ${TABS[sessionId].icon} text-blue-300`}></i>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-bold text-blue-50 leading-snug">
                    {SPECIALIZED_SESSIONS[sessionId - 1].title}
                  </h2>
                </div>
              </div>

              {/* Reports */}
              <div className="px-4 sm:px-6 py-4">
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-[2px] mb-4 px-2">
                  <i className="fas fa-list-ol mr-2 text-blue-400/40"></i>
                  Danh sách báo cáo phiên chuyên đề {sessionId}
                </h3>
                <ReportTable reports={SPECIALIZED_SESSIONS[sessionId - 1].reports} />
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-12">
        <Link
          to="/"
          className="px-6 py-3 rounded-xl border border-blue-500/15 bg-[#0c1e3a]/40 text-blue-300 text-sm font-semibold hover:bg-blue-500/10 transition-all"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Trang chủ
        </Link>
        <Link
          to="/topics"
          className="px-6 py-3 rounded-xl border border-blue-500/15 bg-[#0c1e3a]/40 text-blue-300 text-sm font-semibold hover:bg-blue-500/10 transition-all"
        >
          Xem chủ đề
          <i className="fas fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
};

export default SchedulePage;
