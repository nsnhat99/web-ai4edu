import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePapers } from '../contexts/PaperContext';
import type { PaperSubmissionFormData } from '../types';

const SubmitPaperPage: React.FC = () => {
  const [formData, setFormData] = useState<PaperSubmissionFormData>({
    authorName: '',
    organization: '',
    email: '',
    phone: '',
    paperTitle: '',
    topic: '1',
    fullPaperFile: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const { addPaper, uploadFullTextFile } = usePapers();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB.');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ chấp nhận file PDF, DOC, hoặc DOCX.');
        return;
      }
      
      setError('');
      setFormData(prevState => ({ ...prevState, fullPaperFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.authorName || !formData.organization || !formData.email || !formData.paperTitle || !formData.fullPaperFile) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc và tải lên tệp báo cáo toàn văn.');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Step 1: Create paper entry in database
      setUploadProgress('Đang tạo bản ghi bài báo...');
      const newPaper = await addPaper(formData);
      
      // Step 2: Upload file
      if (formData.fullPaperFile) {
        setUploadProgress('Đang tải file lên server...');
        await uploadFullTextFile(newPaper.id, formData.fullPaperFile);
      }
      
      setUploadProgress('Hoàn tất!');
      setIsSubmitted(true);
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/paper-review');
      }, 3000);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center bg-slate-800/50 backdrop-blur-sm p-10 rounded-lg shadow-lg border border-slate-700/50">
        <div className="text-green-400 mb-4">
          <i className="fas fa-check-circle fa-4x"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-3">Nộp Toàn văn thành công!</h2>
        <p className="text-slate-100">
          Cảm ơn bạn đã nộp báo cáo toàn văn. Thông tin của bạn đã được ghi nhận và sẽ xuất hiện trong trang kết quả duyệt bài.
          <br/>
          Bạn sẽ được chuyển hướng đến trang kết quả sau giây lát...
        </p>
      </div>
    );
  }

  const inputStyles = "mt-1 block w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500";
  const labelStyles = "block text-sm font-medium text-slate-100 mb-1";

  return (
    <div className="max-w-2xl mx-auto bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-slate-700/50">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-slate-100">Nộp Báo cáo Toàn văn & Đăng ký</h1>
      <p className="text-center text-slate-400 mb-8">Vui lòng điền thông tin và nộp báo cáo toàn văn của bạn.</p>
      
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded relative mb-6" role="alert">
          {error}
        </div>
      )}

      {uploadProgress && isLoading && (
        <div className="bg-blue-900/50 border border-blue-700 text-blue-300 px-4 py-3 rounded relative mb-6">
          {uploadProgress}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="authorName" className={labelStyles}>
              Họ và tên Tác giả <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="authorName" 
              id="authorName" 
              value={formData.authorName} 
              onChange={handleChange} 
              required 
              className={inputStyles} 
            />
          </div>
          <div>
            <label htmlFor="organization" className={labelStyles}>
              Đơn vị công tác <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              name="organization" 
              id="organization" 
              value={formData.organization} 
              onChange={handleChange} 
              required 
              className={inputStyles} 
            />
          </div>
          <div>
            <label htmlFor="email" className={labelStyles}>
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className={inputStyles} 
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelStyles}>
              Số điện thoại
            </label>
            <input 
              type="tel" 
              name="phone" 
              id="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              className={inputStyles} 
            />
          </div>
        </div>
        
        <hr className="border-slate-600" />

        <div>
          <label htmlFor="paperTitle" className={labelStyles}>
            Tên bài báo <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="paperTitle" 
            id="paperTitle" 
            value={formData.paperTitle} 
            onChange={handleChange} 
            required 
            className={inputStyles} 
          />
        </div>
        
        <div>
          <label htmlFor="topic" className={labelStyles}>
            Chủ đề <span className="text-red-500">*</span>
          </label>
          <select 
            name="topic" 
            id="topic" 
            value={formData.topic} 
            onChange={handleChange} 
            className={inputStyles}
          >
            <option value="1">Tiểu ban 1: Giáo dục sáng tạo và phát triển bền vững</option>
            <option value="2">Tiểu ban 2: Bản sắc văn hoá trong kỷ nguyên số</option>
            <option value="3">Tiểu ban 3: Trí tuệ nhân tạo trong văn hóa và giáo dục</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="fullPaperFile" className={labelStyles}>
            Tệp báo cáo toàn văn (PDF, DOC, DOCX - tối đa 10MB) <span className="text-red-500">*</span>
          </label>
          <input 
            type="file" 
            name="fullPaperFile" 
            id="fullPaperFile" 
            onChange={handleFileChange} 
            required 
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-800/50 cursor-pointer" 
          />
          {formData.fullPaperFile && (
            <p className="mt-2 text-sm text-slate-400">
              Đã chọn: {formData.fullPaperFile.name} ({(formData.fullPaperFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>
       
        <div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </>
            ) : (
              'Gửi Toàn văn & Đăng ký'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPaperPage;