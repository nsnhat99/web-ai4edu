const NAV_LINKS = [
  { id: 1, name: "Trang chủ", path: "/" },
  { id: 2, name: "Giới thiệu", path: "/introduction" },
  { id: 3, name: "Chủ đề", path: "/topics" },
  { id: 4, name: "Chương trình", path: "/schedule" },
  { id: 5, name: "Thông báo", path: "/announcements" },
  { id: 6, name: "Đăng ký & Nộp bài", path: "/register" },
  { id: 7, name: "Liên hệ", path: "/contact" },
];

const ANNOUNCEMENTS_DATA = [
  { id: 1, title: "Thông báo số 1", date: "01/06/2026", content: "Thông tin chi tiết về Hội thảo Quốc gia AI4EDU 2026 sẽ được cập nhật trong thời gian tới. Vui lòng theo dõi trang web để cập nhật.", imageUrl: "https://picsum.photos/seed/ai4edu-ann1/800/400" },
  { id: 2, title: "Thông báo số 2", date: "15/06/2026", content: "Thông tin bổ sung và hướng dẫn tham gia Hội thảo AI4EDU 2026 sẽ được công bố sau. Kêu gọi nộp bài tham luận.", imageUrl: "https://picsum.photos/seed/ai4edu-ann2/800/400" },
];

const CO_ORGANIZERS_DATA = [
  { id: 1, name: "Tạp chí Giáo dục", logoUrl: "https://picsum.photos/seed/tapchigiaoduc/150/60" },
];

const SPONSORS_DATA = [
  { id: 1, name: "Báo Kinh tế - Đô thị", logoUrl: "https://picsum.photos/seed/kinhtedothi/150/60" },
  { id: 2, name: "Nhà xuất bản Hà Nội", logoUrl: "https://picsum.photos/seed/nxbhanoi/150/60" },
];

const KEYNOTE_SPEAKERS_DATA = [
  { id: 1, name: "Diễn giả sẽ được cập nhật", affiliation: "Sẽ cập nhật", imageUrl: "https://picsum.photos/seed/ai4edu-spk1/200/200", bio: "Thông tin chi tiết sẽ được cập nhật.", keynoteTopic: "Sẽ cập nhật" },
];

const CONFERENCE_TOPICS_DATA = [
  {
    id: 1,
    title: 'AI trong giảng dạy: Từ công cụ đến cộng sự sư phạm',
    imageUrl: 'https://picsum.photos/seed/ai4edu-teaching/800/600',
    link: '/topic/1',
    description: 'Ứng dụng AI để thiết kế bài giảng thông minh và đổi mới kiểm tra, đánh giá.'
  },
  {
    id: 2,
    title: 'AI trong học tập: Hình thành thế hệ kiến tạo',
    imageUrl: 'https://picsum.photos/seed/ai4edu-learning/800/600',
    link: '/topic/2',
    description: 'Cá nhân hóa lộ trình học tập và hướng dẫn học sinh tự thiết kế ứng dụng AI.'
  },
  {
    id: 3,
    title: 'AI trong quản trị: Chuyển đổi số thực chất',
    imageUrl: 'https://picsum.photos/seed/ai4edu-governance/800/600',
    link: '/topic/3',
    description: 'Quản trị dựa trên dữ liệu (Big Data) và tối ưu hóa vận hành nhà trường.'
  },
];

const DETAILED_PAPER_SUBMISSIONS_DATA = [];

module.exports = {
  NAV_LINKS,
  ANNOUNCEMENTS_DATA,
  CO_ORGANIZERS_DATA,
  SPONSORS_DATA,
  KEYNOTE_SPEAKERS_DATA,
  CONFERENCE_TOPICS_DATA,
  DETAILED_PAPER_SUBMISSIONS_DATA
};
