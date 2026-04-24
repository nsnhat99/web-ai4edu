import type { NavLink, ConferenceTopic, ContactInfo, PlenarySession, SpecializedSession } from './types';

export const NAV_LINKS: NavLink[] = [
  { id: 1, name: "Trang chủ", path: "/" },
  { id: 2, name: "Giới thiệu", path: "/introduction" },
  { id: 3, name: "Chủ đề", path: "/topics" },
  { id: 4, name: "Chương trình", path: "/schedule" },
  { id: 5, name: "Thông báo", path: "/announcements" },
  {
    id: 6, name: "Đăng ký", children: [
      { id: 61, name: "Nộp tóm tắt", path: "https://forms.gle/i5JrctyzCG4srPzY8", external: true },
      { id: 62, name: "Nộp báo cáo toàn văn", path: "https://forms.gle/UkrYGG8uNuuYAiwe7", external: true },
      { id: 63, name: "Đăng ký tham dự", path: "https://forms.gle/3m8wYg13vDXJiC928", external: true },
      { id: 64, name: "Hướng dẫn tham dự", path: "/participation-guide" },
    ]
  },
  { id: 7, name: "Kết quả duyệt bài", path: "/paper-review" },
  { id: 8, name: "Liên hệ", path: "/contact" },
];

export const CONFERENCE_TOPICS: ConferenceTopic[] = [
  {
    id: 1,
    title: "AI trong giảng dạy: Từ công cụ đến cộng sự",
    icon: "👨‍🏫",
    description: "Ứng dụng AI để thiết kế bài giảng thông minh và đổi mới kiểm tra, đánh giá.",
    color: "#1e3a8a",
  },
  {
    id: 2,
    title: "AI trong học tập: Hình thành thế hệ kiến tạo",
    icon: "🎓",
    description: "Cá nhân hóa lộ trình học tập và hướng dẫn học sinh tự thiết kế ứng dụng AI.",
    color: "#1d4ed8",
  },
  {
    id: 3,
    title: "AI trong quản trị: Chuyển đổi số thực chất",
    icon: "🏫",
    description: "Quản trị dựa trên dữ liệu (Big Data) và tối ưu hóa vận hành nhà trường.",
    color: "#2563eb",
  },
];

export const CONTACTS: ContactInfo[] = [
  {
    name: "TS. Đinh Thị Kim Thương",
    role: "Trưởng phòng Quản lý khoa học công nghệ và Hợp tác phát triển",
    phone: "0988.766.307",
    email: "dtkthuong@daihocthudo.edu.vn",
  },
  {
    name: "TS. Hoàng Thị Mai",
    role: "Trưởng khoa Toán – Công nghệ thông tin",
    email: "htmai@daihocthudo.edu.vn",
  },
  {
    name: "TS. Tô Hồng Đức",
    role: "Phòng Quản lý Khoa học công nghệ & Hợp tác phát triển",
    email: "thduc@daihocthudo.edu.vn",
  },
];

export const PLENARY_SESSION: PlenarySession = {
  title: "PHẦN 1: PHIÊN TOÀN THỂ (BUỔI SÁNG)",
  theme: "AI và Giáo dục Phổ thông: Hành động vì sự chuyển đổi",
  reports: [
    {
      stt: 1,
      topic: "Xu hướng phát triển của Trí tuệ nhân tạo (AI) thế hệ mới và tác động đối với tương lai giáo dục",
    },
    {
      stt: 2,
      topic: "Giáo dục AI cho học sinh phổ thông: Hình thành thế hệ công dân kiến tạo",
    },
    {
      stt: 3,
      topic: "Hệ sinh thái giải pháp AI cho trường học phổ thông: giảng dạy, học tập và quản trị",
    },
    {
      stt: 4,
      topic: "Xây dựng khung chính sách và quy tắc đạo đức về AI trong hệ thống giáo dục phổ thông Việt Nam",
    },
    {
      stt: 5,
      topic: "Lộ trình hành động vì sự chuyển đổi: Kết nối các bên liên quan trong kỷ nguyên AI",
    },
  ],
};

