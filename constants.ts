import type { NavLink, ConferenceTopic, ContactInfo, PlenarySession, SpecializedSession } from './types';

export const NAV_LINKS: NavLink[] = [
  { id: 1, name: "Trang chủ", path: "/" },
  { id: 2, name: "Giới thiệu", path: "/introduction" },
  { id: 3, name: "Chủ đề", path: "/topics" },
  { id: 4, name: "Chương trình", path: "/schedule" },
  { id: 5, name: "Thông báo", path: "/announcements" },
  {
    id: 6, name: "Đăng ký", children: [
      { id: 61, name: "Nộp tóm tắt", path: "/submit-abstract" },
      { id: 62, name: "Nộp báo cáo toàn văn", path: "/submit-paper" },
      { id: 63, name: "Đăng ký tham dự", path: "/register" },
      { id: 64, name: "Hướng dẫn tham dự", path: "/participation-guide" },
    ]
  },
  { id: 7, name: "Kết quả duyệt bài", path: "/paper-review" },
  { id: 8, name: "Liên hệ", path: "/contact" },
];

export const CONFERENCE_TOPICS: ConferenceTopic[] = [
  {
    id: 1,
    title: "Bản sắc văn hóa trong kỷ nguyên số",
    icon: "🏛️",
    description: "Nghiên cứu, bảo tồn và phát huy giá trị văn hóa truyền thống trong bối cảnh chuyển đổi số toàn diện.",
    color: "#1e3a8a",
  },
  {
    id: 2,
    title: "Giáo dục sáng tạo và phát triển bền vững trong kỷ nguyên số",
    icon: "🎓",
    description: "Đổi mới phương pháp giảng dạy, học tập sáng tạo nhằm phát triển bền vững trong môi trường số hóa.",
    color: "#1d4ed8",
  },
  {
    id: 3,
    title: "Trí tuệ nhân tạo trong bảo tồn, phát triển văn hóa và giáo dục",
    icon: "🤖",
    description: "Ứng dụng AI trong giáo dục phổ thông, quản trị giáo dục và bảo tồn di sản văn hóa.",
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
      requirement: "Chuyên gia khoa học đầu ngành về Trí tuệ nhân tạo.",
    },
    {
      stt: 2,
      topic: "Giáo dục AI cho học sinh phổ thông: Hình thành thế hệ công dân kiến tạo",
      requirement: "Chuyên gia AI trong giáo dục phổ thông.",
    },
    {
      stt: 3,
      topic: "Hệ sinh thái giải pháp AI cho trường học phổ thông: giảng dạy, học tập và quản trị",
      requirement: "Lãnh đạo/Chuyên gia cấp cao từ doanh nghiệp công nghệ hàng đầu về AI trong giáo dục phổ thông.",
    },
    {
      stt: 4,
      topic: "Xây dựng khung chính sách và quy tắc đạo đức về AI trong hệ thống giáo dục phổ thông Việt Nam",
      requirement: "Chuyên gia về chính sách giáo dục hoặc quản lý nhà nước về giáo dục & đào tạo.",
    },
    {
      stt: 5,
      topic: "Lộ trình hành động vì sự chuyển đổi: Kết nối các bên liên quan trong kỷ nguyên AI",
      requirement: "Nhà nghiên cứu hoặc nhà quản lý giáo dục có tầm nhìn về chuyển đổi số bền vững.",
    },
  ],
};

