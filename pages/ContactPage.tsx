import React from 'react';
import { CONTACTS } from '../constants';

const ContactPage: React.FC = () => {
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