export const SPECIALIZED_SESSIONS: SpecializedSession[] = [
  {
    id: 1,
    title: "Chuyên đề 1: AI trong giảng dạy – Từ công cụ đến cộng sự sư phạm",
    reports: [
      { stt: 1, topic: "Ứng dụng AI để tự động hóa thiết kế kế hoạch bài dạy và học liệu thông minh" },
      { stt: 2, topic: "Cá nhân hóa bài tập và học liệu số thông qua các hệ thống AI gợi ý" },
      { stt: 3, topic: "Đổi mới kiểm tra, đánh giá: Sử dụng AI trong xây dựng ngân hàng câu hỏi và chấm bài tự động" },
      { stt: 4, topic: "Phân tích kết quả và phản hồi tức thì cho học sinh bằng các chatbot AI chuyên biệt" },
      { stt: 5, topic: "Phát triển năng lực sư phạm số cho giáo viên trong bối cảnh AI trở thành cộng sự" },
      { stt: 6, topic: "Đạo đức nghề nghiệp và bảo vệ quyền riêng tư dữ liệu người học trong môi trường AI" },
      { stt: 7, topic: "Mô hình cộng tác giữa giáo viên và AI nhằm giảm tải áp lực hành chính" },
    ],
  },
  {
    id: 2,
    title: "Chuyên đề 2: AI trong học tập – Hình thành thế hệ công dân kiến tạo",
    reports: [
      { stt: 1, topic: "Xây dựng mô hình \"Gia sư ảo\" hỗ trợ lộ trình học tập cá nhân hóa cho học sinh phổ thông" },
      { stt: 2, topic: "Phương pháp hướng dẫn học sinh hiểu nguyên lý và thiết kế ứng dụng AI đơn giản" },
      { stt: 3, topic: "AI phục vụ đời sống và học tập: Các dự án kiến tạo của học sinh phổ thông" },
      { stt: 4, topic: "Giáo dục liêm chính học thuật và tư duy phản biện trong kỷ nguyên AI" },
      { stt: 5, topic: "Kỹ năng sử dụng AI an toàn và trách nhiệm đạo đức cho công dân số tương lai" },
      { stt: 6, topic: "Tránh lạm dụng công nghệ: Cân bằng giữa hỗ trợ của AI và phát triển tư duy độc lập" },
    ],
  },
  {
    id: 3,
    title: "Chuyên đề 3: AI trong quản trị giáo dục – Chuyển đổi số thực chất",
    reports: [
      { stt: 1, topic: "Ứng dụng Big Data và AI trong phân tích xu hướng học tập toàn trường" },
      { stt: 2, topic: "Hệ thống hỗ trợ ra quyết định chính xác cho ban giám hiệu dựa trên dự báo kết quả học tập" },
      { stt: 3, topic: "Tối ưu hóa vận hành: AI trong sắp xếp thời khóa biểu và quản lý nhân sự tự động" },
      { stt: 4, topic: "Chuyển đổi quy trình hành chính nhà trường thông qua tự động hóa bằng AI" },
      { stt: 5, topic: "Xây dựng khung tiêu chuẩn đạo đức và minh bạch dữ liệu trong quản trị trường phổ thông" },
      { stt: 6, topic: "Đảm bảo tính công bằng trong tiếp cận công nghệ AI tại các khu vực khó khăn" },
      { stt: 7, topic: "Giải pháp quản lý cơ sở vật chất và nguồn lực nhà trường thông minh tích hợp AI" },
    ],
  },
];

export const ABSTRACT_FORM_URL = "https://forms.gle/i5JrctyzCG4srPzY8";
export const FULL_PAPER_FORM_URL = "https://forms.gle/UkrYGG8uNuuYAiwe7";
export const ATTEND_FORM_URL = "https://forms.gle/3m8wYg13vDXJiC928";
export const SUBMISSION_FORM_URL = ABSTRACT_FORM_URL;

