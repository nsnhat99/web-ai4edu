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

// Lịch phiên chuyên đề buổi chiều 19/09/2026, theo file "CHƯƠNG TRÌNH HTAI4EDU 2026".
// Chương trình chính thức gộp chuyên đề 1 và 2 thành "Tiểu ban 1" (Hội trường lớn) và
// gọi chuyên đề 3 là "Tiểu ban 2" (Phòng họp A). Website vẫn tách 3 chuyên đề, nên các
// báo cáo của Tiểu ban 1 được chia về chuyên đề 1/2 theo cột "topic" trong bảng papers.
// Vì thế chuyên đề 1 và 2 dùng chung phòng, chung khung giờ, chung các mốc Thảo luận.
export const SPECIALIZED_SESSIONS: SpecializedSession[] = [
  {
    id: 1,
    title: "Chuyên đề 1: AI trong giảng dạy – Từ công cụ đến cộng sự sư phạm",
    room: "Tiểu ban 1 – Hội trường lớn",
    time: "13:30 – 16:30",
    reports: [
      {
        stt: 1,
        time: "14:30",
        paperCode: "AI4EDU12",
        topic: "Ứng dụng Google GEM trong xây dựng Chatbot giàn giáo hỗ trợ học sinh trung học phổ thông viết văn bản nghị luận",
        presenter: "Dương Thị Mỹ Hằng, Trần Thị Hạnh Phương – Trường ĐHSP Hà Nội 2",
      },
      { stt: 2, time: "15:00", topic: "Thảo luận" },
      {
        stt: 3,
        time: "15:10",
        paperCode: "AI4EDU24",
        topic: "Ứng dụng trí tuệ nhân tạo trong số hóa ký ức lịch sử thông qua mô hình giáo dục trải nghiệm nhằm phát triển năng lực số và giáo dục lòng yêu nước cho học sinh phổ thông",
        presenter: "Đinh Thị Ngọc – Trường Tiểu học Quang Trung",
      },
      {
        stt: 4,
        time: "16:00",
        paperCode: "AI4EDU72",
        topic: "Trí tuệ nhân tạo trong trường trung học cơ sở ở Việt Nam: từ chủ trương chính sách đến khung lựa chọn tác vụ",
        presenter: "TS. Phạm Ngọc Sơn – Trường Đại học Thủ đô Hà Nội",
      },
      { stt: 5, time: "16:10", topic: "Thảo luận" },
      { stt: 6, time: "16:30", topic: "Phiên bế mạc tại Hội trường lớn" },
    ],
  },
  {
    id: 2,
    title: "Chuyên đề 2: AI trong học tập – Hình thành thế hệ công dân kiến tạo",
    room: "Tiểu ban 1 – Hội trường lớn",
    time: "13:30 – 16:30",
    reports: [
      {
        stt: 1,
        time: "13:30",
        paperCode: "AI4EDU94",
        topic: "Giáo dục trí tuệ nhân tạo cho học sinh phổ thông: từ khung nội dung đến thực tiễn triển khai",
        presenter: "TS. Hồ Vĩnh Thắng – Vụ Giáo dục phổ thông, Bộ Giáo dục và Đào tạo; TS. Hoàng Thị Mai – Chủ biên SGK Tin học, Trưởng khoa Toán và CNTT, Trường Đại học Thủ đô Hà Nội",
      },
      {
        stt: 2,
        time: "14:00",
        paperCode: "AI4EDU65",
        topic: "Trí tuệ nhân tạo và phát triển tư duy máy tính trong giáo dục phổ thông: đề xuất khung lý thuyết và lộ trình sư phạm hướng tới thế hệ công dân đồng kiến tạo",
        presenter: "PGS.TS. Nguyễn Chí Thành, NCS.ThS. Vũ Thị Thu Hường, NCS.ThS. Nguyễn Nguyên Hương – Trường Đại học Giáo dục, Đại học Quốc gia Hà Nội",
      },
      { stt: 3, time: "15:00", topic: "Thảo luận" },
      {
        stt: 4,
        time: "15:40",
        paperCode: "AI4EDU05",
        topic: "AI vì công bằng giáo dục phổ thông: khung khái niệm ban đầu về AI hòa nhập cho các nhóm học sinh vùng sâu, vùng xa, dân tộc thiểu số và khuyết tật tại Việt Nam",
        presenter: "TS. Cao Thái Phương Thanh, ThS. Phạm Thi Vương – Trường Đại học Sài Gòn",
      },
      { stt: 5, time: "16:10", topic: "Thảo luận" },
      { stt: 6, time: "16:30", topic: "Phiên bế mạc tại Hội trường lớn" },
    ],
  },
  {
    id: 3,
    title: "Chuyên đề 3: AI trong quản trị giáo dục – Chuyển đổi số thực chất",
    room: "Tiểu ban 2 – Phòng họp A, Tầng 4",
    time: "13:30 – 16:30",
    reports: [
      {
        stt: 1,
        time: "13:30",
        paperCode: "AI4EDU91",
        topic: "Từ đạo đức AI đến quản trị AI trong trường phổ thông: đề xuất khung quản trị AI có trách nhiệm và hàm ý chính sách cho Việt Nam",
        presenter: "TS. Nguyễn Thị Quý – Vụ Giáo dục phổ thông, Bộ GD&ĐT; CN. Nguyễn Khánh Linh – Trường Đại học Hà Nội",
      },
      {
        stt: 2,
        time: "14:00",
        paperCode: "AI4EDU16",
        topic: "Từ dữ liệu đến quyết định: mô hình AI Copilot hỗ trợ quản trị chất lượng và cải tiến liên tục trong giáo dục",
        presenter: "TS. Nguyễn Văn Hùng – Trường CNTT Phenikaa, Đại học Phenikaa; TS. Nguyễn Thị Thanh Hương – Trường Đại học Giao thông Vận tải",
      },
      { stt: 3, time: "14:30", topic: "Thảo luận" },
      {
        stt: 4,
        time: "15:00",
        paperCode: "AI4EDU93",
        topic: "Xây dựng và thử nghiệm bước đầu mô hình đánh giá, phát triển năng lực số cho học sinh THPT có sự hỗ trợ của Trí tuệ nhân tạo",
        presenter: "TS. Phạm Thị Khánh Ly, ThS. Lê Vân Anh, Lại Thị Mỹ Hạnh, ThS. Nguyễn Huy Hoàng, ThS. Lương Vũ Nam, Đào Phương Thanh, ThS. Nguyễn Thị Thu Hiền – Trường THPT FPT Tây Hà Nội",
      },
      {
        stt: 5,
        time: "15:30",
        paperCode: "AI4EDU82",
        topic: "Bảo đảm an toàn dữ liệu cá nhân của học sinh trong ứng dụng Trí tuệ nhân tạo tại các cơ sở giáo dục phổ thông ở Việt Nam: thực trạng và kiến nghị hoàn thiện cơ chế pháp lý",
        presenter: "TS. Nguyễn Phương Anh – Khoa Luật, Học viện Cảnh sát nhân dân",
      },
      {
        stt: 6,
        time: "16:00",
        paperCode: "AI4EDU95",
        topic: "Sức khỏe tinh thần và hạnh phúc nghề nghiệp của giảng viên trong bối cảnh AI: nghiên cứu tổng quan trắc lượng thư mục",
        presenter: "TS. Vũ Thúy Hoàn – Trường Đại học Thủ đô Hà Nội",
      },
      { stt: 7, time: "16:20", topic: "Thảo luận" },
      { stt: 8, time: "16:30", topic: "Phiên bế mạc tại Hội trường lớn" },
    ],
  },
];

export const ABSTRACT_FORM_URL = "https://forms.gle/i5JrctyzCG4srPzY8";
export const FULL_PAPER_FORM_URL = "https://forms.gle/UkrYGG8uNuuYAiwe7";
export const ATTEND_FORM_URL = "https://forms.gle/3m8wYg13vDXJiC928";
export const SUBMISSION_FORM_URL = ABSTRACT_FORM_URL;
export const CONFERENCE_DOCS_URL = "https://drive.google.com/drive/folders/1bfQYHWv3dPTyznoGrolHplSO-C8xbOft?usp=drive_link";

