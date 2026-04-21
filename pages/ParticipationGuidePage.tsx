import React from 'react';
import { ABSTRACT_FORM_URL, FULL_PAPER_FORM_URL } from '../constants';
import type { Sponsor } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';


const SectionCard: React.FC<{ title: string; children: React.ReactNode; icon: string }> = ({ title, children, icon }) => (
    <section className="bg-slate-800/40 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-slate-700/50">
        <h2 className="text-xl sm:text-2xl md:text-3xl sm:text-xl sm:text-2xl font-bold text-blue-100 mb-6 flex items-center">
            <i className={`fas ${icon} mr-4 text-blue-500`}></i>
            {title}
        </h2>
        <div className="space-y-4 text-slate-100 text-lg">
            {children}
        </div>
    </section>
);

const ContactCard: React.FC<{
    title: string;
    name: string;
    position?: string;
    phone: string;
    email: string;
}> = ({ title, name, position, phone, email }) => (
    <div className="bg-slate-900/50 p-4 rounded-lg h-full flex flex-col border border-slate-700">
        <h4 className="font-bold text-xl text-slate-100 mb-2">{title}</h4>
        <div className="flex-grow">
            <p className="text-sm text-slate-200 font-semibold">{name}</p>
            {position && <p className="text-xs text-slate-400 mb-3">{position}</p>}
        </div>
        <div className="mt-2 space-y-1 text-sm text-slate-100">
            <p>
                <i className="fas fa-phone-alt w-5 text-center mr-2 text-slate-400"></i>
                <a href={`tel:${phone.replace(/\./g, '')}`} className="hover:underline">{phone}</a>
            </p>
            <p>
                <i className="fas fa-envelope w-5 text-center mr-2 text-slate-400"></i>
                <a href={`mailto:${email}`} className="hover:underline break-all">{email}</a>
            </p>
        </div>
    </div>
);


