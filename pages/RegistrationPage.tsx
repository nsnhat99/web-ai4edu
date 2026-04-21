import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { uploadToDrive, submitPublicRegistration } from '../api';

type FormType = 'abstract' | 'full' | 'attend';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

const ABSTRACT_TOPICS = [
  'Chuyên đề 1: AI trong giảng dạy - Từ công cụ đến cộng sự sư phạm',
  'Chuyên đề 2: AI trong học tập - Hình thành thế hệ công dân kiến tạo',
  'Chuyên đề 3: AI trong quản trị giáo dục - Chuyển đổi số thực chất',
];

const DELEGATE_OPTIONS = [
  'Khách mời',
  'Đại biểu trình bày báo cáo',
  'Đại biểu có bài đăng kỷ yếu',
];
// Selecting any of the 3 options above takes user to step 2. "Mục khác" submits directly.

const ACTIVITIES = ['Phiên toàn thể', 'Phiên Chuyên đề 1', 'Phiên Chuyên đề 2', 'Phiên Chuyên đề 3', 'Ăn trưa', 'Gala Dinner', 'Thăm quan Hà Nội'];

const NumberedField: React.FC<{ n: number; label: string; required?: boolean; children: React.ReactNode }> = ({ n, label, required, children }) => (
  <div className="bg-[#0a1628]/40 border border-blue-500/10 rounded-xl px-5 py-4">
    <div className="text-blue-100 text-sm font-medium mb-3">
      {n}. {label} {required && <span className="text-red-400">*</span>}
    </div>
    {children}
  </div>
);

