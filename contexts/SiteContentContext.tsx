import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { KeynoteSpeaker, ConferenceTopic, Sponsor, NavLink, SiteContent } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import * as api from '../api';


// Define the context type
interface SiteContentContextType {
  siteContent: SiteContent; // No longer null after initial load
  updateImage: (key: keyof Omit<SiteContent, 'keynoteSpeakers' | 'conferenceTopics' | 'sponsors' | 'coOrganizers' | 'navLinks' | 'heroTitle' | 'heroSubtitle' | 'conferenceDate' | 'conferenceLocation'>, newUrl: string) => Promise<void>;
  updateConferenceInfo: (data: { title: string; subtitle: string; date: string; location: string }) => Promise<void>;
  addNavLink: (navLinkData: Omit<NavLink, 'id'>) => Promise<void>;
  updateNavLink: (navLinkId: number, navLinkData: Partial<NavLink>) => Promise<void>;
  deleteNavLink: (navLinkId: number) => Promise<void>;
  addKeynoteSpeaker: (speakerData: Omit<KeynoteSpeaker, 'id'>) => Promise<void>;
  updateKeynoteSpeaker: (speakerId: number, speakerData: Partial<KeynoteSpeaker>) => Promise<void>;
  deleteKeynoteSpeaker: (speakerId: number) => Promise<void>;
  updateConferenceTopic: (topicId: number, data: { title: string; imageUrl: string; description: string }) => Promise<void>;
  addSponsorOrCoOrganizer: (data: Omit<Sponsor, 'id'>, type: 'sponsor' | 'coOrganizer') => Promise<void>;
  updateSponsorOrCoOrganizer: (id: number, data: Partial<Sponsor>, type: 'sponsor' | 'coOrganizer') => Promise<void>;
  deleteSponsorOrCoOrganizer: (id: number, type: 'sponsor' | 'coOrganizer') => Promise<void>;
}

// Create the context
const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

// Create the provider component
export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSiteContent()
      .then(setSiteContent)
      .catch(err => {
        console.error("Failed to load site content:", err);
        setError("Không thể tải dữ liệu cần thiết của hội thảo. Vui lòng thử làm mới trang.");
      });
  }, []);
  
  const updateContent = async (updatedData: Partial<SiteContent>) => {
      if (!siteContent) return;
      const updatedContent = await api.updateSiteContent(updatedData);
      setSiteContent(updatedContent);
  }

  const updateImage = async (key: keyof Omit<SiteContent, 'keynoteSpeakers' | 'conferenceTopics' | 'sponsors' | 'coOrganizers' | 'navLinks' | 'heroTitle' | 'heroSubtitle' | 'conferenceDate' | 'conferenceLocation'>, newUrl: string) => {
    updateContent({ [key]: newUrl });
  };
  
  const updateConferenceInfo = async (data: { title: string; subtitle: string; date: string; location: string }) => {
    updateContent({ 
        heroTitle: data.title, 
        heroSubtitle: data.subtitle,
        conferenceDate: data.date,
        conferenceLocation: data.location,
    });
  };

  const addNavLink = async (navLinkData: Omit<NavLink, 'id'>) => {
    if (!siteContent) return;
    const newLink: NavLink = { id: Date.now(), ...navLinkData };
    updateContent({ navLinks: [...siteContent.navLinks, newLink] });
  };

  const updateNavLink = async (navLinkId: number, navLinkData: Partial<NavLink>) => {
    if (!siteContent) return;
    updateContent({
      navLinks: siteContent.navLinks.map(link => link.id === navLinkId ? { ...link, ...navLinkData } : link),
    });
  };

  const deleteNavLink = async (navLinkId: number) => {
    if (!siteContent) return;
    updateContent({
      navLinks: siteContent.navLinks.filter(link => link.id !== navLinkId),
    });
  };

  const addKeynoteSpeaker = async (speakerData: Omit<KeynoteSpeaker, 'id'>) => {
    if (!siteContent) return;
    const newSpeaker: KeynoteSpeaker = { id: Date.now(), ...speakerData };
    updateContent({ keynoteSpeakers: [...siteContent.keynoteSpeakers, newSpeaker]});
  };
  
  const updateKeynoteSpeaker = async (speakerId: number, speakerData: Partial<KeynoteSpeaker>) => {
    if (!siteContent) return;
    updateContent({
      keynoteSpeakers: siteContent.keynoteSpeakers.map(s => s.id === speakerId ? { ...s, ...speakerData } : s),
    });
  };
  
  const deleteKeynoteSpeaker = async (speakerId: number) => {
    if (!siteContent) return;
    updateContent({
      keynoteSpeakers: siteContent.keynoteSpeakers.filter(s => s.id !== speakerId),
    });
  };

  const updateConferenceTopic = async (topicId: number, data: { title: string; imageUrl: string; description: string }) => {
    if (!siteContent) return;
    updateContent({
      conferenceTopics: siteContent.conferenceTopics.map(topic =>
        topic.id === topicId ? { ...topic, ...data } : topic
      ),
    });
  };

  const addSponsorOrCoOrganizer = async (data: Omit<Sponsor, 'id'>, type: 'sponsor' | 'coOrganizer') => {
    if (!siteContent) return;
    const newItem: Sponsor = { id: Date.now(), ...data };
    const key = type === 'sponsor' ? 'sponsors' : 'coOrganizers';
    updateContent({ [key]: [...siteContent[key], newItem] });
  };

  const updateSponsorOrCoOrganizer = async (id: number, data: Partial<Sponsor>, type: 'sponsor' | 'coOrganizer') => {
    if (!siteContent) return;
    const key = type === 'sponsor' ? 'sponsors' : 'coOrganizers';
    updateContent({
      [key]: siteContent[key].map(item => item.id === id ? { ...item, ...data } : item),
    });
  };

  const deleteSponsorOrCoOrganizer = async (id: number, type: 'sponsor' | 'coOrganizer') => {
    if (!siteContent) return;
    const key = type === 'sponsor' ? 'sponsors' : 'coOrganizers';
    updateContent({
      [key]: siteContent[key].filter(item => item.id !== id),
    });
  };
  
  // Render a loading or error state until content is fetched
  if (error) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex justify-center items-center z-50 p-4">
        <div className="text-center bg-red-900/50 border border-red-700 p-8 rounded-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-red-300 mb-4">Lỗi tải trang</h2>
          <p className="text-slate-200">{error}</p>
        </div>
      </div>
    );
  }

  if (!siteContent) {
    return <LoadingSpinner fullScreen />; 
  }
  
  const value = { siteContent, updateImage, updateConferenceInfo, addNavLink, updateNavLink, deleteNavLink, addKeynoteSpeaker, updateKeynoteSpeaker, deleteKeynoteSpeaker, updateConferenceTopic, addSponsorOrCoOrganizer, updateSponsorOrCoOrganizer, deleteSponsorOrCoOrganizer };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

// Create the custom hook
export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context as SiteContentContextType;
};
