import React, { useState } from 'react';
import type { ReviewStatus, DetailedPaperSubmission } from '../types';
import { CONFERENCE_TOPICS } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import { usePapers } from '../contexts/PaperContext';

const reviewStatusStyles: { [key in ReviewStatus]: string } = {
  'Duyệt': 'bg-green-900/60 text-green-300 border border-green-700',
  'Không duyệt': 'bg-red-900/60 text-red-300 border border-red-700',
  'Đang chờ duyệt': 'bg-blue-900/60 text-blue-300 border border-blue-700',
};

const reviewStatusText: { [key in ReviewStatus]: string } = {
  'Duyệt': 'Duyệt',
  'Không duyệt': 'Không duyệt',
  'Đang chờ duyệt': 'Đang chờ',
};

// Cột "Trạng thái" dùng chung field "reviewStatus" với AdminPage (ở đó gắn nhãn
// "Duyệt đăng kỷ yếu"), chỉ đổi nhãn hiển thị cho đúng ngữ cảnh trang công khai.
// "Đang chờ duyệt" giữ nhãn trung gian, không gộp vào "Không đăng kỷ yếu" vì đó là
// giá trị mặc định của bài mới nộp — nói "không đăng" là sai với bài chưa xét.
const proceedingsStatusText: { [key in ReviewStatus]: string } = {
  'Duyệt': 'Đăng kỷ yếu',
  'Không duyệt': 'Không đăng kỷ yếu',
  'Đang chờ duyệt': 'Đang chờ',
};

const topicStyles: { [key: number]: string } = {
  1: 'bg-amber-900/70 text-amber-300 border border-amber-700',
  2: 'bg-emerald-900/70 text-emerald-300 border border-emerald-700',
  3: 'bg-indigo-900/70 text-blue-300 border border-indigo-700',
};

const unassignedTopicStyle = 'bg-cyan-900/70 text-cyan-300 border border-cyan-700';

// Hai cột trạng thái đọc từ cột TEXT nullable (api/seed.js không đặt NOT NULL/DEFAULT),
// nên types.ts khai là ReviewStatus vẫn có thể nhận null từ API. Không chuẩn hoá thì badge
// rỗng với khách, còn <select value={undefined}> sẽ tự nhảy về option đầu ("Duyệt") với admin.
// Quy về "Đang chờ duyệt" như AdminPage.tsx:67 đang làm — chỉ đổi hiển thị, không ghi DB.
const toReviewStatus = (value?: ReviewStatus | null): ReviewStatus =>
  value && value in reviewStatusText ? value : 'Đang chờ duyệt';

// Sắp xếp theo mã số bài viết dạng "AI4EDU<number>" tăng dần.
// Lấy nhóm chữ số CUỐI cùng để bỏ qua số "4" trong tiền tố "AI4EDU"; bài chưa có mã xếp cuối.
const paperCodeOrder = (code?: string): number => {
  const nums = code?.match(/\d+/g);
  return nums ? parseInt(nums[nums.length - 1], 10) : Number.POSITIVE_INFINITY;
};

const isKnownTopic = (topic: number): boolean => CONFERENCE_TOPICS.some((t) => t.id === topic);

type TopicSection = {
  key: string;
  heading: string;
  badgeClass: string;
  papers: DetailedPaperSubmission[];
};

