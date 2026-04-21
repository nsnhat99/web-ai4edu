import React, { useState } from 'react';
import { CONTACTS } from '../constants';
import { submitPublicContact } from '../api';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !message) {
      setError('Vui lòng điền đầy đủ họ tên, email và nội dung.');
      return;
    }
    setIsLoading(true);
    try {
      await submitPublicContact({ name, email, subject, message });
      setSent(true);
      setName(''); setEmail(''); setSubject(''); setMessage('');
      setTimeout(() => setSent(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-[#0a1628]/80 border border-blue-500/15 rounded-xl px-4 py-3 text-blue-50 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-400/40 focus:ring-1 focus:ring-blue-400/20 transition-all";
  const labelClass = "block text-blue-200/80 text-sm font-medium mb-2";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-50 mb-4 tracking-tight">
          Liên hệ
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Thông tin liên lạc Ban tổ chức Hội thảo
        </p>
      </div>

      {/* Contact cards */}
      <div className="space-y-4 mb-12">
        {CONTACTS.map((contact, i) => (
          <div
            key={i}
            className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8 hover:border-blue-400/20 transition-all group"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/20 to-blue-400/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <i className="fas fa-user-tie text-blue-300 text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-50 mb-1">{contact.name}</h3>
                <p className="text-slate-400 text-sm mb-3">{contact.role}</p>
                <div className="flex flex-wrap gap-4">
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-blue-300 text-sm hover:text-blue-200 transition-colors">
                      <i className="fas fa-phone text-xs text-blue-400/50"></i>
                      {contact.phone}
                    </a>
                  )}
                  <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-blue-300 text-sm hover:text-blue-200 transition-colors">
                    <i className="fas fa-envelope text-xs text-blue-400/50"></i>
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Utilities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-hotel text-blue-400"></i>
            <h3 className="text-lg font-bold text-blue-50">Thông tin tiện ích</h3>
          </div>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li className="flex items-center gap-2"><i className="fas fa-check text-blue-400/40 text-xs"></i>Khách sạn gần Trường Đại học Thủ đô Hà Nội</li>
            <li className="flex items-center gap-2"><i className="fas fa-check text-blue-400/40 text-xs"></i>Phương tiện di chuyển</li>
          </ul>
        </div>

        <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <i className="fas fa-plane text-blue-400"></i>
            <h3 className="text-lg font-bold text-blue-50">Du lịch</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">
            Các địa điểm nên đến thăm quan tại Hà Nội — Thông tin sẽ được cập nhật.
          </p>
        </div>
      </div>

      {/* Contact form */}
      <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <i className="fas fa-paper-plane text-blue-400"></i>
          <h3 className="text-lg font-bold text-blue-50">Gửi câu hỏi cho Ban tổ chức</h3>
        </div>

        {sent && (
          <div className="mb-4 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-4 py-3 text-emerald-200 text-sm">
            Đã gửi thành công! Chúng tôi sẽ phản hồi qua email.
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-500/15 border border-red-400/30 rounded-xl px-4 py-3 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Họ và tên *</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Tiêu đề</label>
            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Nội dung *</label>
            <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5} className={inputClass} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <i className="fas fa-paper-plane mr-2"></i>
            {isLoading ? 'Đang gửi...' : 'Gửi'}
          </button>
        </form>
      </div>

      {/* Map placeholder */}
      <div className="bg-[#0c1e3a]/60 backdrop-blur-sm border border-blue-500/10 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <i className="fas fa-map-marked-alt text-blue-400"></i>
          <h3 className="text-lg font-bold text-blue-50">Địa điểm tổ chức</h3>
        </div>
        <p className="text-slate-300 text-sm mb-4">Trường Đại học Thủ đô Hà Nội</p>
        <div className="rounded-xl overflow-hidden border border-blue-500/10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.777!2d105.822!3d21.007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab5c64e4d4b3%3A0x4e3a8c4f5e5f5e5e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBUaOG7pyDEkcO0IEjDoCBO4buZaQ!5e0!3m2!1svi!2svn!4v1"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="opacity-80"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