export const SPECIALIZED_SESSIONS: SpecializedSession[] = [
  {
    id: 1,
    title: "Chuyên đề 1: AI trong giảng dạy – Từ công cụ đến cộng sự sư phạm",
    reports: [
      { stt: 1, topic: "Ứng dụng AI để tự động hóa thiết kế kế hoạch bài dạy và học liệu thông minh", requirement: "Giảng viên/Giáo viên có kinh nghiệm ứng dụng AI trong thiết kế bài giảng." },
      { stt: 2, topic: "Cá nhân hóa bài tập và học liệu số thông qua các hệ thống AI gợi ý", requirement: "Chuyên gia về thiết kế học liệu số hoặc công nghệ giáo dục." },
      { stt: 3, topic: "Đổi mới kiểm tra, đánh giá: Sử dụng AI trong xây dựng ngân hàng câu hỏi và chấm bài tự động", requirement: "Chuyên gia về khảo thí và đo lường giáo dục có ứng dụng AI." },
      { stt: 4, topic: "Phân tích kết quả và phản hồi tức thì cho học sinh bằng các chatbot AI chuyên biệt", requirement: "Nhà nghiên cứu về tương tác người - máy trong giáo dục." },
      { stt: 5, topic: "Phát triển năng lực sư phạm số cho giáo viên trong bối cảnh AI trở thành cộng sự", requirement: "Chuyên gia đào tạo bồi dưỡng giáo viên về kỹ năng số." },
      { stt: 6, topic: "Đạo đức nghề nghiệp và bảo vệ quyền riêng tư dữ liệu người học trong môi trường AI", requirement: "Nhà nghiên cứu về đạo đức học hoặc luật công nghệ thông tin." },
      { stt: 7, topic: "Mô hình cộng tác giữa giáo viên và AI nhằm giảm tải áp lực hành chính", requirement: "Nhà quản lý giáo dục hoặc giáo viên có mô hình thực tiễn thành công." },
    ],
  },
  {
    id: 2,
    title: "Chuyên đề 2: AI trong học tập – Hình thành thế hệ công dân kiến tạo",
    reports: [
      { stt: 1, topic: "Xây dựng mô hình \"Gia sư ảo\" hỗ trợ lộ trình học tập cá nhân hóa cho học sinh phổ thông", requirement: "Chuyên gia phát triển phần mềm giáo dục hoặc trí tuệ nhân tạo ứng dụng." },
      { stt: 2, topic: "Phương pháp hướng dẫn học sinh hiểu nguyên lý và thiết kế ứng dụng AI đơn giản", requirement: "Giáo viên Tin học hoặc chuyên gia giảng dạy STEM/AI." },
      { stt: 3, topic: "AI phục vụ đời sống và học tập: Các dự án kiến tạo của học sinh phổ thông", requirement: "Giáo viên hướng dẫn hoặc học sinh có dự án AI đạt giải/ứng dụng thực tế." },
      { stt: 4, topic: "Giáo dục liêm chính học thuật và tư duy phản biện trong kỷ nguyên AI", requirement: "Chuyên gia giáo dục hoặc nhà nghiên cứu về tâm lý học giáo dục." },
      { stt: 5, topic: "Kỹ năng sử dụng AI an toàn và trách nhiệm đạo đức cho công dân số tương lai", requirement: "Chuyên gia về an toàn thông tin hoặc giáo dục kỹ năng số." },
      { stt: 6, topic: "Tránh lạm dụng công nghệ: Cân bằng giữa hỗ trợ của AI và phát triển tư duy độc lập", requirement: "Nhà nghiên cứu giáo dục hoặc chuyên gia tâm lý trẻ em." },
    ],
  },
  {
    id: 3,
    title: "Chuyên đề 3: AI trong quản trị giáo dục – Chuyển đổi số thực chất",
    reports: [
      { stt: 1, topic: "Ứng dụng Big Data và AI trong phân tích xu hướng học tập toàn trường", requirement: "Chuyên gia phân tích dữ liệu giáo dục." },
      { stt: 2, topic: "Hệ thống hỗ trợ ra quyết định chính xác cho ban giám hiệu dựa trên dự báo kết quả học tập", requirement: "Nhà quản lý giáo dục hoặc chuyên gia hệ thống thông tin quản lý." },
      { stt: 3, topic: "Tối ưu hóa vận hành: AI trong sắp xếp thời khóa biểu và quản lý nhân sự tự động", requirement: "Chuyên gia về tối ưu hóa hoặc phần mềm quản lý trường học." },
      { stt: 4, topic: "Chuyển đổi quy trình hành chính nhà trường thông qua tự động hóa bằng AI", requirement: "Chuyên gia về quản trị trường học và chuyển đổi số." },
      { stt: 5, topic: "Xây dựng khung tiêu chuẩn đạo đức và minh bạch dữ liệu trong quản trị trường phổ thông", requirement: "Nhà hoạch định chính sách hoặc chuyên gia luật về dữ liệu." },
      { stt: 6, topic: "Đảm bảo tính công bằng trong tiếp cận công nghệ AI tại các khu vực khó khăn", requirement: "Nhà nghiên cứu về xã hội học giáo dục hoặc chính sách công." },
      { stt: 7, topic: "Giải pháp quản lý cơ sở vật chất và nguồn lực nhà trường thông minh tích hợp AI", requirement: "Chuyên gia giải pháp hạ tầng trường học thông minh." },
    ],
  },
];

export const SUBMISSION_FORM_URL = "https://forms.gle/placeholder";