const RegistrationPage: React.FC<{ formType?: FormType }> = ({ formType: propType }) => {
  const location = useLocation();
  const defaultType: FormType = propType || (
    location.pathname.includes('abstract') ? 'abstract' :
    location.pathname.includes('full') ? 'full' : 'attend'
  );
  const [activeForm, setActiveForm] = useState<FormType>(defaultType);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [attendStep, setAttendStep] = useState<1 | 2>(1);

  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [delegateType, setDelegateType] = useState('');
  const [delegateTypeOther, setDelegateTypeOther] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const toggleActivity = (a: string) => setActivities(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);
  const [file, setFile] = useState<File | null>(null);

  const forms: { id: FormType; label: string; icon: string }[] = [
    { id: 'abstract', label: 'Nộp tóm tắt', icon: 'fa-file-alt' },
    { id: 'full', label: 'Nộp báo cáo toàn văn', icon: 'fa-file-pdf' },
    { id: 'attend', label: 'Đăng ký tham dự', icon: 'fa-user-check' },
  ];

  const resetMessages = () => { setError(''); setProgress(''); setSubmitted(false); };

  const switchForm = (id: FormType) => {
    setActiveForm(id);
    setAttendStep(1);
    resetMessages();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > MAX_FILE_BYTES) {
      setError('File quá lớn. Vui lòng chọn file nhỏ hơn 100MB.');
      return;
    }
    setError('');
    setFile(f);
  };

  const resetAfterSuccess = () => {
    setName(''); setOrganization(''); setEmail(''); setPhone('');
    setPaperTitle(''); setTopic(''); setDelegateType(''); setDelegateTypeOther('');
    setBankAccount(''); setTaxCode(''); setActivities([]); setFile(null);
    setAttendStep(1);
  };

  const goNextAttend = () => {
    resetMessages();
    if (!name || !organization || !email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (!delegateType) {
      setError('Vui lòng chọn loại đại biểu.');
      return;
    }
    if (delegateType === 'other' && !delegateTypeOther.trim()) {
      setError('Vui lòng nhập nội dung cho "Mục khác".');
      return;
    }
    if (DELEGATE_OPTIONS.includes(delegateType)) {
      setAttendStep(2);
    } else {
      // "Mục khác" → submit ngay
      void doSubmit();
    }
  };

  const doSubmit = async () => {
    resetMessages();
    setIsLoading(true);
    try {
      let fileId: string | undefined;
      let fileName: string | undefined;
      if (file && (activeForm === 'abstract' || activeForm === 'full')) {
        setProgress('Đang tải file lên Google Drive...');
        const up = await uploadToDrive(file, (p) => setProgress(`Đang tải file... ${p}%`));
        fileId = up.fileId;
        fileName = up.fileName;
      }
      setProgress('Đang ghi nhận thông tin...');
      const finalDelegateType = delegateType === 'other'
        ? `Mục khác: ${delegateTypeOther.trim()}`
        : delegateType;
      await submitPublicRegistration({
        tab: activeForm,
        name, organization, email, phone,
        paperTitle: paperTitle || undefined,
        topic: topic || undefined,
        delegateType: finalDelegateType || undefined,
        activities: activities.length ? activities : undefined,
        bankAccount: bankAccount || undefined,
        taxCode: taxCode || undefined,
        fileId, fileName,
      });
      setProgress('');
      setSubmitted(true);
      resetAfterSuccess();
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Registration submit error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (activeForm === 'attend') {
      if (attendStep === 1) {
        goNextAttend();
        return;
      }
      // step 2
      if (!paperTitle) {
        // optional; skip
      }
      if (!topic) {
        setError('Vui lòng chọn chuyên đề.');
        return;
      }
      if (!bankAccount) {
        setError('Vui lòng nhập số tài khoản - ngân hàng.');
        return;
      }
      if (!taxCode) {
        setError('Vui lòng nhập mã số thuế.');
        return;
      }
      if (activities.length === 0) {
        setError('Vui lòng chọn ít nhất một hoạt động.');
        return;
      }
      await doSubmit();
      return;
    }

    // abstract / full
    if (!name || !organization || !email) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    if (!paperTitle || !topic) {
      setError('Vui lòng nhập tên bài báo và chọn chuyên đề.');
      return;
    }
    if (!file) {
      setError('Vui lòng chọn file.');
      return;
    }
    await doSubmit();
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

      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {forms.map((form) => (
          <button
            key={form.id}
            onClick={() => switchForm(form.id)}
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

      {submitted && (
        <div className="mb-6 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-6 py-4 flex items-center gap-3 animate-fadeIn">
          <i className="fas fa-check-circle text-emerald-400 text-lg"></i>
          <p className="text-emerald-200 text-sm font-medium">Đăng ký thành công! Chúng tôi sẽ liên hệ qua email.</p>
        </div>
      )}
      {error && (
        <div className="mb-6 bg-red-500/15 border border-red-400/30 rounded-xl px-6 py-4 text-red-200 text-sm">
          {error}
        </div>
      )}
      {progress && isLoading && (
        <div className="mb-6 bg-blue-500/15 border border-blue-400/30 rounded-xl px-6 py-4 text-blue-200 text-sm">
          {progress}
        </div>
      )}

      <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600/15 to-blue-800/10 px-6 sm:px-8 py-5 border-b border-blue-500/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-blue-50 flex items-center gap-3">
            <i className={`fas ${forms.find(f => f.id === activeForm)?.icon} text-blue-400`}></i>
            {forms.find(f => f.id === activeForm)?.label}
          </h2>
          {activeForm === 'attend' && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-400/30 text-blue-200">
              Phần {attendStep} / 2
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 space-y-5">
          {(activeForm === 'abstract' || activeForm === 'full') && (
            <div className="space-y-4">
              <NumberedField n={1} label="Họ và Tên" required>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Câu trả lời của bạn" className={inputClass} />
              </NumberedField>

              <NumberedField n={2} label="Đơn vị công tác" required>
                <input type="text" required value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Câu trả lời của bạn" className={inputClass} />
              </NumberedField>

              <NumberedField n={3} label="Địa chỉ email" required>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Câu trả lời của bạn" className={inputClass} />
              </NumberedField>

              <NumberedField n={4} label="Số điện thoại">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Câu trả lời của bạn" className={inputClass} />
              </NumberedField>

              <NumberedField n={5} label="Tên bài báo" required>
                <input type="text" required value={paperTitle} onChange={e => setPaperTitle(e.target.value)} placeholder="Câu trả lời của bạn" className={inputClass} />
              </NumberedField>

              <NumberedField n={6} label="Thuộc chuyên đề" required>
                <select required value={topic} onChange={e => setTopic(e.target.value)} className={inputClass}>
                  <option value="">-- Chọn chuyên đề --</option>
                  {ABSTRACT_TOPICS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </NumberedField>

              <NumberedField n={7} label={activeForm === 'full' ? 'Báo cáo toàn văn' : 'File tóm tắt'} required>
                <label className="block border-2 border-dashed border-blue-500/20 rounded-xl p-6 text-center hover:border-blue-400/30 transition-colors cursor-pointer mt-2">
                  <i className="fas fa-cloud-upload-alt text-blue-400/40 text-2xl mb-2"></i>
                  <p className="text-slate-400 text-sm">
                    {file ? file.name : 'Kéo thả file hoặc click để chọn'}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX (tối đa 100MB)'}
                  </p>
                  <input type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                </label>
              </NumberedField>
            </div>
          )}

          {activeForm === 'attend' && attendStep === 1 && (
            <div className="space-y-4">
              <NumberedField n={1} label="Họ và tên" required>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={2} label="Đơn vị công tác" required>
                <input type="text" required value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={3} label="Địa chỉ email" required>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={4} label="Số điện thoại">
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={5} label="Loại đại biểu" required>
                <div className="space-y-2 mt-2">
                  {DELEGATE_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="delegateType"
                        value={opt}
                        checked={delegateType === opt}
                        onChange={() => setDelegateType(opt)}
                        className="w-4 h-4 accent-blue-500"
                      />
                      <span className="text-slate-200 text-sm group-hover:text-blue-200 transition-colors">{opt}</span>
                    </label>
                  ))}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="delegateType"
                      value="other"
                      checked={delegateType === 'other'}
                      onChange={() => setDelegateType('other')}
                      className="w-4 h-4 accent-blue-500"
                    />
                    <span className="text-slate-200 text-sm">Mục khác:</span>
                    <input
                      type="text"
                      value={delegateTypeOther}
                      onChange={e => { setDelegateTypeOther(e.target.value); if (e.target.value) setDelegateType('other'); }}
                      className="flex-1 bg-transparent border-b border-blue-500/30 text-blue-50 text-sm px-1 py-1 focus:outline-none focus:border-blue-400/60"
                    />
                  </label>
                </div>
              </NumberedField>
            </div>
          )}

          {activeForm === 'attend' && attendStep === 2 && (
            <div className="space-y-4">
              <div className="bg-[#0a1628]/40 border border-blue-500/10 rounded-xl px-5 py-4">
                <div className="text-blue-100 text-sm font-semibold italic mb-1">
                  * Đối với báo cáo viên và đại biểu khách mời
                </div>
                <div className="text-slate-500 text-xs">Mô tả (không bắt buộc)</div>
              </div>

              <NumberedField n={1} label="Tên bài báo">
                <input type="text" value={paperTitle} onChange={e => setPaperTitle(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={2} label="Thuộc chuyên đề" required>
                <div className="space-y-2 mt-2">
                  {ABSTRACT_TOPICS.map(t => (
                    <label key={t} className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="topic"
                        required
                        value={t}
                        checked={topic === t}
                        onChange={() => setTopic(t)}
                        className="mt-1 w-4 h-4 accent-blue-500"
                      />
                      <span className="text-slate-200 text-sm group-hover:text-blue-200 transition-colors">{t}</span>
                    </label>
                  ))}
                </div>
              </NumberedField>

              <NumberedField n={3} label="Số tài khoản - Ngân hàng" required>
                <input type="text" required value={bankAccount} onChange={e => setBankAccount(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={4} label="Mã số thuế" required>
                <input type="text" required value={taxCode} onChange={e => setTaxCode(e.target.value)} placeholder="Văn bản câu trả lời ngắn" className={inputClass} />
              </NumberedField>

              <NumberedField n={5} label="ĐĂNG KÝ THAM GIA CÁC HOẠT ĐỘNG CỦA HỘI THẢO" required>
                <div className="space-y-2 mt-2">
                  {ACTIVITIES.map(a => (
                    <label key={a} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={activities.includes(a)}
                        onChange={() => toggleActivity(a)}
                        className="w-4 h-4 rounded accent-blue-500"
                      />
                      <span className="text-slate-200 text-sm group-hover:text-blue-200 transition-colors">{a}</span>
                    </label>
                  ))}
                </div>
              </NumberedField>
            </div>
          )}

          <div className="pt-4 flex items-center justify-between gap-3 flex-wrap">
            {activeForm === 'attend' && attendStep === 2 && (
              <button
                type="button"
                onClick={() => { resetMessages(); setAttendStep(1); }}
                className="px-6 py-3 rounded-xl bg-[#0a1628]/60 border border-blue-500/20 text-blue-200 text-sm font-semibold hover:bg-blue-500/10 transition-all"
              >
                <i className="fas fa-arrow-left mr-2"></i>Quay lại
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="ml-auto px-10 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {activeForm === 'attend' && attendStep === 1 && DELEGATE_OPTIONS.includes(delegateType) ? (
                <><i className="fas fa-arrow-right mr-2"></i>Tiếp theo</>
              ) : (
                <><i className="fas fa-paper-plane mr-2"></i>{isLoading ? 'Đang gửi...' : 'Gửi đăng ký'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
