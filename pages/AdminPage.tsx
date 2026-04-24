import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// FIX: Import SiteContent from types.ts where it is now centrally defined.
import type { KeynoteSpeaker, Sponsor, NavLink, SiteContent, DetailedPaperSubmission, ReviewStatus, PresentationStatus } from '../types';
import { useSiteContent } from '../contexts/SiteContentContext';
import { usePapers } from '../contexts/PaperContext';
import type { AddPaperInput } from '../contexts/PaperContext';
import { useRegistrations } from '../contexts/RegistrationContext';
import { CONFERENCE_TOPICS } from '../constants';

const REVIEW_STATUSES: ReviewStatus[] = ['Duyệt', 'Không duyệt', 'Đang chờ duyệt'];
const PRESENTATION_STATUSES: PresentationStatus[] = ['Trình bày', 'Không trình bày'];

const PaperModal: React.FC<{
    paper: DetailedPaperSubmission | null;
    onClose: () => void;
    onSave: (data: AddPaperInput, file: File | null) => Promise<void>;
    onDeleteFile?: () => Promise<void>;
}> = ({ paper, onClose, onSave, onDeleteFile }) => {
    const [form, setForm] = useState<AddPaperInput>({
        authorName: paper?.authorName || '',
        organization: paper?.organization || '',
        paperTitle: paper?.paperTitle || '',
        topic: paper?.topic || 1,
        abstractStatus: paper?.abstractStatus || 'Đang chờ duyệt',
        fullTextStatus: paper?.fullTextStatus || 'Đang chờ duyệt',
        reviewStatus: paper?.reviewStatus || 'Đang chờ duyệt',
        presentationStatus: paper?.presentationStatus || 'Không trình bày',
    });
    const [file, setFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: name === 'topic' ? parseInt(value, 10) as 1 | 2 | 3 : value }));
    };

    const handleSubmit = async () => {
        if (!form.authorName.trim() || !form.paperTitle.trim()) {
            alert('Vui lòng nhập tên tác giả và tiêu đề bài báo.');
            return;
        }
        setSaving(true);
        try {
            await onSave(form, file);
            onClose();
        } catch (err: any) {
            alert(`Lưu thất bại: ${err.message || err}`);
        } finally {
            setSaving(false);
        }
    };

    const inputStyles = "mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 text-slate-100";
    const labelStyles = "block text-sm font-medium text-slate-100";

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onMouseDown={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700" onMouseDown={e => e.stopPropagation()}>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">{paper ? 'Sửa bài báo' : 'Thêm bài báo'}</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div>
                        <label className={labelStyles}>Tên tác giả *</label>
                        <input type="text" name="authorName" value={form.authorName} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className={labelStyles}>Đơn vị công tác</label>
                        <input type="text" name="organization" value={form.organization} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className={labelStyles}>Tiêu đề bài báo *</label>
                        <input type="text" name="paperTitle" value={form.paperTitle} onChange={handleChange} className={inputStyles} />
                    </div>
                    <div>
                        <label className={labelStyles}>Chủ đề</label>
                        <select name="topic" value={form.topic} onChange={handleChange} className={inputStyles}>
                            {CONFERENCE_TOPICS.map(t => (
                                <option key={t.id} value={t.id}>Chủ đề {t.id}: {t.title}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelStyles}>Duyệt tóm tắt</label>
                            <select name="abstractStatus" value={form.abstractStatus} onChange={handleChange} className={inputStyles}>
                                {REVIEW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyles}>Duyệt toàn văn</label>
                            <select name="fullTextStatus" value={form.fullTextStatus} onChange={handleChange} className={inputStyles}>
                                {REVIEW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyles}>Duyệt đăng kỷ yếu</label>
                            <select name="reviewStatus" value={form.reviewStatus} onChange={handleChange} className={inputStyles}>
                                {REVIEW_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelStyles}>Trình bày</label>
                            <select name="presentationStatus" value={form.presentationStatus} onChange={handleChange} className={inputStyles}>
                                {PRESENTATION_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className={labelStyles}>File toàn văn (PDF, tùy chọn)</label>
                        {paper?.fullTextFileName && (
                            <div className="flex items-center gap-3 my-2 p-2 bg-slate-900/50 rounded-md">
                                <i className="fas fa-file-pdf text-red-400"></i>
                                <span className="text-sm text-slate-200 flex-1 truncate">{paper.fullTextFileName}</span>
                                {onDeleteFile && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!window.confirm('Xóa file toàn văn?')) return;
                                            await onDeleteFile();
                                        }}
                                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 bg-red-900/30 rounded"
                                    >Xóa file</button>
                                )}
                            </div>
                        )}
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={e => setFile(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-800/50"
                        />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} disabled={saving} className="px-4 py-2 rounded-md text-slate-200 bg-slate-600 hover:bg-slate-500 disabled:opacity-50">Hủy</button>
                    <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                        {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const statusBadgeClass = (status: string) => {
    if (status === 'Duyệt' || status === 'Trình bày') return 'bg-green-900/50 text-green-300';
    if (status === 'Không duyệt' || status === 'Không trình bày') return 'bg-red-900/40 text-red-300';
    return 'bg-yellow-900/40 text-yellow-300';
};

const StatCard: React.FC<{ icon: string; title: string; value: number; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg shadow-md flex items-center border border-slate-700/50">
        <div className={`rounded-full p-4 mr-4 ${color}`}>
            <i className={`fas ${icon} fa-2x text-white`}></i>
        </div>
        <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const ManagementCard: React.FC<{
    imageUrl: string;
    title: string;
    description?: string;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ imageUrl, title, description, onEdit, onDelete }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700/50 flex flex-col">
        <img src={imageUrl} alt={title} className="w-full h-32 object-contain rounded-md bg-slate-900/50 p-1 mb-4" />
        <div className="flex-grow">
            <h3 className="text-lg font-semibold text-slate-100 truncate" title={title}>{title}</h3>
            {description && <p className="text-sm text-slate-400">{description}</p>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
            <button onClick={onEdit} className="text-sm font-medium text-blue-100 hover:text-blue-300 py-1 px-3 rounded bg-blue-900/50 hover:bg-blue-800/50">Edit</button>
            <button onClick={onDelete} className="text-sm font-medium text-red-400 hover:text-red-300 py-1 px-3 rounded bg-red-900/50 hover:bg-red-800/50">Delete</button>
        </div>
    </div>
);

const ImageUploadCard: React.FC<{
    title: string;
    currentImage: string;
    onImageSelect: (file: File) => void;
}> = ({ title, currentImage, onImageSelect }) => {
    const inputId = `upload-${title.replace(/\s+/g, '-')}`;
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700/50 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-100 mb-2 truncate" title={title}>{title}</h3>
            <div className="w-full h-32 mb-4">
              <img src={currentImage} alt={title} className="w-full h-full rounded-md bg-slate-900/50 p-1 object-contain" />
            </div>
            <label htmlFor={inputId} className="cursor-pointer w-full text-center block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mt-auto">
                Change Image
            </label>
            <input id={inputId} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
    );
};

// Generic Modal for editing items
const EditModal: React.FC<{
    item: KeynoteSpeaker | Sponsor | NavLink | null;
    itemType: 'speaker' | 'sponsor' | 'navLink';
    onClose: () => void;
    onSave: (itemData: any) => void;
}> = ({ item, itemType, onClose, onSave }) => {
    const [formData, setFormData] = useState<any>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        setFormData(item || {});
        setImagePreview(item ? (item as any).imageUrl || (item as any).logoUrl : null);
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (imageFile && itemType !== 'navLink') {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (itemType === 'speaker') {
                    onSave({ ...formData, imageUrl: base64String });
                } else {
                    onSave({ ...formData, logoUrl: base64String });
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            onSave(formData);
        }
    };
    
    const inputStyles = "mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500";
    const labelStyles = "block text-sm font-medium text-slate-100";

    const getTitle = () => {
        if (itemType === 'speaker') return 'Keynote Speaker';
        if (itemType === 'sponsor') return 'Sponsor/Partner';
        if (itemType === 'navLink') return 'Navigation Link';
        return 'Item';
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onMouseDown={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700" onMouseDown={e => e.stopPropagation()}>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mb-4">{item?.id ? 'Edit' : 'Add'} {getTitle()}</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name" className={inputStyles} />
                    {itemType === 'navLink' && (
                         <input type="text" name="path" value={formData.path || ''} onChange={handleChange} placeholder="Path (e.g., /contact)" className={inputStyles} />
                    )}
                    {itemType === 'speaker' && (
                        <>
                            <input type="text" name="affiliation" value={formData.affiliation || ''} onChange={handleChange} placeholder="Affiliation" className={inputStyles} />
                            <textarea name="bio" value={formData.bio || ''} onChange={handleChange} placeholder="Bio" className={inputStyles} rows={3}></textarea>
                            <input type="text" name="keynoteTopic" value={formData.keynoteTopic || ''} onChange={handleChange} placeholder="Keynote Topic" className={inputStyles} />
                        </>
                    )}
                    {(itemType === 'speaker' || itemType === 'sponsor') && (
                        <div>
                            <label className={labelStyles}>Image/Logo</label>
                            {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-40 object-contain rounded-md my-2 bg-slate-900" />}
                            <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-900/50 file:text-blue-300 hover:file:bg-blue-800/50"/>
                        </div>
                    )}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-slate-200 bg-slate-600 hover:bg-slate-500">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Save</button>
                </div>
            </div>
        </div>
    );
};


const AdminPage: React.FC = () => {
    const { siteContent, updateImage, updateConferenceInfo, addNavLink, updateNavLink, deleteNavLink, addKeynoteSpeaker, updateKeynoteSpeaker, deleteKeynoteSpeaker, addSponsorOrCoOrganizer, updateSponsorOrCoOrganizer, deleteSponsorOrCoOrganizer } = useSiteContent();
    const { papers, addPaper, updatePaperDetails, deletePaper, uploadFullTextFile, deleteFullTextFile } = usePapers();
    const [paperModal, setPaperModal] = useState<{ isOpen: boolean; paper: DetailedPaperSubmission | null }>({ isOpen: false, paper: null });
    const { registrations } = useRegistrations();

    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        item: KeynoteSpeaker | Sponsor | NavLink | null;
        itemType: 'speaker' | 'sponsor' | 'navLink';
        subType?: 'sponsor' | 'coOrganizer';
    }>({ isOpen: false, item: null, itemType: 'sponsor' });

    const [confInfo, setConfInfo] = useState({
        title: siteContent.heroTitle,
        subtitle: siteContent.heroSubtitle,
        date: siteContent.conferenceDate,
        location: siteContent.conferenceLocation,
    });

    const handleConfInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfInfo({ ...confInfo, [e.target.name]: e.target.value });
    }

    const handleSaveConfInfo = () => {
        updateConferenceInfo(confInfo);
        alert('Conference info updated!');
    }
    
    const handleImageUpload = (imageKey: keyof Omit<SiteContent, 'keynoteSpeakers' | 'conferenceTopics' | 'sponsors' | 'coOrganizers' | 'navLinks' | 'heroTitle' | 'heroSubtitle' | 'conferenceDate' | 'conferenceLocation'>, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            updateImage(imageKey, reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleOpenModal = (item: KeynoteSpeaker | Sponsor | NavLink | null, itemType: 'speaker' | 'sponsor' | 'navLink', subType?: 'sponsor' | 'coOrganizer') => {
        setModalState({ isOpen: true, item, itemType, subType });
    };

    const handleCloseModal = () => {
        setModalState({ isOpen: false, item: null, itemType: 'sponsor' });
    };

    const handleSave = (itemData: any) => {
        if (modalState.itemType === 'speaker') {
            itemData.id ? updateKeynoteSpeaker(itemData.id, itemData) : addKeynoteSpeaker(itemData);
        } else if (modalState.itemType === 'navLink') {
            itemData.id ? updateNavLink(itemData.id, itemData) : addNavLink(itemData);
        } else {
            itemData.id ? updateSponsorOrCoOrganizer(itemData.id, itemData, modalState.subType!) : addSponsorOrCoOrganizer(itemData, modalState.subType!);
        }
        handleCloseModal();
    };
    
    const handleSavePaper = async (data: AddPaperInput, file: File | null) => {
        let targetId: number;
        if (paperModal.paper) {
            await updatePaperDetails(paperModal.paper.id, data);
            targetId = paperModal.paper.id;
        } else {
            const created = await addPaper(data);
            targetId = created.id;
        }
        if (file) {
            await uploadFullTextFile(targetId, file);
        }
    };

    const handleDeletePaper = async (id: number) => {
        if (!window.confirm('Xóa bài báo này?')) return;
        try {
            await deletePaper(id);
        } catch (err: any) {
            alert(`Xóa thất bại: ${err.message || err}`);
        }
    };

    const handleDelete = (id: number, type: 'speaker' | 'sponsor' | 'coOrganizer' | 'navLink') => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        if(type === 'speaker') deleteKeynoteSpeaker(id);
        else if (type === 'navLink') deleteNavLink(id);
        else deleteSponsorOrCoOrganizer(id, type);
    }

    return (
        <div className="max-w-7xl mx-auto pt-28 px-4 pb-16">
            <div>
                <h1 className="text-4xl font-bold text-center mb-4 text-slate-100">Admin Dashboard</h1>
                <p className="text-center text-slate-100 text-lg mb-10">Thống kê và báo cáo tổng quan hội thảo.</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard icon="fa-users" title="Tổng số đăng ký" value={registrations.length} color="bg-blue-500" />
                    <StatCard icon="fa-file-alt" title="Bài báo đã nộp" value={papers.length} color="bg-purple-500" />
                </div>
            </div>

            {/* Content Management Section */}
            <div className="space-y-12 mt-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-100 border-b-2 border-slate-700 pb-4">Quản lý nội dung</h2>
                
                {/* General Conference Info */}
                <div>
                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-100 mb-8">Thông tin chung về hội thảo</h3>
                     <div className="bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-700/50 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-100">Tiêu đề chính homepage</label>
                            <input type="text" name="title" value={confInfo.title} onChange={handleConfInfoChange} className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-100">Tiêu đề phụ homepage</label>
                            <input type="text" name="subtitle" value={confInfo.subtitle} onChange={handleConfInfoChange} className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-100">Ngày diễn ra hội thảo</label>
                                <input type="text" name="date" value={confInfo.date} onChange={handleConfInfoChange} className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-100">Địa điểm hội thảo</label>
                                <input type="text" name="location" value={confInfo.location} onChange={handleConfInfoChange} className="mt-1 block w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md"/>
                            </div>
                        </div>
                        <div className="text-right">
                            <button onClick={handleSaveConfInfo} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Lưu</button>
                        </div>
                     </div>
                </div>

                {/* Navigation Menu */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl sm:text-2xl font-semibold text-blue-100">Menu điều hướng</h3>
                         <button onClick={() => handleOpenModal(null, 'navLink')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Add Nav Link</button>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700/50">
                        <ul className="space-y-2">
                            {siteContent.navLinks.map(link => (
                                <li key={link.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-md">
                                    <div>
                                        <span className="font-semibold text-slate-100">{link.name}</span>
                                        <span className="text-sm text-slate-400 ml-4">{link.path}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleOpenModal(link, 'navLink')} className="text-sm font-medium text-blue-100 hover:text-blue-300 py-1 px-3 rounded bg-blue-900/50 hover:bg-blue-800/50">Edit</button>
                                        <button onClick={() => handleDelete(link.id, 'navLink')} className="text-sm font-medium text-red-400 hover:text-red-300 py-1 px-3 rounded bg-red-900/50 hover:bg-red-800/50">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Keynote Speakers */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl sm:text-2xl font-semibold text-blue-100">Diễn giả chính</h3>
                         <button onClick={() => handleOpenModal(null, 'speaker')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Thêm diễn giả</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {siteContent.keynoteSpeakers.map(speaker => (
                            <ManagementCard 
                                key={speaker.id}
                                imageUrl={speaker.imageUrl}
                                title={speaker.name}
                                description={speaker.affiliation}
                                onEdit={() => handleOpenModal(speaker, 'speaker')}
                                onDelete={() => handleDelete(speaker.id, 'speaker')}
                            />
                        ))}
                    </div>
                </div>

                {/* Sponsors & Partners */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl sm:text-2xl font-semibold text-blue-100">Nhà tài trợ & Đối tác</h3>
                         <div>
                            <button onClick={() => handleOpenModal(null, 'sponsor', 'coOrganizer')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors mr-2">Thêm đồng tổ chức</button>
                            <button onClick={() => handleOpenModal(null, 'sponsor', 'sponsor')} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">Thêm nhà tài trợ</button>
                         </div>
                    </div>
                    <h4 className="text-xl font-medium text-slate-100 mb-4">Đồng tổ chức</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                         {siteContent.coOrganizers.map(item => (
                            <ManagementCard 
                                key={item.id}
                                imageUrl={item.logoUrl}
                                title={item.name}
                                onEdit={() => handleOpenModal(item, 'sponsor', 'coOrganizer')}
                                onDelete={() => handleDelete(item.id, 'coOrganizer')}
                            />
                        ))}
                    </div>
                    <h4 className="text-xl font-medium text-slate-100 mb-4">Nhà tài trợ</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {siteContent.sponsors.map(item => (
                            <ManagementCard 
                                key={item.id}
                                imageUrl={item.logoUrl}
                                title={item.name}
                                onEdit={() => handleOpenModal(item, 'sponsor', 'sponsor')}
                                onDelete={() => handleDelete(item.id, 'sponsor')}
                            />
                        ))}
                    </div>
                </div>

                 {/* General Images */}
                <div>
                     <h3 className="text-xl sm:text-2xl font-semibold text-blue-100 mb-8">Ảnh trên website</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <ImageUploadCard title="Logo hội thảo" currentImage={siteContent.conferenceLogo} onImageSelect={(file) => handleImageUpload('conferenceLogo', file)} />
                        <ImageUploadCard title="Logo trường đại học" currentImage={siteContent.universityLogo} onImageSelect={(file) => handleImageUpload('universityLogo', file)} />
                        <ImageUploadCard title="Hình nền trang chủ" currentImage={siteContent.heroBackground} onImageSelect={(file) => handleImageUpload('heroBackground', file)} />
                        <ImageUploadCard title="Hình nền kêu gọi bài báo" currentImage={siteContent.callForPapersImage} onImageSelect={(file) => handleImageUpload('callForPapersImage', file)} />
                        <ImageUploadCard title="Banner sự kiện (trang chủ)" currentImage={siteContent.eventBannerImage} onImageSelect={(file) => handleImageUpload('eventBannerImage', file)} />
                    </div>
                </div>
            </div>


            <div className="mt-16 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b-2 border-slate-700 pb-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-100">Quản lý kết quả duyệt bài</h2>
                    <button
                        onClick={() => setPaperModal({ isOpen: true, paper: null })}
                        className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <i className="fas fa-plus mr-2"></i>Thêm bài báo
                    </button>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-lg shadow-md border border-slate-700/50 overflow-x-auto">
                    {papers.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">Chưa có bài báo nào. Nhấn "Thêm bài báo" để bắt đầu.</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-300 border-b border-slate-700">
                                    <th className="p-3">#</th>
                                    <th className="p-3">Tác giả</th>
                                    <th className="p-3">Tiêu đề</th>
                                    <th className="p-3">CĐ</th>
                                    <th className="p-3">Tóm tắt</th>
                                    <th className="p-3">Toàn văn</th>
                                    <th className="p-3">Kỷ yếu</th>
                                    <th className="p-3">Trình bày</th>
                                    <th className="p-3">File</th>
                                    <th className="p-3 text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {papers.map(p => (
                                    <tr key={p.id} className="border-b border-slate-700/50 hover:bg-slate-900/30">
                                        <td className="p-3 text-slate-400">{p.id}</td>
                                        <td className="p-3 text-slate-100">
                                            <div className="font-medium">{p.authorName}</div>
                                            <div className="text-xs text-slate-400">{p.organization}</div>
                                        </td>
                                        <td className="p-3 text-slate-100 max-w-xs truncate" title={p.paperTitle}>{p.paperTitle}</td>
                                        <td className="p-3 text-slate-300">{p.topic}</td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(p.abstractStatus)}`}>{p.abstractStatus}</span></td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(p.fullTextStatus)}`}>{p.fullTextStatus}</span></td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(p.reviewStatus)}`}>{p.reviewStatus}</span></td>
                                        <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${statusBadgeClass(p.presentationStatus)}`}>{p.presentationStatus}</span></td>
                                        <td className="p-3">
                                            {p.fullTextUrl ? (
                                                <a href={p.fullTextUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" title={p.fullTextFileName}>
                                                    <i className="fas fa-file-pdf"></i>
                                                </a>
                                            ) : (
                                                <span className="text-slate-600">—</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-right whitespace-nowrap">
                                            <button onClick={() => setPaperModal({ isOpen: true, paper: p })} className="text-xs font-medium text-blue-100 hover:text-blue-300 py-1 px-3 rounded bg-blue-900/50 hover:bg-blue-800/50 mr-2">Sửa</button>
                                            <button onClick={() => handleDeletePaper(p.id)} className="text-xs font-medium text-red-400 hover:text-red-300 py-1 px-3 rounded bg-red-900/50 hover:bg-red-800/50">Xóa</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-100">Quản lý cơ sở dữ liệu</h2>
                <div className="bg-slate-800/50 p-6 rounded-lg shadow-md border border-slate-700/50 text-center">
                    <p className="text-slate-100 mb-4">Xem dữ liệu thô của ứng dụng.</p>
                    <Link to="/admin/database" className="inline-block bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg">
                        <i className="fas fa-database mr-2"></i>Xem cơ sở dữ liệu
                    </Link>
                </div>
            </div>

             {modalState.isOpen && (
                <EditModal
                    item={modalState.item}
                    itemType={modalState.itemType}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
            {paperModal.isOpen && (
                <PaperModal
                    paper={paperModal.paper}
                    onClose={() => setPaperModal({ isOpen: false, paper: null })}
                    onSave={handleSavePaper}
                    onDeleteFile={paperModal.paper ? async () => {
                        await deleteFullTextFile(paperModal.paper!.id);
                        setPaperModal(prev => prev.paper ? { ...prev, paper: { ...prev.paper, fullTextFileName: undefined, fullTextUrl: undefined } } : prev);
                    } : undefined}
                />
            )}
        </div>
    );
};

export default AdminPage;
