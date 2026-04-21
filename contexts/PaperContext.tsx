import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { DetailedPaperSubmission, ReviewStatus, PresentationStatus } from '../types';
import * as api from '../api';

export type AddPaperInput = Omit<DetailedPaperSubmission, 'id' | 'fullTextFileName' | 'fullTextUrl'>;

interface PaperContextType {
  papers: DetailedPaperSubmission[];
  addPaper: (data: AddPaperInput) => Promise<DetailedPaperSubmission>;
  deletePaper: (id: number) => Promise<void>;
  updatePaperDetails: (id: number, data: Partial<DetailedPaperSubmission>) => Promise<void>;
  updateAbstractStatus: (id: number, status: ReviewStatus) => Promise<void>;
  updateFullTextStatus: (id: number, status: ReviewStatus) => Promise<void>;
  updateReviewStatus: (id: number, status: ReviewStatus) => Promise<void>;
  updatePresentationStatus: (id: number, status: PresentationStatus) => Promise<void>;
  uploadFullTextFile: (paperId: number, file: File) => Promise<void>;
  deleteFullTextFile: (paperId: number) => Promise<void>;
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export const PaperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<DetailedPaperSubmission[]>([]);

  useEffect(() => {
    api.getPapers().then(setPapers).catch(err => console.error("Failed to fetch papers:", err));
  }, []);

  const addPaper = async (data: AddPaperInput): Promise<DetailedPaperSubmission> => {
    const newPaper = await api.addPaper(data);
    setPapers(prevPapers => [newPaper, ...prevPapers]);
    return newPaper;
  };

  const deletePaper = async (id: number) => {
    await api.deletePaper(id);
    setPapers(prevPapers => prevPapers.filter(p => p.id !== id));
  };

  const updatePaperDetails = async (id: number, data: Partial<DetailedPaperSubmission>) => {
    const updatedPaper = await api.updatePaper(id, data);
    setPapers(papers.map(p => (p.id === id ? updatedPaper : p)));
  };

  const updateStatus = async (id: number, field: keyof DetailedPaperSubmission, status: ReviewStatus | PresentationStatus) => {
    const updatedPaper = await api.updatePaper(id, { [field]: status });
    setPapers(prevPapers => prevPapers.map(p => (p.id === id ? updatedPaper : p)));
  };

  const updateAbstractStatus = (id: number, status: ReviewStatus) => updateStatus(id, 'abstractStatus', status);
  const updateFullTextStatus = (id: number, status: ReviewStatus) => updateStatus(id, 'fullTextStatus', status);
  const updateReviewStatus = (id: number, status: ReviewStatus) => updateStatus(id, 'reviewStatus', status);
  const updatePresentationStatus = (id: number, status: PresentationStatus) => updateStatus(id, 'presentationStatus', status);

  const uploadFullTextFile = async (paperId: number, file: File) => {
    const response = await api.uploadFullTextFile(paperId, file);
    setPapers(prevPapers => prevPapers.map(p => (p.id === paperId ? response.paper : p)));
  };

  const deleteFullTextFile = async (paperId: number) => {
    const response = await api.deleteFullTextFile(paperId);
    setPapers(prevPapers => prevPapers.map(p => (p.id === paperId ? response.paper : p)));
  };

  return (
    <PaperContext.Provider value={{
      papers, addPaper, deletePaper, updatePaperDetails,
      updateAbstractStatus, updateFullTextStatus, updateReviewStatus, updatePresentationStatus,
      uploadFullTextFile, deleteFullTextFile
    }}>
      {children}
    </PaperContext.Provider>
  );
};

export const usePapers = (): PaperContextType => {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error('usePapers must be used within a PaperProvider');
  }
  return context;
};
