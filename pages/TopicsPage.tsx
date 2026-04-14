import React from 'react';
import { Link } from 'react-router-dom';
import { CONFERENCE_TOPICS } from '../constants';

const TopicsPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="text-center mb-14">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Chủ đề Hội thảo
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          3 trục nội dung chính của Hội thảo AI4EDU 2026
        </p>
      </div>

      <div className="space-y-6">
        {CONFERENCE_TOPICS.map((topic) => (
          <div
            key={topic.id}
            className="group bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400/25 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Icon */}
              <div className="text-5xl sm:text-6xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                {topic.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-50 mb-3 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-slate-400 text-[15px] leading-relaxed mb-5">
                  {topic.description}
                </p>
                <Link
                  to={`/schedule?session=${topic.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-blue-400/25 bg-blue-500/10 text-blue-300 text-sm font-semibold hover:bg-blue-500/20 transition-all"
                >
                  Xem chương trình chi tiết
                  <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </Link>
              </div>
            </div>

            {/* Decorative accent */}
            <div
              className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-25 transition-opacity"
              style={{ background: `radial-gradient(circle, ${topic.color}, transparent 70%)` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicsPage;
