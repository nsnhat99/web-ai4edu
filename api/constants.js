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
    title: 'Bản sắc văn hóa trong kỷ nguyên số',
    imageUrl: 'https://picsum.photos/seed/ai4edu-culture/800/600',
    link: '/topic/1',
    description: 'Nghiên cứu, bảo tồn và phát huy giá trị văn hóa truyền thống trong bối cảnh chuyển đổi số toàn diện.'
  },
  {
    id: 2,
    title: 'Giáo dục sáng tạo và phát triển bền vững trong kỷ nguyên số',
    imageUrl: 'https://picsum.photos/seed/ai4edu-education/800/600',
    link: '/topic/2',
    description: 'Đổi mới phương pháp giảng dạy, học tập sáng tạo nhằm phát triển bền vững trong môi trường số hóa.'
  },
  {
    id: 3,
    title: 'Trí tuệ nhân tạo trong bảo tồn, phát triển văn hóa và giáo dục',
    imageUrl: 'https://picsum.photos/seed/ai4edu-ai/800/600',
    link: '/topic/3',
    description: 'Ứng dụng AI trong giáo dục phổ thông, quản trị giáo dục và bảo tồn di sản văn hóa.'
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
