import React, { useState } from 'react';
import type { ReviewStatus, PresentationStatus, DetailedPaperSubmission } from '../types';
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

const presentationStatusStyles: { [key in PresentationStatus]: string } = {
  'Trình bày': 'bg-blue-900/60 text-blue-300 border border-blue-700',
  'Không trình bày': 'bg-slate-700/60 text-slate-100 border border-slate-600',
};

const topicStyles: { [key: number]: string } = {
  1: 'bg-amber-900/70 text-amber-300 border border-amber-700',
  2: 'bg-emerald-900/70 text-emerald-300 border border-emerald-700',
  3: 'bg-indigo-900/70 text-blue-300 border border-indigo-700',
};

// File Manager Component
const FileManager: React.FC<{
  paper: DetailedPaperSubmission;
  onUpload: (paperId: number, file: File) => void;
  onDelete: (paperId: number) => void;
}> = ({ paper, onUpload, onDelete }) => {
  const [uploadingFulltext, setUploadingFulltext] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Chỉ chấp nhận file PDF, DOC, hoặc DOCX.');
      return;
    }

    setUploadingFulltext(true);

    try {
      await onUpload(paper.id, file);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Có lỗi xảy ra khi tải file lên.');
    } finally {
      setUploadingFulltext(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa file toàn văn này không?`)) {
      return;
    }

    try {
      await onDelete(paper.id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Có lỗi xảy ra khi xóa file.');
    }
  };

  return (
    <div className="space-y-4">
      {/* Fulltext File */}
      <div className="border border-slate-600 rounded-lg p-4 bg-slate-800/50">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-slate-100">File Toàn văn</h4>
          {paper.fullTextUrl && (
            <span className="text-xs text-green-400">
              <i className="fas fa-check-circle mr-1"></i>
              Đã có file
            </span>
          )}
        </div>

        {paper.fullTextUrl ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <i className="fas fa-file-alt text-blue-400"></i>
              <span className="truncate flex-1">{paper.fullTextFileName || 'fulltext.pdf'}</span>
            </div>
            <div className="flex gap-2">
              <a
                href={paper.fullTextUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center px-3 py-2 text-xs bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 rounded border border-blue-700 transition-colors"
              >
                <i className="fas fa-download mr-1"></i>
                Tải xuống
              </a>
              <button
                onClick={handleDelete}
                className="px-3 py-2 text-xs bg-red-900/50 hover:bg-red-800/50 text-red-300 rounded border border-red-700 transition-colors"
                title="Xóa file"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e)}
              disabled={uploadingFulltext}
              className="hidden"
              id={`fulltext-upload-${paper.id}`}
            />
            <label
              htmlFor={`fulltext-upload-${paper.id}`}
              className={`block w-full text-center px-3 py-2 text-xs rounded border cursor-pointer transition-colors ${uploadingFulltext
                  ? 'bg-slate-700 text-slate-400 border-slate-600 cursor-not-allowed'
                  : 'bg-blue-900/50 hover:bg-blue-800/50 text-blue-300 border-blue-700'
                }`}
            >
              {uploadingFulltext ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i>
                  Đang tải lên...
                </>
              ) : (
                <>
                  <i className="fas fa-upload mr-1"></i>
                  Tải lên file toàn văn
                </>
              )}
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Paper Modal Component with File Manager
const EditPaperModal: React.FC<{
  paper: DetailedPaperSubmission;
  onSave: (paperId: number, data: Partial<DetailedPaperSubmission>) => void;
  onClose: () => void;
  onUploadFile: (paperId: Number, file: File) => void;
  onDeleteFile: (paperId: Number) => void;
}> = ({ paper, onSave, onClose, onUploadFile, onDeleteFile }) => {
  const [formData, setFormData] = useState({
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

        <hr className="border-slate-600 my-6" />

        {/* File Manager */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Quản lý file</h3>
          <FileManager
            paper={paper}
            onUpload={onUploadFile}
            onDelete={onDeleteFile}
          />
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
    updateAbstractStatus,
    updateFullTextStatus,
    updateReviewStatus,
    updatePresentationStatus,
    deletePaper,
    uploadFullTextFile,
    deleteFullTextFile
  } = usePapers();
  const [editingPaper, setEditingPaper] = useState<DetailedPaperSubmission | null>(null);

  const handleSavePaper = (paperId: number, data: Partial<DetailedPaperSubmission>) => {
    updatePaperDetails(paperId, data);
    setEditingPaper(null);
  };

  const handleUploadFile = async (paperId: number, file: File) => {
    await uploadFullTextFile(paperId, file);
  };

  const handleDeleteFile = async (paperId: number) => {
    await deleteFullTextFile(paperId);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài báo này không? Thao tác này không thể hoàn tác.')) {
      deletePaper(id);
    }
  };

  const selectBaseClasses = "w-full text-xs font-semibold rounded-md py-1.5 px-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition appearance-none text-center";
  const spanBaseClasses = "inline-block px-2.5 py-1 text-xs font-semibold leading-none rounded-full whitespace-nowrap";

  return (
    <>
      <div className="max-w-screen-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-slate-100">Kết quả duyệt bài tham dự hội thảo</h1>
        <p className="text-center text-slate-100 text-lg mb-10">
          Danh sách các bài báo đã nộp và trạng thái duyệt, trình bày.
        </p>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-100 table-fixed">
              <colgroup>
                <col className="w-12" /> {/* TT */}
                <col className="w-40" /> {/* Họ tên */}
                <col className="w-48" /> {/* Đơn vị */}
                <col className="min-w-[320px] w-auto" /> {/* Tên bài - flexible */}
                <col className="w-24" /> {/* Chủ đề */}
                {currentUser?.role === 'admin' && <col className="w-20" />} {/* Files */}
                <col className="w-[110px]" /> {/* Tóm tắt */}
                <col className="w-[110px]" /> {/* Toàn văn */}
                <col className="w-[110px]" /> {/* Kết quả */}
                <col className="w-[110px]" /> {/* Trình bày */}
                {currentUser?.role === 'admin' && <col className="w-24" />} {/* Hành động */}
              </colgroup>
              <thead className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-3 py-3 text-center">STT</th>
                  <th scope="col" className="px-3 py-3">Họ tên</th>
                  <th scope="col" className="px-3 py-3">Đơn vị công tác</th>
                  <th scope="col" className="px-3 py-3">Tên bài</th>
                  <th scope="col" className="px-2 py-3 text-center">Chủ đề</th>
                  {currentUser?.role === 'admin' && (
                    <th scope="col" className="px-2 py-3 text-center">Files</th>
                  )}
                  <th scope="col" className="px-2 py-3 text-center">Tóm tắt</th>
                  <th scope="col" className="px-2 py-3 text-center">Toàn văn</th>
                  <th scope="col" className="px-2 py-3 text-center">Kết quả</th>
                  <th scope="col" className="px-2 py-3 text-center">Trình bày</th>
                  {currentUser?.role === 'admin' && (
                    <th scope="col" className="px-2 py-3 text-center">Thao tác</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {papers.map((paper, index) => (
                  <tr key={paper.id} className="hover:bg-slate-700/30 transition-colors duration-200">
                    <td className="px-3 py-4 text-center font-medium text-slate-400">{index + 1}</td>
                    <td className="px-3 py-4 font-medium text-slate-100">
                      <div className="truncate" title={paper.authorName}>{paper.authorName}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="truncate text-slate-300" title={paper.organization}>{paper.organization}</div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="font-medium text-slate-100 line-clamp-3" title={paper.paperTitle}>
                        {paper.paperTitle}
                      </div>
                    </td>
                    <td className="px-2 py-4 text-center">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${topicStyles[paper.topic] || 'bg-cyan-900/70 text-cyan-300 border border-cyan-700'}`}>
                        Tiểu ban {paper.topic}
                      </span>
                    </td>
                    {currentUser?.role === 'admin' && (
                      <td className="px-2 py-4 text-center">
                        {paper.fullTextUrl ? (
                          <a
                            href={paper.fullTextUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 text-xs whitespace-nowrap"
                            title="Tải file toàn văn"
                          >
                            <i className="fas fa-file-alt mr-1"></i>
                            Có
                          </a>
                        ) : (
                          <span className="text-slate-500 text-xs">—</span>
                        )}
                      </td>
                    )}
                    <td className="px-2 py-4 text-center">
                      {currentUser?.role === 'admin' ? (
                        <select
                          value={paper.abstractStatus}
                          onChange={(e) => updateAbstractStatus(paper.id, e.target.value as ReviewStatus)}
                          onClick={(e) => e.stopPropagation()}
                          className={`${selectBaseClasses} ${reviewStatusStyles[paper.abstractStatus]}`}
                        >
                          <option className="bg-slate-800 text-white" value="Duyệt">Duyệt</option>
                          <option className="bg-slate-800 text-white" value="Không duyệt">Không duyệt</option>
                          <option className="bg-slate-800 text-white" value="Đang chờ duyệt">Đang chờ</option>
                        </select>
                      ) : (
                        <span className={`${spanBaseClasses} ${reviewStatusStyles[paper.abstractStatus]}`}>
                          {reviewStatusText[paper.abstractStatus]}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {currentUser?.role === 'admin' ? (
                        <select
                          value={paper.fullTextStatus}
                          onChange={(e) => updateFullTextStatus(paper.id, e.target.value as ReviewStatus)}
                          onClick={(e) => e.stopPropagation()}
                          className={`${selectBaseClasses} ${reviewStatusStyles[paper.fullTextStatus]}`}
                        >
                          <option className="bg-slate-800 text-white" value="Duyệt">Duyệt</option>
                          <option className="bg-slate-800 text-white" value="Không duyệt">Không duyệt</option>
                          <option className="bg-slate-800 text-white" value="Đang chờ duyệt">Đang chờ</option>
                        </select>
                      ) : (
                        <span className={`${spanBaseClasses} ${reviewStatusStyles[paper.fullTextStatus]}`}>
                          {reviewStatusText[paper.fullTextStatus]}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {currentUser?.role === 'admin' ? (
                        <select
                          value={paper.reviewStatus}
                          onChange={(e) => updateReviewStatus(paper.id, e.target.value as ReviewStatus)}
                          onClick={(e) => e.stopPropagation()}
                          className={`${selectBaseClasses} ${reviewStatusStyles[paper.reviewStatus]}`}
                        >
                          <option className="bg-slate-800 text-white" value="Duyệt">Duyệt</option>
                          <option className="bg-slate-800 text-white" value="Không duyệt">Không duyệt</option>
                          <option className="bg-slate-800 text-white" value="Đang chờ duyệt">Đang chờ</option>
                        </select>
                      ) : (
                        <span className={`${spanBaseClasses} ${reviewStatusStyles[paper.reviewStatus]}`}>
                          {reviewStatusText[paper.reviewStatus]}
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-4 text-center">
                      {currentUser?.role === 'admin' ? (
                        <select
                          value={paper.presentationStatus}
                          onChange={(e) => updatePresentationStatus(paper.id, e.target.value as PresentationStatus)}
                          onClick={(e) => e.stopPropagation()}
                          className={`${selectBaseClasses} ${presentationStatusStyles[paper.presentationStatus]}`}
                        >
                          <option className="bg-slate-800 text-white" value="Trình bày">Trình bày</option>
                          <option className="bg-slate-800 text-white" value="Không trình bày">Không TB</option>
                        </select>
                      ) : (
                        <span className={`${spanBaseClasses} ${presentationStatusStyles[paper.presentationStatus]}`}>
                          {paper.presentationStatus === 'Không trình bày' ? 'Không TB' : paper.presentationStatus}
                        </span>
                      )}
                    </td>
                    {currentUser?.role === 'admin' && (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {editingPaper && (
        <EditPaperModal
          paper={editingPaper}
          onSave={handleSavePaper}
          onClose={() => setEditingPaper(null)}
          onUploadFile={handleUploadFile}
          onDeleteFile={handleDeleteFile}
        />
      )}
    </>
  );
};

export default PaperReviewPage;