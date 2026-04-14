import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

type FormType = 'abstract' | 'full' | 'attend';

const RegistrationPage: React.FC<{ formType?: FormType }> = ({ formType: propType }) => {
  const location = useLocation();
  const defaultType: FormType = propType || (
    location.pathname.includes('abstract') ? 'abstract' :
    location.pathname.includes('full') ? 'full' : 'attend'
  );
  const [activeForm, setActiveForm] = useState<FormType>(defaultType);
  const [submitted, setSubmitted] = useState(false);

  const forms: { id: FormType; label: string; icon: string }[] = [
    { id: 'abstract', label: 'Nộp tóm tắt', icon: 'fa-file-alt' },
    { id: 'full', label: 'Nộp báo cáo toàn văn', icon: 'fa-file-pdf' },
    { id: 'attend', label: 'Đăng ký tham dự', icon: 'fa-user-check' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const inputClass = "w-full bg-[#0a1628]/80 border border-blue-500/15 rounded-xl px-4 py-3 text-blue-50 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20 transition-all";
  const labelClass = "block text-blue-200/80 text-sm font-medium mb-2";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Đăng ký
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Nộp bài và đăng ký tham dự Hội thảo AI4EDU 2026
        </p>
      </div>

      {/* Form type tabs */}
      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {forms.map((form) => (
          <button
            key={form.id}
            onClick={() => { setActiveForm(form.id); setSubmitted(false); }}
            className={`flex items-center gap-2 px-4 sm:px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeForm === form.id
                ? 'bg-blue-500/20 border border-blue-400/40 text-blue-200'
                : 'bg-[#0c1e3a]/40 border border-blue-500/10 text-slate-400 hover:text-blue-300'
            }`}
          >
            <i className={`fas ${form.icon} text-xs`}></i>
            {form.label}
          </button>
        ))}
      </div>

      {/* Success message */}
      {submitted && (
        <div className="mb-6 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-6 py-4 flex items-center gap-3 animate-fadeIn">
          <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
          <p className="text-emerald-200 text-sm font-medium">Đăng ký thành công! Chúng tôi sẽ liên hệ qua email.</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/15 to-blue-800/10 px-6 sm:px-8 py-5 border-b border-blue-500/10">
          <h2 className="text-lg font-bold text-blue-50 flex items-center gap-3">
            <i className={`fas ${forms.find(f => f.id === activeForm)?.icon} text-blue-400`}></i>
            {forms.find(f => f.id === activeForm)?.label}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
          {/* Common fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Họ và tên *</label>
              <input type="text" required placeholder="Nhập họ và tên" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Đơn vị công tác *</label>
              <input type="text" required placeholder="Tên đơn vị" className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Địa chỉ email *</label>
              <input type="email" required placeholder="email@example.com" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Số điện thoại *</label>
              <input type="tel" required placeholder="0xxx.xxx.xxx" className={inputClass} />
            </div>
          </div>

          {/* Abstract & Full paper fields */}
          {(activeForm === 'abstract' || activeForm === 'full') && (
            <>
              <div>
                <label className={labelClass}>Tên bài báo *</label>
                <input type="text" required placeholder="Nhập tên bài báo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Thuộc chủ đề *</label>
                <select required className={inputClass}>
                  <option value="">-- Chọn chủ đề --</option>
                  <option value="1">1. Bản sắc văn hóa trong kỷ nguyên số</option>
                  <option value="2">2. Giáo dục sáng tạo và phát triển bền vững trong kỷ nguyên số</option>
                  <option value="3">3. Trí tuệ nhân tạo trong bảo tồn, phát triển văn hóa và giáo dục</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  {activeForm === 'abstract' ? 'File tóm tắt *' : 'File báo cáo toàn văn *'}
                </label>
                <div className="border-2 border-dashed border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-400/30 transition-colors cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-blue-400/40 text-2xl mb-2"></i>
                  <p className="text-slate-400 text-sm">Kéo thả file hoặc click để chọn</p>
                  <p className="text-slate-500 text-xs mt-1">PDF, DOCX (tối đa 10MB)</p>
                  <input type="file" className="hidden" accept=".pdf,.docx,.doc" />
                </div>
              </div>
            </>
          )}

          {/* Attend-specific fields */}
          {activeForm === 'attend' && (
            <>
              <div>
                <label className={labelClass}>Loại đại biểu *</label>
                <select required className={inputClass}>
                  <option value="">-- Chọn loại --</option>
                  <option value="guest">Khách mời</option>
                  <option value="presenter">Đại biểu trình bày báo cáo</option>
                  <option value="proceeding">Đại biểu có bài đăng kỷ yếu</option>
                  <option value="other">Đại biểu khác</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Đăng ký tham gia các hoạt động</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {['Phiên toàn thể', 'Phiên Chuyên đề 1', 'Phiên Chuyên đề 2', 'Phiên Chuyên đề 3', 'Ăn trưa', 'Gala Dinner', 'Thăm quan Hà Nội'].map((activity) => (
                    <label key={activity} className="flex items-center gap-3 bg-[#0a1628]/50 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-500/5 transition-colors">
                      <input type="checkbox" className="w-4 h-4 rounded border-blue-500/30 bg-transparent text-blue-500 focus:ring-blue-400/30" />
                      <span className="text-slate-300 text-sm">{activity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Gửi đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