// Chia bảng thành các section theo chuyên đề. Cột "topic" trong DB cho phép null nên
// gom riêng những bài chưa có chuyên đề hợp lệ vào section cuối, chỉ hiện khi có bài.
const buildTopicSections = (papers: DetailedPaperSubmission[]): TopicSection[] => {
  const sortByCode = (list: DetailedPaperSubmission[]) =>
    [...list].sort((a, b) => paperCodeOrder(a.paperCode) - paperCodeOrder(b.paperCode));

  const sections: TopicSection[] = CONFERENCE_TOPICS.map((topic) => ({
    key: `topic-${topic.id}`,
    heading: `Chuyên đề ${topic.id}: ${topic.title}`,
    badgeClass: topicStyles[topic.id] || unassignedTopicStyle,
    papers: sortByCode(papers.filter((p) => p.topic === topic.id)),
  }));

  const unassigned = sortByCode(papers.filter((p) => !isKnownTopic(p.topic)));
  if (unassigned.length > 0) {
    sections.push({
      key: 'topic-unassigned',
      heading: 'Chưa phân chuyên đề',
      badgeClass: unassignedTopicStyle,
      papers: unassigned,
    });
  }

  return sections;
};

// Edit Paper Modal Component
const EditPaperModal: React.FC<{
  paper: DetailedPaperSubmission;
  onSave: (paperId: number, data: Partial<DetailedPaperSubmission>) => void;
  onClose: () => void;
}> = ({ paper, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    paperCode: paper.paperCode || '',
    authorName: paper.authorName,
    organization: paper.organization,
    paperTitle: paper.paperTitle,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(paper.id, formData);
  };

  const inputStyles = "mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-blue-500";

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onMouseDown={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 border border-slate-700" onMouseDown={e => e.stopPropagation()}>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">Chỉnh sửa bài báo</h2>

        {/* Paper Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="paperCode" className="block text-sm font-medium text-slate-100">Mã số bài viết</label>
            <input type="text" id="paperCode" name="paperCode" value={formData.paperCode} onChange={handleChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-slate-100">Tên tác giả</label>
            <input type="text" id="authorName" name="authorName" value={formData.authorName} onChange={handleChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-slate-100">Đơn vị công tác</label>
            <input type="text" id="organization" name="organization" value={formData.organization} onChange={handleChange} className={inputStyles} />
          </div>
          <div>
            <label htmlFor="paperTitle" className="block text-sm font-medium text-slate-100">Tên bài báo</label>
            <input type="text" id="paperTitle" name="paperTitle" value={formData.paperTitle} onChange={handleChange} className={inputStyles} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-600">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-slate-200 bg-slate-600 hover:bg-slate-500 transition-colors">
            Đóng
          </button>
          <button type="button" onClick={handleSave} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

const PaperReviewPage: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    papers,
    updatePaperDetails,
    updateFullTextStatus,
    updateReviewStatus,
    deletePaper,
  } = usePapers();
  const [editingPaper, setEditingPaper] = useState<DetailedPaperSubmission | null>(null);

  // Ghi thất bại (hay gặp nhất: phiên admin hết hạn sau 8 tiếng -> 401) không được im lặng,
  // vì select sẽ tự bật về giá trị cũ và người dùng tưởng thao tác đã lưu.
  const runUpdate = (action: Promise<void>) => {
    action.catch((error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Cập nhật bài báo thất bại', error);
      alert(`Lưu thay đổi thất bại: ${message}`);
    });
  };

  const handleSavePaper = (paperId: number, data: Partial<DetailedPaperSubmission>) => {
    runUpdate(updatePaperDetails(paperId, data));
    setEditingPaper(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài báo này không? Thao tác này không thể hoàn tác.')) {
      runUpdate(deletePaper(id));
    }
  };

  // Chỉ nhận chuyên đề hợp lệ: Number('') === 0 nên nếu option "Chưa chọn" lọt qua thì
  // server sẽ COALESCE(0, topic) và ghi topic = 0 vào dữ liệu thật.
  const handleTopicChange = (paperId: number, value: string) => {
    const topic = Number(value);
    if (!isKnownTopic(topic)) return;
    runUpdate(updatePaperDetails(paperId, { topic: topic as 1 | 2 | 3 }));
  };

  const selectBaseClasses = "w-full text-xs font-semibold rounded-md py-1.5 px-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none text-center";
  const spanBaseClasses = "inline-block px-2.5 py-1 text-xs font-semibold leading-none rounded-full whitespace-nowrap";

  const isAdmin = currentUser?.role === 'admin';
  const sections = buildTopicSections(papers);
  // 8 cột hiển thị cho mọi người (STT -> Trạng thái) + cột Thao tác chỉ admin thấy.
  const columnCount = 8 + (isAdmin ? 1 : 0);

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4 pt-28">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-100">Kết quả duyệt bài tham dự hội thảo</h1>
        <p className="text-center text-slate-100 text-lg mb-10">
          Danh sách các bài báo đã nộp, phân theo chuyên đề, kèm kết quả phản biện và trạng thái đăng kỷ yếu.
        </p>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-100 table-fixed">
              <colgroup>
                <col className="w-12" /> {/* STT */}
                <col className="w-28" /> {/* Mã số bài viết */}
                <col className="w-40" /> {/* Họ tên */}
                <col className="w-48" /> {/* Đơn vị công tác */}
                <col className="min-w-[320px] w-auto" /> {/* Tên bài - flexible */}
                <col className="w-[150px]" /> {/* Chủ đề đăng ký */}
                <col className="w-[130px]" /> {/* Kết quả Phản biện */}
                <col className="w-[160px]" /> {/* Trạng thái */}
                {isAdmin && <col className="w-24" />} {/* Thao tác */}
              </colgroup>
              <thead className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-3 py-3 text-center">STT</th>
                  <th scope="col" className="px-3 py-3 text-center whitespace-nowrap">Mã số bài viết</th>
                  <th scope="col" className="px-3 py-3">Họ tên</th>
                  <th scope="col" className="px-3 py-3">Đơn vị công tác</th>
                  <th scope="col" className="px-3 py-3">Tên bài</th>
                  <th scope="col" className="px-2 py-3 text-center">Chủ đề đăng ký</th>
                  <th scope="col" className="px-2 py-3 text-center">Kết quả Phản biện</th>
                  <th scope="col" className="px-2 py-3 text-center">Trạng thái</th>
                  {isAdmin && (
                    <th scope="col" className="px-2 py-3 text-center">Thao tác</th>
                  )}
                </tr>
              </thead>
              {sections.map((section) => (
                <tbody key={section.key} className="divide-y divide-slate-700/50">
                  <tr className="bg-slate-900/60 border-t border-slate-700/50">
                    <th scope="rowgroup" colSpan={columnCount} className="px-3 py-3 text-left font-semibold">
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${section.badgeClass}`}>
                        {section.heading}
                      </span>
                      <span className="ml-2 text-xs font-normal text-slate-400">({section.papers.length} bài)</span>
                    </th>
                  </tr>

                  {section.papers.length === 0 ? (
                    <tr>
                      <td colSpan={columnCount} className="px-3 py-6 text-center text-sm text-slate-500">
                        Chưa có bài báo trong chuyên đề này.
                      </td>
                    </tr>
                  ) : (
                    section.papers.map((paper, index) => {
                      const reviewResult = toReviewStatus(paper.fullTextStatus);
                      const proceedingsStatus = toReviewStatus(paper.reviewStatus);
                      const paperLabel = paper.paperCode || `#${paper.id}`;

                      return (
                      <tr key={paper.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                        <td className="px-3 py-4 text-center font-medium text-slate-400">{index + 1}</td>
                        <td className="px-3 py-4 text-center text-slate-300">
                          {paper.paperCode || <span className="text-slate-500">—</span>}
                        </td>
                        <td className="px-3 py-4 font-medium text-slate-100">
                          <div className="break-words whitespace-normal" title={paper.authorName}>{paper.authorName}</div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="break-words whitespace-normal text-slate-300" title={paper.organization}>{paper.organization}</div>
                        </td>
                        <td className="px-3 py-4">
                          <div className="font-medium text-slate-100 line-clamp-3" title={paper.paperTitle}>
                            {paper.paperTitle}
                          </div>
                        </td>
                        <td className="px-2 py-4 text-center">
                          {isAdmin ? (
                            <select
                              value={isKnownTopic(paper.topic) ? paper.topic : ''}
                              onChange={(e) => handleTopicChange(paper.id, e.target.value)}
                              aria-label={`Chủ đề đăng ký của bài ${paperLabel}`}
                              className={`${selectBaseClasses} ${topicStyles[paper.topic] || unassignedTopicStyle}`}
                            >
                              {!isKnownTopic(paper.topic) && (
                                <option className="bg-slate-800 text-white" value="" disabled>Chưa chọn</option>
                              )}
                              {CONFERENCE_TOPICS.map((t) => (
                                <option key={t.id} className="bg-slate-800 text-white" value={t.id}>Chuyên đề {t.id}</option>
                              ))}
                            </select>
                          ) : isKnownTopic(paper.topic) ? (
                            <span className={`${spanBaseClasses} ${topicStyles[paper.topic]}`}>
                              Chuyên đề {paper.topic}
                            </span>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="px-2 py-4 text-center">
                          {isAdmin ? (
                            <select
                              value={reviewResult}
                              onChange={(e) => runUpdate(updateFullTextStatus(paper.id, e.target.value as ReviewStatus))}
                              aria-label={`Kết quả phản biện của bài ${paperLabel}`}
                              className={`${selectBaseClasses} ${reviewStatusStyles[reviewResult]}`}
                            >
                              <option className="bg-slate-800 text-white" value="Duyệt">Duyệt</option>
                              <option className="bg-slate-800 text-white" value="Không duyệt">Không duyệt</option>
                              <option className="bg-slate-800 text-white" value="Đang chờ duyệt">Đang chờ</option>
                            </select>
                          ) : (
                            <span className={`${spanBaseClasses} ${reviewStatusStyles[reviewResult]}`}>
                              {reviewStatusText[reviewResult]}
                            </span>
                          )}
                        </td>
                        <td className="px-2 py-4 text-center">
                          {isAdmin ? (
                            <select
                              value={proceedingsStatus}
                              onChange={(e) => runUpdate(updateReviewStatus(paper.id, e.target.value as ReviewStatus))}
                              aria-label={`Trạng thái đăng kỷ yếu của bài ${paperLabel}`}
                              className={`${selectBaseClasses} ${reviewStatusStyles[proceedingsStatus]}`}
                            >
                              <option className="bg-slate-800 text-white" value="Duyệt">Đăng kỷ yếu</option>
                              <option className="bg-slate-800 text-white" value="Không duyệt">Không đăng kỷ yếu</option>
                              <option className="bg-slate-800 text-white" value="Đang chờ duyệt">Đang chờ</option>
                            </select>
                          ) : (
                            <span className={`${spanBaseClasses} ${reviewStatusStyles[proceedingsStatus]}`}>
                              {proceedingsStatusText[proceedingsStatus]}
                            </span>
                          )}
                        </td>
                        {isAdmin && (
                          <td className="px-2 py-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditingPaper(paper)}
                                className="text-blue-100 hover:text-blue-300 p-1.5 rounded-md bg-blue-900/50 hover:bg-blue-800/50 border border-blue-700/50 transition-colors"
                                title="Sửa"
                              >
                                <i className="fas fa-pencil-alt text-xs"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(paper.id)}
                                className="text-red-400 hover:text-red-300 p-1.5 rounded-md bg-red-900/50 hover:bg-red-800/50 border border-red-700/50 transition-colors"
                                title="Xóa"
                              >
                                <i className="fas fa-trash-alt text-xs"></i>
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                      );
                    })
                  )}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </div>

      {editingPaper && (
        <EditPaperModal
          paper={editingPaper}
          onSave={handleSavePaper}
          onClose={() => setEditingPaper(null)}
        />
      )}
    </>
  );
};

export default PaperReviewPage;