const ParticipationGuidePage: React.FC = () => {
    const { siteContent } = useSiteContent();

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4 text-slate-100">Hướng dẫn Tham dự & Nộp bài</h1>
                <p className="text-slate-100 text-xl">Tất cả thông tin bạn cần để tham gia và đóng góp cho hội thảo.</p>
            </div>

            <SectionCard title="Quy trình nộp bài" icon="fa-file-alt">
                <p>
                    Quy trình nộp bài gồm hai giai đoạn. Vui lòng thực hiện theo đúng thứ tự để đảm bảo bài tham luận của bạn được xem xét.
                </p>
                <div className="mt-6 space-y-6">
                    {/* Step 1: Abstract Submission */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">Giai đoạn 1: Nộp Tóm tắt</h3>
                        <p className="mb-4 text-slate-100">
                            Vui lòng nộp tóm tắt bài báo của bạn thông qua Google Form. Ban tổ chức sẽ xem xét và gửi thông báo kết quả qua email.
                        </p>
                        <a 
                            href={ABSTRACT_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Đi đến Form Nộp Tóm tắt <i className="fas fa-external-link-alt ml-2"></i>
                        </a>
                    </div>
                    
                    {/* Step 2: Full Paper Submission */}
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-semibold text-slate-100 mb-2">Giai đoạn 2: Nộp Báo cáo Toàn văn</h3>
                        <p className="mb-4 text-slate-100">
                            Sau khi tóm tắt được chấp thuận, tác giả vui lòng nộp báo cáo toàn văn và hoàn tất đăng ký thông tin tại đây.
                        </p>
                        <a
                            href={FULL_PAPER_FORM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Đi đến Form Nộp Toàn văn <i className="fas fa-external-link-alt ml-2"></i>
                        </a>
                    </div>
                </div>
            </SectionCard>


            <SectionCard title="Lệ phí tham dự" icon="fa-money-check-alt">
                <div className="space-y-3">
                    <p><strong className="text-emerald-400 font-bold">Miễn phí</strong> đối với cán bộ, giảng viên Trường Đại học Thủ đô Hà Nội.</p>
                    <p><strong className="text-amber-400 font-bold">1.500.000 VNĐ</strong> đối với các tác giả khác.</p>
                    <p className="text-sm text-slate-400 italic">Cách thức nộp: Chuyển khoản trước khi nộp báo cáo toàn văn.</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-600">
                    <h3 className="font-semibold text-xl text-slate-100 mb-3">Thông tin chuyển khoản</h3>
                    <ul className="space-y-2 text-slate-100 bg-slate-900/50 p-4 rounded-md border border-slate-700">
                        <li><strong>Chủ tài khoản:</strong> TRUONG DAI HOC THU DO HA NOI</li>
                        <li><strong>Số tài khoản:</strong> 115000147515</li>
                        <li><strong>Ngân hàng:</strong> Vietinbank - CN Nam Thăng Long</li>
                        <li><strong>Địa chỉ ngân hàng:</strong> Hà Nội, Việt Nam</li>
                        <li><strong>Loại tiền tệ:</strong> VND / USD</li>
                        <li><strong>Swiftcode:</strong> ICBVVNVX133</li>
                    </ul>
                </div>
            </SectionCard>
            
            <SectionCard title="Liên lạc" icon="fa-headset">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ContactCard
                        title="Tiểu ban 1: Bản sắc văn hóa"
                        name="TS. Lê Thị Thu Hương"
                        position="Viện trưởng Viện Hà Nội học & ĐTQT"
                        phone="0912.229.483"
                        email="ltthuong3@daihocthudo.edu.vn"
                    />
                    <ContactCard
                        title="Tiểu ban 2: Giáo dục sáng tạo"
                        name="TS. Ngô Thị Kim Hoàn"
                        position="Phó Trưởng khoa Sư phạm"
                        phone="0963.810.966"
                        email="ntkhoan@daihocthudo.edu.vn"
                    />
                    <ContactCard
                        title="Tiểu ban 3: Trí tuệ nhân tạo"
                        name="TS. Hoàng Thị Mai"
                        position="Trưởng khoa Toán & Công nghệ thông tin"
                        phone="0983.136.829"
                        email="htmai@daihocthudo.edu.vn"
                    />
                    <ContactCard
                        title="Hỗ trợ hậu cần"
                        name="ThS. Bùi Thu Giang"
                        phone="0933.878.686"
                        email="btgiang@daihocthudo.edu.vn"
                    />
                    <div className="sm:col-span-2">
                        <div className="bg-slate-900/50 p-6 rounded-lg h-full flex flex-col items-center text-center justify-center border border-slate-700">
                            <h4 className="font-bold text-xl text-slate-100 mb-2">Thông tin chung</h4>
                            
                            <p className="text-sm text-slate-200 font-semibold">TS. Đinh Thị Kim Thương</p>
                            <p className="text-xs text-slate-400 mb-3">Trưởng phòng QLKHCN & HTPT</p>
                            
                            <div className="mt-2 space-y-1 text-sm text-slate-100">
                                <p>
                                    <i className="fas fa-phone-alt mr-2 text-slate-400"></i>
                                    <a href="tel:0900066030" className="hover:underline">0900.066.030</a>
                                </p>
                                <p>
                                    <i className="fas fa-envelope mr-2 text-slate-400"></i>
                                    <a href="mailto:dtkthuong@daihocthudo.edu.vn" className="hover:underline break-all">dtkthuong@daihocthudo.edu.vn</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </SectionCard>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                 <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-100 mb-4">Đơn vị đồng tổ chức</h2>
                    <div className="flex justify-center items-center gap-6 flex-wrap bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                        {siteContent.coOrganizers.map((org: Sponsor) => (
                        <div key={org.id} className="p-2">
                            <img src={org.logoUrl} alt={org.name} className="h-14 object-contain" />
                            <p className="mt-2 text-sm font-semibold text-slate-100">{org.name}</p>
                        </div>
                        ))}
                    </div>
                </section>
                <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-100 mb-4">Đơn vị tài trợ</h2>
                     <div className="flex justify-center items-center gap-6 flex-wrap bg-slate-800/40 p-4 rounded-lg border border-slate-700/50">
                        {siteContent.sponsors.map((sponsor: Sponsor) => (
                        <div key={sponsor.id} className="p-2">
                            <img src={sponsor.logoUrl} alt={sponsor.name} className="h-14 object-contain" />
                             <p className="mt-2 text-sm font-semibold text-slate-100">{sponsor.name}</p>
                        </div>
                        ))}
                    </div>
                </section>
            </div>

        </div>
    )
}

export default ParticipationGuidePage;
