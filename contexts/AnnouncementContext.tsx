import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Announcement } from '../types';
import * as api from '../api';

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcementData: Omit<Announcement, 'id' | 'date'>) => Promise<void>;
  updateAnnouncement: (announcementId: number, announcementData: Partial<Omit<Announcement, 'id' | 'date'>>) => Promise<void>;
  deleteAnnouncement: (announcementId: number) => Promise<void>;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export const AnnouncementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    api.getAnnouncements()
      .then(setAnnouncements)
      .catch(err => console.error("Failed to fetch announcements:", err));
  }, []);

  const addAnnouncement = async (announcementData: Omit<Announcement, 'id' | 'date'>) => {
    const newAnnouncement = await api.addAnnouncement(announcementData);
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  const updateAnnouncement = async (announcementId: number, announcementData: Partial<Omit<Announcement, 'id' | 'date'>>) => {
    const updatedAnnouncement = await api.updateAnnouncement(announcementId, announcementData);
    setAnnouncements(prev => prev.map(a => a.id === announcementId ? updatedAnnouncement : a));
  };

  const deleteAnnouncement = async (announcementId: number) => {
    await api.deleteAnnouncement(announcementId);
    setAnnouncements(prev => prev.filter(a => a.id !== announcementId));
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = (): AnnouncementContextType => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};
